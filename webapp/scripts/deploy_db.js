import fs from 'fs'
import https from 'https'
import { createClient } from '@supabase/supabase-js'

const PROJECT_REF = 'taszwtgrgvhkjvqdieqh'
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc3p3dGdyZ3Zoa2p2cWRpZXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzEzNjY5NCwiZXhwIjoyMTAyNzEyNjk0fQ.ZZ-5KefEtf__L0yEESFZs38nv9Dq8EoRvaVYXTgoyv4'

console.log(`Connecting to Supabase Project: ${SUPABASE_URL} with Service Role Key...`)

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
})

async function runMigration() {
  const sql = fs.readFileSync('../supabase_schema.sql', 'utf8')
  console.log(`Read supabase_schema.sql (${sql.length} bytes).`)

  // Create Hospital Admin & Doctor user accounts in Supabase Auth directly using Service Role
  console.log('\n--- CREATING SUPABASE AUTH USER ACCOUNTS ---')

  // 1. Create Hospital Admin Account
  const { data: adminUser, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@metrocare.com',
    password: 'Password123!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Metro Care General Hospital Admin',
      role: 'hospital_admin',
      hospital_id: 'a0000000-0000-0000-0000-000000000001'
    }
  })

  if (adminErr) {
    console.log('Hospital Admin Auth account status:', adminErr.message)
  } else {
    console.log(`✓ Hospital Admin user created in Supabase Auth: admin@metrocare.com (ID: ${adminUser.user.id})`)
  }

  // 2. Create Doctor Account
  const { data: docUser, error: docErr } = await supabase.auth.admin.createUser({
    email: 'doctor@hospital.com',
    password: 'Password123!',
    email_confirm: true,
    user_metadata: {
      full_name: 'Dr. Rahul Sharma',
      role: 'doctor',
      hospital_id: 'a0000000-0000-0000-0000-000000000001',
      department: 'Cardiology'
    }
  })

  if (docErr) {
    console.log('Doctor Auth account status:', docErr.message)
  } else {
    console.log(`✓ Doctor user created in Supabase Auth: doctor@hospital.com (ID: ${docUser.user.id})`)
  }

  console.log('\n--- EXEC_SQL MIGRATION via POSTGRES / REST ENDPOINT ---')
  const req = https.request({
    hostname: `${PROJECT_REF}.supabase.co`,
    port: 443,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  }, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', () => {
      console.log(`RPC Status: ${res.statusCode}`)
      console.log('Response body:', data.slice(0, 300))
    })
  })

  req.on('error', (e) => {
    console.error('REST request error:', e.message)
  })

  req.write(JSON.stringify({ query: sql }))
  req.end()
}

runMigration().catch(console.error)
