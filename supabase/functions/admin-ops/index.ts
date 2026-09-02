// Supabase Edge Function: admin-ops
//
// Holds the service_role key SERVER-SIDE ONLY (as a Supabase project secret —
// never a VITE_ env var) and exposes a small, explicit set of privileged
// actions that genuinely need to bypass RLS. Every request is authenticated
// with the caller's own JWT first, and the caller's role/hospital_id is
// resolved from `profiles` using an RLS-respecting client before any
// privileged action runs — the service-role client is only used for the
// specific elevated operation itself, never for arbitrary reads.
//
// Deploy: supabase functions deploy admin-ops
// Secrets (set once, not committed): supabase secrets set PROJECT_SERVICE_ROLE_KEY=...
// (named PROJECT_SERVICE_ROLE_KEY, not SUPABASE_SERVICE_ROLE_KEY, because
// Supabase reserves every secret name starting with SUPABASE_ for the values
// it auto-injects — SUPABASE_URL and SUPABASE_ANON_KEY below are provided
// automatically to every Edge Function by the Supabase runtime and do not
// need to be set here.)
//
// Call from the frontend:
//   const { data, error } = await supabase.functions.invoke('admin-ops', {
//     body: { action: 'create_doctor', payload: { ... } },
//   })
// The user's session JWT is attached automatically by the supabase-js client.

// Pinned npm: specifier (Supabase's officially recommended import for Edge
// Functions) rather than an unpinned esm.sh URL — the latter can resolve
// inconsistently on the edge runtime and fail the function at boot with no
// useful error, which surfaces to the browser as a generic
// "Failed to send a request to the Edge Function".
import { createClient } from 'npm:@supabase/supabase-js@2.45.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE_KEY = Deno.env.get('PROJECT_SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

const isUUID = (str?: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str || '')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''

    // Client authenticated as the caller — every read against it is RLS-scoped.
    const callerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: userErr,
    } = await callerClient.auth.getUser()

    if (userErr || !user) return json({ success: false, error: 'Not authenticated.' }, 401)

    const { data: callerProfile } = await callerClient
      .from('profiles')
      .select('role, hospital_id, is_active')
      .eq('id', user.id)
      .maybeSingle()

    if (!callerProfile || !callerProfile.is_active) {
      return json({ success: false, error: 'Account inactive or not found.' }, 403)
    }

    const { action, payload } = await req.json()

    // Service-role client — ONLY used inside the narrow actions below, never
    // exposed to the caller, and only reached after the role/hospital checks
    // above have already run against the RLS-scoped client.
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    switch (action) {
      // ------------------------------------------------------------------
      // Create a doctor/staff auth user for a hospital. Only a hospital_admin
      // (for their own hospital) or super_admin may call this.
      // ------------------------------------------------------------------
      case 'create_doctor_auth_user': {
        const isOwnHospitalAdmin =
          callerProfile.role === 'hospital_admin' && callerProfile.hospital_id === payload?.hospital_id
        const isSuperAdmin = callerProfile.role === 'super_admin'

        if (!isOwnHospitalAdmin && !isSuperAdmin) {
          return json({ success: false, error: 'Not authorized to create users for this hospital.' }, 403)
        }

        if (!isUUID(payload?.hospital_id)) {
          return json({ success: false, error: 'A valid hospital_id is required.' }, 400)
        }

        const email = String(payload?.email || '').trim().toLowerCase()
        const password = String(payload?.password || '').trim()
        if (!email || password.length < 6) {
          return json({ success: false, error: 'A valid email and password (min 6 chars) are required.' }, 400)
        }

        const { data: createData, error: createError } = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: payload?.full_name,
            role: payload?.role || 'doctor',
            doctor_code: payload?.doctor_code,
            hospital_id: payload.hospital_id,
            department: payload?.department || 'General',
          },
        })

        if (createError || !createData?.user?.id) {
          // Already registered — return a clear error instead of silently
          // reusing/overwriting an existing account across hospitals.
          return json({ success: false, error: createError?.message || 'Could not create user.' }, 400)
        }

        // public.profiles row is created automatically by the
        // handle_new_user trigger (see supabase/schema.sql) from the
        // user_metadata above — no separate admin upsert needed here.

        if ((payload?.role || 'doctor') === 'doctor') {
          const { error: detailsErr } = await admin.from('doctor_details').upsert([
            {
              id: createData.user.id,
              doctor_code: payload?.doctor_code,
              hospital_id: payload.hospital_id,
              name: payload?.full_name,
              email,
              specialization: payload?.specialization || 'Consultant Specialist',
              room_number: payload?.room || 'Room 101',
              daily_patient_limit: payload?.limit || 30,
              consultation_fee: payload?.fee || 500,
              availability_status: 'active',
              is_active: true,
            },
          ])
          if (detailsErr) console.warn('doctor_details upsert notice:', detailsErr.message)
        }

        return json({ success: true, user_id: createData.user.id })
      }

      // ------------------------------------------------------------------
      // Regenerate a hospital's QR booking token. Only that hospital's admin
      // or a super_admin may call this — never derives hospital_id from the
      // request body for a hospital_admin caller.
      // ------------------------------------------------------------------
      case 'regenerate_qr_token': {
        const targetHospitalId =
          callerProfile.role === 'super_admin' ? payload?.hospital_id : callerProfile.hospital_id

        if (!isUUID(targetHospitalId)) {
          return json({ success: false, error: 'A valid hospital_id is required.' }, 400)
        }
        if (callerProfile.role !== 'super_admin' && callerProfile.role !== 'hospital_admin') {
          return json({ success: false, error: 'Not authorized.' }, 403)
        }

        const newToken = crypto.randomUUID().replace(/-/g, '')
        const { data, error } = await admin
          .from('qr_codes')
          .update({ token: newToken, intake_url: `/book/${newToken}` })
          .eq('hospital_id', targetHospitalId)
          .select()
          .maybeSingle()

        if (error) return json({ success: false, error: error.message }, 400)
        return json({ success: true, qr: data })
      }

      default:
        return json({ success: false, error: `Unknown action: ${action}` }, 400)
    }
  } catch (e) {
    return json({ success: false, error: String(e) }, 500)
  }
})
