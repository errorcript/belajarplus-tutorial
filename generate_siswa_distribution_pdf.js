const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generateSiswaPdfs() {
  console.log('1. Loading student data from tws_latest_students_parsed.json...');
  const driveRows = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  console.log(`Total drive students: ${driveRows.length}`);

  // Base64 Logo
  let logoBase64 = '';
  const logoPath = path.resolve('assets/belajar-plus-logo.png');
  if (fs.existsSync(logoPath)) {
    const bytes = fs.readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${bytes.toString('base64')}`;
  }

  // Sort function for Rombel
  function getRombelKey(name) {
    const m = name.match(/Kelas\s+(\d+)[\-_](\d+)/);
    if (m) {
      return parseInt(m[1]) * 100 + parseInt(m[2]);
    }
    return 9999;
  }

  // Group by Rombel
  const rombelsMap = new Map();
  driveRows.forEach(s => {
    const r = (s.D || '').trim();
    if (!rombelsMap.has(r)) {
      rombelsMap.set(r, []);
    }
    rombelsMap.get(r).push({
      nama: s.A,
      email: s.B,
      pass: s.C,
      rombel: s.D
    });
  });

  const sortedRombelNames = Array.from(rombelsMap.keys()).sort((a, b) => getRombelKey(a) - getRombelKey(b));
  console.log(`Grouped into ${sortedRombelNames.length} rombels:`, sortedRombelNames.join(', '));

  function buildHtml(titleScope, rombelListFilter = null) {
    const activeRombels = rombelListFilter 
      ? sortedRombelNames.filter(r => rombelListFilter.includes(r))
      : sortedRombelNames;

    let totalStudents = 0;
    activeRombels.forEach(r => totalStudents += rombelsMap.get(r).length);

    // Summary Table (2 columns on landscape/grid or clean rows)
    let summaryRowsHtml = '';
    let idx = 1;
    activeRombels.forEach(r => {
      const list = rombelsMap.get(r);
      const bg = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      const tingkat = r.startsWith('Kelas 10') ? 'Fase E (Kelas 10)' : (r.startsWith('Kelas 11') ? 'Fase F (Kelas 11)' : 'Fase F (Kelas 12)');
      summaryRowsHtml += `
        <tr style="background: ${bg};">
          <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">${idx}</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: 700; text-align: center; font-size: 10px; color: #1e3a8a;">${r}</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">${tingkat}</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; font-weight: 700;">${list.length} Siswa</td>
          <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 800; font-size: 9.5px;">TERVERIFIKASI AKTIF</td>
        </tr>
      `;
      idx++;
    });

    // Class Sheets (1 per rombel)
    let classSheetsHtml = '';
    activeRombels.forEach(r => {
      const students = rombelsMap.get(r);
      let studentRows = '';
      students.forEach((s, sIdx) => {
        const sBg = (sIdx + 1) % 2 === 0 ? '#f8fafc' : '#ffffff';
        studentRows += `
          <tr style="background: ${sBg};">
            <td style="padding: 3.2px 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px;">${sIdx + 1}</td>
            <td style="padding: 3.2px 6px; border: 1px solid #cbd5e1; font-size: 9.5px; font-weight: 600; color: #0f172a;">${s.nama}</td>
            <td style="padding: 3.2px 6px; border: 1px solid #cbd5e1; font-size: 9.5px; font-family: 'Consolas', monospace; color: #1e40af;">${s.email}</td>
            <td style="padding: 3.2px 5px; border: 1px solid #cbd5e1; font-size: 9.5px; font-family: 'Consolas', monospace; font-weight: 700; color: #b45309; text-align: center;">${s.pass}</td>
            <td style="padding: 3.2px 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px; color: #15803d; font-weight: 700;">AKTIF</td>
            <td style="padding: 3.2px 4px; border: 1px solid #cbd5e1; text-align: center; font-size: 8.5px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
          </tr>
        `;
      });

      classSheetsHtml += `
        <div class="page-break"></div>
        <div class="sheet-container">
          <div class="header-container">
            <div class="logo-box">
              ${logoBase64 ? `<img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" />` : '<h2 style="color:#1e3a8a;margin:0;">BELAJARPLUS</h2>'}
            </div>
            <div class="doc-meta">
              <div><strong>Satuan Pendidikan:</strong> SMA NEGERI 1 TAWANGSARI</div>
              <div><strong>NPSN:</strong> 20330968 &nbsp;|&nbsp; <strong>Tahun Ajaran:</strong> 2026/2027</div>
              <div><strong>Rombongan Belajar:</strong> <span class="badge-rombel">${r}</span> &nbsp;|&nbsp; <strong>Total:</strong> ${students.length} Siswa</div>
            </div>
          </div>

          <div class="class-title-banner">
            <h2>DAFTAR KREDENSIAL LOGIN PESERTA DIDIK &mdash; ${r}</h2>
            <p>Lembar resmi distribusi akun untuk diserahkan oleh Wali Kelas kepada masing-masing siswa bersangkutan</p>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">No</th>
                <th style="width: 32%;">Nama Lengkap Peserta Didik</th>
                <th style="width: 30%;">Email Login Resmi</th>
                <th style="width: 16%; text-align: center;">Password Awal</th>
                <th style="width: 8%; text-align: center;">Status</th>
                <th style="width: 10%; text-align: center;">Paraf Siswa</th>
              </tr>
            </thead>
            <tbody>
              ${studentRows}
            </tbody>
          </table>

          <div class="class-footer">
            <div>Portal Login LMS: <a href="https://sman1tawangsari.belajarplus.com" style="color: #2563eb; font-weight: bold; text-decoration: underline;">https://sman1tawangsari.belajarplus.com</a></div>
            <div style="font-weight: 600; color: #1e3a8a;">Wali Kelas ${r}: _____________________________</div>
          </div>
        </div>
      `;
    });

    return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Kredensial Akun Siswa - SMAN 1 Tawangsari - ${titleScope}</title>
<style>
  @page {
    size: A4 portrait;
    margin: 8mm 10mm 10mm 10mm;
  }
  * { box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Arial, -apple-system, sans-serif;
    margin: 0; padding: 0;
    color: #1e293b;
    line-height: 1.35;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-break {
    page-break-before: always;
    break-before: page;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2.5px solid #1e3a8a;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .official-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }
  .doc-meta {
    text-align: right;
    font-size: 10px;
    color: #475569;
    line-height: 1.4;
  }
  .doc-meta strong { color: #0f172a; }
  .badge-rombel {
    background: #1e3a8a;
    color: #fff;
    padding: 1.5px 6px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 10px;
    display: inline-block;
  }
  .title-banner {
    text-align: center;
    margin-bottom: 12px;
  }
  .title-banner h1 {
    margin: 0 0 3px 0;
    font-size: 14.5px;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .title-banner .doc-num {
    font-size: 10px;
    color: #64748b;
    margin: 0;
  }
  .portal-box {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 6px;
    padding: 6px 10px;
    margin-bottom: 10px;
    text-align: center;
  }
  .portal-box .title {
    font-weight: bold;
    color: #15803d;
    font-size: 10.5px;
    margin-bottom: 1px;
    text-transform: uppercase;
  }
  .portal-box .link {
    font-size: 13px;
    font-weight: bold;
    color: #1d4ed8;
    text-decoration: underline;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 10px;
  }
  .summary-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px;
    text-align: center;
  }
  .summary-card .label {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
  }
  .summary-card .value {
    font-size: 12px;
    font-weight: bold;
    color: #0f172a;
    margin-top: 1px;
  }
  .ba-section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 9.5px;
    line-height: 1.45;
    margin-bottom: 10px;
  }
  .ba-section p { margin: 0 0 4px 0; }
  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
    padding: 0 25px;
  }
  .sign-box {
    text-align: center;
    width: 220px;
    font-size: 10px;
  }
  .sign-space { height: 42px; }
  .sign-name {
    font-weight: bold;
    border-bottom: 1px solid #0f172a;
    display: inline-block;
    min-width: 170px;
    padding-bottom: 1px;
  }
  .class-title-banner {
    background: #eff6ff;
    border-left: 4px solid #1e3a8a;
    padding: 5px 8px;
    margin-bottom: 8px;
  }
  .class-title-banner h2 {
    margin: 0;
    font-size: 11.5px;
    color: #1e3a8a;
  }
  .class-title-banner p {
    margin: 1px 0 0 0;
    font-size: 9px;
    color: #64748b;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  th {
    background: #1e3a8a;
    color: #ffffff;
    padding: 4px 5px;
    font-size: 9.5px;
    font-weight: 600;
    text-align: left;
    border: 1px solid #1e3a8a;
  }
  td {
    padding: 3.2px 5px;
    font-size: 9.5px;
    border: 1px solid #cbd5e1;
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    padding-top: 5px;
    border-top: 1px dashed #cbd5e1;
    font-size: 9px;
  }
</style>
</head>
<body>

  <!-- COVER / REKAPITULASI -->
  <div class="sheet-container">
    <div class="header-container">
      <div class="logo-box">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" />` : '<h2 style="color:#1e3a8a;margin:0;">BELAJARPLUS</h2>'}
      </div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> SMA NEGERI 1 TAWANGSARI</div>
        <div><strong>NPSN:</strong> 20330968 &nbsp;|&nbsp; <strong>Kab/Kota:</strong> Kab. Sukoharjo</div>
        <div><strong>Tahun Ajaran:</strong> 2026/2027 &nbsp;|&nbsp; <strong>Lingkup:</strong> ${titleScope}</div>
      </div>
    </div>

    <div class="title-banner">
      <h1>BERITA ACARA SERAH TERIMA & DISTRIBUSI KREDENSIAL AKUN SISWA</h1>
      <p class="doc-num">No. Dokumen: BP-BA/SMAN1TAW/SISWA/${titleScope.toUpperCase().replace(/\s+/g, '_')}/2026</p>
    </div>

    <div class="portal-box">
      <div class="title">Portal Akses Resmi Learning Management System (LMS) BelajarPlus</div>
      <div class="link">https://sman1tawangsari.belajarplus.com</div>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="label">Total Siswa</div>
        <div class="value">${totalStudents} Siswa</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Rombel</div>
        <div class="value">${activeRombels.length} Rombel</div>
      </div>
      <div class="summary-card">
        <div class="label">Status Akun</div>
        <div class="value" style="color: #16a34a;">100% Aktif</div>
      </div>
      <div class="summary-card">
        <div class="label">Status Rombel</div>
        <div class="value" style="color: #1e3a8a;">Tersinkron</div>
      </div>
    </div>

    <div class="ba-section">
      <p>Pada hari ini, <strong>Rabu, 11 November 2026</strong>, telah diselesaikan sinkronisasi dan penerbitan kredensial akun peserta didik SMA Negeri 1 Tawangsari pada platform LMS BelajarPlus. Seluruh akun peserta didik telah terdaftar resmi pada database tahun ajaran 2026/2027 dan terhubung ke rombongan belajar masing-masing.</p>
      <p>Kredensial login ini bersifat rahasia dan diserahkan kepada pihak sekolah untuk selanjutnya didistribusikan oleh masing-masing Wali Kelas kepada peserta didik yang bersangkutan.</p>
    </div>

    <table style="margin-bottom: 12px;">
      <thead>
        <tr>
          <th style="width: 6%; text-align: center;">No</th>
          <th style="width: 25%; text-align: center;">Rombongan Belajar</th>
          <th style="width: 30%; text-align: center;">Jenjang / Fase</th>
          <th style="width: 17%; text-align: center;">Jumlah Siswa</th>
          <th style="width: 22%; text-align: center;">Status Kredensial</th>
        </tr>
      </thead>
      <tbody>
        ${summaryRowsHtml}
      </tbody>
    </table>

    <div class="signatures">
      <div class="sign-box">
        <div>Diserahkan oleh:</div>
        <div><strong>Tim Implementasi BelajarPlus</strong></div>
        <div class="sign-space"></div>
        <div class="sign-name">Henri Susilo</div>
        <div style="font-size: 9px; color: #64748b; margin-top: 1px;">Trainer Pendamping BelajarPlus</div>
      </div>
      <div class="sign-box">
        <div>Diterima oleh:</div>
        <div><strong>SMA Negeri 1 Tawangsari</strong></div>
        <div class="sign-space"></div>
        <div class="sign-name">Kepala Sekolah / Waka Kurikulum</div>
        <div style="font-size: 9px; color: #64748b; margin-top: 1px;">NIP. ____________________________</div>
      </div>
    </div>
  </div>

  <!-- LEMBAR PER ROMBEL -->
  ${classSheetsHtml}

</body>
</html>`;
  }

  // 2. Launch Browser with Playwright
  console.log('\n2. Launching browser to generate PDFs...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  const targetDriveDir = 'G:\\My Drive\\Trainer\\B+\\AKUN\\44. SMAN 1 Tawangsari\\BERKAS_AKUN_RESMI_SMAN_1_TAWANGSARI';

  // A. MASTER PDF (All 30 Rombel, 1.063 Siswa)
  console.log('\n--- Generating Master Siswa PDF (1.063 Siswa, 30 Rombel) ---');
  const masterHtml = buildHtml('Master Seluruh Rombel');
  fs.writeFileSync('temp_master_siswa.html', masterHtml);
  await page.setContent(masterHtml, { waitUntil: 'networkidle' });
  
  const masterPdfLocal = '2_Daftar_Akun_Siswa_Per_Rombel_SMAN_1_Tawangsari.pdf';
  await page.pdf({
    path: masterPdfLocal,
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`[OK] Master PDF saved: ${masterPdfLocal} (${fs.statSync(masterPdfLocal).size} bytes)`);

  if (fs.existsSync(targetDriveDir)) {
    const driveMasterPdf = path.join(targetDriveDir, masterPdfLocal);
    fs.copyFileSync(masterPdfLocal, driveMasterPdf);
    console.log(`[OK] Copied to Drive: ${driveMasterPdf}`);
  }

  // B. KELAS X PDF (10-1 s/d 10-10, 358 Siswa)
  console.log('\n--- Generating Kelas X Siswa PDF (358 Siswa, 10 Rombel) ---');
  const k10Rombels = sortedRombelNames.filter(r => r.startsWith('Kelas 10'));
  const xHtml = buildHtml('Kelas X (Fase E)', k10Rombels);
  await page.setContent(xHtml, { waitUntil: 'networkidle' });
  const xPdfLocal = 'Daftar_Akun_Siswa_Kelas_X_SMAN_1_Tawangsari.pdf';
  await page.pdf({
    path: xPdfLocal,
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`[OK] Kelas X PDF saved: ${xPdfLocal} (${fs.statSync(xPdfLocal).size} bytes)`);
  if (fs.existsSync(targetDriveDir)) {
    fs.copyFileSync(xPdfLocal, path.join(targetDriveDir, xPdfLocal));
  }

  // C. KELAS XI PDF (11-1 s/d 11-10, 353 Siswa - TERMASUK KELAS 11-1 LENGKAP!)
  console.log('\n--- Generating Kelas XI Siswa PDF (353 Siswa, 10 Rombel) ---');
  const k11Rombels = sortedRombelNames.filter(r => r.startsWith('Kelas 11'));
  const xiHtml = buildHtml('Kelas XI (Fase F)', k11Rombels);
  await page.setContent(xiHtml, { waitUntil: 'networkidle' });
  const xiPdfLocal = 'Daftar_Akun_Siswa_Kelas_XI_SMAN_1_Tawangsari.pdf';
  await page.pdf({
    path: xiPdfLocal,
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`[OK] Kelas XI PDF saved: ${xiPdfLocal} (${fs.statSync(xiPdfLocal).size} bytes)`);
  if (fs.existsSync(targetDriveDir)) {
    fs.copyFileSync(xiPdfLocal, path.join(targetDriveDir, xiPdfLocal));
  }

  // D. KELAS XII PDF (12-1 s/d 12-10, 352 Siswa)
  console.log('\n--- Generating Kelas XII Siswa PDF (352 Siswa, 10 Rombel) ---');
  const k12Rombels = sortedRombelNames.filter(r => r.startsWith('Kelas 12'));
  const xiiHtml = buildHtml('Kelas XII (Fase F)', k12Rombels);
  await page.setContent(xiiHtml, { waitUntil: 'networkidle' });
  const xiiPdfLocal = 'Daftar_Akun_Siswa_Kelas_XII_SMAN_1_Tawangsari.pdf';
  await page.pdf({
    path: xiiPdfLocal,
    format: 'A4',
    printBackground: true,
    margin: { top: '8mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  console.log(`[OK] Kelas XII PDF saved: ${xiiPdfLocal} (${fs.statSync(xiiPdfLocal).size} bytes)`);
  if (fs.existsSync(targetDriveDir)) {
    fs.copyFileSync(xiiPdfLocal, path.join(targetDriveDir, xiiPdfLocal));
  }

  await browser.close();
  console.log('\n=== ALL SISWA DISTRIBUTION PDFS GENERATED SUCCESSFULLY! ===');
}

generateSiswaPdfs().catch(console.error);
