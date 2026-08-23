import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = 'taszwtgrgvhkjvqdieqh'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc3p3dGdyZ3Zoa2p2cWRpZXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzEzNjY5NCwiZXhwIjoyMTAyNzEyNjk0fQ.ZZ-5KefEtf__L0yEESFZs38nv9Dq8EoRvaVYXTgoyv4'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function purgeAllTables() {
  console.log(`Connecting to Supabase Project: ${SUPABASE_URL} to purge all hospital & doctor data...`)

  const tables = [
    'audit_logs',
    'payments',
    'prescriptions',
    'consultations',
    'appointments',
    'patients',
    'doctor_day_settings',
    'profiles',
    'departments',
    'intake_links',
    'queue_counters',
    'token_counters',
    'hospitals'
  ]

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error) {
      console.log(`Purge table ${table} result:`, error.message)
    } else {
      console.log(`✓ Purged table '${table}' in Supabase`)
    }
  }

  // Purge all user accounts in Supabase Auth
  const { data: { users } } = await supabase.auth.admin.listUsers()
  if (users && users.length > 0) {
    for (const u of users) {
      await supabase.auth.admin.deleteUser(u.id)
      console.log(`✓ Deleted auth user ${u.email} from Supabase Auth`)
    }
  }

  console.log('\n🎉 ALL HOSPITALS, DOCTORS, PATIENTS, AND DEMO DATA PURGED FROM SUPABASE!')
}

purgeAllTables().catch(console.error)
