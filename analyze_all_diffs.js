const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('tws_mismatched_rombels_text.json', 'utf8'));
const excelMap = JSON.parse(fs.readFileSync('tws_excel_students_by_rombel.json', 'utf8'));

console.log('=== ANALISIS PERBEDAAN DETAIL PER ROMBEL ===\n');

for (const rombelName of Object.keys(scraped)) {
  const dialogText = scraped[rombelName] || '';
  const lines = dialogText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Ambil hanya bagian anggota aktif (sebelum "Lihat riwayat" atau "Tambah siswa")
  const activeMembers = [];
  let inActiveSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Anggota aktif')) {
      inActiveSection = true;
      continue;
    }
    if (line.includes('Lihat riwayat') || line.includes('Tambah siswa') || line === 'Close') {
      inActiveSection = false;
      break;
    }
    if (inActiveSection && line.includes('@')) {
      activeMembers.push({
        nama: lines[i - 1],
        email: line
      });
    }
  }

  const targetStudents = excelMap[rombelName] || [];

  console.log(`\n============================================================`);
  console.log(`📌 ${rombelName} | Target Excel: ${targetStudents.length} | Live Platform: ${activeMembers.length}`);
  console.log(`============================================================`);

  // Siswa yang LEBIH (ada di live tapi tidak ada di target excel rombel ini)
  const extraInLive = activeMembers.filter(liveS => {
    return !targetStudents.some(tgt => 
      tgt.email.toLowerCase() === liveS.email.toLowerCase() ||
      tgt.nama.toLowerCase().replace(/[^a-z]/g, '') === liveS.nama.toLowerCase().replace(/[^a-z]/g, '')
    );
  });

  // Siswa yang KURANG (ada di target excel tapi belum ada di live rombel ini)
  const missingInLive = targetStudents.filter(tgt => {
    return !activeMembers.some(liveS => 
      liveS.email.toLowerCase() === tgt.email.toLowerCase() ||
      liveS.nama.toLowerCase().replace(/[^a-z]/g, '') === tgt.nama.toLowerCase().replace(/[^a-z]/g, '')
    );
  });

  if (extraInLive.length > 0) {
    console.log(`⚠️ LEBIH DI PLATFORM (${extraInLive.length} siswa):`);
    extraInLive.forEach(s => console.log(`   + ${s.nama} (${s.email})`));
  } else {
    console.log(`✅ Tidak ada siswa berlebih di platform`);
  }

  if (missingInLive.length > 0) {
    console.log(`❌ BELUM ADA DI PLATFORM (${missingInLive.length} siswa):`);
    missingInLive.forEach(s => console.log(`   - ${s.nama} (${s.email})`));
  } else {
    console.log(`✅ Semua target siswa excel sudah ada di platform`);
  }
}

