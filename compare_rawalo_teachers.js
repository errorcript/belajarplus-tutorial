const unzipper = require('unzipper');
const fs = require('fs');

async function extractAllGurusFromExcel() {
  const filePath = 'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/SMA Negeri 1 RAWALO.xlsx';
  const directory = await unzipper.Open.file(filePath);
  const sheet2File = directory.files.find(d => d.path.replace(/\\/g, '/').toLowerCase() === 'xl/worksheets/sheet2.xml');
  const buf = await sheet2File.buffer();
  const xml = buf.toString('utf8');

  // Parse baris-baris guru
  const rows = [...xml.matchAll(/<row r="(\d+)">([\s\S]*?)<\/row>/g)];
  const teachers = [];

  for (const r of rows) {
    const rowNum = r[1];
    const rowXml = r[2];
    const cells = [...rowXml.matchAll(/<c r="([A-Z]+)\d+"[^>]*><v>([^<]*)<\/v><\/c>/g)];
    const rowData = {};
    for (const c of cells) {
      rowData[c[1]] = c[2];
    }
    // Kolom A: username/kode, B: Nama, C: Peran, D: Email, E: Password
    if (rowData.B) {
      teachers.push({
        row: rowNum,
        code: rowData.A,
        name: rowData.B,
        role: rowData.C,
        email: rowData.D,
        password: rowData.E
      });
    }
  }

  console.log(`Total teachers in Sheet 2: ${teachers.length}`);
  fs.writeFileSync('excel_rawalo_teachers.json', JSON.stringify(teachers, null, 2));

  // Bandingkan dengan platform live staff (46 staff)
  const liveStaff = JSON.parse(fs.readFileSync('rawalo_all_staff.json', 'utf8'));
  const liveEmails = new Set(liveStaff.map(s => (s.email || '').toLowerCase().trim()));
  const liveNames = new Set(liveStaff.map(s => (s.full_name || '').toLowerCase().trim()));

  const matched = [];
  const missing = [];

  for (const t of teachers.slice(1)) { // skip header
    const emailMatch = t.email && liveEmails.has(t.email.toLowerCase().trim());
    const nameMatch = t.name && liveNames.has(t.name.toLowerCase().trim());
    if (emailMatch || nameMatch) {
      matched.push(t);
    } else {
      missing.push(t);
    }
  }

  console.log(`Matched with live platform: ${matched.length}`);
  console.log(`Missing from live platform: ${missing.length}`);
  console.log('\n=== GURU DI EXCEL YANG BELUM ADA DI PLATFORM ===');
  console.table(missing.map(m => ({ name: m.name, email: m.email, password: m.password })));

  // Cek spesifik Fitrinah
  const fitrinah = teachers.find(t => t.name.toLowerCase().includes('fitrinah'));
  console.log('\n=== DATA RESMI FITRINAH DI EXCEL ===');
  console.log(fitrinah);
}

extractAllGurusFromExcel().catch(console.error);
