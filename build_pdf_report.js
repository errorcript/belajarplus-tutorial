const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePdf() {
  const students = JSON.parse(fs.readFileSync('manual_43_students_enriched.json', 'utf8'));

  // Load logo
  const logoBytes = fs.readFileSync('assets/belajar-plus-logo.png');
  const logoBase64 = `data:image/png;base64,${logoBytes.toString('base64')}`;

  // Group by rombel
  const byRombel = {
    'PSAS_XI FA 2': {
      title: 'Rombel: PSAS_XI FA 2 (Kelas 11)',
      wali: 'Anisca Dyah Permata Sari',
      students: []
    },
    'PSAS_XI FA 1': {
      title: 'Rombel: PSAS_XI FA 1 (Kelas 11)',
      wali: 'Winda Pramalia Novianti',
      students: []
    },
    'PSAS_XI FE': {
      title: 'Rombel: PSAS_XI FE (Kelas 11)',
      wali: 'Esti Dwi Prihatiningsih',
      students: []
    }
  };

  students.forEach(s => {
    if (byRombel[s.rombel]) {
      byRombel[s.rombel].students.push(s);
    } else {
      byRombel[s.rombel] = { title: `Rombel: ${s.rombel}`, wali: '-', students: [s] };
    }
  });

  // Build tables HTML
  let sectionsHtml = '';
  for (const [rKey, rData] of Object.entries(byRombel)) {
    if (rData.students.length === 0) continue;

    let rowsHtml = '';
    rData.students.forEach((s, idx) => {
      const isEven = idx % 2 === 0;
      rowsHtml += `
        <tr style="background-color: ${isEven ? '#ffffff' : '#f8fafc'};">
          <td style="text-align: center; font-weight: 600; padding: 6px 8px; border: 1px solid #e2e8f0;">${idx + 1}</td>
          <td style="padding: 6px 8px; font-weight: 600; color: #0f172a; border: 1px solid #e2e8f0;">${s.full_name}</td>
          <td style="padding: 6px 8px; font-family: 'Consolas', monospace; color: #1e40af; border: 1px solid #e2e8f0;">${s.email}</td>
          <td style="padding: 6px 8px; font-family: 'Consolas', monospace; font-weight: 700; color: #047857; border: 1px solid #e2e8f0; background: #ecfdf5;">${s.new_password}</td>
          <td style="text-align: center; padding: 6px 8px; border: 1px solid #e2e8f0;">
            <span style="background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">Aktif</span>
          </td>
        </tr>
      `;
    });

    sectionsHtml += `
      <div style="margin-top: 20px; page-break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f1f5f9; padding: 8px 12px; border-left: 4px solid #2563eb; border-radius: 4px; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 13px; color: #1e293b; font-weight: 700;">${rData.title}</h3>
          <span style="font-size: 11px; color: #475569; font-weight: 600;">Wali Kelas: <b>${rData.wali}</b> | Total: <b>${rData.students.length} Siswa</b></span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 12px;">
          <thead>
            <tr style="background-color: #1e40af; color: #ffffff;">
              <th style="width: 5%; padding: 7px; border: 1px solid #1e40af; text-align: center;">No</th>
              <th style="width: 35%; padding: 7px; border: 1px solid #1e40af; text-align: left;">Nama Lengkap Siswa</th>
              <th style="width: 35%; padding: 7px; border: 1px solid #1e40af; text-align: left;">Email Login Akun</th>
              <th style="width: 15%; padding: 7px; border: 1px solid #1e40af; text-align: left;">Password Baru</th>
              <th style="width: 10%; padding: 7px; border: 1px solid #1e40af; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  const fullHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Rekap Akun Siswa (Reset Password) - SMA NEGERI 1 BANDONGAN</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 12mm 14mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      font-size: 11.5px;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2.5px double #2563eb;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }
    .logo-box {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .official-logo {
      height: 48px;
      width: auto;
      object-fit: contain;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.3px;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 500;
    }
    .doc-meta {
      text-align: right;
      font-size: 10px;
      color: #64748b;
    }
    .doc-badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #bfdbfe;
      margin-bottom: 3px;
      font-size: 10px;
    }
    .title-banner {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .report-title {
      margin: 0;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }
    .report-sub {
      margin: 3px 0 0 0;
      font-size: 11px;
      opacity: 0.95;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 14px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
    }
    .kpi-val {
      font-size: 16px;
      font-weight: 800;
      color: #1e40af;
      margin-bottom: 2px;
    }
    .kpi-lbl {
      font-size: 9.5px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }
    .note-box {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 10.5px;
      color: #92400e;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      padding-top: 15px;
      page-break-inside: avoid;
    }
    .signature-box {
      width: 42%;
      text-align: center;
      font-size: 10.5px;
    }
    .signature-space {
      height: 50px;
    }
    .signature-name {
      font-weight: 700;
      text-decoration: underline;
      color: #0f172a;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header-container">
    <div class="logo-box">
      <img src="${logoBase64}" alt="BelajarPlus Logo" class="official-logo" />
      <div>
        <div class="brand-title">BelajarPlus</div>
        <div class="brand-subtitle">Platform Digital Pendidikan & Smart School Solution</div>
      </div>
    </div>
    <div class="doc-meta">
      <span class="doc-badge">DOKUMEN RESMI REKAP AKUN</span>
      <div>No: B+/REKAP/BDN/XI-2026/043</div>
      <div>Tanggal: 5 November 2026</div>
    </div>
  </div>

  <!-- Banner -->
  <div class="title-banner">
    <h1 class="report-title">LAPORAN REKAP AKUN SISWA & RESET PASSWORD</h1>
    <p class="report-sub">Sekolah: <b>SMA NEGERI 1 BANDONGAN</b> | Tahun Ajaran 2026/2027</p>
  </div>

  <!-- KPI Grid -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-val">43</div>
      <div class="kpi-lbl">Total Siswa Rekap</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">36</div>
      <div class="kpi-lbl">Rombel XI FA 2</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-val">7</div>
      <div class="kpi-lbl">Rombel XI FA 1 & FE</div>
    </div>
    <div class="kpi-card" style="background: #ecfdf5; border-color: #a7f3d0;">
      <div class="kpi-val" style="color: #047857; font-size: 13px; font-family: monospace;">Bandongan2026!</div>
      <div class="kpi-lbl" style="color: #065f46;">Password Standar</div>
    </div>
  </div>

  <!-- Note -->
  <div class="note-box">
    <b>PENTING:</b> Dokumen ini memuat data akun siswa yang didaftarkan secara mandiri oleh pihak sekolah pada tanggal 21 Oktober 2026 (termasuk rombel PSAS_XI FA 2 wali Bu Anisca Dyah Permata Sari). Password awal telah diseragamkan menjadi <code>Bandongan2026!</code> agar siswa dapat segera login dan mengikuti KBM/PSAS di platform BelajarPlus tanpa kendala lupa password.
  </div>

  <!-- Tables per Rombel -->
  ${sectionsHtml}

  <!-- Panduan Login -->
  <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 14px; margin-top: 15px; font-size: 10.5px; page-break-inside: avoid;">
    <h4 style="margin: 0 0 4px 0; color: #1e3a8a; font-size: 11px;">Panduan Login untuk Siswa:</h4>
    <ol style="margin: 0; padding-left: 18px; color: #334155;">
      <li>Buka peramban web dan akses: <b>https://belajarplus.com</b></li>
      <li>Masukkan <b>Email Akun</b> yang tertera pada tabel di atas.</li>
      <li>Masukkan kata sandi: <b style="color: #047857; font-family: monospace;">Bandongan2026!</b></li>
      <li>Setelah berhasil masuk, siswa dapat mengakses tugas, materi e-learning, dan ujian/PSAS sesuai rombel masing-masing.</li>
    </ol>
  </div>

  <!-- Signatures -->
  <div class="signature-section">
    <div class="signature-box">
      <div>Mengetahui,</div>
      <div>Wali Kelas XI FA 2 / Admin Sekolah</div>
      <div class="signature-space"></div>
      <div class="signature-name">Anisca Dyah Permata Sari</div>
      <div>NIP. -</div>
    </div>
    <div class="signature-box">
      <div>Magelang, 5 November 2026</div>
      <div>Trainer Resmi BelajarPlus</div>
      <div class="signature-space"></div>
      <div class="signature-name">Henri Susilo</div>
      <div>Tim Implementasi BelajarPlus</div>
    </div>
  </div>

</body>
</html>
  `;

  const htmlPath = 'Laporan_Resmi_Akun_Manual_SMAN_1_Bandongan.html';
  fs.writeFileSync(htmlPath, fullHtml);
  console.log('Saved HTML report:', htmlPath);

  // Render to PDF using Playwright
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const localPdfPath = 'Laporan_Resmi_Akun_Manual_SMAN_1_Bandongan.pdf';
  await page.pdf({
    path: localPdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '12mm', right: '12mm' }
  });
  console.log('Generated local PDF:', localPdfPath);

  const drivePdfPath = 'G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/Laporan_Resmi_Akun_Manual_SMAN_1_Bandongan.pdf';
  try {
    fs.copyFileSync(localPdfPath, drivePdfPath);
    console.log('Copied PDF to Google Drive:', drivePdfPath);
  } catch (e) {
    console.error('Failed copying to Drive:', e.message);
  }

  await browser.close();
}

generatePdf().catch(console.error);

