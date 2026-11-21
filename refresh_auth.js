const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function refreshAuth() {
  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  const sess = JSON.parse(fs.readFileSync('khansania_session.json', 'utf8'));

  console.log('Refreshing token using refresh_token...');
  const res = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    headers: {
      'apikey': apikey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      refresh_token: sess.refresh_token
    })
  });

  const refreshed = await res.json();
  if (refreshed.access_token) {
    console.log('Successfully refreshed token! New expiry:', refreshed.expires_at);
    fs.writeFileSync('khansania_token.txt', refreshed.access_token);
    fs.writeFileSync('khansania_session.json', JSON.stringify(refreshed, null, 2));
    return refreshed;
  } else {
    console.error('Failed to refresh:', refreshed);
  }
}

refreshAuth().catch(console.error);
