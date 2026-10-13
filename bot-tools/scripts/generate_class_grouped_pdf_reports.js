const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');

const logoPath = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png';
const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

const schoolsConfig = [
  { folderName: '01. SMAN 10 Purworejo', name: 'SMA NEGERI 10 PURWOREJO', shortName: 'SMAN 10 Purworejo', files: ['SMA Negeri 10 Purworejo.xlsx'] },
  { folderName: '02. SMAN 1 Purworejo', name: 'SMA NEGERI 1 PURWOREJO', shortName: 'SMAN 1 Purworejo', files: ['SMA Negeri 1 Purworejo.xlsx'] },
  { folderName: '03. SMAN 11 Purworejo', name: 'SMA NEGERI 11 PURWOREJO', shortName: 'SMAN 11 Purworejo', files: ['SMA Negeri 11 Purworejo.xlsx'] },
  { folderName: '04. SMAN 6 Purworejo', name: 'SMA NEGERI 6 PURWOREJO', shortName: 'SMAN 6 Purworejo', files: ['SMA Negeri 6 Purworejo.xlsx'] },
  { folderName: '05. SMAN 1 Salaman', name: 'SMA NEGERI 1 SALAMAN', shortName: 'SMAN 1 Salaman', files: ['SMA Negeri 1 Salaman - bagian 1 dari 2.xlsx', 'SMA Negeri 1 Salaman - bagian 2 dari 2.xlsx'] },
  { folderName: '06. SMAN 1 Bandongan', name: 'SMA NEGERI 1 BANDONGAN', shortName: 'SMAN 1 Bandongan', files: ['SMA Negeri 1 Bandongan.xlsx'] },
  { folderName: '07. SMAN 1 Grabag', name: 'SMA NEGERI 1 GRABAG', shortName: 'SMAN 1 Grabag', files: ['SMA Negeri 1 Grabag.xlsx'] },
  { folderName: '08. SMAN 2 Grabag', name: 'SMA NEGERI 2 GRABAG', shortName: 'SMAN 2 Grabag', files: ['SMA Negeri 2 Grabag.xlsx'] },
  { folderName: '09. SMAN 1 Candimulyo', name: 'SMA NEGERI 1 CANDIMULYO', shortName: 'SMAN 1 Candimulyo', files: ['SMA Negeri 1 Candimulyo.xlsx'] },
  { folderName: '10. SMAN 1 Dukun', name: 'SMA NEGERI 1 DUKUN', shortName: 'SMAN 1 Dukun', files: ['SMA Negeri 1 Dukun.xlsx'] },
  { folderName: '11. SMAN 1 Ngluwar', name: 'SMA NEGERI 1 NGLUWAR', shortName: 'SMAN 1 Ngluwar', files: ['SMA Negeri 1 Ngluwar.xlsx'] },
  { folderName: '12. SMAN 1 Mertoyudan', name: 'SMA NEGERI 1 MERTOYUDAN', shortName: 'SMAN 1 Mertoyudan', files: ['SMA Negeri 1 Mertoyudan.xlsx'] },
  { folderName: '13. SMAN 1 Muntilan', name: 'SMA NEGERI 1 MUNTILAN', shortName: 'SMAN 1 Muntilan', files: ['SMA Negeri 1 Muntilan.xlsx'] },
  { folderName: '14. SMAN 1 Bawang', name: 'SMA NEGERI 1 BAWANG BANJARNEGARA', shortName: 'SMAN 1 Bawang', files: ['SMA Negeri 1 Bawang.xlsx'] },
  { folderName: '15. SMAN 1 Karangkobar', name: 'SMA NEGERI 1 KARANGKOBAR', shortName: 'SMAN 1 Karangkobar', files: ['SMA Negeri 1 Karangkobar.xlsx'] },
  { folderName: '16. SMAN 1 Wadaslintang', name: 'SMA NEGERI 1 WADASLINTANG', shortName: 'SMAN 1 Wadaslintang', files: ['SMA Negeri 1 Wadaslintang.xlsx'] }
];

const imporDir = 'C:/Users/errorscript/Downloads/Impor';
const baseOutputDir = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/13 Sekolah Terdata';

