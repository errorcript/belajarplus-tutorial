const ExcelJS = require('exceljs');

async function readCleanImport() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo\\[CLEAN_IMPORT] SMAN 11 Purworejo_Kelas11_dan_12.xlsx');
  console.log('Worksheets in clean import:', wb.worksheets.map(w => w.name));
  wb.worksheets.forEach(ws => {
    console.log(`\n--- Sheet: ${ws.name} (Rows: ${ws.rowCount}) ---`);
    for (let r = 1; r <= Math.min(ws.rowCount, 15); r++) {
      const row = ws.getRow(r);
      const vals = [];
      row.eachCell({ includeEmpty: true }, (c, i) => vals[i - 1] = c.value);
      console.log(`R${r}:`, JSON.stringify(vals));
    }
  });
}

readCleanImport().catch(console.error);

