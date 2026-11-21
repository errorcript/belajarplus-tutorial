const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

async function testSchoolList() {
  // Login dulu ke Supabase untuk dapat access token Khansania
  const authRes = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'khansania.medtra@gmail.com',
      password: 'Khansa04'
    })
  });

  const authData = await authRes.json();
  console.log('Khansania User ID:', authData.user ? authData.user.id : authData);
  const token = authData.access_token;

  // Panggil serverFn d9ad5fe3fa2dcaaa0db206b313e2d83c90bd89b29a7546052ca86dd5b4be0aa8
  const res = await fetch('https://belajarplus.com/_serverFn/d9ad5fe3fa2dcaaa0db206b313e2d83c90bd89b29a7546052ca86dd5b4be0aa8', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  const text = await res.text();
  console.log('ServerFn response status:', res.status);
  fs.writeFileSync('khansania_serverfn_response.json', text);
  console.log('ServerFn response text:\n', text.slice(0, 1000));

  // Cari Purworejo di teks
  const matches = text.match(/"([^"]*purworejo[^"]*)"/gi) || [];
  console.log('Purworejo matches:', matches);
}

testSchoolList().catch(console.error);
