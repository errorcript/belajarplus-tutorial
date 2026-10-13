const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');

const baseDir = 'G:/My Drive/Trainer/B+/AKUN';
const cleanDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/output_clean_semarang';
const outputPdfDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/output_pdfs_semarang';

if (!fs.existsSync(outputPdfDir)) {
  fs.mkdirSync(outputPdfDir, { recursive: true });
}

const logoPath = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png';
const logoBase64 = fs.existsSync(logoPath) ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64') : '';

const schools = [
  {
    name: 'SMAN 10 Semarang',
    folder: '83. SMAN 10 Semarang',
    excel: '[CLEAN_IMPORT] SMAN 10 Semarang.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 10 Semarang.pdf',
    subdomain: 'https://smanegeri10semarang.belajarplus.com',
    npsn: '20328878'
  },
  {
    name: 'SMAN 11 Semarang',
    folder: '59. SMAN 11 Semarang',
    excel: '[CLEAN_IMPORT] SMAN 11 Semarang.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 11 Semarang.pdf',
    subdomain: 'https://smanegeri11semarang.belajarplus.com',
    npsn: '20328879'
  },
  {
    name: 'SMAN 1 Tuntang',
    folder: '81. SMAN 1 Tuntang',
    excel: '[CLEAN_IMPORT] SMAN 1 Tuntang.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Tuntang.pdf',
    subdomain: 'https://smanegeri1tuntang.belajarplus.com',
    npsn: '20320243'
  },
  {
    name: 'SMA Islam Sudirman Ambarawa',
    folder: '79. SMA Islam Sudirman Ambarawa',
    excel: '[CLEAN_IMPORT] SMA Islam Sudirman Ambarawa.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMA Islam Sudirman Ambarawa.pdf',
    subdomain: 'https://smaislamsudirmanambarawa.belajarplus.com',
    npsn: '20320373'
  },
  {
    name: 'SMAN 1 Ambarawa',
    folder: '78. SMAN 1 Ambarawa',
    excel: '[CLEAN_IMPORT] SMAN 1 Ambarawa.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 1 Ambarawa.pdf',
    subdomain: 'https://smanegeri1ambarawa.belajarplus.com',
    npsn: '20320387'
  },
  {
    name: 'SMAN 2 Ungaran',
    folder: '80. SMAN 2 Ungaran',
    excel: '[CLEAN_IMPORT] SMAN 2 Ungaran.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 2 Ungaran.pdf',
    subdomain: 'https://smanegeri2ungaran.belajarplus.com',
    npsn: '20320241'
  },
  {
    name: 'SMAN 7 Semarang',
    folder: '82. SMAN 7 Semarang',
    excel: '[CLEAN_IMPORT] SMAN 7 Semarang.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN 7 Semarang.pdf',
    subdomain: 'https://smanegeri7semarang.belajarplus.com',
    npsn: '20328891'
  }
];

function generateSchoolHtml(school, students) {
  const rombelsMap = {};
  students.forEach(s => {
    const rName = (s.Rombel || s.rombel || s.Kelas || 'Belum Ditentukan').toString().trim() || 'Belum Ditentukan';
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
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama || s.nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #334155;">${s.Email || s.email || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 600; color: #b45309; text-align: center;">${s['Password Awal'] || s.password || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #15803d; font-weight: 600;">AKTIF</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
      </tr>
    `).join('');

    return `
    <div class="page-break"></div>
    <div class="header-container">
      <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> ${school.name}</div>
        <div><strong>Kelas / Rombel:</strong> <span class="badge-rombel">${rKey}</span></div>
        <div><strong>Total Siswa:</strong> ${studentsInClass.length} Siswa</div>
      </div>
    </div>
    <div class="class-title-banner">
      <h2>DAFTAR KREDENSIAL LOGIN SISWA — KELAS ${rKey}</h2>
      <p>Lampiran resmi untuk dibagikan oleh Wali Kelas kepada siswa yang bersangkutan</p>
    </div>
    <table>
      <thead><tr>
        <th style="width: 5%;">No</th><th style="width: 32%;">Nama Lengkap Siswa</th>
        <th style="width: 30%;">Email Login</th><th style="width: 18%;">Password Awal</th>
        <th style="width: 7%;">Status</th><th style="width: 8%;">Paraf</th>
      </tr></thead>
      <tbody>${studentRows}</tbody>
    </table>
    <div class="class-footer">
      <div style="font-size: 10.5px; color: #475569;">
        🔗 Portal Masuk: <a href="${school.subdomain}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${school.subdomain}</a>
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">Wali Kelas ${rKey}: _______________________</div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><title>Laporan Resmi Akun - ${school.name}</title>
<style>
  @page { size: A4 portrait; margin: 12mm 15mm 15mm 15mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; line-height: 1.4; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page-break { page-break-before: always; break-before: page; }
  .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 18px; }
  .official-logo { height: 48px; width: auto; object-fit: contain; }
  .doc-meta { text-align: right; font-size: 11px; color: #475569; }
  .doc-meta strong { color: #0f172a; }
  .badge-rombel { background: #1e3a8a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px; display: inline-block; }
  .title-banner { text-align: center; margin-bottom: 20px; }
  .title-banner h1 { margin: 0 0 4px 0; font-size: 17px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
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

(async () => {
  console.log('=== MEMULAI GENERASI LAPORAN RESMI PDF DENGAN TAHUN AJARAN 2026/2027 & SUBDOMAIN ===\n');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  for (let idx = 0; idx < schools.length; idx++) {
    const s = schools[idx];
    console.log(`[${idx + 1}/${schools.length}] Memproses ${s.name}...`);
    const excelPath = path.join(cleanDir, s.excel);
    if (!fs.existsSync(excelPath)) {
      console.error(`File Excel tidak ditemukan: ${excelPath}`);
      continue;
    }

    const wb = xlsx.readFile(excelPath);
    const students = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
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

    // Salin juga ke Google Drive
    fs.copyFileSync(localPdfPath, drivePdfPath);
    console.log(`   ✓ PDF Berhasil Dibuat: ${s.pdfName}`);
    console.log(`   ✓ Tersimpan di Google Drive: ${drivePdfPath}`);
  }

  await browser.close();
  console.log('\n🎉 SEMUA LAPORAN RESMI PDF BERHASIL DIGENERATE ULANG DENGAN TA 2026/2027 & LINK SUBDOMAIN!');
})();
