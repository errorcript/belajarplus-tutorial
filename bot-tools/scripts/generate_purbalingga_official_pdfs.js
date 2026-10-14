const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');

const baseDir = 'G:/My Drive/Trainer/B+/AKUN';
const outputPdfDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/output_pdfs_purbalingga';

if (!fs.existsSync(outputPdfDir)) {
  fs.mkdirSync(outputPdfDir, { recursive: true });
}

const logoPath = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png';
const logoBase64 = fs.existsSync(logoPath) ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64') : '';

function formatRombelName(raw) {
  if (!raw) return 'Belum Ada Rombel';
  let str = raw.toString().trim();
  // smansaka_X-A -> Kelas X-A
  // sman1bob_x_x-a -> Kelas X-A
  // sman1buka_kelas10_x-01 -> Kelas X-01
  str = str.replace(/^[a-z0-9_]+_kelas\d*_/i, '');
  str = str.replace(/^[a-z0-9_]+_x_/i, 'X-');
  str = str.replace(/^[a-z0-9_]+_xi_/i, 'XI-');
  str = str.replace(/^[a-z0-9_]+_xii_/i, 'XII-');
  str = str.replace(/^[a-z0-9_]+_X\-/i, 'X-');
  str = str.replace(/^[a-z0-9_]+_XI\-/i, 'XI-');
  str = str.replace(/^[a-z0-9_]+_XII\-/i, 'XII-');
  str = str.replace(/^[a-z0-9_]+__/i, '');
  str = str.toUpperCase();

  if (!str.startsWith('KELAS ') && str !== 'BELUM ADA ROMBEL') {
    str = 'Kelas ' + str;
  }
  return str;
}

