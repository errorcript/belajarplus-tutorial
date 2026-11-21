const ExcelJS = require('exceljs');
const fs = require('fs');

async function createExcel() {
  const students = JSON.parse(fs.readFileSync('manual_43_students_enriched.json', 'utf8'));

  const wb = new ExcelJS.Workbook();
  wb.creator = 'BelajarPlus Official';
  wb.created = new Date();

  // Sheet 1: Format Impor Resmi (Template Siswa Official BelajarPlus)
  const wsImport = wb.addWorksheet('Format_Impor_Siswa');
  wsImport.columns = [
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Password Awal', key: 'password', width: 20 },
    { header: 'Rombel', key: 'rombel', width: 20 }
  ];

  // Header styling
  wsImport.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsImport.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D4ED8' } };
  wsImport.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  students.forEach(s => {
    wsImport.addRow({
      nama: s.full_name,
      email: s.email,
      password: s.new_password,
      rombel: s.rombel
    });
  });

  // Sheet 2: Rekap Lengkap per Rombel untuk Guru
  const wsRekap = wb.addWorksheet('Rekap_Akun_Siswa');
  wsRekap.columns = [
    { header: 'No', key: 'no', width: 8 },
    { header: 'Nama Siswa', key: 'nama', width: 35 },
    { header: 'Email Akun BelajarPlus', key: 'email', width: 35 },
    { header: 'Password Baru', key: 'password', width: 22 },
    { header: 'Rombel', key: 'rombel', width: 18 },
    { header: 'Wali Kelas / Catatan', key: 'wali', width: 28 },
    { header: 'Status Akun', key: 'status', width: 20 }
  ];

  wsRekap.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsRekap.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F766E' } };
  wsRekap.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  students.forEach((s, i) => {
    let wali = '-';
    if (s.rombel.includes('FA 2')) wali = 'Anisca Dyah Permata Sari';
    else if (s.rombel.includes('FA 1')) wali = 'Winda Pramalia Novianti';
    else if (s.rombel.includes('FE')) wali = 'Esti Dwi Prihatiningsih';

    wsRekap.addRow({
      no: i + 1,
      nama: s.full_name,
      email: s.email,
      password: s.new_password,
      rombel: s.rombel,
      wali: wali,
      status: s.status
    });
  });

  // Borders for all rows
  [wsImport, wsRekap].forEach(ws => {
    ws.eachRow((r, rowIdx) => {
      r.eachCell(cell => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
          right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
        };
        if (rowIdx > 1) {
          cell.alignment = { vertical: 'middle' };
        }
      });
    });
  });

  const localPath = 'REKAP_RESET_PASSWORD_SMAN_1_BANDONGAN_43_SISWA.xlsx';
  await wb.xlsx.writeFile(localPath);
  console.log('Saved local Excel:', localPath);

  const drivePath = 'G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/REKAP_RESET_PASSWORD_SMAN_1_BANDONGAN_43_SISWA.xlsx';
  try {
    await wb.xlsx.writeFile(drivePath);
    console.log('Saved Google Drive Excel:', drivePath);
  } catch (e) {
    console.error('Drive save error:', e.message);
  }
}

createExcel().catch(console.error);

