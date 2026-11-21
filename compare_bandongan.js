const fs = require('fs');
const ExcelJS = require('exceljs');

async function run() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/SMA Negeri 1 Bandongan.xlsx');
  const sheet = wb.getWorksheet('Siswa');
  
  const driveMap = new Map();
  sheet.eachRow((r, idx) => {
    if (idx > 1) {
      const nama = r.values[1];
      const email = r.values[2];
      const pass = r.values[3];
      const rombel = r.values[4];
      if (email) {
        driveMap.set(email.toString().toLowerCase().trim(), { nama, pass, rombel });
      }
    }
  });

  const csvContent = fs.readFileSync('bandongan_ekspor_students.csv', 'utf8');
  const csvLines = csvContent.split('\n').filter(l => l.trim().length > 0);
  const csvStudents = [];
  
  // Skip header
  for (let i = 1; i < csvLines.length; i++) {
    const l = csvLines[i].trim();
    // parse CSV line with quotes
    const matches = l.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
    if (matches && matches.length >= 5) {
      const cleaned = matches.map(m => m.replace(/^,/, '').replace(/^"/, '').replace(/"$/, '').trim());
      csvStudents.push({
        nama: cleaned[0],
        email: cleaned[1].toLowerCase(),
        placement: cleaned[2],
        status: cleaned[3],
        tanggal: cleaned[4]
      });
    }
  }

  console.log('Total di Drive Excel:', driveMap.size);
  console.log('Total di Live CSV:', csvStudents.length);

  const matchedInDrive = [];
  const notInDrive = [];

  csvStudents.forEach(s => {
    if (driveMap.has(s.email)) {
      matchedInDrive.push({ ...s, driveRombel: driveMap.get(s.email).rombel, drivePass: driveMap.get(s.email).pass });
    } else {
      notInDrive.push(s);
    }
  });

  console.log('\n--- SISWA LIVE YANG COCOK DENGAN DRIVE TRAINER:', matchedInDrive.length);
  const driveRombelCounts = {};
  matchedInDrive.forEach(s => {
    driveRombelCounts[s.driveRombel] = (driveRombelCounts[s.driveRombel] || 0) + 1;
  });
  console.log('Distribusi rombel dari file trainer:', driveRombelCounts);

  console.log('\n--- SISWA LIVE YANG TIDAK ADA DI DRIVE TRAINER (BUATAN MANUAL GURU):', notInDrive.length);
  notInDrive.forEach((s, idx) => {
    console.log(`  ${idx+1}. [Bergabung: ${s.tanggal}] ${s.nama} | ${s.email}`);
  });

  // Cek apakah ada file lain di Drive Bandongan
  const driveDir = 'G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan';
  console.log('\nBerkas lain di folder Drive Bandongan:', fs.readdirSync(driveDir));
}

run().catch(console.error);

