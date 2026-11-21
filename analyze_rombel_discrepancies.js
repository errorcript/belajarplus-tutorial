const ExcelJS = require('exceljs');
const fs = require('fs');

async function analyzeDiscrepancies() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Update data akun terbaru\\1 Tawangsari\\Master_Data_Siswa_SMAN_1_Tawangsari-1.xlsx');
  const ws = wb.getWorksheet('Siswa');

  // Baca target excel: rombel -> [{ nama, email, nisn, rombel }]
  const targetMap = {};
  ws.eachRow((row, rNum) => {
    if (rNum === 1) return;
    const nama = (row.getCell(1).value || '').toString().trim();
    const email = (row.getCell(2).value?.text || row.getCell(2).value || '').toString().trim().toLowerCase();
    const rombel = (row.getCell(4).value || '').toString().trim();
    if (!rombel) return;

    if (!targetMap[rombel]) targetMap[rombel] = [];
    targetMap[rombel].push({ nama, email, rombel });
  });

  const liveMap = JSON.parse(fs.readFileSync('tws_all_rombel_active_members.json', 'utf8'));

  console.log('=== ANALISIS DISKREPANSI PER ROMBEL ===\n');

  const discrepancies = {};

  for (const rombelName of Object.keys(liveMap)) {
    const live = liveMap[rombelName];
    const target = targetMap[rombelName] || [];

    const targetEmails = new Set(target.map(t => t.email.toLowerCase()));
    const targetNames = new Set(target.map(t => t.nama.toLowerCase().replace(/[^a-z0-9]/g, '')));

    const liveMembers = live.members;
    const liveEmails = new Set(liveMembers.map(m => m.email.toLowerCase()));

    // 1. Akun di Live yang tidak cocok dengan target email
    const extraInLive = [];
    const internalDuplicates = [];
    const seenNames = {};

    liveMembers.forEach(m => {
      const normName = m.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenNames[normName]) {
        seenNames[normName] = [];
      }
      seenNames[normName].push(m);

      if (!targetEmails.has(m.email.toLowerCase())) {
        extraInLive.push(m);
      }
    });

    Object.keys(seenNames).forEach(n => {
      if (seenNames[n].length > 1) {
        internalDuplicates.push(seenNames[n]);
      }
    });

    // 2. Siswa di Target yang belum ada di Live
    const missingInLive = target.filter(t => !liveEmails.has(t.email));

    if (live.count !== target.length || extraInLive.length > 0 || missingInLive.length > 0) {
      discrepancies[rombelName] = {
        rombelId: live.rombelId,
        targetCount: target.length,
        liveCount: live.count,
        diff: live.count - target.length,
        extraInLive,
        missingInLive,
        internalDuplicates
      };

      console.log(`[${rombelName}] Target: ${target.length} | Live: ${live.count} (Diff: ${live.count - target.length})`);
      if (internalDuplicates.length > 0) {
        console.log(`  -> Ada ${internalDuplicates.length} nama dobel di dalam rombel!`);
        internalDuplicates.forEach(d => {
          console.log(`     * ${d[0].name}:`);
          d.forEach(acc => console.log(`       - ${acc.email} (memberId: ${acc.memberId})`));
        });
      }
      if (extraInLive.length > 0) {
        console.log(`  -> Extra di Live (${extraInLive.length} siswa/akun):`);
        extraInLive.forEach(e => console.log(`     - ${e.name} | ${e.email} (memberId: ${e.memberId})`));
      }
      if (missingInLive.length > 0) {
        console.log(`  -> Kurang di Live (${missingInLive.length} siswa):`);
        missingInLive.forEach(m => console.log(`     - ${m.nama} | ${m.email}`));
      }
      console.log('');
    }
  }

  fs.writeFileSync('tws_rombel_discrepancies.json', JSON.stringify(discrepancies, null, 2));
  console.log('Saved discrepancies to tws_rombel_discrepancies.json');
}

analyzeDiscrepancies().catch(console.error);

