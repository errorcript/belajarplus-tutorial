const ExcelJS = require('exceljs');

async function readOriginalMaster() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('C:\\Users\\errorscript\\Downloads\\Data Akun\\37. SMA Negeri 11 Purworejo\\SMA Negeri 11 Purworejo.xlsx');
  console.log('Worksheet Names:', wb.worksheets.map(w => w.name));
  wb.worksheets.forEach(ws => {
    console.log(`\n=== Sheet: ${ws.name} (Rows: ${ws.rowCount}) ===`);
    for (let r = 1; r <= Math.min(ws.rowCount, 10); r++) {
      const vals = [];
      ws.getRow(r).eachCell({ includeEmpty: true }, (c, i) => vals[i - 1] = c.value);
      console.log(`  R${r}:`, JSON.stringify(vals));
    }
  });
}

readOriginalMaster().catch(console.error);

