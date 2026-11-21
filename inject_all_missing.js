const fs = require('fs');
const cp = require('child_process');

async function injectAllMissing() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  // 1. Ambil fresh live slots dari platform
  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelMap = {};
  for (const m of idMatches) {
    const rawName = `${m[8]}-${m[2]}`; // "Kelas 10-1"
    rombelMap[rawName] = m[1];
  }

  const liveSlots = [];
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
      for (const item of items) {
        const v = item?.p?.v;
        if (!v) continue;
        liveSlots.push({
          rombel: rombelName,
          dayOfWeek: v[6]?.s,
          start: v[2]?.s,
          end: v[1]?.s,
          subjectName: v[9]?.s,
          teacherName: v[10]?.s
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  console.log(`Current live slots in platform: ${liveSlots.length}`);

  // 2. Filter missing slots dari target
  const allTarget = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
  const liveKeySet = new Set(liveSlots.map(s => `${s.rombel}|${s.dayOfWeek}|${s.start}`));

  const missing = allTarget.filter(r => !liveKeySet.has(`${r.rombel}|${r.dayOfWeek}|${r.start}`));
  console.log(`Missing slots to inject: ${missing.length}`);

  if (missing.length === 0) {
    console.log('All slots are already live! Nothing to inject.');
    return;
  }

  // 3. Inject missing slots in batches of 15
  const batchSize = 15;
  const totalBatches = Math.ceil(missing.length / batchSize);
  let totalSaved = 0;
  let allFailures = [];

  for (let b = 0; b < totalBatches; b++) {
    const batch = missing.slice(b * batchSize, (b + 1) * batchSize);
    const serovalRows = batch.map((r, idx) => ({
      t: 10, i: idx + 3,
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
        t: 10, i: 0,
        p: {
          k: ['data'],
          v: [{
            t: 10, i: 1,
            p: {
              k: ['semesterId', 'rows'],
              v: [
                { t: 1, s: semesterId },
                { t: 9, i: 2, a: serovalRows, o: 0 }
              ]
            },
            o: 0
          }]
        },
        o: 0
      },
      f: 127, m: []
    };

    fs.writeFileSync('temp_missing_batch.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/f7a5d2d9568a84b623d754b04d98939c3840d2cd30d3b33ee6e2547b0d5d4ba8" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_missing_batch.json"`;

    try {
      const res = cp.execSync(cmd, { encoding: 'utf8' });
      const parsedRes = JSON.parse(res);
      const resData = parsedRes?.p?.v?.[0]?.p?.v;
      const savedCount = resData?.[1]?.s || 0;
      const failedItems = resData?.[2]?.a || [];

      totalSaved += savedCount;
      console.log(`[Batch ${b + 1}/${totalBatches}] Saved: ${savedCount}, Failed: ${failedItems.length}`);
      if (failedItems.length > 0) {
        for (const fi of failedItems) {
          const rowNum = fi.p.v[0].s;
          const reason = fi.p.v[1].s;
          allFailures.push({ row: rowNum, reason });
          console.log(`   - Row ${rowNum}: ${reason}`);
        }
      }
    } catch (e) {
      console.error(`Error in batch ${b + 1}:`, e.message);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== INJECTION COMPLETE ===`);
  console.log(`Newly saved: ${totalSaved}`);
  console.log(`Failures: ${allFailures.length}`);
}

injectAllMissing().catch(console.error);

