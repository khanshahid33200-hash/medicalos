import fs from 'fs';
import https from 'https';

const PROJECT_REF = 'taszwtgrgvhkjvqdieqh';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
const API_KEY = 'sb_publishable_mnexAFN9MSh-GpX0yIaXIA_rkeCol4Z';

console.log(`Testing connection to Supabase Project: ${SUPABASE_URL}`);

// Test health check / root API
const req = https.request(`${SUPABASE_URL}/rest/v1/`, {
  method: 'GET',
  headers: {
    'apikey': API_KEY,
    'Authorization': `Bearer ${API_KEY}`
  }
}, (res) => {
  console.log(`Supabase REST Response Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response body:', data.slice(0, 300));
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
