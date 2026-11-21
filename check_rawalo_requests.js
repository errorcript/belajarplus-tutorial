const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkRequestsAndSupabase() {
  const token = fs.readFileSync('rawalo_trainer_token.txt', 'utf8').trim();
  const rawaloId = 'cd1a621e-b3b2-4e06-a53d-4fc7690b5d89';

  // 1. Cek requests di SMAN 1 Rawalo
  const reqPayload = {
    t: {
      t: 10,
      i: 0,
      p: {
        k: ['data'],
        v: [
          {
            t: 10,
            i: 1,
            p: {
              k: ['op', 'institutionId'],
              v: [
                { t: 1, s: 'requests' },
                { t: 1, s: rawaloId }
              ]
            },
            o: 0
          }
        ]
      },
      o: 0
    },
    f: 127,
    m: []
  };

  const reqRes = await fetch('https://belajarplus.com/_serverFn/2c8fda7d38060ceee84693206b8d6356ba330cde4a2b94fd8b37f6be650e6a07', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': rawaloId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqPayload)
  });

  const reqText = await reqRes.text();
  console.log('Requests for SMAN 1 Rawalo len:', reqText.length);
  console.log('Snippet:', reqText.slice(0, 500));

  // 2. Query Supabase RPC atau profiles jika ada
  const apikey = 'sb_publishable_cM49BBg-UouUK6il5mzhtg_VoEVRM8U';
  const profileRes = await fetch('https://rwmcfzsnkjkklytthmow.supabase.co/rest/v1/profiles?full_name=ilike.*fitrinah*', {
    headers: {
      'apikey': apikey,
      'Authorization': 'Bearer ' + token
    }
  });
  console.log('Supabase profile query status:', profileRes.status);
  const profiles = await profileRes.json().catch(() => null);
  console.log('Profiles found:', profiles);
}

checkRequestsAndSupabase().catch(console.error);

