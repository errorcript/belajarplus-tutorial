const ExcelJS = require('exceljs');
const fs = require('fs');

async function parseJadwalExcel() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');

  // 1. Parse Sheet Daftar Guru & Mapel
  const wsGuru = wb.getWorksheet('Daftar Guru & Mapel');
  const teachers = [];
  wsGuru.eachRow((row, r) => {
    if (r >= 4) {
      const kode = row.getCell(1).value;
      const nama = row.getCell(2).value;
      const mapel = row.getCell(3).value;
      const kelas = row.getCell(4).value;
      const ket = row.getCell(5).value;
      if (kode || nama) {
        teachers.push({ kode, nama, mapel, kelas, ket });
      }
    }
  });

  // 2. Parse Sheet Jadwal Pelajaran
  const wsJadwal = wb.getWorksheet('Jadwal Pelajaran');
  // Header ada di Row 5: ["Hari","Jam ke","Waktu","X.1","X.2","X.3","X.4","X.5","XI.1","XI.2","XI.3","XI.4","XI.5","XII.1","XII.2","XII.3","XII.4","XII.5","Piket"]
  const headerRow = wsJadwal.getRow(5);
  const classes = [];
  for (let c = 4; c <= 18; c++) {
    classes.push({ col: c, name: headerRow.getCell(c).value });
  }

  const scheduleSlots = [];
  let currentHari = '';

  for (let r = 6; r <= wsJadwal.rowCount; r++) {
    const row = wsJadwal.getRow(r);
    const hariCell = row.getCell(1).value;
    if (hariCell && typeof hariCell === 'string' && hariCell.trim() !== '') {
      currentHari = hariCell.trim();
    }
    const jamKe = row.getCell(2).value;
    const waktu = row.getCell(3).value;

    if (!jamKe || jamKe === 'Istirahat') continue;

    classes.forEach(cls => {
      const cellVal = row.getCell(cls.col).value;
      if (cellVal && typeof cellVal === 'string' && cellVal.trim() !== '' && cellVal !== 'UPACARA') {
        const lines = cellVal.split('\n').map(s => s.trim()).filter(Boolean);
        const guru = lines[0] || '';
        let mapel = lines[1] || '';
        if (mapel.startsWith('(') && mapel.endsWith(')')) {
          mapel = mapel.slice(1, -1);
        }
        scheduleSlots.push({
          hari: currentHari,
          jamKe,
          waktu,
          rombel: cls.name,
          guru,
          mapel,
          rawText: cellVal
        });
      }
    });
  }

  const uniqueGurusInJadwal = [...new Set(scheduleSlots.map(s => s.guru))].sort();
  const uniqueMapelsInJadwal = [...new Set(scheduleSlots.map(s => s.mapel))].sort();
  const uniqueRombelsInJadwal = [...new Set(scheduleSlots.map(s => s.rombel))].sort();

  console.log('=== SUMMARY JADWAL SMAN 11 PURWOREJO EXCEL ===');
  console.log(`Total Guru di Sheet Guru : ${teachers.length}`);
  console.log(`Total Rombel di Jadwal   : ${classes.length} (${uniqueRombelsInJadwal.join(', ')})`);
  console.log(`Total Slot Jadwal Belajar: ${scheduleSlots.length}`);
  console.log(`Total Unik Guru di Jadwal: ${uniqueGurusInJadwal.length}`);
  console.log(`Total Unik Mapel di Jadwal: ${uniqueMapelsInJadwal.length}`);

  fs.writeFileSync('parsed_jadwal_purworejo.json', JSON.stringify({
    teachers,
    classes,
    uniqueGurusInJadwal,
    uniqueMapelsInJadwal,
    uniqueRombelsInJadwal,
    sampleSlots: scheduleSlots.slice(0, 10),
    totalSlots: scheduleSlots.length
  }, null, 2));
}

parseJadwalExcel().catch(console.error);

