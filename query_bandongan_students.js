const fs = require('fs');
const token = fs.readFileSync('henri_token.txt', 'utf8').trim();
const schoolId = 'f28b2496-92f6-474f-9d1d-71c087de37a0';

async function run() {
  const payload = {
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
              k: ['schoolId', 'search', 'grade', 'limit'],
              v: [
                { t: 1, s: schoolId },
                { t: 1, s: '' },
                { t: 1, s: '' },
                { t: 0, s: 200 }
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

  const res = await fetch('https://belajarplus.com/_serverFn/48555baf421f908efc1f77c5a31187bf65c3e314f204a3cb4d38ecbb0477728b', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'x-school-override': schoolId,
      'x-tsr-serverfn': 'true',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(r => r.text());

  fs.writeFileSync('bandongan_students_full_query.txt', res);
  console.log('Saved bandongan_students_full_query.txt, length:', res.length);
}

run().catch(console.error);

