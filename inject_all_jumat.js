const fs = require('fs');
const cp = require('child_process');

async function injectAllJumat() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const allRows = JSON.parse(fs.readFileSync('final_schedule_rows_zero_conflict.json', 'utf8'));
  const jumatRows = allRows.filter(r => r.dayOfWeek === 5);
  console.log(`=== INJECTING ALL ${jumatRows.length} JUMAT SLOTS ===`);

  const batchSize = 20;
  const totalBatches = Math.ceil(jumatRows.length / batchSize);

  let totalSaved = 0;
  let totalAlready = 0;
  let failures = [];

  for (let b = 0; b < totalBatches; b++) {
    const startIdx = b * batchSize;
    const batch = jumatRows.slice(startIdx, startIdx + batchSize);

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

    fs.writeFileSync('temp_jumat_batch.json', JSON.stringify(payload));

    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/f7a5d2d9568a84b623d754b04d98939c3840d2cd30d3b33ee6e2547b0d5d4ba8" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_jumat_batch.json"`;

    try {
      const res = cp.execSync(cmd, { encoding: 'utf8' });
      const savedMatch = res.match(/"saved"\],"v":\[\{"t":2,"s":2\},\{"t":0,"s":(\d+)\}/);
      const savedCount = savedMatch ? parseInt(savedMatch[1], 10) : 0;
      totalSaved += savedCount;

      const failedMatches = [...res.matchAll(/\{"t":0,"s":(\d+)\},\{"t":1,"s":"([^"]+)"\}/g)];
      let alreadyInBatch = 0;
      for (const fm of failedMatches) {
        const rowNum = fm[1];
        const reason = fm[2];
        if (reason.includes('guru sudah mengajar') || reason.includes('sudah ada')) {
          alreadyInBatch++;
          totalAlready++;
        } else {
          failures.push({ row: rowNum, reason });
        }
      }

      console.log(`[Jumat Batch ${b + 1}/${totalBatches}] +${savedCount} saved | ${alreadyInBatch} already | ${failures.length} errors`);
    } catch (err) {
      console.error(`Jumat Batch ${b + 1} error:`, err.message);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=======================================');
  console.log(`HARI JUMAT SELESAI DISUNTIK!`);
  console.log(`- Berhasil Baru Disimpan: ${totalSaved}`);
  console.log(`- Sudah Ada Sebelumnya: ${totalAlready}`);
  console.log(`- Total Slot Jumat Aktif: ${totalSaved + totalAlready} / ${jumatRows.length}`);
  console.log(`- Errors: ${failures.length}`);
  if (failures.length > 0) {
    console.log('Detail errors:', failures);
  }
  console.log('=======================================\n');
}

injectAllJumat().catch(console.error);

