const ExcelJS = require('exceljs');

async function analyzeHenri() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('master_trainer.xlsx');

  const sheetsToInspect = ['Komunikasi sekolah', 'PROJECT', 'SIMULASI', 'ASAS', 'AKUN '];

  for (const sheetName of sheetsToInspect) {
    const ws = wb.getWorksheet(sheetName);
    if (!ws) continue;

    console.log(`\n======================================================`);
    console.log(`SHEET: "${sheetName}"`);
    console.log(`======================================================`);

    const headers = [];
    ws.getRow(1).eachCell((c, colNumber) => {
      headers[colNumber] = (c.value || '').toString().trim();
    });

    console.log('Headers:', headers.filter(Boolean));

    const henriRows = [];
    ws.eachRow((row, rNum) => {
      const rowVals = [];
      row.eachCell({ includeEmpty: true }, (c, colNumber) => {
        rowVals[colNumber] = c.value;
      });

      const strVals = JSON.stringify(rowVals).toLowerCase();
      if (strVals.includes('henri')) {
        henriRows.push({ rNum, rowVals });
      }
    });

    console.log(`Found ${henriRows.length} rows mentioning Henri in "${sheetName}":`);
    henriRows.forEach(({ rNum, rowVals }) => {
      // Clean values
      const printable = {};
      rowVals.forEach((val, idx) => {
        if (val !== null && val !== undefined && val !== '') {
          const key = headers[idx] || `Col_${idx}`;
          let v = val;
          if (typeof val === 'object' && val.text) v = val.text;
          else if (val instanceof Date) v = val.toISOString().slice(0, 10);
          printable[key] = v;
        }
      });
      console.log(`Row ${rNum}:`, JSON.stringify(printable));
    });
  }
}

analyzeHenri().catch(console.error);

