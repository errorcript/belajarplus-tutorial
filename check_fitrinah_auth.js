const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkAccountAuth() {
  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  
  // Coba login dengan password default dari berkas: Sman1rawalo_5005
  console.log('Testing login for fitrinahsmanra05@gmail.com...');
  const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'apikey': apikey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'fitrinahsmanra05@gmail.com',
      password: 'Sman1rawalo_5005'
    })
  });

  const data = await res.json();
  console.log('Login result status:', res.status);
  console.log('Login result data:', data);

  // Jika error invalid credentials, cek apakah email sudah terdaftar via signup attempt (akan menolak jika sudah terdaftar)
  if (data.error_description?.includes('Invalid login credentials')) {
    console.log('Credentials incorrect. Testing signup to check if email exists...');
    const signupRes = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: {
        'apikey': apikey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'fitrinahsmanra05@gmail.com',
        password: 'TemporaryTestPassword123!'
      })
    });
    const signupData = await signupRes.json();
    console.log('Signup test result:', signupData);
  }
}

checkAccountAuth().catch(console.error);

