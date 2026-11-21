const ExcelJS = require('exceljs');

async function buildSummary() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('master_trainer.xlsx');

  const wsKom = wb.getWorksheet('Komunikasi sekolah');
  const wsProj = wb.getWorksheet('PROJECT');
  const wsSim = wb.getWorksheet('SIMULASI');
  const wsAsas = wb.getWorksheet('ASAS');

  // Henri is rows 48 to 62 in Komunikasi / ASAS, rows 50 to 64 in PROJECT, rows 54 to 68 in SIMULASI
  const schools = [
    'SMAN 1 Purwokerto',
    'SMAN 1 Nguter',
    'SMA 1 Tawangsari',
    'SMAN 1 Sukoharjo',
    'SMAN 3 Sragen',
    'SMAN 1 Tangen',
    'SMAN 2 Sragen',
    'SMAN 6 Purworejo',
    'SMAN 1 Sukodono',
    'SMAN 1 Bandongan',
    'SMAN 1 Polokarto',
    'SMAN 1 Sragen',
    'SMAN 1 Blora',
    'SMAN 1 Adipala',
    'SMAN 1 BULU'
  ];

  const results = [];

  schools.forEach(schoolName => {
    let asasStatus = '-';
    let tglAsas = '-';
    let tglSimulasi = '-';
    let peserta = '-';
    let catatan = '-';
    let lastKomunikasi = '-';

    // Find in ASAS
    wsAsas.eachRow((r) => {
      const s = (r.getCell(2).value || '').toString().trim();
      if (s.toLowerCase() === schoolName.toLowerCase() || s.toLowerCase().includes(schoolName.toLowerCase().replace('sman', 'sma'))) {
        asasStatus = r.getCell(4).value || '-';
        const d1 = r.getCell(5).value;
        const d2 = r.getCell(6).value;
        if (d1 instanceof Date) {
          tglAsas = d1.toISOString().slice(0, 10);
          if (d2 instanceof Date) tglAsas += ` s.d. ${d2.toISOString().slice(0, 10)}`;
        }
        peserta = r.getCell(7).value || '-';
      }
    });

    // Find in SIMULASI
    wsSim.eachRow((r) => {
      const s = (r.getCell(3).value || '').toString().trim();
      if (s.toLowerCase() === schoolName.toLowerCase() || s.toLowerCase().includes(schoolName.toLowerCase().replace('sman', 'sma'))) {
        const dSim = r.getCell(13).value;
        if (dSim instanceof Date) tglSimulasi = dSim.toISOString().slice(0, 10);
        const alasan = r.getCell(6).value;
        if (alasan) catatan = alasan;
      }
    });

    // Find in PROJECT
    wsProj.eachRow((r) => {
      const s = (r.getCell(2).value || '').toString().trim();
      if (s.toLowerCase() === schoolName.toLowerCase() || s.toLowerCase().includes(schoolName.toLowerCase().replace('sman', 'sma'))) {
        const c = r.getCell(3).value;
        if (c && catatan === '-') catatan = c;
      }
    });

    // Find in Komunikasi
    wsKom.eachRow((r) => {
      const s = (r.getCell(2).value || '').toString().trim();
      if (s.toLowerCase() === schoolName.toLowerCase() || s.toLowerCase().includes(schoolName.toLowerCase().replace('sman', 'sma'))) {
        const k1 = r.getCell(4).value;
        const k2 = r.getCell(7).value;
        lastKomunikasi = k2 || k1 || '-';
      }
    });

    results.push({
      school: schoolName.replace('SMA 1', 'SMAN 1').replace('BULU', 'Bulu'),
      asasStatus,
      tglAsas,
      tglSimulasi,
      peserta,
      catatan,
      lastKomunikasi
    });
  });

  console.log(JSON.stringify(results, null, 2));
}

buildSummary().catch(console.error);

