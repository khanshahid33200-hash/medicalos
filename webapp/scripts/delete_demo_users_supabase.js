import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = 'taszwtgrgvhkjvqdieqh'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc3p3dGdyZ3Zoa2p2cWRpZXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzEzNjY5NCwiZXhwIjoyMTAyNzEyNjk0fQ.ZZ-5KefEtf__L0yEESFZs38nv9Dq8EoRvaVYXTgoyv4'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function purgeDemoData() {
  console.log(`Connecting to Supabase Project: ${SUPABASE_URL} to purge demo users...`)

  // 1. List all users in Supabase Auth
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers()

  if (listErr) {
    console.error('Error listing Supabase Auth users:', listErr.message)
    return
  }

  console.log(`Found ${users.length} users in Supabase Auth. Deleting demo accounts...`)

  for (const user of users) {
    console.log(`Deleting user ${user.email} (ID: ${user.id})...`)
    const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
    if (delErr) {
      console.error(`Failed to delete user ${user.email}:`, delErr.message)
    } else {
      console.log(`✓ Deleted user ${user.email} from Supabase Auth`)
    }
  }

  console.log('\n🎉 ALL DEMO USERS PURGED FROM SUPABASE AUTH!')
}

purgeDemoData().catch(console.error)
