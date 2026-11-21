const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const fs = require('fs');

async function runReset() {
  console.log('=== EKSEKUSI RESET PASSWORD 43 SISWA SMAN 1 BANDONGAN ===');
  const token = fs.readFileSync('henri_token.txt', 'utf8').trim();
  const schoolId = 'f28b2496-92f6-474f-9d1d-71c087de37a0';
  const newPassword = 'Bandongan2026!';

  const students = JSON.parse(fs.readFileSync('manual_43_students_enriched.json', 'utf8'));
  console.log(`Memproses total ${students.length} siswa...`);

  let successCount = 0;
  let failCount = 0;
  const results = [];

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
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
                k: ['schoolId', 'userId', 'password'],
                v: [
                  { t: 1, s: schoolId },
                  { t: 1, s: s.student_id },
                  { t: 1, s: newPassword }
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

    try {
      const res = await fetch('https://belajarplus.com/_serverFn/be4f99ed7391ba591da781b142eca2632a4de06dde881ad3ff8cbec9fc2ea3bf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-school-override': schoolId,
          'x-tsr-serverfn': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      const isOk = text.includes('"ok"') && text.includes('2');

      if (isOk) {
        successCount++;
        console.log(`[${i + 1}/${students.length}] SUCCESS: ${s.full_name} (${s.email}) -> Password: ${newPassword}`);
        results.push({ name: s.full_name, email: s.email, status: 'SUCCESS' });
      } else {
        failCount++;
        console.error(`[${i + 1}/${students.length}] FAILED: ${s.full_name} (${s.email}) -> ${text.slice(0, 100)}`);
        results.push({ name: s.full_name, email: s.email, status: 'FAILED', error: text });
      }
    } catch (err) {
      failCount++;
      console.error(`[${i + 1}/${students.length}] ERROR: ${s.full_name} -> ${err.message}`);
      results.push({ name: s.full_name, email: s.email, status: 'ERROR', error: err.message });
    }

    // Small delay to be polite to server
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n=============================================');
  console.log(`HASIL EKSEKUSI RESET PASSWORD:`);
  console.log(`  Total Diproses: ${students.length}`);
  console.log(`  Berhasil      : ${successCount}`);
  console.log(`  Gagal         : ${failCount}`);
  console.log(`  Password Baru : ${newPassword}`);
  console.log('=============================================');

  fs.writeFileSync('reset_execution_results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    schoolId,
    newPassword,
    total: students.length,
    successCount,
    failCount,
    results
  }, null, 2));
}

runReset().catch(console.error);

