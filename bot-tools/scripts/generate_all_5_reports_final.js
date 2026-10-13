const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const { generateGroupedHtml } = require('./report_generator_helper');

async function renderPdf(page, htmlContent, outputPath, tempHtmlName) {
  const tempPath = path.join('C:/Users/errorscript/.gemini/antigravity-ide/scratch', tempHtmlName);
  fs.writeFileSync(tempPath, htmlContent, 'utf8');
  await page.goto('file:///' + tempPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '12mm', bottom: '15mm', left: '12mm' }
  });
  console.log(`Saved PDF: ${outputPath}`);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // 1. SMAN 1 PURWOKERTO (792 Siswa, 22 Rombel)
  {
    console.log('\n--- 1. Generating SMAN 1 Purwokerto ---');
    const school = {
      shortName: 'SMAN 1 Purwokerto',
      name: 'SMA NEGERI 1 PURWOKERTO',
      subdomainUrl: 'https://smanegeri1purwokerto.belajarplus.com'
    };
    const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/SMA Negeri 1 Purwokerto.xlsx');
    const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]]);
    const rombelsMap = {};
    const allStudents = [];

    rows.forEach(s => {
      const ln = (s.lastname || s.cohort1 || '').trim();
      let rName = 'Kelas Cadangan';
      const m10 = ln.match(/sman1pwk_X-0?(\d+)/i);
      const m11 = ln.match(/sman1pwk_XI-0?(\d+)/i);
      if (m10) {
        rName = `Kelas 10-${parseInt(m10[1], 10)}`;
      } else if (m11) {
        rName = `Kelas 11-${parseInt(m11[1], 10)}`;
      }

      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      const cleanEmail = (s.email || s.Email || '').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      const studentObj = {
        nama: s.firstname || s.Nama || '',
        email: cleanEmail,
        password: s.password || s['Password Awal'] || 'sman1pwk_1234'
      };
      rombelsMap[rName].push(studentObj);
      allStudents.push(studentObj);
    });

    console.log(`Purwokerto: ${allStudents.length} siswa across ${Object.keys(rombelsMap).length} rombel`);
    const html = generateGroupedHtml(school, allStudents, rombelsMap);
    await renderPdf(page, html, 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/Laporan_Resmi_Akun_SMAN 1 Purwokerto.pdf', 'laporan_purwokerto_final.html');
  }

  // 2. SMAN 1 JATILAWANG (792 Siswa)
  {
    console.log('\n--- 2. Generating SMAN 1 Jatilawang ---');
    const school = {
      shortName: 'SMAN 1 Jatilawang',
      name: 'SMA NEGERI 1 JATILAWANG',
      subdomainUrl: 'https://smanegeri1jatilawang.belajarplus.com'
    };
    const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/56. SMAN 1 Jatilawang/SMA NEGERI 1 JATILAWANG.xlsx');
    const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]]);
    const rombelsMap = {};
    const allStudents = [];

    rows.forEach(s => {
      const ln = (s.lastname || '').trim().toLowerCase();
      let rName = 'Kelas Cadangan';
      const m10 = ln.match(/sman1jatila_kelas10_x-([a-k])/i);
      const m11 = ln.match(/sman1jatila_kelas11_xi-([a-k])/i);
      if (m10) rName = `Kelas 10-${m10[1].toUpperCase()}`;
      else if (m11) rName = `Kelas 11-${m11[1].toUpperCase()}`;

      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      const cleanEmail = (s.email || s.Email || '').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      const studentObj = {
        nama: s.firstname || s.Nama || '',
        email: cleanEmail,
        password: s.password || s['Password Awal'] || 'Sman1jatila_1234'
      };
      rombelsMap[rName].push(studentObj);
      allStudents.push(studentObj);
    });

    console.log(`Jatilawang: ${allStudents.length} siswa across ${Object.keys(rombelsMap).length} rombel`);
    const html = generateGroupedHtml(school, allStudents, rombelsMap);
    await renderPdf(page, html, 'G:/My Drive/Trainer/B+/AKUN/56. SMAN 1 Jatilawang/Laporan_Resmi_Akun_SMAN 1 Jatilawang.pdf', 'laporan_jatilawang_final.html');
  }

  // 3. SMAN 1 PATIKRAJA (612 Siswa)
  {
    console.log('\n--- 3. Generating SMAN 1 Patikraja ---');
    const school = {
      shortName: 'SMAN 1 Patikraja',
      name: 'SMA NEGERI 1 PATIKRAJA',
      subdomainUrl: 'https://smanegeri1patikraja.belajarplus.com'
    };
    const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/57. SMAN 1 Patikraja/SMA NEGERI 1 PATIKRAJA.xlsx');
    const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]]);
    const rombelsMap = {};
    const allStudents = [];

    rows.forEach(s => {
      const ln = (s.lastname || '').trim().toLowerCase();
      let rName = 'Kelas Cadangan';
      const m11 = ln.match(/sman1patik_kelas11_xi(\d+)/i);
      const m12 = ln.match(/sman1patik_kelas12_xii(\d+)/i);
      if (m11) rName = `Kelas 11-${m11[1]}`;
      else if (m12) rName = `Kelas 12-${m12[1]}`;

      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      const cleanEmail = (s.email || s.Email || '').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      const studentObj = {
        nama: s.firstname || s.Nama || s.nama || '',
        email: cleanEmail,
        password: s.password || s['Password Awal'] || 'Sman1patik_1234'
      };
      rombelsMap[rName].push(studentObj);
      allStudents.push(studentObj);
    });

    console.log(`Patikraja: ${allStudents.length} siswa across ${Object.keys(rombelsMap).length} rombel`);
    const html = generateGroupedHtml(school, allStudents, rombelsMap);
    await renderPdf(page, html, 'G:/My Drive/Trainer/B+/AKUN/57. SMAN 1 Patikraja/Laporan_Resmi_Akun_SMAN 1 Patikraja.pdf', 'laporan_patikraja_final.html');
  }

  // 4. SMAN 1 RAWALO (852 Siswa)
  {
    console.log('\n--- 4. Generating SMAN 1 Rawalo (852 Siswa Real) ---');
    const school = {
      shortName: 'SMAN 1 Rawalo',
      name: 'SMA NEGERI 1 RAWALO',
      subdomainUrl: 'https://smanegeri1rawalo.belajarplus.com'
    };
    const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/SMA Negeri 1 RAWALO.xlsx');
    const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]]);
    const rombelsMap = {};
    const allStudents = [];

    rows.forEach(s => {
      const rName = s.rombel || 'Kelas 10-1';
      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      const cleanEmail = (s.email || s.Email || '').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      const studentObj = {
        nama: s.firstname || s.Nama || '',
        email: cleanEmail,
        password: s.password || s['Password Awal'] || 'Sman1rawalo_1234'
      };
      rombelsMap[rName].push(studentObj);
      allStudents.push(studentObj);
    });

    console.log(`Rawalo: ${allStudents.length} siswa across ${Object.keys(rombelsMap).length} rombel`);
    const html = generateGroupedHtml(school, allStudents, rombelsMap);
    await renderPdf(page, html, 'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/Laporan_Resmi_Akun_SMAN 1 Rawalo.pdf', 'laporan_rawalo_final.html');
  }

  // 5. SMAN 1 DUKUN (281 Siswa)
  {
    console.log('\n--- 5. Generating SMAN 1 Dukun ---');
    const school = {
      shortName: 'SMAN 1 Dukun',
      name: 'SMA NEGERI 1 DUKUN',
      subdomainUrl: 'https://smanegeri1dukun.belajarplus.com'
    };
    const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/10. SMAN 1 Dukun/SMA Negeri 1 Dukun.xlsx');
    const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]]);
    const rombelsMap = {};
    const allStudents = [];

    rows.forEach(s => {
      const rName = s.Rombel || s.rombel || 'Kelas 10-A';
      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      const cleanEmail = (s.Email || s.email || '').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      const studentObj = {
        nama: s.Nama || s.firstname || '',
        email: cleanEmail,
        password: s['Password Awal'] || s.password || 'Sman1dukun_1234'
      };
      rombelsMap[rName].push(studentObj);
      allStudents.push(studentObj);
    });

    console.log(`Dukun: ${allStudents.length} siswa across ${Object.keys(rombelsMap).length} rombel`);
    const html = generateGroupedHtml(school, allStudents, rombelsMap);
    await renderPdf(page, html, 'G:/My Drive/Trainer/B+/AKUN/10. SMAN 1 Dukun/Laporan_Resmi_Akun_SMAN_1_Dukun.pdf', 'laporan_dukun_final.html');
  }

  await browser.close();
  console.log('\n=== SEMUA 5 LAPORAN RESMI PDF BERHASIL DIGENERATE DENGAN SUBDOMAIN & BEBAS PESONAEDU! ===');
})();
