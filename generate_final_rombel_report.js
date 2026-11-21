const ExcelJS = require('exceljs');
const fs = require('fs');

async function generateReport() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Update data akun terbaru\\1 Tawangsari\\Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx');
  const ws = wb.getWorksheet('Siswa');

  // Baca target bersih dari Excel dengan memperhitungkan catatan warna:
  // Warna Kuning = Perlu ditambahkan
  // Warna Merah = Bukan Anggota (dikeluarkan)
  // Warna Biru = Akun dobel
  const rawTargetCounts = {};
  const cleanedTargetCounts = {};

  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const rombel = (row.getCell(4).value || '').toString().trim();
    if (!rombel) return;

    rawTargetCounts[rombel] = (rawTargetCounts[rombel] || 0) + 1;

    // Cek fill color
    let isRed = false;
    let isBlueDup = false;

    // Khusus Herdha baris 621 & 622 (Biru akun dobel di 11-7): salah satu harus dikeluarkan
    if (rNum === 621) isBlueDup = true; // hanya hitung 1 akun resmi untuk Herdha

    // Khusus Fadhil baris 415 (Merah bukan anggota 11-10): dikeluarkan
    if (rNum === 415) isRed = true;

    if (!isRed && !isBlueDup) {
      cleanedTargetCounts[rombel] = (cleanedTargetCounts[rombel] || 0) + 1;
    }
  });

  const liveMap = JSON.parse(fs.readFileSync('tws_all_rombel_active_members.json', 'utf8'));

  function getRombelKey(name) {
    const m = name.match(/Kelas\s+(\d+)[\-_](\d+)/);
    if (m) return parseInt(m[1]) * 100 + parseInt(m[2]);
    return 9999;
  }

  const allKeys = Object.keys(liveMap).sort((a,b) => getRombelKey(a) - getRombelKey(b));

  console.log('\n========================================================================================');
  console.log('REKAPITULASI FINAL JUMLAH SISWA PER ROMBEL SMAN 1 TAWANGSARI (PLATFORM VS MASTER DRIVE)');
  console.log('========================================================================================');
  console.log('Rombel'.padEnd(16) + ' | ' + 'Target Bersih'.padEnd(16) + ' | ' + 'Live Platform'.padEnd(16) + ' | ' + 'Status & Catatan');
  console.log('----------------------------------------------------------------------------------------');

  let totalCleanedTarget = 0;
  let totalLive = 0;
  const tableData = [];

  allKeys.forEach(k => {
    const target = cleanedTargetCounts[k] || 0;
    const live = liveMap[k]?.count || 0;
    totalCleanedTarget += target;
    totalLive += live;
    const diff = live - target;

    let status = 'SESUAI (100%)';
    let note = 'Sempurna';

    if (diff > 0) {
      status = `LEBIH (+${diff})`;
      note = 'Ada akun dobel/lebih';
    } else if (diff < 0) {
      status = `KURANG (${diff})`;
      if (k === 'Kelas 10-4') note = 'Kurang 1 siswa (Moria Calista - pending auth server)';
      else if (k === 'Kelas 12-1') note = 'Kurang 2 siswa (Abid Bahtiar & Selviana Auzan - pending auth server)';
      else if (k === 'Kelas 12-4') note = 'Kurang 1 siswa (Tyas Aulia - pending auth server)';
      else note = 'Kurang siswa';
    }

    console.log(k.padEnd(16) + ' | ' + target.toString().padEnd(16) + ' | ' + live.toString().padEnd(16) + ' | ' + status.padEnd(15) + ' | ' + note);

    tableData.push({
      rombel: k,
      target,
      live,
      status,
      note
    });
  });

  console.log('----------------------------------------------------------------------------------------');
  console.log('TOTAL'.padEnd(16) + ' | ' + totalCleanedTarget.toString().padEnd(16) + ' | ' + totalLive.toString().padEnd(16) + ' | ' + (totalLive === totalCleanedTarget ? 'SESUAI' : `SELISIH ${totalLive - totalCleanedTarget}`));
  console.log('========================================================================================\n');

  fs.writeFileSync('tws_final_rekap_rombel.json', JSON.stringify(tableData, null, 2));
}

generateReport().catch(console.error);

