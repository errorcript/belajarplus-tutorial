klo sekalian lu bikinin kelasnya bisa ? coba cek dulu jgn ubah apapun diplatfom dulu

const ExcelJS = require('exceljs');

async function createDianPtkExcel() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('PTK');

  ws.addRow(['Nama', 'Email', 'Password (opsional, min. 8)', 'Jadikan Guru (Ya/Tidak)']);
  ws.addRow(['Dian Saputri, S.Pd.', 'sman11pwr_guru29@belajarplus.com', 'Purworejo2026!', 'Ya']);

  await wb.xlsx.writeFile('[IMPOR_PTK]_SMAN_11_Purworejo_Dian2.xlsx');
  console.log('Created [IMPOR_PTK]_SMAN_11_Purworejo_Dian2.xlsx');
}

createDianPtkExcel().catch(console.error);

