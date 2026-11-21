const ExcelJS = require('exceljs');

async function readTemplate() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('template_impor_siswa.xlsx');

  workbook.eachSheet((sheet, sheetId) => {
    console.log(`Sheet ID: ${sheetId}, Name: ${sheet.name}`);
    sheet.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`, row.values);
    });
  });
}

readTemplate().catch(console.error);

