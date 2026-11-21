const ExcelJS = require('exceljs');

async function inspectHidayat() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');

  const wsGuru = wb.getWorksheet('Daftar Guru & Mapel');
  console.log('=== DATA GURU DI SHEET GURU & MAPEL ===');
  wsGuru.eachRow((r, i) => {
    const txt = JSON.stringify(r.values);
    if (txt.includes('Hidayat') || txt.includes('Fauzi') || txt.includes('Dian Saputri')) {
      console.log(`R${i}:`, txt);
    }
  });

  const wsJadwal = wb.getWorksheet('Jadwal Pelajaran');
  console.log('\n=== DETAIL SEL JADWAL HIDAYAT FAUZI DI SENIN JAM 5-6 & SELASA JAM 3-4 ===');
  // Row 11: Senin Jam 5
  // Row 12: Senin Jam 6
  // Row 17: Selasa Jam 3
  // Row 18: Selasa Jam 4
  [11, 12, 17, 18, 24, 44].forEach(rowIdx => {
    const row = wsJadwal.getRow(rowIdx);
    const hari = row.getCell(1).value;
    const jam = row.getCell(2).value;
    const waktu = row.getCell(3).value;
    console.log(`\nRow ${rowIdx} [${hari} Jam ${jam} (${waktu})]:`);
    for (let c = 4; c <= 18; c++) {
      const cls = wsJadwal.getRow(5).getCell(c).value;
      const val = row.getCell(c).value;
      if (val && JSON.stringify(val).includes('Fauzi')) {
        console.log(`  Class ${cls} (Col ${c}):`, JSON.stringify(val));
      }
    }
  });
}

inspectHidayat().catch(console.error);

