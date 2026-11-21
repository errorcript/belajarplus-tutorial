const ExcelJS = require('exceljs');
const fs = require('fs');

async function detectConflicts() {
  console.log('=== MEMULAI AUDIT DETEKSI BENTROK JADWAL SMAN 11 PURWOREJO ===');

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');

  const ws = wb.getWorksheet('Jadwal Pelajaran');
  const headerRow = ws.getRow(5);
  const classes = [];
  for (let c = 4; c <= 18; c++) {
    classes.push({ col: c, name: headerRow.getCell(c).value });
  }

  // Kolom Piket ada di kolom 19
  const piketCol = 19;

  const entries = [];
  let currentHari = '';

  for (let r = 6; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const hariVal = row.getCell(1).value;
    if (hariVal && typeof hariVal === 'string' && hariVal.trim() !== '') {
      currentHari = hariVal.trim();
    }
    const jamKe = row.getCell(2).value;
    const waktu = row.getCell(3).value;

    if (!jamKe || jamKe === 'Istirahat' || typeof jamKe !== 'number') continue;

    // Guru Piket
    const piketVal = row.getCell(piketCol).value;

    classes.forEach(cls => {
      const cellVal = row.getCell(cls.col).value;
      if (cellVal && typeof cellVal === 'string' && cellVal.trim() !== '' && cellVal !== 'UPACARA') {
        const lines = cellVal.split('\n').map(s => s.trim()).filter(Boolean);
        const guru = lines[0] || '';
        let mapel = lines[1] || '';
        if (mapel.startsWith('(') && mapel.endsWith(')')) {
          mapel = mapel.slice(1, -1);
        }

        entries.push({
          row: r,
          hari: currentHari,
          jamKe,
          waktu: String(waktu).trim(),
          rombel: cls.name,
          guru,
          mapel,
          raw: cellVal
        });
      }
    });
  }

  console.log(`Total entri jadwal yang dianalisis: ${entries.length}`);

  // 1. Cek Rombel Conflict (Apakah 1 rombel punya 2 jadwal di jam yang sama?)
  const rombelSlotMap = {};
  const rombelConflicts = [];
  entries.forEach(e => {
    const key = `${e.hari}__Jam${e.jamKe}__${e.rombel}`;
    if (!rombelSlotMap[key]) {
      rombelSlotMap[key] = [];
    }
    rombelSlotMap[key].push(e);
  });

  Object.entries(rombelSlotMap).forEach(([k, list]) => {
    if (list.length > 1) {
      rombelConflicts.push({ slot: k, count: list.length, items: list });
    }
  });

  // 2. Cek Guru Conflict (Apakah 1 guru mengajar di lebih dari 1 rombel di jam yang sama?)
  const guruSlotMap = {};
  entries.forEach(e => {
    // Normalisasi nama guru untuk perbandingan
    const cleanGuru = e.guru.toLowerCase().trim();
    const key = `${e.hari}__Jam${e.jamKe}__${cleanGuru}`;
    if (!guruSlotMap[key]) {
      guruSlotMap[key] = [];
    }
    guruSlotMap[key].push(e);
  });

  const simultaneousTeaching = [];
  Object.entries(guruSlotMap).forEach(([k, list]) => {
    if (list.length > 1) {
      // Periksa apakah mapelnya sama (Kelas Gabungan / Cross-Rombel Joint Class) atau beda mapel
      const uniqueMapels = [...new Set(list.map(x => x.mapel))];
      const isJointClass = uniqueMapels.length === 1;
      simultaneousTeaching.push({
        key: k,
        guru: list[0].guru,
        hari: list[0].hari,
        jamKe: list[0].jamKe,
        waktu: list[0].waktu,
        rombelList: list.map(x => x.rombel),
        mapelList: uniqueMapels,
        isJointClass: isJointClass, // Jika true: kelas gabungan
        type: isJointClass ? 'KELAS GABUNGAN (CROSS-ROMBEL)' : 'BENTROK MAPEL BEDA (REAL CLASH)'
      });
    }
  });

  const realClashes = simultaneousTeaching.filter(x => !x.isJointClass);
  const jointClasses = simultaneousTeaching.filter(x => x.isJointClass);

  console.log('\n======================================================');
  console.log('HASIL AUDIT DETEKSI BENTROK:');
  console.log(`1. Bentrok Rombel Ganda (Double Booking Rombel): ${rombelConflicts.length}`);
  console.log(`2. Guru Mengajar Multi-Kelas Bersamaan         : ${simultaneousTeaching.length}`);
  console.log(`   - Kategori Kelas Gabungan Sah (Mapel Sama) : ${jointClasses.length}`);
  console.log(`   - Kategori Bentrok Murni (Mapel Berbeda)   : ${realClashes.length}`);
  console.log('======================================================\n');

  if (realClashes.length > 0) {
    console.log('🚨 BENTROK MURNI DITEMUKAN:');
    realClashes.forEach((c, idx) => {
      console.log(`[${idx + 1}] Guru: ${c.guru} | ${c.hari} Jam ke-${c.jamKe} (${c.waktu})`);
      console.log(`    Rombel: ${c.rombelList.join(', ')}`);
      console.log(`    Mapel Berbeda: ${c.mapelList.join(' VS ')}`);
    });
  } else {
    console.log('✅ TIDAK ADA BENTROK MURNI PADA GURU MAUPUN ROMBEL!');
  }

  if (jointClasses.length > 0) {
    console.log('\nℹ️ RINCIAN KELAS GABUNGAN LINTAS ROMBEL (Dukungan Fitur Cross-Rombel BelajarPlus):');
    // Grouping by guru & hari
    const summaryJoint = {};
    jointClasses.forEach(j => {
      const gKey = `${j.guru} (${j.mapelList[0]})`;
      if (!summaryJoint[gKey]) summaryJoint[gKey] = [];
      summaryJoint[gKey].push(`${j.hari} Jam ${j.jamKe} [${j.rombelList.join(' + ')}]`);
    });
    Object.entries(summaryJoint).forEach(([g, slots]) => {
      console.log(`- ${g}: ${slots.length} sesi`);
      console.log(`  Sample: ${slots.slice(0, 3).join(', ')}${slots.length > 3 ? '...' : ''}`);
    });
  }

  fs.writeFileSync('jadwal_clash_audit_report.json', JSON.stringify({
    totalEntries: entries.length,
    rombelConflictsCount: rombelConflicts.length,
    realClashesCount: realClashes.length,
    jointClassesCount: jointClasses.length,
    realClashes,
    jointClasses,
    rombelConflicts
  }, null, 2));
}

detectConflicts().catch(console.error);

