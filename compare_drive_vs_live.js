const ExcelJS = require('exceljs');
const fs = require('fs');

async function compareRombels() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Update data akun terbaru\\1 Tawangsari\\Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx');
  const ws = wb.getWorksheet('Siswa');

  const excelCounts = {};
  const excelStudents = {};

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const nama = row.getCell(1).value;
    const email = row.getCell(2).value?.text || row.getCell(2).value;
    const rombel = (row.getCell(4).value || '').toString().trim();
    if (!rombel) return;

    if (!excelCounts[rombel]) {
      excelCounts[rombel] = 0;
      excelStudents[rombel] = [];
    }
    excelCounts[rombel]++;
    excelStudents[rombel].push({ nama, email });
  });

  console.log('--- TARGET DARI EXCEL MASTER DRIVE ---');

  if (fs.existsSync('tws_live_rombel_counts_after_revision.json')) {
    const liveData = JSON.parse(fs.readFileSync('tws_live_rombel_counts_after_revision.json', 'utf8'));
    const liveCounts = {};
    liveData.forEach(l => liveCounts[l.rombel] = l.count);

    console.log('\n--- PERBANDINGAN TARGET DRIVE VS LIVE PLATFORM ---');
    console.log('Rombel'.padEnd(16) + ' | ' + 'Target Drive'.padEnd(14) + ' | ' + 'Live Platform'.padEnd(15) + ' | ' + 'Status');
    console.log('-'.repeat(60));

    function getRombelKey(name) {
      const m = name.match(/Kelas\s+(\d+)[\-_](\d+)/);
      if (m) return parseInt(m[1]) * 100 + parseInt(m[2]);
      return 9999;
    }

    const allKeys = [...new Set([...Object.keys(excelCounts), ...Object.keys(liveCounts)])].sort((a,b) => getRombelKey(a) - getRombelKey(b));
    let totalTarget = 0;
    let totalLive = 0;

    allKeys.forEach(k => {
      const target = excelCounts[k] || 0;
      const live = liveCounts[k] || 0;
      totalTarget += target;
      totalLive += live;
      const diff = live - target;
      let status = 'COCOK';
      if (diff > 0) status = 'LEBIH (+' + diff + ')';
      if (diff < 0) status = 'KURANG (' + diff + ')';
      console.log(k.padEnd(16) + ' | ' + target.toString().padEnd(14) + ' | ' + live.toString().padEnd(15) + ' | ' + status);
    });

    console.log('-'.repeat(60));
    console.log('TOTAL'.padEnd(16) + ' | ' + totalTarget.toString().padEnd(14) + ' | ' + totalLive.toString().padEnd(15));
  }
}

compareRombels().catch(console.error);

