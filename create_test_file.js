const ExcelJS = require('exceljs');

async function createTestFile() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Jadwal');
  
  // Header: rombel, hari, mulai, selesai, mapel, kegiatan, guru
  ws.addRow(['rombel', 'hari', 'mulai', 'selesai', 'mapel', 'kegiatan', 'guru']);
  
  // Row 1: Upacara
  ws.addRow(['Kelas 10-1', 'Senin', '07:00', '07:45', '', 'Upacara', '']);
  
  await wb.xlsx.writeFile('test_impor_upacara.xlsx');
  console.log('Created test_impor_upacara.xlsx');
}

createTestFile().catch(console.error);

