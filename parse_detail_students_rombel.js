const fs = require('fs');

async function parseStudentsAndRombelDetail() {
  const students = JSON.parse(fs.readFileSync('tws_platform_students.json', 'utf8'));

  // 1. Ekstrak 6 siswa unplaced
  const unplaced = students.filter(s => !s.has_rombel).map((s, i) => ({
    no: i + 1,
    name: s.full_name,
    email: s.email,
    user_id: s.user_id,
    status: s.status,
    joined_at: s.joined_at
  }));

  console.log('=== 6 SISWA BELUM DITEMPATKAN (UNPLACED) ===');
  console.table(unplaced);
  fs.writeFileSync('tws_unplaced_students.json', JSON.stringify(unplaced, null, 2));

  // 2. Baca daftar rombel live
  const rText = fs.readFileSync('tws_rombels_raw.txt', 'utf8');
  const rombelItems = [...rText.matchAll(/\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":2,"s":2\}\s*,\s*\{"t":1,"s":"([^"]*)"\}\s*,\s*\{"t":1,"s":"([0-9a-fA-F-]{36})"\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}\s*,\s*\{"t":0,"s":(\d+)\}\s*,\s*\{"t":1,"s":"([^"]+)"\}/g)];

  const rombels = rombelItems.map(m => ({
    id: m[1],
    suffix: m[2],
    name: m[4],
    gradeCode: m[6],
    levelCode: m[7],
    displayName: `${m[8]}-${m[2]}`
  }));

  fs.writeFileSync('tws_platform_rombels.json', JSON.stringify(rombels, null, 2));
  console.log(`\n=== DAFTAR 30 ROMBEL PLATFORM ===`);
  console.log(rombels.map(r => r.displayName).join(', '));
}

parseStudentsAndRombelDetail().catch(console.error);

