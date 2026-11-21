const fs = require('fs');
const cp = require('child_process');

async function findPendingSlots() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelMapById = {};
  idMatches.forEach(m => {
    rombelMapById[`${m[8]}-${m[2]}`] = m[1];
  });

  // Kumpulkan semua slot yang sudah ada di platform
  const existingSet = new Set();

  for (const [rombelName, rombelId] of Object.entries(rombelMapById)) {
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

    fs.writeFileSync('temp_q_exist.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_q_exist.json"`;

    const res = cp.execSync(cmd, { encoding: 'utf8' });
    // Ekstrak slot: "start", "dayOfWeek"
    // Seroval object: {"k":["id","end","start","active","classId","className","dayOfWeek", ...]}
    const slotMatches = [...res.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":2,"s":0\}\s*,\s*\{"t":2,"s":0\}\s*,\s*\{"t":0,"s":(\d+)\}/g)];
    
    for (const sm of slotMatches) {
      const end = sm[2];
      const start = sm[3];
      const dayOfWeek = parseInt(sm[4], 10);
      existingSet.add(`${rombelName}_${dayOfWeek}_${start}`);
    }
  }

  console.log(`Total unique slots existing in platform: ${existingSet.size}`);

  // Bandingkan dengan final_schedule_rows_zero_conflict.json
  const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
  const pending = [];

  for (const r of allRows) {
    const key = `${r.rombel}_${r.dayOfWeek}_${r.start}`;
    if (!existingSet.has(key)) {
      pending.push(r);
    }
  }

  console.log(`Pending slots to inject: ${pending.length} (out of ${allRows.length})`);
  fs.writeFileSync('pending_slots_to_inject.json', JSON.stringify(pending, null, 2));

  if (pending.length > 0) {
    console.log('Sample pending slot:');
    console.log(pending[0]);
    console.log('Days of pending slots:', [...new Set(pending.map(p => p.dayOfWeek))]);
  }
}

findPendingSlots().catch(console.error);

