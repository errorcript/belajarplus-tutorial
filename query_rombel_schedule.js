const fs = require('fs');
const cp = require('child_process');

const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';
const rombelId = 'c1d05055-697b-4fbb-9781-3bd676c99970'; // Kelas 10-1

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

fs.writeFileSync('temp_query_schedule.json', JSON.stringify(payload));

const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_query_schedule.json"`;

const res = cp.execSync(cmd, { encoding: 'utf8' });
console.log('Query result length:', res.length);
fs.writeFileSync('kelas_10_1_schedule.json', res);

// Cari berapa banyak slot jadwal yang ada di Kelas 10-1
const matches = [...res.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":0,"s":(\d+)\}/g)];
console.log('Total slots matched in Kelas 10-1:', matches.length);

