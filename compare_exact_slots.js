const fs = require('fs');
const cp = require('child_process');

async function main() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelMap = {};
  for (const m of idMatches) {
    const rawName = `${m[8]}-${m[2]}`; // "Kelas 10-1"
    rombelMap[rawName] = m[1];
  }

  const allZeroConflict = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));

  // Kumpulkan seluruh slot live dari platform
  const liveSlots = [];
  const countPerRombel = {};

  for (const [rombelName, rombelId] of Object.entries(rombelMap)) {
    const payload = {
      t: {
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: {
              k: ['rombelId', 'semesterId'],
              v: [{ t: 1, s: rombelId }, { t: 1, s: semesterId }]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    fs.writeFileSync('temp_q.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" --data-binary "@temp_q.json"`;
    const res = cp.execSync(cmd, { encoding: 'utf8' });

    try {
      const parsed = JSON.parse(res);
      const items = parsed?.p?.v?.[0]?.a || [];
      countPerRombel[rombelName] = items.length;

      for (const item of items) {
        const v = item?.p?.v;
        if (!v) continue;
        const id = v[0]?.s;
        const end = v[1]?.s;
        const start = v[2]?.s;
        const dayOfWeek = v[6]?.s;
        const subjectId = v[7]?.s;
        const teacherId = v[8]?.s;
        const subjectName = v[9]?.s;
        const teacherName = v[10]?.s;

        liveSlots.push({
          id,
          rombel: rombelName,
          dayOfWeek,
          start,
          end,
          subjectName,
          teacherName
        });
      }
    } catch (e) {
      console.error(`Error parsing response for ${rombelName}:`, e.message);
    }
  }

  console.log(`=== LIVE SCHEDULE PER ROMBEL ===`);
  console.table(countPerRombel);
  console.log(`Total live slots fetched across 15 rombels: ${liveSlots.length}`);
  fs.writeFileSync('all_live_slots.json', JSON.stringify(liveSlots, null, 2));

  // Cocokkan dengan allZeroConflict (720 rows)
  // Perhatikan: di file excel asli vs platform, jam start mungkin ada selisih (misal 07:45 vs 07:50 atau semacamnya).
  // Mari kita cek perbandingan per rombel dan dayOfWeek.
  const liveByRombelDay = {};
  for (const s of liveSlots) {
    const k = `${s.rombel}|Day${s.dayOfWeek}`;
    liveByRombelDay[k] = (liveByRombelDay[k] || 0) + 1;
  }

  const targetByRombelDay = {};
  for (const r of allZeroConflict) {
    const k = `${r.rombel}|Day${r.dayOfWeek}`;
    targetByRombelDay[k] = (targetByRombelDay[k] || 0) + 1;
  }

  console.log('\n=== PERBANDINGAN PER ROMBEL & HARI ===');
  const comparison = [];
  const allKeys = Array.from(new Set([...Object.keys(liveByRombelDay), ...Object.keys(targetByRombelDay)])).sort();
  for (const k of allKeys) {
    const liveC = liveByRombelDay[k] || 0;
    const targetC = targetByRombelDay[k] || 0;
    if (liveC !== targetC) {
      comparison.push({
        rombelDay: k,
        live: liveC,
        target: targetC,
        diff: targetC - liveC
      });
    }
  }

  if (comparison.length === 0) {
    console.log('SEMUA ROMBEL DAN HARI SUDAH 100% COCOK DENGAN TARGET!');
  } else {
    console.log('Ditemukan selisih pada rombel/hari berikut:');
    console.table(comparison);
  }
}

main().catch(console.error);
