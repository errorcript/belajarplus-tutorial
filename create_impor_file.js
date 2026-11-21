const ExcelJS = require('exceljs');
const fs = require('fs');

async function createImporFile() {
  const drive = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  const k11_1 = drive.filter(d => d.D === 'Kelas 11-1');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Siswa');

  sheet.columns = [
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Password Awal', key: 'password', width: 20 },
    { header: 'Rombel', key: 'rombel', width: 20 }
  ];

  k11_1.forEach(s => {
    sheet.addRow({
      nama: s.A,
      email: s.B,
      password: s.C,
      rombel: s.D
    });
  });

  await workbook.xlsx.writeFile('impor_kelas_11_1.xlsx');
  console.log('Successfully created impor_kelas_11_1.xlsx with', k11_1.length, 'students');
}

createImporFile().catch(console.error);

