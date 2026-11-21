const ExcelJS = require('exceljs');
const fs = require('fs');

async function readTemplate() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('contoh-impor-jadwal.xlsx');
  wb.eachSheet((ws, id) => {
    console.log('Sheet:', ws.name);
    ws.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`, JSON.stringify(row.values));
    });
  });
}

readTemplate().catch(console.error);

