const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function inspectUnplacedAndNonactive() {
  const token = fs.readFileSync('tawangsari_token.txt', 'utf8').trim();
  const schoolId = 'a1ecc8f2-84a5-4f22-bbbc-e79a5823ae21';

  const stuPayload = {
    t: {
      t: 10, i: 0,
      p: {
        k: ['data'],
        v: [{
          t: 10, i: 1,
          p: {
            k: ['op', 'institutionId', 'kind'],
            v: [
              { t: 1, s: 'roster' },
              { t: 1, s: schoolId },
              { t: 1, s: 'student' }
            ]
          },
          o: 0
        }]
      },
      o: 0
    },
    f: 127, m: []
  };

  const stuRes = await fetch('https://belajarplus.com/_serverFn/338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(stuPayload)
  });

  const stuText = await stuRes.text();
  const obj = JSON.parse(stuText);
  let str = '';
  function findStr(v) {
    if (typeof v === 'string' && v.includes('student')) return v;
    if (typeof v === 'object' && v) {
      for (const k of Object.keys(v)) {
        const r = findStr(v[k]);
        if (r) return r;
      }
    }
  }
  str = findStr(obj);
  if (str.startsWith('[{\\"')) str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  const students = JSON.parse(str);

  console.log('Total students in roster:', students.length);
  const unplaced = students.filter(s => !s.has_rombel && s.status === 'active');
  console.log('=== UNPLACED ACTIVE ===', unplaced.length);
  unplaced.forEach(s => console.log('  -', s.full_name, '|', s.email, '| status:', s.status, '| id:', s.user_id));

  const nonActive = students.filter(s => s.status !== 'active');
  console.log('=== NON ACTIVE ===', nonActive.length);
  nonActive.forEach(s => console.log('  -', s.full_name, '|', s.email, '| status:', s.status, '| id:', s.user_id));
}

inspectUnplacedAndNonactive().catch(console.error);