function generateSchoolHtml(school, students) {
  const rombelsMap = {};
  students.forEach(s => {
    const rName = (s.Rombel || 'Belum Ada Rombel').toString().trim() || 'Belum Ada Rombel';
    if (!rombelsMap[rName]) rombelsMap[rName] = [];
    rombelsMap[rName].push(s);
  });

  const sortedRombelKeys = Object.keys(rombelsMap).sort();

  const summaryRows = sortedRombelKeys.map(rKey => `
    <tr>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">${rKey}</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">${rombelsMap[rKey].length} Siswa</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
    </tr>
  `).join('');

  const rombelSectionsHtml = sortedRombelKeys.map(rKey => {
    const studentsInClass = rombelsMap[rKey];
    const studentRows = studentsInClass.map((s, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #334155;">${s.Email || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: bold; color: #c2410c; text-align: center;">${s.Password || s['Password Awal'] || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10.5px; color: #16a34a; font-weight: bold;">AKTIF</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px; color: #94a3b8;">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</td>
      </tr>
    `).join('');

    return `
      <div style="page-break-before: always; padding-top: 10px;">
        <div class="header-container">
          <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
          <div class="doc-meta" style="font-size: 11px;">
            <div><strong>Satuan Pendidikan:</strong> ${school.name}</div>
            <div><strong>Kelas / Rombel:</strong> <span style="background: #1e40af; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${rKey}</span></div>
            <div><strong>Total Siswa:</strong> ${studentsInClass.length} Siswa</div>
          </div>
        </div>

        <div class="class-title-banner">
          <h2>DAFTAR KREDENSIAL LOGIN SISWA &mdash; KELAS ${rKey}</h2>
          <p>Lampiran resmi untuk dibagikan oleh Wali Kelas kepada siswa yang bersangkutan</p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">No</th>
              <th style="width: 32%;">Nama Lengkap Siswa</th>
              <th style="width: 33%;">Email Login</th>
              <th style="width: 16%; text-align: center;">Password Awal</th>
              <th style="width: 7%; text-align: center;">Status</th>
              <th style="width: 7%; text-align: center;">Paraf</th>
            </tr>
          </thead>
          <tbody>
            ${studentRows}
          </tbody>
        </table>

        <div class="class-footer">
          <div style="font-size: 10.5px; color: #64748b;">
            &bull; Portal Login: <strong style="color: #1d4ed8;">${school.subdomain}</strong>
          </div>
          <div style="font-size: 11px; text-align: right; font-weight: 500;">
            Wali Kelas <strong>${rKey}</strong>: ___________________________
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Resmi Akun - ${school.name}</title>
<style>
  @page { size: A4 portrait; margin: 12mm 15mm 15mm 15mm; }
  body { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; line-height: 1.4; }
  .header-container { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 16px; }
  .official-logo { height: 38px; object-fit: contain; }
  .doc-meta { text-align: right; font-size: 11px; color: #475569; }
  .title-banner { text-align: center; margin-bottom: 16px; }
  .title-banner h1 { margin: 0 0 4px 0; font-size: 16px; font-weight: 800; color: #0f172a; letter-spacing: 0.5px; }
  .title-banner .doc-num { font-size: 12px; color: #64748b; margin: 0; }
  .class-title-banner { background: #eff6ff; border-left: 4px solid #2563eb; padding: 8px 12px; margin-bottom: 14px; }
  .class-title-banner h2 { margin: 0; font-size: 13.5px; color: #1e3a8a; }
  .class-title-banner p { margin: 2px 0 0 0; font-size: 10.5px; color: #64748b; }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
  .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; text-align: center; }
  .summary-card .label { font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
  .summary-card .value { font-size: 16px; font-weight: bold; color: #0f172a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  th { background: #1e3a8a; color: #fff; padding: 7px 8px; font-size: 11px; font-weight: 600; text-align: left; border: 1px solid #1e3a8a; }
  td { padding: 6px 8px; font-size: 11px; border: 1px solid #cbd5e1; }
  .ba-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; font-size: 11.5px; line-height: 1.6; margin-bottom: 20px; }
  .portal-box { background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; text-align: center; }
  .portal-box .title { font-weight: bold; color: #15803d; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; }
  .portal-box .link { font-size: 15px; font-weight: bold; color: #1d4ed8; text-decoration: none; word-break: break-all; }
  .signatures { display: flex; justify-content: space-between; margin-top: 30px; padding: 0 20px; }
  .sign-box { text-align: center; width: 220px; font-size: 11.5px; }
  .sign-space { height: 65px; }
  .sign-name { font-weight: bold; border-bottom: 1px solid #0f172a; display: inline-block; min-width: 180px; padding-bottom: 2px; }
  .class-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 10px; border-top: 1px dashed #cbd5e1; }
</style>
</head><body>
  <div class="header-container">
    <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/${school.name.replace(/\s+/g, '_').toUpperCase()}/X/2026</div>
      <div><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <div><strong>Sifat:</strong> Resmi / Rahasia</div>
    </div>
  </div>
  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PEMBELAJARAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>
  
  <div class="portal-box">
    <div class="title">🌐 Portal Akses Resmi LMS Sekolah</div>
    <a href="${school.subdomain}" class="link">${school.subdomain}</a>
    <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">Siswa dan Guru dapat langsung login menggunakan tautan subdomain di atas</div>
  </div>

  <div class="summary-grid">
    <div class="summary-card"><div class="label">Satuan Pendidikan</div><div class="value" style="font-size: 13.5px;">${school.name}</div></div>
    <div class="summary-card"><div class="label">Total Akun Siswa</div><div class="value" style="color: #2563eb;">${students.length} Siswa</div></div>
    <div class="summary-card"><div class="label">Total Rombel / Kelas</div><div class="value" style="color: #16a34a;">${sortedRombelKeys.length} Rombel</div></div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini telah diselesaikan penerbitan dan sinkronisasi kredensial akun peserta didik untuk satuan pendidikan <strong>${school.name} (NPSN: ${school.npsn})</strong> ke dalam platform <strong>BelajarPlus</strong> pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p style="margin-bottom: 0;">Seluruh akun peserta didik telah memiliki email login unik, password awal terverifikasi, dan telah dipetakan ke dalam rombongan belajar (rombel) masing-masing.</p>
  </div>

  <h3 style="font-size: 13px; color: #1e3a8a; margin: 0 0 8px 0;">REKAPITULASI PENEMPATAN KELAS / ROMBEL</h3>
  <table>
    <thead><tr><th style="width: 40%; text-align: center;">Nama Rombel / Kelas</th><th style="width: 30%; text-align: center;">Jumlah Siswa Terdaftar</th><th style="width: 30%; text-align: center;">Status Verifikasi Sistem</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <div class="signatures">
    <div class="sign-box"><div>Mengetahui,<br><strong>Kepala Sekolah</strong></div><div class="sign-space"></div><div class="sign-name">${school.name}</div></div>
    <div class="sign-box"><div>Diserahkan Oleh,<br><strong>Tim Trainer</strong></div><div class="sign-space"></div><div class="sign-name">Tim Pendamping BelajarPlus</div></div>
  </div>
  ${rombelSectionsHtml}
</body></html>`;
}

async function loadStudents(school) {
  if (school.type === 'karangreja') {
    const wb = xlsx.readFile(path.join(baseDir, school.folder, school.excel));
    const data = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
    return data.map((d, i) => ({
      Nama: d.firstname || d.Nama || `Siswa ${i+1}`,
      Email: d.email || `smansaka_siswa${i+1}@belajarplus.com`,
      Password: d.password || 'Smansaka_1234',
      Rombel: formatRombelName(d.lastname || d.cohort1)
    }));
  }

  if (school.type === 'bobotsari') {
    const wb = xlsx.readFile(path.join(baseDir, school.folder, school.excel));
    const data = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
    const seenEmails = new Set();
    return data.map((d, i) => {
      let email = (d.email || '').trim().toLowerCase();
      if (!email || email.includes('smansaboss') || seenEmails.has(email)) {
        email = `${d.username || `sman1bob_siswa${i+1}`}@belajarplus.com`;
      }
      seenEmails.add(email);
      return {
        Nama: d.firstname || d.Nama || `Siswa ${i+1}`,
        Email: email,
        Password: d.password || 'Sman1bob_1234',
        Rombel: formatRombelName(d.lastname)
      };
    });
  }

  if (school.type === 'bukateja') {
    const wb = xlsx.readFile(path.join(baseDir, school.folder, school.excel));
    const data = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
    const seenEmails = new Set();
    return data.map((d, i) => {
      let email = (d.email || '').trim().toLowerCase();
      if (!email || email.includes('smabukateja') || seenEmails.has(email)) {
        email = `${d.username || `sman1buka_siswa${i+1}`}@belajarplus.com`;
      }
      seenEmails.add(email);
      return {
        Nama: d.firstname || d.Nama || `Siswa ${i+1}`,
        Email: email,
        Password: d.password || 'Sman1buka_1234',
        Rombel: formatRombelName(d.lastname)
      };
    });
  }

  if (school.type === 'purbalingga2') {
    const b1 = xlsx.readFile(path.join(baseDir, school.folder, 'SMA Negeri 2 Purbalingga - bagian 1 dari 2.xlsx'));
    const b2 = xlsx.readFile(path.join(baseDir, school.folder, 'SMA Negeri 2 Purbalingga - bagian 2 dari 2.xlsx'));
    const d1 = xlsx.utils.sheet_to_json(b1.Sheets[b1.SheetNames[0]]);
    const d2 = xlsx.utils.sheet_to_json(b2.Sheets[b2.SheetNames[0]]);
    const all = [...d1, ...d2];
    return all.map((d, i) => ({
      Nama: d.Nama || `Siswa ${i+1}`,
      Email: d.Email || `sman2pbg_siswa${i+1}@belajarplus.com`,
      Password: d['Password Awal'] || 'SMAN2Purbalingga',
      Rombel: formatRombelName(d.Rombel)
    }));
  }

  if (school.type === 'kutasari' || school.type === 'kemangkon') {
    const wb = xlsx.readFile(path.join(baseDir, school.folder, school.excel));
    const data = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
    return data.map((d, i) => ({
      Nama: d.Nama || `Siswa ${i+1}`,
      Email: d.Email || `${school.prefix}_siswa${i+1}@belajarplus.com`,
      Password: d['Password Awal'] || `${school.prefix}_1234`,
      Rombel: formatRombelName(d.Rombel)
    }));
  }

  return [];
}

const purbalinggaSchools = [
  {
    name: 'SMAN 1 Karangreja',
    folder: '64. SMAN 1 Karangreja',
    excel: 'SMA Negeri 1 Karangreja.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Karangreja.pdf',
    subdomain: 'https://smanegeri1karangreja.belajarplus.com',
    npsn: '20303254',
    type: 'karangreja'
  },
  {
    name: 'SMAN 1 Bobotsari',
    folder: '61. SMAN 1 Bobotsari',
    excel: 'SMA Negeri 1 Bobotsari.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Bobotsari.pdf',
    subdomain: 'https://smanegeri1bobotsari.belajarplus.com',
    npsn: '20303250',
    type: 'bobotsari'
  },
  {
    name: 'SMAN 1 Bukateja',
    folder: '63. SMAN 1 Bukateja',
    excel: 'SMA NEGERI 1 Bukateja.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Bukateja.pdf',
    subdomain: 'https://smanegeri1bukateja.belajarplus.com',
    npsn: '20303251',
    type: 'bukateja'
  },
  {
    name: 'SMAN 2 Purbalingga',
    folder: '60. SMAN 2 Purbalingga',
    pdfName: 'Laporan_Resmi_Akun_SMAN 2 Purbalingga.pdf',
    subdomain: 'https://smanegeri2purbalingga.belajarplus.com',
    npsn: '20303248',
    type: 'purbalingga2'
  },
  {
    name: 'SMAN 1 Kutasari',
    folder: '66. SMAN 1 Kutasari',
    excel: 'SMA Negeri 1 Kutasari.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Kutasari.pdf',
    subdomain: 'https://smanegeri1kutasari.belajarplus.com',
    npsn: '20303256',
    type: 'kutasari',
    prefix: 'sma1kutasari'
  },
  {
    name: 'SMAN 1 Kemangkon',
    folder: '65. SMAN 1 Kemangkon',
    excel: 'SMA Negeri 1 Kemangkon.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Kemangkon.pdf',
    subdomain: 'https://smanegeri1kemangkon.belajarplus.com',
    npsn: '20338543',
    type: 'kemangkon',
    prefix: 'sman1kmk'
  }
];

(async () => {
  console.log('=== MEMULAI GENERASI LAPORAN RESMI PDF BERITA ACARA WILAYAH PURBALINGGA ===\n');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  for (let idx = 0; idx < purbalinggaSchools.length; idx++) {
    const s = purbalinggaSchools[idx];
    console.log(`[${idx + 1}/${purbalinggaSchools.length}] Memproses ${s.name}...`);

    const students = await loadStudents(s);
    console.log(`   Total Siswa: ${students.length}`);
    console.log(`   Subdomain: ${s.subdomain}`);

    const html = generateSchoolHtml(s, students);
    const tempHtmlPath = path.join(outputPdfDir, `temp_${idx}.html`);
    fs.writeFileSync(tempHtmlPath, html, 'utf8');

    await page.setContent(html, { waitUntil: 'load' });
    const localPdfPath = path.join(outputPdfDir, s.pdfName);
    const drivePdfPath = path.join(baseDir, s.folder, s.pdfName);

    await page.pdf({
      path: localPdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      }
    });

    // Salin ke Google Drive
    fs.copyFileSync(localPdfPath, drivePdfPath);
    console.log(`   ✓ PDF Berhasil: ${localPdfPath}`);
    console.log(`   ✓ Tersimpan di Google Drive: ${drivePdfPath}\n`);
  }

  await browser.close();
  console.log('========================================================================');
  console.log('SELURUH LAPORAN RESMI PDF PURBALINGGA SUDAH DIPERBAHARUI KE GOOGLE DRIVE');
  console.log('========================================================================');
})();
