const fs = require('fs');

const scraped = JSON.parse(fs.readFileSync('tws_mismatched_rombels_text.json', 'utf8'));

function findDuplicatesInRombel(rombelName) {
  const dialogText = scraped[rombelName] || '';
  const lines = dialogText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const members = [];
  let inActive = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('Anggota aktif')) {
      inActive = true;
      continue;
    }
    if (line.includes('Lihat riwayat') || line.includes('Tambah siswa') || line === 'Close') {
      inActive = false;
      break;
    }
    if (inActive && line.includes('@')) {
      members.push({
        nama: lines[i - 1],
        email: line
      });
    }
  }

  console.log(`\n==================================================`);
  console.log(`MEMBERS OF ${rombelName} (Total: ${members.length})`);
  console.log(`==================================================`);

  // Cari duplikasi berdasarkan nama
  const nameMap = {};
  for (const m of members) {
    const norm = m.nama.toLowerCase().replace(/[^a-z]/g, '');
    if (!nameMap[norm]) nameMap[norm] = [];
    nameMap[norm].push(m);
  }

  const dupes = Object.entries(nameMap).filter(([k, v]) => v.length > 1);
  if (dupes.length > 0) {
    console.log(`⚠️ DITEMUKAN ${dupes.length} DUPLIKASI NAMA DI ${rombelName}:`);
    for (const [k, v] of dupes) {
      console.log(`   * ${v[0].nama}:`);
      v.forEach(x => console.log(`      - ${x.email}`));
    }
  } else {
    console.log(`✅ Tidak ada duplikasi nama yang persis.`);
  }

  return { members, dupes };
}

findDuplicatesInRombel('Kelas 11-5');
findDuplicatesInRombel('Kelas 11-6');
findDuplicatesInRombel('Kelas 11-7');
findDuplicatesInRombel('Kelas 11-8');

