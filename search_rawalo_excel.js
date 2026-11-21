const ExcelJS = require('exceljs');

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/SMA Negeri 1 RAWALO.xlsx');
  console.log('Worksheets:', wb.worksheets.map(w => w.name));

  for (const ws of wb.worksheets) {
    ws.eachRow((row, rowNumber) => {
      const val = row.values;
      const str = JSON.stringify(val);
      if (str.toUpperCase().includes('DIAN')) {
        console.log(`[${ws.name} Row ${rowNumber}]:`, val);
      }
    });
  }
})();

