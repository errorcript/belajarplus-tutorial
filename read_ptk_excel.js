const ExcelJS = require('exceljs');

async function readPtkExcel() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('[IMPOR_PTK]_SMAN_11_Purworejo_10_Guru.xlsx');
  const ws = wb.getWorksheet('PTK');
  console.log('PTK Sheet Rows:');
  ws.eachRow((r, num) => {
    console.log(num, JSON.stringify(r.values));
  });
}

readPtkExcel().catch(console.error);

