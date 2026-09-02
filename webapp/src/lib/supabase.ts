import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://taszwtgrgvhkjvqdieqh.supabase.co'

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_GgFVVkVVTSjAUzgDMfjU-w_QyA-Y0fs'

export const SUPABASE_JWKS_URL =
  import.meta.env.VITE_SUPABASE_JWKS_URL ||
  'https://taszwtgrgvhkjvqdieqh.supabase.co/auth/v1/.well-known/jwks.json'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// SECURITY: the Supabase service_role (secret) key must NEVER be referenced
// here. Any env var read in this file is inlined into the public browser
// bundle by Vite — a `VITE_`-prefixed secret key ships to every visitor and
// bypasses all Row Level Security. Genuinely privileged operations (creating
// a doctor's auth user, etc.) must go through a Supabase Edge Function that
// holds SUPABASE_SERVICE_ROLE_KEY as a server-side project secret and is
// invoked via `supabase.functions.invoke(...)`. See supabase/functions/admin-ops.
