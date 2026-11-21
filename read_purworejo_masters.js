const ExcelJS = require('exceljs');

async function readSchoolMasters() {
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo\\SMA Negeri 11 Purworejo.xlsx');
  console.log('--- SMA Negeri 11 Purworejo.xlsx sheets:', wb1.worksheets.map(w => w.name));
  wb1.worksheets.forEach(ws => {
    console.log(`Sheet: ${ws.name}, Rows: ${ws.rowCount}`);
    for (let r = 1; r <= Math.min(ws.rowCount, 5); r++) {
      const vals = [];
      ws.getRow(r).eachCell({ includeEmpty: true }, (c, i) => vals[i - 1] = c.value);
      console.log(`  R${r}:`, JSON.stringify(vals));
    }
  });

  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo\\Siswa_SMAN 11 PURWOREJO_2.xlsx');
  console.log('\n--- Siswa_SMAN 11 PURWOREJO_2.xlsx sheets:', wb2.worksheets.map(w => w.name));
  wb2.worksheets.forEach(ws => {
    console.log(`Sheet: ${ws.name}, Rows: ${ws.rowCount}`);
    for (let r = 1; r <= Math.min(ws.rowCount, 5); r++) {
      const vals = [];
      ws.getRow(r).eachCell({ includeEmpty: true }, (c, i) => vals[i - 1] = c.value);
      console.log(`  R${r}:`, JSON.stringify(vals));
    }
  });
}

readSchoolMasters().catch(console.error);

