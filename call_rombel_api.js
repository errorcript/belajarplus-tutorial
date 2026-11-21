const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function testServerFn() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  // Kelas 11-7 rombelId dari temuan tadi: '4d49e827-656d-4f4b-84a2-a7a97354ad6b'
  const rombelId_11_7 = '4d49e827-656d-4f4b-84a2-a7a97354ad6b';

  console.log('Fetching members of Kelas 11-7 via serverFn...');
  const res = await fetch('https://belajarplus.com/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': 'sb-access-token=' + token + '; sb-refresh-token=' + token,
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({
      t: {
        t: 10,
        i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10,
            i: 1,
            p: {
              k: ['rombelId'],
              v: [{ t: 1, s: rombelId_11_7 }]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127,
      m: []
    })
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response length:', text.length);
  fs.writeFileSync('k11_7_members_raw.txt', text);

  // Parse JSON/Seroval
  if (text.includes('herdha')) {
    console.log('Herdha found in raw response!');
  }
}

testServerFn().catch(console.error);

