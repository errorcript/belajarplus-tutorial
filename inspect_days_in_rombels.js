const fs = require('fs');
const cp = require('child_process');

async function inspectDaysInRombels() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  // Cek Kelas 10-1, Kelas 11-1, Kelas 12-1
  const targets = [idMatches[0], idMatches[5], idMatches[10]];

  for (const t of targets) {
    const rombelName = `${t[8]}-${t[2]}`;
    const rombelId = t[1];

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

    fs.writeFileSync('temp_q_check.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_q_check.json"`;

    const res = cp.execSync(cmd, { encoding: 'utf8' });
    
    // Cari semua dayOfWeek yang ada di rombel ini
    const dayMatches = [...res.matchAll(/"dayOfWeek"\s*,\s*"subjectId"[\s\S]*?\{"t":0,"s":(\d+)\}/g)].map(m => parseInt(m[1], 10));
    console.log(`Rombel: ${rombelName} | Total slots: ${dayMatches.length} | Days present:`, [...new Set(dayMatches)].sort());
  }
}

inspectDaysInRombels().catch(console.error);

