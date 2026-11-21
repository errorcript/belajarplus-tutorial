const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function checkStudents() {
  const token = fs.readFileSync('rawalo_trainer_token.txt', 'utf8').trim();
  const rawaloId = 'cd1a621e-b3b2-4e06-a53d-4fc7690b5d89';

  const payload = {
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
              { t: 1, s: rawaloId },
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

  const res = await fetch('https://belajarplus.com/_serverFn/338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'x-school-override': rawaloId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const raw = await res.text();
  console.log('Students response len:', raw.length);
  const fitriIdx = raw.toLowerCase().indexOf('fitrinah');
  console.log('fitrinah in students raw index:', fitriIdx);
  const fitriAny = raw.toLowerCase().indexOf('fitri');
  console.log('fitri in students raw index:', fitriAny);
  if (fitriIdx !== -1) {
    console.log(raw.slice(Math.max(0, fitriIdx - 150), fitriIdx + 200));
  }
}

checkStudents().catch(console.error);

