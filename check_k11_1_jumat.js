const fs = require('fs');
const cp = require('child_process');

const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';
const rombelId = '1d87c6a0-4366-4d7e-8124-78fe86053ca2'; // Kelas 11-1

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
            k: ['rombelId', 'semesterId'],
            v: [
              { t: 1, s: rombelId },
              { t: 1, s: semesterId }
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

fs.writeFileSync('temp_q_k11_1.json', JSON.stringify(payload));
const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_q_k11_1.json"`;

const res = cp.execSync(cmd, { encoding: 'utf8' });
fs.writeFileSync('k11_1_full.json', res);

// Cari apakah ada BIOLOGI di hari 5
const hasBioJumat = res.includes('BIOLOGI') && res.includes('14:10');
console.log('Kelas 11-1 has BIOLOGI 14:10:', hasBioJumat);
console.log('Is LINDARTI present in Kelas 11-1:', res.includes('LINDARTI'));

