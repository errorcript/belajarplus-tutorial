const ExcelJS = require('exceljs');

async function inspect() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');
  console.log('Sheet Count:', wb.worksheets.length);
  wb.worksheets.forEach((ws, idx) => {
    console.log(`\n=== Sheet ${idx + 1}: [${ws.name}] (Rows: ${ws.rowCount}, Cols: ${ws.columnCount}) ===`);
    for (let r = 1; r <= Math.min(ws.rowCount, 40); r++) {
      const row = ws.getRow(r);
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        values[colNumber - 1] = cell.value;
      });
      if (values.some(v => v !== null && v !== undefined && v !== '')) {
        console.log(`R${r}:`, JSON.stringify(values.slice(0, 20)));
      }
    }
  });
}

inspect().catch(console.error);

