const ExcelJS = require('exceljs');

async function inspectOriginalExcelDian() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');
  
  // Baca sheet jadwal
  const ws = wb.worksheets[0];
  console.log('Sheet name:', ws.name);
  
  // Cari di baris-baris atas
  for (let r = 1; r <= 30; r++) {
    const row = ws.getRow(r);
    const vals = row.values;
    if (JSON.stringify(vals).includes('09.10') || JSON.stringify(vals).includes('08.30')) {
      console.log(`Row ${r}:`, JSON.stringify(vals).slice(0, 300));
    }
  }
}

inspectOriginalExcelDian().catch(console.error);

