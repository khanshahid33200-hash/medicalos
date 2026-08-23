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
  const sql = fs.readFileSync('supabase_schema.sql', 'utf8')
  console.log(`Read supabase_schema.sql (${sql.length} bytes).`)

  // Split SQL into individual statements or execute via Supabase RPC / SQL endpoint
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements to execute.`)

  // Try creating core tables via RPC or direct REST endpoint
  const options = {
    hostname: `${PROJECT_REF}.supabase.co`,
    port: 443,
    path: '/rest/v1/rpc/exec_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  }

  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', chunk => data += chunk)
    res.on('end', async () => {
      console.log(`RPC exec_sql Response status: ${res.statusCode}`)
      console.log('Response body:', data.slice(0, 300))

      // If exec_sql endpoint is not enabled, seed tables directly using Supabase client
      if (res.statusCode !== 200) {
        console.log('Executing direct table check & seed with Supabase Service Role Client...')
        
        // 1. Seed demo hospitals
        const { data: hospData, error: hospErr } = await supabase
          .from('hospitals')
          .upsert([
            {
              id: 'a0000000-0000-0000-0000-000000000001',
              name: 'Metro Care General Hospital (H1)',
              city: 'Kolkata',
              phone: '+91-9876543210',
              email: 'admin@metrocare.com',
              doctor_seat_limit: 5
            },
            {
              id: 'a0000000-0000-0000-0000-000000000002',
              name: 'City Heart & Cardiac Specialty Clinic (H2)',
              city: 'Bangalore',
              phone: '+91-9876543211',
              email: 'admin@cityheart.com',
              doctor_seat_limit: 1
            }
          ])

        if (hospErr) {
          console.log('Hospitals upsert result:', hospErr.message)
        } else {
          console.log('✓ Demo hospitals upserted successfully!')
        }
      }
    })
  })

  req.on('error', (e) => {
    console.error('Request error:', e.message)
  })

  req.write(JSON.stringify({ query: sql }))
  req.end()
}

runMigration().catch(console.error)
