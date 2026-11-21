const ExcelJS = require('exceljs');
const fs = require('fs');

async function detailedDiff() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Update data akun terbaru\\1 Tawangsari\\Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx');
  const ws = wb.getWorksheet('Siswa');

  const excelMap = {}; // rombel -> [{nama, email}]

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const nama = (row.getCell(1).value || '').toString().trim();
    const email = (row.getCell(2).value?.text || row.getCell(2).value || '').toString().trim();
    const rombel = (row.getCell(4).value || '').toString().trim();
    if (!rombel) return;

    if (!excelMap[rombel]) excelMap[rombel] = [];
    excelMap[rombel].push({ nama, email });
  });

  // Baca dump dialog rombel teks jika ada
  const specificRombels = fs.existsSync('tws_specific_rombels_text.json') ? JSON.parse(fs.readFileSync('tws_specific_rombels_text.json', 'utf8')) : {};

  console.log('Available scraped dialogs:', Object.keys(specificRombels));

  // Simpan data target excel per rombel ke JSON
  fs.writeFileSync('tws_excel_students_by_rombel.json', JSON.stringify(excelMap, null, 2));
  console.log('Saved target students by rombel to tws_excel_students_by_rombel.json');
}

detailedDiff().catch(console.error);

