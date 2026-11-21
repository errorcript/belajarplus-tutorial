const ExcelJS = require('exceljs');
const fs = require('fs');

async function scanColors() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Update data akun terbaru\\1 Tawangsari\\Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx');
  
  console.log('Worksheets:', wb.worksheets.map(w => w.name));

  const colorReport = [];

  for (const ws of wb.worksheets) {
    console.log(`\nScanning sheet: ${ws.name} (rows: ${ws.rowCount})`);

    ws.eachRow((row, rNum) => {
      if (rNum === 1) return; // header

      let hasColor = false;
      let colorType = 'UNKNOWN';
      let argb = '';

      // Cek cell 1 s/d cell 10
      for (let c = 1; c <= 8; c++) {
        const fill = row.getCell(c).fill;
        if (fill && fill.fgColor) {
          argb = fill.fgColor.argb || fill.fgColor.theme || '';
          hasColor = true;
          break;
        }
      }

      if (hasColor) {
        // Klasifikasi warna
        // Kuning: FFFFFF00, FFFF00, FFFFC000, FFFE...
        // Merah: FFFF0000, FFC00000, FFED7D31 (orange/red), FFC0000
        // Biru: FF00B0F0, FF0070C0, FF4472C4, FF00B0F0, etc.
        const upperArgb = (argb || '').toUpperCase();
        if (upperArgb.includes('FF00B0F0') || upperArgb.includes('0070C0') || upperArgb.includes('4472C4') || upperArgb.includes('00B0F0') || upperArgb.includes('2E75B6')) {
          colorType = 'BIRU (Akun Dobel)';
        } else if (upperArgb.includes('FFFF00') || upperArgb.includes('FFFF0000') === false && (upperArgb.includes('FFFF') || upperArgb.includes('FFC000') || upperArgb.includes('FFD966') || upperArgb.includes('FFF2CC'))) {
          colorType = 'KUNING (Perlu ditambahkan ke rombel)';
        } else if (upperArgb.includes('FF0000') || upperArgb.includes('C00000') || upperArgb.includes('FFC7CE') || upperArgb.includes('9C0006')) {
          colorType = 'MERAH (Bukan Anggota Rombel / Perlu dikeluarkan)';
        } else {
          colorType = `WARNA LAIN (${upperArgb})`;
        }

        const nama = (row.getCell(1).value || '').toString().trim();
        const email = (row.getCell(2).value?.text || row.getCell(2).value || '').toString().trim();
        const nisn = (row.getCell(3).value || '').toString().trim();
        const rombel = (row.getCell(4).value || '').toString().trim();

        colorReport.push({
          sheet: ws.name,
          row: rNum,
          argb,
          colorType,
          nama,
          email,
          nisn,
          rombel
        });
      }
    });
  }

  console.log(`\nTotal baris berwarna ditemukan: ${colorReport.length}`);
  console.table(colorReport.map(r => ({
    row: r.row,
    colorType: r.colorType,
    nama: r.nama,
    email: r.email,
    rombel: r.rombel
  })));

  fs.writeFileSync('tws_color_report.json', JSON.stringify(colorReport, null, 2));
}

scanColors().catch(console.error);

