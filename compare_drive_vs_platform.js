const fs = require('fs');

async function compareDriveVsPlatform() {
  const driveRows = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  const platformStudents = JSON.parse(fs.readFileSync('tws_platform_students.json', 'utf8'));

  console.log(`Total Siswa di File Terbaru Drive: ${driveRows.length}`);
  console.log(`Total Siswa di Live Platform   : ${platformStudents.length}`);

  // Buat lookup maps
  const platformByEmail = new Map();
  const platformByName = new Map();
  for (const s of platformStudents) {
    if (s.email) platformByEmail.set(s.email.toLowerCase().trim(), s);
    if (s.full_name) platformByName.set(s.full_name.toLowerCase().trim(), s);
  }

  const driveByEmail = new Map();
  for (const d of driveRows) {
    if (d.B) driveByEmail.set(d.B.toLowerCase().trim(), d);
  }

  // 1. Cari siswa di Drive yang belum ada di platform
  const missingInPlatform = [];
  const foundInPlatform = [];

  for (const d of driveRows) {
    const email = (d.B || '').toLowerCase().trim();
    const name = (d.A || '').toLowerCase().trim();
    
    let matched = platformByEmail.get(email) || platformByName.get(name);
    if (matched) {
      foundInPlatform.push({ drive: d, platform: matched });
    } else {
      missingInPlatform.push(d);
    }
  }

  console.log(`Matched (Ada di Platform): ${foundInPlatform.length}`);
  console.log(`Missing in Platform (Belum Masuk): ${missingInPlatform.length}`);
  console.log('\n=== DAFTAR SISWA TERBARU YANG BELUM ADA DI PLATFORM ===');
  console.table(missingInPlatform.map(m => ({ nama: m.A, email: m.B, rombel: m.D, pass: m.C })));

  // 2. Cari siswa di Platform yang tidak ada di file Drive terbaru
  const extraInPlatform = [];
  for (const s of platformStudents) {
    const email = (s.email || '').toLowerCase().trim();
    const name = (s.full_name || '').toLowerCase().trim();
    if (!driveByEmail.has(email) && !driveRows.find(d => (d.A || '').toLowerCase().trim() === name)) {
      extraInPlatform.push({
        name: s.full_name,
        email: s.email,
        status: s.status,
        has_rombel: s.has_rombel
      });
    }
  }

  console.log(`\n=== SISWA DI PLATFORM TAPI TIDAK ADA DI FILE TERBARU (${extraInPlatform.length} siswa) ===`);
  console.table(extraInPlatform.slice(0, 15));

  // 3. Distribusi Rombel di Drive
  const driveRombelCounts = {};
  for (const d of driveRows) {
    driveRombelCounts[d.D] = (driveRombelCounts[d.D] || 0) + 1;
  }

  const comparisonData = {
    totalDriveStudents: driveRows.length,
    totalPlatformStudents: platformStudents.length,
    matchedCount: foundInPlatform.length,
    missingInPlatformCount: missingInPlatform.length,
    missingInPlatformList: missingInPlatform,
    extraInPlatformCount: extraInPlatform.length,
    extraInPlatformList: extraInPlatform,
    driveRombelCounts
  };

  fs.writeFileSync('tws_student_rombel_comparison.json', JSON.stringify(comparisonData, null, 2));
  console.log('Saved comparison to tws_student_rombel_comparison.json');
}

compareDriveVsPlatform().catch(console.error);

