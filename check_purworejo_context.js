const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkSchools() {
  const token = fs.readFileSync('henri_token.txt', 'utf8').trim();
  
  // Test me or profile to see user info
  const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/user', {
    headers: {
      'apikey': 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U',
      'Authorization': `Bearer ${token}`
    }
  });
  const user = await res.json();
  console.log('Logged in user:', user.email, 'ID:', user.id);

  // Ambil data sekolah via RPC atau table Supabase jika bisa, atau via endpoint BelajarPlus
  // Mari cek endpoint BelajarPlus get schools or similar
}

checkSchools().catch(console.error);

