const fs = require('fs');
const ExcelJS = require('exceljs');

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1J8avKPNLscG58p8Zfxc_XqerwNwAndVuQ-oOZYijts8/export?format=xlsx';
  console.log('Downloading spreadsheet as XLSX...');
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download spreadsheet: ${res.status} ${res.statusText}`);
  }
  const buffer = await res.arrayBuffer();
  fs.writeFileSync('master_trainer.xlsx', Buffer.from(buffer));
  console.log('Downloaded master_trainer.xlsx, size:', buffer.byteLength);

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('master_trainer.xlsx');

  console.log('\nWorksheets found:');
  wb.eachSheet((ws, id) => {
    console.log(`- [${id}] ${ws.name} (rows: ${ws.rowCount}, cols: ${ws.columnCount})`);
  });

  // Search for "Henri" or "PIC" across all sheets
  console.log('\nSearching for Henri / PIC...');
  wb.eachSheet((ws) => {
    ws.eachRow((row, rowNumber) => {
      const values = row.values;
      const str = JSON.stringify(values).toLowerCase();
      if (str.includes('henri') || str.includes('pic')) {
        console.log(`Sheet "${ws.name}" Row ${rowNumber}:`, values);
      }
    });
  });
}

main().catch(console.error);

