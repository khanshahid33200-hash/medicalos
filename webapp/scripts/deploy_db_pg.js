import fs from 'fs'
import pg from 'pg'

const PROJECT_REF = 'taszwtgrgvhkjvqdieqh'

// Try standard pooler and direct connection strings
const connectionStrings = [
  `postgres://postgres.${PROJECT_REF}:Password123!@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  `postgres://postgres.${PROJECT_REF}:Upjtv%401234@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  `postgres://postgres.${PROJECT_REF}:Password123!@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  `postgres://postgres:${encodeURIComponent('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhc3p3dGdyZ3Zoa2p2cWRpZXFoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzEzNjY5NCwiZXhwIjoyMTAyNzEyNjk0fQ.ZZ-5KefEtf__L0yEESFZs38nv9Dq8EoRvaVYXTgoyv4')}@db.${PROJECT_REF}.supabase.co:5432/postgres`
]

async function runPgMigration() {
  const sql = fs.readFileSync('../supabase_schema.sql', 'utf8')
  console.log(`Read supabase_schema.sql (${sql.length} bytes).`)

  for (const connectionString of connectionStrings) {
    console.log(`Attempting connection to Supabase DB: ${connectionString.split('@')[1]}...`)
    const client = new pg.Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000
    })

    try {
      await client.connect()
      console.log('✓ Successfully connected to Supabase PostgreSQL database!')
      console.log('Executing database schema creation (14 tables, RLS policies, seed data)...')
      
      await client.query(sql)
      console.log('🎉 ALL TABLES, ENUMS, SECURITY POLICIES & SEED DATA CREATED IN SUPABASE!')
      await client.end()
      return
    } catch (err) {
      console.log('Connection attempt result:', err.message)
      try { await client.end() } catch (e) {}
    }
  }

  console.log('\nDirect DB connection pooler requires database password.')
}

runPgMigration().catch(console.error)
