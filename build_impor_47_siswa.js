const ExcelJS = require('exceljs');
const fs = require('fs');

async function buildImpor47Siswa() {
  const comp = JSON.parse(fs.readFileSync('tws_student_rombel_comparison.json', 'utf8'));
  const missing = comp.missingInPlatformList;

  console.log(`Building Excel import file for ${missing.length} students...`);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Siswa');

  sheet.columns = [
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Password Awal', key: 'password', width: 20 },
    { header: 'Rombel', key: 'rombel', width: 20 }
  ];

  missing.forEach((s, idx) => {
    sheet.addRow({
      nama: s.A,
      email: s.B,
      password: s.C,
      rombel: s.D
    });
  });

  const outPath = 'IMPOR_47_SISWA_TERBARU_SMAN1_TAWANGSARI.xlsx';
  await workbook.xlsx.writeFile(outPath);
  console.log(`Saved ${outPath} successfully.`);
}

buildImpor47Siswa().catch(console.error);

