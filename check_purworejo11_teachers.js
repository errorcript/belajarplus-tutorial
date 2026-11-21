const ExcelJS = require('exceljs');

async function checkTeachers() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\AKUN\\DATA_GURU_EMAIL_BELAJARPLUS.xlsx');
  console.log('Sheets in DATA_GURU_EMAIL_BELAJARPLUS.xlsx:', wb.worksheets.map(w => w.name));

  const ws = wb.worksheets[0];
  console.log(`Rows: ${ws.rowCount}`);

  const purworejo11Teachers = [];
  ws.eachRow((row, r) => {
    const rowVals = [];
    row.eachCell({ includeEmpty: true }, (c, i) => rowVals[i - 1] = c.value);
    const text = JSON.stringify(rowVals);
    if (text.toLowerCase().includes('11 purworejo') || text.toLowerCase().includes('sman 11')) {
      purworejo11Teachers.push({ row: r, data: rowVals });
    }
  });

  console.log(`Found ${purworejo11Teachers.length} teachers for SMAN 11 Purworejo:`);
  purworejo11Teachers.forEach(t => console.log(t.data));
}

checkTeachers().catch(console.error);

