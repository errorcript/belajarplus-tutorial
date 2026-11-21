const fs = require('fs');
const cp = require('child_process');

async function injectAllSchedule() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b'; // Semester 1 2026/2027

  const allRows = JSON.parse(fs.readFileSync('final_schedule_rows.json', 'utf8'));
  console.log(`Starting bulk injection of ${allRows.length} schedule rows...`);

  const batchSize = 30;
  const totalBatches = Math.ceil(allRows.length / batchSize);

  let totalSaved = 0;
  let totalAlreadySaved = 0;
  let otherFailures = [];

  for (let b = 0; b < totalBatches; b++) {
    const startIdx = b * batchSize;
    const batch = allRows.slice(startIdx, startIdx + batchSize);

    const serovalRows = batch.map((r, idx) => ({
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

    fs.writeFileSync('temp_batch_payload.json', JSON.stringify(payload));

    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/f7a5d2d9568a84b623d754b04d98939c3840d2cd30d3b33ee6e2547b0d5d4ba8" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_batch_payload.json"`;

    try {
      const res = cp.execSync(cmd, { encoding: 'utf8' });
      const savedMatch = res.match(/"saved"\],"v":\[\{"t":2,"s":2\},\{"t":0,"s":(\d+)\}/);
      const savedCount = savedMatch ? parseInt(savedMatch[1], 10) : 0;
      totalSaved += savedCount;

      // Cek failed
      // Format: "failed"],"v": ... "row","reason"],"v":[{"t":0,"s":...},{"t":1,"s":"..."}]
      const reasons = [...res.matchAll(/\{"t":1,"s":"([^"]+)"\}/g)].map(m => m[1]);
      let alreadyInBatch = 0;
      let othersInBatch = 0;
      for (const r of reasons) {
        if (r.includes('guru sudah mengajar')) {
          alreadyInBatch++;
        } else if (r !== 'true' && r !== 'false' && !r.includes('-')) {
          othersInBatch++;
          otherFailures.push(r);
        }
      }
      totalAlreadySaved += alreadyInBatch;

      console.log(`[Batch ${b + 1}/${totalBatches}] Saved: ${savedCount}, Existing: ${alreadyInBatch}, Others: ${othersInBatch}`);
    } catch (err) {
      console.error(`Batch ${b + 1} execution error:`, err.message);
    }

    // Delay 200ms
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=============================================');
  console.log(`FINAL RESULT:`);
  console.log(`- Total newly saved: ${totalSaved}`);
  console.log(`- Total already existing in platform: ${totalAlreadySaved}`);
  console.log(`- Total active slots on platform: ${totalSaved + totalAlreadySaved}`);
  console.log(`- Other failures: ${otherFailures.length}`);
  if (otherFailures.length > 0) {
    console.log('Sample other failures:', otherFailures.slice(0, 5));
  }
  console.log('=============================================\n');
}

injectAllSchedule().catch(console.error);

