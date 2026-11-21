const ExcelJS = require('exceljs');
const fs = require('fs');

async function testExistingStudentPreview() {
  // Ambil 1 siswa Kelas 11-8 dari platform
  // dan 1 siswa baru dari Kelas 11-1
  const drive = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  const k11_8 = drive.find(d => d.D === 'Kelas 11-8');
  const k11_1 = drive.find(d => d.D === 'Kelas 11-1');

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Siswa');
  sheet.columns = [
    { header: 'Nama', key: 'nama' },
    { header: 'Email', key: 'email' },
    { header: 'Password Awal', key: 'password' },
    { header: 'Rombel', key: 'rombel' }
  ];

  sheet.addRow({ nama: k11_8.A, email: k11_8.B, password: k11_8.C, rombel: k11_8.D });
  sheet.addRow({ nama: k11_1.A, email: k11_1.B, password: k11_1.C, rombel: k11_1.D });

  await workbook.xlsx.writeFile('test_impor_mix.xlsx');
  console.log('Saved test_impor_mix.xlsx');
}

testExistingStudentPreview().catch(console.error);

