const fs = require('fs');

async function getInstitutions() {
  const token = fs.readFileSync('henri_token.txt', 'utf8').trim();
  const supabaseUrl = 'https://rwmcfzsnkjklytthmow.supabase.co';

  // Decode JWT payload
  const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  const userId = payload.sub;
  console.log('User ID:', userId, 'Email:', payload.email);

  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  const res = await fetch(`${supabaseUrl}/rest/v1/institution_members?user_id=eq.${userId}&select=*,institutions(*)`, {
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${token}`
    }
  });

  console.log('Members response status:', res.status);
  const data = await res.json();
  console.log(`Found ${Array.isArray(data) ? data.length : 0} institution memberships:`);

  if (Array.isArray(data)) {
    data.forEach((m, i) => {
      const inst = m.institutions || {};
      console.log(`${i + 1}. [${inst.id || m.institution_id}] "${inst.name || 'Unknown'}" (Role: ${m.role})`);
    });
  } else {
    console.log(data);
  }
}

getInstitutions().catch(console.error);

