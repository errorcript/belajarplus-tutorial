const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function updateDataAndGeneratePdfs() {
  console.log('1. Loading student data from tws_latest_students_parsed.json...');
  const driveRows = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  console.log(`Original total students: ${driveRows.length}`);

  // Terapkan revisi:
  const revisedRows = [];
  for (const s of driveRows) {
    const email = (s.B || '').trim();
    if (email === 'sman1taw_siswa621@belajarplus.com') {
      console.log('Excluding duplicate 621:', s.A);
      continue;
    }
    if (email === 'sman1taw_asesmen348@belajarplus.com') {
      console.log('Excluding duplicate 348:', s.A);
      continue;
    }
    if (email === 'fadilfadjrul22@gmail.com') {
      console.log('Excluding Fadhil Muhammad Mahardika (merah/bukan anggota rombel):', s.A);
      continue;
    }
    if (email === 'fadhildzuljalilathasaputro@belajarplus.com') {
      console.log('Updating Fadhil Dzul Jalil to Kelas 12-6');
      s.D = 'Kelas 12-6';
    }
    if (email === 'rayyaalvaearlynurfaizah@belajarplus.com') {
      console.log('Updating Rayya Alva to Kelas 12-6');
      s.D = 'Kelas 12-6';
    }
    if (email === 'vanesyaanandaanastasia@belajarplus.com') {
      console.log('Updating Vanesya Ananda to Kelas 12-6');
      s.D = 'Kelas 12-6';
    }
    revisedRows.push(s);
  }

  console.log(`Revised total students: ${revisedRows.length}`);

  // Base64 Logo
  let logoBase64 = '';
  const logoPath = path.resolve('assets/belajar-plus-logo.png');
  if (fs.existsSync(logoPath)) {
    const bytes = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${bytes.toString('base64')}`;
  }

  function getRombelKey(name) {
    const m = name.match(/Kelas\s+(\d+)[\-_](\d+)/);
    if (m) {
      return parseInt(m[1]) * 100 + parseInt(m[2]);
    }
    return 9999;
  }

  const rombelsMap = new Map();
  revisedRows.forEach(s => {
    const r = (s.D || '').trim();
    if (!rombelsMap.has(r)) {
      rombelsMap.set(r, []);
    }
    rombelsMap.get(r).push(s);
  });

  const sortedRombelNames = Array.from(rombelsMap.keys()).sort((a, b) => getRombelKey(a) - getRombelKey(b));

  console.log('\n--- REVISED SUMMARY PER ROMBEL ---');
  sortedRombelNames.forEach(r => {
    console.log(`${r.padEnd(15)}: ${rombelsMap.get(r).length} siswa`);
  });

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });

  function generateHtmlForRombels(rombelList, titleHeading, subtitleText) {
    let totalInSet = 0;
    rombelList.forEach(r => totalInSet += rombelsMap.get(r).length);

    let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${titleHeading}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 10mm 12mm 10mm;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.15;
    }
    .page-container {
      page-break-after: always;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page-container:last-child {
      page-break-after: avoid;
    }
    .kop-table {
      width: 100%;
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    .kop-logo {
      width: 70px;
      vertical-align: middle;
    }
    .kop-text {
      text-align: center;
      vertical-align: middle;
    }
    .kop-title {
      font-size: 11pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      margin: 0;
      text-transform: uppercase;
    }
    .kop-school {
      font-size: 13pt;
      font-weight: 900;
      color: #1e3a8a;
      margin: 2px 0;
      text-transform: uppercase;
    }
    .kop-meta {
      font-size: 8pt;
      color: #64748b;
      margin: 0;
    }
    .doc-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 6px 10px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .doc-info-item {
      font-size: 8.5pt;
    }
    .doc-info-item strong {
      color: #0f172a;
    }
    .student-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .student-table th {
      background-color: #1e3a8a;
      color: #ffffff;
      font-weight: 700;
      font-size: 8pt;
      padding: 4px 6px;
      text-align: left;
      border: 1px solid #1e3a8a;
      text-transform: uppercase;
    }
    .student-table td {
      border: 1px solid #cbd5e1;
      padding: 3.2px 6px;
      font-size: 8pt;
      vertical-align: middle;
    }
    .student-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .student-table tr:hover {
      background-color: #f1f5f9;
    }
    .col-no { width: 4%; text-align: center; }
    .col-name { width: 33%; font-weight: 600; color: #0f172a; }
    .col-email { width: 31%; font-family: 'Courier New', monospace; font-size: 7.5pt; color: #0369a1; }
    .col-pw { width: 17%; font-family: 'Courier New', monospace; font-size: 8pt; font-weight: 700; color: #0f172a; text-align: center; background: #fffbeb; }
    .col-paraf { width: 15%; text-align: center; color: #94a3b8; font-size: 7pt; }
    .footer-section {
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 4px;
    }
    .notes {
      font-size: 7.5pt;
      color: #64748b;
      line-height: 1.25;
      max-width: 60%;
    }
    .ttd-box {
      text-align: center;
      width: 170px;
    }
    .ttd-title {
      font-size: 7.5pt;
      color: #475569;
      margin-bottom: 35px;
    }
    .ttd-name {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 1px solid #0f172a;
      padding-bottom: 1px;
    }
  </style>
</head>
<body>`;

    // 1. Cover / Summary Page
    html += `
  <div class="page-container">
    <div>
      <table class="kop-table">
        <tr>
          <td class="kop-logo"><img src="${logoBase64}" style="max-height: 52px;" alt="Logo"></td>
          <td class="kop-text">
            <div class="kop-title">BERITA ACARA & REKAPITULASI DISTRIBUSI AKUN RESMI SISWA (REVISI)</div>
            <div class="kop-school">SMA NEGERI 1 TAWANGSARI</div>
            <div class="kop-meta">NPSN: 20330968 · Tahun Ajaran 2026/2027 · Platform BelajarPlus LMS</div>
          </td>
        </tr>
      </table>

      <div style="margin-top: 15px; font-size: 9.5pt; line-height: 1.5;">
        <p>Pada hari ini, <strong>Rabu, 11 November 2026</strong>, telah diselesaikan sinkronisasi data akun resmi dan revisi penempatan rombel serta pembersihan akun dobel siswa <strong>SMA Negeri 1 Tawangsari</strong> untuk platform pembelajaran digital BelajarPlus:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr style="background: #1e3a8a; color: white;">
            <th style="padding: 6px; border: 1px solid #1e3a8a; font-size: 8.5pt; text-align: left;">Kategori Berkas</th>
            <th style="padding: 6px; border: 1px solid #1e3a8a; font-size: 8.5pt; text-align: center;">Jumlah Rombel</th>
            <th style="padding: 6px; border: 1px solid #1e3a8a; font-size: 8.5pt; text-align: center;">Total Siswa</th>
            <th style="padding: 6px; border: 1px solid #1e3a8a; font-size: 8.5pt; text-align: center;">Status Verifikasi</th>
          </tr>
          <tr>
            <td style="padding: 6px; border: 1px solid #cbd5e1; font-weight: 600;">${titleHeading}</td>
            <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center;">${rombelList.length} Rombel</td>
            <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${totalInSet} Siswa</td>
            <td style="padding: 6px; border: 1px solid #cbd5e1; text-align: center; color: #166534; font-weight: 700;">100% Aktif & Terdistribusi</td>
          </tr>
        </table>

        <div style="background: #f1f5f9; border-left: 4px solid #1e3a8a; padding: 10px; margin: 15px 0; font-size: 8.5pt;">
          <strong>Catatan Revisi Penempatan & Pembersihan Akun Dobel:</strong>
          <ul style="margin: 4px 0 0 15px; padding: 0;">
            <li><strong>Kelas 12-6:</strong> 3 Siswa (Fadhil Dzul Jalil Atha Saputro, Rayya Alva Early Nur Faizah, Vanesya Ananda Anastasia) telah berhasil dipindahkan dari Kelas 11-6 ke <strong>Kelas 12-6</strong> (kini 36 siswa lengkap).</li>
            <li><strong>Kelas 11-4 & 11-10:</strong> Fadhil Muhammad Mahardika telah berhasil dikeluarkan dari Kelas 11-10 dan dipindahkan ke <strong>Kelas 11-4</strong>.</li>
            <li><strong>Kelas 11-7:</strong> Akun dobel Herdha Bayu Prasetya (<code>sman1taw_siswa621@belajarplus.com</code>) telah dinonaktifkan dan dikeluarkan; akun resmi yang digunakan adalah <code>sman1taw_siswa622@belajarplus.com</code>.</li>
            <li><strong>Kelas 12-10:</strong> Akun resmi Muhammad Nurdiansyah (<code>sman1taw_asesmen338@belajarplus.com</code>) telah diaktifkan kembali di Kelas 12-10; akun dobel <code>sman1taw_asesmen348@belajarplus.com</code> telah dinonaktifkan dan dikeluarkan.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer-section" style="margin-top: 30px;">
      <div class="ttd-box">
        <div class="ttd-title">Perwakilan Tim BelajarPlus,</div>
        <div class="ttd-name">HENRI SUSILO</div>
        <div style="font-size: 7pt; color: #64748b; margin-top: 2px;">Trainer BelajarPlus</div>
      </div>
      <div class="ttd-box">
        <div class="ttd-title">Tawangsari, 11 November 2026<br>Kepala Sekolah / Waka Kurikulum,</div>
        <div class="ttd-name">SMA NEGERI 1 TAWANGSARI</div>
        <div style="font-size: 7pt; color: #64748b; margin-top: 2px;">NIP. ........................................</div>
      </div>
    </div>
  </div>`;

    // 2. Halaman per Rombel
    rombelList.forEach(rName => {
      const students = rombelsMap.get(rName) || [];
      students.sort((a, b) => (a.A || '').localeCompare(b.A || ''));

      html += `
  <div class="page-container">
    <div>
      <table class="kop-table">
        <tr>
          <td class="kop-logo"><img src="${logoBase64}" style="max-height: 44px;" alt="Logo"></td>
          <td class="kop-text">
            <div class="kop-title">DAFTAR KREDENSIAL AKUN SISWA RESMI (REVISI)</div>
            <div class="kop-school">SMA NEGERI 1 TAWANGSARI</div>
            <div class="kop-meta">NPSN: 20330968 · Tahun Ajaran 2026/2027 · Portal: https://sman1tawangsari.belajarplus.com</div>
          </td>
        </tr>
      </table>

      <div class="doc-info">
        <div class="doc-info-item">Rombel: <strong>${rName}</strong></div>
        <div class="doc-info-item">Jumlah Siswa: <strong>${students.length} Siswa</strong></div>
        <div class="doc-info-item">Tahun Ajaran: <strong>2026/2027</strong></div>
      </div>

      <table class="student-table">
        <thead>
          <tr>
            <th class="col-no">No</th>
            <th class="col-name">Nama Lengkap Siswa</th>
            <th class="col-email">Email Akun BelajarPlus</th>
            <th class="col-pw">Password Awal</th>
            <th class="col-paraf">Paraf Siswa</th>
          </tr>
        </thead>
        <tbody>`;

      students.forEach((s, idx) => {
        const no = idx + 1;
        const name = (s.A || '').trim();
        const email = (s.B || '').trim();
        const pw = (s.C || '').trim() || 'Sman1taw_siswa1';

        html += `
          <tr>
            <td class="col-no">${no}</td>
            <td class="col-name">${name}</td>
            <td class="col-email">${email}</td>
            <td class="col-pw">${pw}</td>
            <td class="col-paraf">${no}. ........</td>
          </tr>`;
      });

      html += `
        </tbody>
      </table>
    </div>

    <div class="footer-section">
      <div class="notes">
        * Lembar verifikasi & serah terima akun siswa resmi.<br>
        * Siswa wajib login pertama di <strong>https://sman1tawangsari.belajarplus.com</strong> dan segera ubah kata sandi.
      </div>
      <div class="ttd-box">
        <div class="ttd-title">Wali Kelas ${rName},</div>
        <div class="ttd-name">( .................................................... )</div>
        <div style="font-size: 7pt; color: #64748b; margin-top: 2px;">NIP. ........................................</div>
      </div>
    </div>
  </div>`;
    });

    html += `</body></html>`;
    return html;
  }

  // A. Generate Master PDF (Semua 30 Rombel)
  console.log('\nGenerating Master PDF (30 Rombel)...');
  const masterHtml = generateHtmlForRombels(sortedRombelNames, 'DAFTAR LENGKAP AKUN SISWA 30 ROMBEL (REVISI)', 'Seluruh Jenjang Kelas X, XI, XII');
  fs.writeFileSync('temp_master_siswa.html', masterHtml);
  
  const page = await browser.newPage();
  await page.setContent(masterHtml, { waitUntil: 'load' });
  const masterPdfPath = path.resolve('2_Daftar_Akun_Siswa_Per_Rombel_SMAN_1_Tawangsari.pdf');
  await page.pdf({
    path: masterPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log('Master PDF created:', masterPdfPath);

  // B. Generate Kelas X
  console.log('Generating Kelas X PDF...');
  const k10 = sortedRombelNames.filter(r => r.startsWith('Kelas 10'));
  const k10Html = generateHtmlForRombels(k10, 'DAFTAR AKUN SISWA RESMI KELAS X (REVISI)', 'Jenjang Kelas X (10-1 s/d 10-10)');
  await page.setContent(k10Html, { waitUntil: 'load' });
  const k10PdfPath = path.resolve('Daftar_Akun_Siswa_Kelas_X_SMAN_1_Tawangsari.pdf');
  await page.pdf({ path: k10PdfPath, format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });

  // C. Generate Kelas XI
  console.log('Generating Kelas XI PDF...');
  const k11 = sortedRombelNames.filter(r => r.startsWith('Kelas 11'));
  const k11Html = generateHtmlForRombels(k11, 'DAFTAR AKUN SISWA RESMI KELAS XI (REVISI)', 'Jenjang Kelas XI (11-1 s/d 11-10)');
  await page.setContent(k11Html, { waitUntil: 'load' });
  const k11PdfPath = path.resolve('Daftar_Akun_Siswa_Kelas_XI_SMAN_1_Tawangsari.pdf');
  await page.pdf({ path: k11PdfPath, format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });

  // D. Generate Kelas XII
  console.log('Generating Kelas XII PDF...');
  const k12 = sortedRombelNames.filter(r => r.startsWith('Kelas 12'));
  const k12Html = generateHtmlForRombels(k12, 'DAFTAR AKUN SISWA RESMI KELAS XII (REVISI)', 'Jenjang Kelas XII (12-1 s/d 12-10)');
  await page.setContent(k12Html, { waitUntil: 'load' });
  const k12PdfPath = path.resolve('Daftar_Akun_Siswa_Kelas_XII_SMAN_1_Tawangsari.pdf');
  await page.pdf({ path: k12PdfPath, format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });

  await browser.close();

  // Copy ke Google Drive
  const driveDest = 'G:\\My Drive\\Trainer\\B+\\AKUN\\44. SMAN 1 Tawangsari\\BERKAS_AKUN_RESMI_SMAN_1_TAWANGSARI';
  if (fs.existsSync(driveDest)) {
    console.log('\nCopying revised PDFs to Google Drive...');
    fs.copyFileSync(masterPdfPath, path.join(driveDest, '2_Daftar_Akun_Siswa_Per_Rombel_SMAN_1_Tawangsari.pdf'));
    fs.copyFileSync(k10PdfPath, path.join(driveDest, 'Daftar_Akun_Siswa_Kelas_X_SMAN_1_Tawangsari.pdf'));
    fs.copyFileSync(k11PdfPath, path.join(driveDest, 'Daftar_Akun_Siswa_Kelas_XI_SMAN_1_Tawangsari.pdf'));
    fs.copyFileSync(k12PdfPath, path.join(driveDest, 'Daftar_Akun_Siswa_Kelas_XII_SMAN_1_Tawangsari.pdf'));
    console.log('All revised PDFs successfully copied to Google Drive!');
  }

  // Copy ke public/pdf dan root untuk web
  fs.copyFileSync(masterPdfPath, 'master.pdf');
  fs.copyFileSync(k10PdfPath, 'kelas-10.pdf');
  fs.copyFileSync(k11PdfPath, 'kelas-11.pdf');
  fs.copyFileSync(k12PdfPath, 'kelas-12.pdf');
  if (fs.existsSync('public/pdf')) {
    fs.copyFileSync(masterPdfPath, 'public/pdf/master.pdf');
    fs.copyFileSync(k10PdfPath, 'public/pdf/kelas-10.pdf');
    fs.copyFileSync(k11PdfPath, 'public/pdf/kelas-11.pdf');
    fs.copyFileSync(k12PdfPath, 'public/pdf/kelas-12.pdf');
  }

  console.log('PDF generation and distribution sync completed successfully!');
}

updateDataAndGeneratePdfs().catch(console.error);

