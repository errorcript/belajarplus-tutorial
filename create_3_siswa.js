const ExcelJS = require('exceljs');
const fs = require('fs');

async function create3Siswa() {
  const comp = JSON.parse(fs.readFileSync('tws_student_rombel_comparison.json', 'utf8'));
  const targetEmails = ['cacha.cdr2011@gmail.com', 'abidbahtiar50@gmail.com', 'selvianaauzan28@gmail.com'];
  const targets = comp.missingInPlatformList.filter(s => targetEmails.includes(s.B.toLowerCase().trim()));

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Siswa');
  sheet.columns = [
    { header: 'Nama', key: 'nama' },
    { header: 'Email', key: 'email' },
    { header: 'Password Awal', key: 'password' },
    { header: 'Rombel', key: 'rombel' }
  ];

  targets.forEach(s => {
    sheet.addRow({ nama: s.A, email: s.B, password: s.C, rombel: s.D });
  });

  await workbook.xlsx.writeFile('impor_3_siswa.xlsx');
  console.log('Saved impor_3_siswa.xlsx with', targets.length, 'students');
}

create3Siswa().catch(console.error);

