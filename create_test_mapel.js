const ExcelJS = require('exceljs');

async function createTestMapel() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Jadwal');
  
  ws.addRow(['rombel', 'hari', 'mulai', 'selesai', 'mapel', 'kegiatan', 'guru']);
  // Mapel Kelas 10: BAHASA INDONESIA
  // Guru di platform SMAN 11 Purworejo: ERY EKA PRATIWI atau Ery Eka Pratiwi, S.Pd.
  // Kita coba dua variasi nama guru atau cek nama guru di platform
  ws.addRow(['Kelas 10-1', 'Senin', '07:45', '08:30', 'BAHASA INDONESIA', '', 'ERY EKA PRATIWI']);
  
  await wb.xlsx.writeFile('test_impor_mapel.xlsx');
  console.log('Created test_impor_mapel.xlsx');
}

createTestMapel().catch(console.error);

