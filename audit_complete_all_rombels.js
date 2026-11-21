const fs = require('fs');
const cp = require('child_process');

async function auditAllRombelsComplete() {
  const token = fs.readFileSync('khansania_token.txt', 'utf8').trim();
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';
  const semesterId = 'ad30621b-8300-463d-a86f-6aba95541d2b';

  const rawRombels = fs.readFileSync('rombels_raw.json', 'utf8');
  const idMatches = [...rawRombels.matchAll(/\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-f-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombelList = idMatches.map(m => ({
    id: m[1],
    displayName: `${m[8]}-${m[2]}`
  }));

  console.log(`=== AUDIT LENGKAP JADWAL 15 ROMBEL SMAN 11 PURWOREJO ===\n`);

  let grandTotal = 0;
  const summary = [];

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

    fs.writeFileSync('temp_q_audit.json', JSON.stringify(payload));
    const cmd = `curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/da25c6d4221aa4f4fa34bc04bd16f3ea6f8e5a4a597f0d2f45b2674972b8f2db" -H "authorization: Bearer ${token}" -H "x-school-override: ${schoolId}" -H "content-type: application/json" -H "accept: application/x-tss-framed, application/x-ndjson, application/json" -H "x-tsr-serverfn: true" -H "referer: https://belajarplus.com/master-data/jadwal" --data-binary "@temp_q_audit.json"`;

    const res = cp.execSync(cmd, { encoding: 'utf8' });
    
    // Hitung seluruh item jadwal: id unik slot jadwal
    // Format seroval tiap slot: id: "UUID"
    const slotIds = [...res.matchAll(/"id","end","start","active","classId","className","dayOfWeek","subjectId","teacherId","subjectName","teacherName","activityLabel"[\s\S]*?\{"t":1,"s":"([0-9a-f-]{36})"\}/g)].map(m => m[1]);
    
    // Atau regex sederhana untuk menghitung blok slot:
    const blockCount = (res.match(/"subjectName"/g) || []).length;
    grandTotal += blockCount;

    // Hitung per hari
    const days = {};
    for (let d = 1; d <= 7; d++) {
      const dayCount = (res.match(new RegExp(`"dayOfWeek"\\s*,\\s*"subjectId"[\\s\\S]*?\\{"t":0,"s":${d}\\}`, 'g')) || []).length;
      if (dayCount > 0) days[`H${d}`] = dayCount;
    }

    summary.push({
      rombel: r.displayName,
      totalSlots: blockCount,
      days
    });

    console.log(`- ${r.displayName.padEnd(12)}: ${String(blockCount).padStart(2)} slot KBM | Detail: ${JSON.stringify(days)}`);
  }

  console.log('\n=======================================');
  console.log(`GRAND TOTAL SLOT JADWAL TERDAFTAR: ${grandTotal}`);
  console.log('=======================================\n');

  fs.writeFileSync('complete_audit_summary.json', JSON.stringify(summary, null, 2));
}

auditAllRombelsComplete().catch(console.error);