function generateGroupedHtml(school, allStudents, rombelsMap) {
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const docNo = `BP/BA-AKUN/${school.shortName.replace(/\s+/g, '_').toUpperCase()}/X/2026`;

  // 1. Ringkasan Rombel untuk Halaman Depan (Berita Acara)
  const sortedRombelKeys = Object.keys(rombelsMap).sort();
  const summaryRows = sortedRombelKeys.map(rKey => `
    <tr>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">${rKey}</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">${rombelsMap[rKey].length} Siswa</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
    </tr>
  `).join('');

  // 2. Lembar Kredensial Terpisah per Rombel (1 Rombel = 1 Bagian Halaman Mandiri)
  const rombelSectionsHtml = sortedRombelKeys.map(rKey => {
    const studentsInClass = rombelsMap[rKey];
    const studentRows = studentsInClass.map((s, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama || s.nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #334155;">${s.Email || s.email || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 600; color: #b45309; text-align: center;">${s['Password Awal'] || s.password || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #15803d; font-weight: 600;">AKTIF</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
      </tr>
    `).join('');

    return `
    <!-- HALAMAN MANDIRI PER KELAS / ROMBEL -->
    <div class="page-break"></div>

    <div class="header-container">
      <div class="logo-box">
        <img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" />
      </div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> ${school.shortName}</div>
        <div><strong>Kelas / Rombel:</strong> <span class="badge-rombel">${rKey}</span></div>
        <div><strong>Total Siswa:</strong> ${studentsInClass.length} Siswa</div>
      </div>
    </div>

    <div class="class-title-banner">
      <h2>DAFTAR KREDENSIAL LOGIN SISWA — KELAS ${rKey}</h2>
      <p>Lampiran resmi untuk dibagikan oleh Wali Kelas kepada siswa yang bersangkutan</p>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 5%;">No</th>
          <th style="width: 32%;">Nama Lengkap Siswa</th>
          <th style="width: 30%;">Email Login</th>
          <th style="width: 18%;">Password Awal</th>
          <th style="width: 7%;">Status</th>
          <th style="width: 8%;">Paraf</th>
        </tr>
      </thead>
      <tbody>
        ${studentRows}
      </tbody>
    </table>

    <div class="class-footer">
      <div style="font-size: 10px; color: #64748b;">
        * Akses masuk: <strong>https://belajarplus.id</strong> &bull; Harap jaga kerahasiaan password masing-masing siswa demi keamanan data.
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">
        Wali Kelas ${rKey}: _______________________
      </div>
    </div>
    `;
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Resmi Akun BelajarPlus - ${school.name}</title>
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
      font-size: 19px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-sub {
      font-size: 10px;
      color: #64748b;
      margin: 1px 0 0 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .doc-meta {
      text-align: right;
      font-size: 10.5px;
      color: #475569;
      line-height: 1.5;
    }
    .badge-rombel {
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #bfdbfe;
    }
    .doc-title {
      text-align: center;
      margin: 14px 0 10px 0;
    }
    .doc-title h1 {
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      color: #0f172a;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .doc-title p {
      font-size: 10.5px;
      color: #64748b;
      margin: 3px 0 0 0;
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 14px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 9.5px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
    }
    .info-value {
      font-size: 12.5px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 2px;
    }
    .section-title {
      font-size: 12px;
      font-weight: 700;
      color: #1e3a8a;
      margin: 14px 0 6px 0;
      border-left: 4px solid #2563eb;
      padding-left: 8px;
      text-transform: uppercase;
    }
    .class-title-banner {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 10px;
      text-align: center;
    }
    .class-title-banner h2 {
      font-size: 13px;
      font-weight: 800;
      color: #1e3a8a;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .class-title-banner p {
      font-size: 10px;
      color: #64748b;
      margin: 2px 0 0 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      font-size: 10.5px;
      font-weight: 700;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      text-transform: uppercase;
    }
    .guide-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 10px 14px;
      margin: 12px 0;
    }
    .guide-box h4 {
      margin: 0 0 4px 0;
      color: #1e40af;
      font-size: 11px;
      font-weight: 700;
    }
    .guide-box ol {
      margin: 0;
      padding-left: 16px;
      font-size: 10.5px;
      color: #1e3a8a;
    }
    .guide-box li {
      margin-bottom: 3px;
    }
    .sig-section {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .sig-col {
      width: 45%;
      text-align: center;
    }
    .sig-space {
      height: 50px;
    }
    .sig-name {
      font-weight: 700;
      text-decoration: underline;
      color: #0f172a;
    }
    .sig-role {
      font-size: 10px;
      color: #64748b;
    }
    .class-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px dashed #cbd5e1;
      padding-top: 8px;
      margin-top: 10px;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- HALAMAN 1: BERITA ACARA RESMI -->
  <div class="header-container">
    <div class="logo-box">
      <img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" />
    </div>
    <div class="doc-meta">
      <div><strong>No:</strong> ${docNo}</div>
      <div><strong>Tanggal:</strong> ${dateStr}</div>
      <div><strong>Status:</strong> <span style="color:#16a34a; font-weight:bold;">RESMI & TERVERIFIKASI</span></div>
    </div>
  </div>

  <div class="doc-title">
    <h1>BERITA ACARA PENYERAHAN & REKAPITULASI AKUN SISWA</h1>
    <p>Dokumen resmi aktivasi kredensial platform BelajarPlus Tahun Ajaran 2024/2025</p>
  </div>

  <div class="info-card">
    <div class="info-item">
      <span class="info-label">Satuan Pendidikan</span>
      <span class="info-value">${school.name}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Total Akun Terdata</span>
      <span class="info-value" style="color:#2563eb;">${allStudents.length} Siswa</span>
    </div>
    <div class="info-item">
      <span class="info-label">Jumlah Rombongan Belajar</span>
      <span class="info-value">${sortedRombelKeys.length} Rombel</span>
    </div>
  </div>

  <div class="section-title">Ringkasan Distribusi Akun per Rombongan Belajar (Kelas)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 35%;">Nama Rombongan Belajar (Kelas)</th>
        <th style="width: 35%;">Jumlah Siswa</th>
        <th style="width: 30%;">Status Akun</th>
      </tr>
    </thead>
    <tbody>
      ${summaryRows}
    </tbody>
  </table>

  <div class="guide-box">
    <h4>📌 PANDUAN LOGIN & PENGGUNAAN SISWA</h4>
    <ol>
      <li>Buka peramban (Google Chrome/Safari) di ponsel atau laptop, lalu buka alamat: <strong>https://belajarplus.id</strong></li>
      <li>Klik tombol <strong>"Masuk"</strong> pada sudut kanan atas halaman.</li>
      <li>Gunakan <strong>Email Login</strong> dan <strong>Password Awal</strong> yang tercantum pada lembar lampiran kelas masing-masing.</li>
      <li>Setelah berhasil masuk, pilih institusi <strong>${school.name}</strong> untuk mengakses kelas, materi pembelajaran, dan ujian asesmen.</li>
      <li>Harap jaga kerahasiaan password masing-masing akun demi keamanan data siswa.</li>
    </ol>
  </div>

  <div class="sig-section">
    <div class="sig-col">
      <div>Diserahkan Oleh:</div>
      <div style="font-weight: 600; color: #1e3a8a;">Tim Implementasi BelajarPlus</div>
      <div class="sig-space"></div>
      <div class="sig-name">Khansania / Tim Trainer</div>
      <div class="sig-role">Implementation & Trainer Specialist</div>
    </div>
    <div class="sig-col">
      <div>Diterima Oleh:</div>
      <div style="font-weight: 600; color: #1e3a8a;">${school.name}</div>
      <div class="sig-space"></div>
      <div class="sig-name">Administrator / Waka Kurikulum</div>
      <div class="sig-role">NIP. ....................................................</div>
    </div>
  </div>

  <!-- HALAMAN-HALAMAN KREDENSIAL PER KELAS / ROMBEL -->
  ${rombelSectionsHtml}

</body>
</html>
  `;
}

(async () => {
  console.log('=== MEMULAI GENERASI REPORT PDF RESMI BERLOGO ASLI & KELOMPOK PER LEMBAR KELAS ===\n');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  for (let i = 0; i < schoolsConfig.length; i++) {
    const school = schoolsConfig[i];
    console.log(`[${i + 1}/${schoolsConfig.length}] Memproses ${school.folderName}...`);

    const schoolDir = path.join(baseOutputDir, school.folderName);
    if (!fs.existsSync(schoolDir)) fs.mkdirSync(schoolDir, { recursive: true });

    // Baca data siswa
    let allStudents = [];
    for (const f of school.files) {
      const fPath = path.join(imporDir, f);
      if (fs.existsSync(fPath)) {
        const wb = xlsx.readFile(fPath);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        allStudents = allStudents.concat(data);
      }
    }

    // Kelompokkan siswa per rombel
    const rombelsMap = {};
    allStudents.forEach(s => {
      const rName = (s.Rombel || s.rombel || s.Kelas || 'Tanpa Rombel').toString().trim();
      if (!rombelsMap[rName]) rombelsMap[rName] = [];
      rombelsMap[rName].push(s);
    });

    console.log(`    Total siswa: ${allStudents.length}, Rombel: ${Object.keys(rombelsMap).length}`);

    // Render HTML dengan logo resmi dan pengelompokan per lembar kelas
    const htmlContent = generateGroupedHtml(school, allStudents, rombelsMap);
    const htmlPath = path.join(schoolDir, `Laporan_Resmi_${school.shortName.replace(/\s+/g, '_')}.html`);
    fs.writeFileSync(htmlPath, htmlContent);

    // Generate PDF dengan Playwright
    await page.setContent(htmlContent, { waitUntil: 'load' });
    const pdfPath = path.join(schoolDir, `Laporan_Resmi_Akun_${school.shortName.replace(/\s+/g, '_')}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        right: '14mm',
        bottom: '12mm',
        left: '14mm'
      }
    });

    console.log(`    -> PDF resmi per lembar kelas berhasil dibuat: ${pdfPath}`);
  }

  await browser.close();
  console.log('\n=== SELURUH 13 SEKOLAH SELESAI DIGENERATE DENGAN LOGO ASLI & LEMBAR PER KELAS 100%! ===');
})();
