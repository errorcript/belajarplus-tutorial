const fs = require('fs');
const cp = require('child_process');

async function auditAllRombels() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  // Baca daftar rombel
  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelList = idMatches.map(m => ({
    id: m[1],
    suffix: m[2],
    displayName: `${m[8]}-${m[2]}` // e.g. "Kelas 10-1"
  }));

  console.log(`Auditing schedules across ${rombelList.length} rombels...`);

  let totalPlatformSlots = 0;
  const rombelStatus = [];

  for (const r of rombelList) {
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
                  { t: 1, s: r.id },
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

    fs.writeFileSync('temp_q_rombel.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_q_rombel.json"`;

    try {
      const res = cp.execSync(cmd, { encoding: 'utf8' });
      // Hitung item jadwal di seroval array
      // Pattern: "id","end","start","active","classId"
      const slotsCount = [...res.matchAll(/"start"\s*,\s*"active"/g)].length;
      totalPlatformSlots += slotsCount;
      rombelStatus.push({
        rombel: r.displayName,
        id: r.id,
        slotsCount
      });
      console.log(`- ${r.displayName}: ${slotsCount} slots`);
    } catch (e) {
      console.error(`Error querying ${r.displayName}:`, e.message);
    }
  }

  console.log('\n=======================================');
  console.log(`TOTAL SLOTS CURRENTLY SAVED: ${totalPlatformSlots}`);
  console.log('=======================================\n');

  fs.writeFileSync('rombel_schedule_summary.json', JSON.stringify(rombelStatus, null, 2));
}

auditAllRombels().catch(console.error);

