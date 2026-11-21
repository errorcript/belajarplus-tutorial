const fs = require('fs');
const cp = require('child_process');

const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
const batch10 = allRows.slice(225, 235); // 10 baris saja

console.log('Sample rows in Batch 10:');
console.log(batch10.slice(0, 3));

const serovalRows = batch10.map((r, idx) => ({
  t: 10,
  i: idx + 3,
  p: {
    k: ['row', 'rombel', 'dayOfWeek', 'start', 'end', 'subject', 'activity', 'teacher'],
    v: [
      { t: 0, s: r.row },
      { t: 1, s: r.rombel },
      { t: 0, s: r.dayOfWeek },
      { t: 1, s: r.start },
      { t: 1, s: r.end },
      { t: 1, s: r.subject },
      { t: 1, s: r.activity },
      { t: 1, s: r.teacher }
    ]
  },
  o: 0
}));

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
            k: ['semesterId', 'rows'],
            v: [
              { t: 1, s: semesterId },
              {
                t: 9,
                i: 2,
                a: serovalRows,
                o: 0
              }
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

fs.writeFileSync('temp_debug_batch10.json', JSON.stringify(payload));

const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/f7a5d2d9568a84b623d754b04d98939c3840d2cd30d3b33ee6e2547b0d5d4ba8" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_debug_batch10.json"`;

const res = cp.execSync(cmd, { encoding: 'utf8' });
console.log('Raw response Batch 10:\n', res);

