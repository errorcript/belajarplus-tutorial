const ExcelJS = require('exceljs');
const fs = require('fs');

async function createCleanImport() {
  const students = JSON.parse(fs.readFileSync('manual_43_students_enriched.json', 'utf8'));

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Siswa');

  // Columns: Nama, Email, Password Awal, Rombel
  ws.columns = [
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Password Awal', key: 'password', width: 20 },
    { header: 'Rombel', key: 'rombel', width: 20 }
  ];

  students.forEach(s => {
    // Suffix for rombel: e.g. "XI FA 2"
    let rombelName = s.rombel;
    if (rombelName.startsWith('PSAS_')) {
      rombelName = rombelName.replace('PSAS_', '');
    }
    ws.addRow({
      nama: s.full_name,
      email: s.email,
      password: s.new_password,
      rombel: rombelName
    });
  });

  const filePath = 'CLEAN_IMPORT_SMAN_1_Bandongan_43_Siswa.xlsx';
  await wb.xlsx.writeFile(filePath);
  console.log('Saved clean import file:', filePath);

  const drivePath = 'G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/CLEAN_IMPORT_SMAN_1_Bandongan_43_Siswa.xlsx';
  try {
    await wb.xlsx.writeFile(drivePath);
    console.log('Saved to Drive:', drivePath);
  } catch (e) {
    console.error('Drive save error:', e.message);
  }
}

createCleanImport().catch(console.error);

