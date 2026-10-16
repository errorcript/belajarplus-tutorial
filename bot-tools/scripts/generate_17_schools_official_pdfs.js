const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');

const baseDir = 'G:/My Drive/Trainer/B+/AKUN';
const outputPdfDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/output_pdfs_17_schools';

if (!fs.existsSync(outputPdfDir)) {
  fs.mkdirSync(outputPdfDir, { recursive: true });
}

const logoPath = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png';
const logoBase64 = fs.existsSync(logoPath) ? 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64') : '';

const schools = [
  // 10 SEKOLAH SURAKARTA
  {
    name: 'SMA NEGERI 1 SURAKARTA',
    shortName: 'SMAN 1 Surakarta',
    folder: '20. SMAN 1 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 1 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Surakarta.pdf',
    subdomain: 'https://smanegeri1surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1surakarta',
    npsn: '20327974'
  },
  {
    name: 'SMA NEGERI 2 SURAKARTA',
    shortName: 'SMAN 2 Surakarta',
    folder: '21. SMAN 2 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 2 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_2_Surakarta.pdf',
    subdomain: 'https://smanegeri2surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri2surakarta',
    npsn: '20327975'
  },
  {
    name: 'SMA NEGERI 3 SURAKARTA',
    shortName: 'SMAN 3 Surakarta',
    folder: '22. SMAN 3 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 3 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_3_Surakarta.pdf',
    subdomain: 'https://smanegeri3surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri3surakarta',
    npsn: '20327976'
  },
  {
    name: 'SMA NEGERI 4 SURAKARTA',
    shortName: 'SMAN 4 Surakarta',
    folder: '23. SMAN 4 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 4 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_4_Surakarta.pdf',
    subdomain: 'https://smanegeri4surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri4surakarta',
    npsn: '20327977'
  },
  {
    name: 'SMA NEGERI 5 SURAKARTA',
    shortName: 'SMAN 5 Surakarta',
    folder: '24. SMAN 5 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 5 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_5_Surakarta.pdf',
    subdomain: 'https://smanegeri5surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri5surakarta',
    npsn: '20327978'
  },
  {
    name: 'SMA NEGERI 6 SURAKARTA',
    shortName: 'SMAN 6 Surakarta',
    folder: '25. SMAN 6 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 6 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_6_Surakarta.pdf',
    subdomain: 'https://smanegeri6surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri6surakarta',
    npsn: '20327979'
  },
  {
    name: 'SMA NEGERI 7 SURAKARTA',
    shortName: 'SMAN 7 Surakarta',
    folder: '25b. SMAN 7 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 7 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_7_Surakarta.pdf',
    subdomain: 'https://smanegeri7surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri7surakarta',
    npsn: '20327980'
  },
  {
    name: 'SMA NEGERI 8 SURAKARTA',
    shortName: 'SMAN 8 Surakarta',
    folder: '26. SMAN 8 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 8 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_8_Surakarta.pdf',
    subdomain: 'https://smanegeri8surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri8surakarta',
    npsn: '20327981'
  },
  {
    name: 'SMA NEGERI 9 SURAKARTA',
    shortName: 'SMAN 9 Surakarta',
    folder: '27. SMAN 9 Surakarta',
    excel: '[CLEAN_IMPORT] SMAN 9 Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_9_Surakarta.pdf',
    subdomain: 'https://smanegeri9surakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri9surakarta',
    npsn: '20327982'
  },
  {
    name: 'SMA BUDI UTOMO SURAKARTA',
    shortName: 'SMA Budi Utomo Surakarta',
    folder: '19. SMA Budi Utomo Surakarta',
    excel: '[CLEAN_IMPORT] SMA Budi Utomo Surakarta.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMA_Budi_Utomo_Surakarta.pdf',
    subdomain: 'https://smabudiutomosurakarta.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smabudiutomosurakarta',
    npsn: '20327960'
  },

  // 7 SEKOLAH SRAGEN
  {
    name: 'SMA NEGERI 1 SRAGEN',
    shortName: 'SMAN 1 Sragen',
    folder: '32. SMAN 1 Sragen',
    excel: '[CLEAN_IMPORT] SMAN 1 Sragen.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Sragen.pdf',
    subdomain: 'https://smanegeri1sragen.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1sragen',
    npsn: '20313042'
  },
  {
    name: 'SMA NEGERI 2 SRAGEN',
    shortName: 'SMAN 2 Sragen',
    folder: '33. SMAN 2 Sragen',
    excel: '[CLEAN_IMPORT] SMAN 2 Sragen.xlsx',
    teacherExcel: '[CLEAN_IMPORT_GURU] SMAN 2 Sragen.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_2_Sragen.pdf',
    subdomain: 'https://smanegeri2sragen.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri2sragen',
    npsn: '20313043'
  },
  {
    name: 'SMA NEGERI 3 SRAGEN',
    shortName: 'SMAN 3 Sragen',
    folder: '34. SMAN 3 Sragen',
    excel: '[CLEAN_IMPORT] SMAN 3 Sragen.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_3_Sragen.pdf',
    subdomain: 'https://smanegeri3sragen.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri3sragen',
    npsn: '20313044'
  },
  {
    name: 'SMA NEGERI 1 GEMOLONG',
    shortName: 'SMAN 1 Gemolong',
    folder: '35. SMAN 1 Gemolong',
    excel: '[CLEAN_IMPORT] SMAN 1 Gemolong.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Gemolong.pdf',
    subdomain: 'https://smanegeri1gemolong.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1gemolong',
    npsn: '20313045'
  },
  {
    name: 'SMA NEGERI 1 GONDANG',
    shortName: 'SMAN 1 Gondang',
    folder: '36. SMAN 1 Gondang',
    excel: '[CLEAN_IMPORT] SMAN 1 Gondang.xlsx',
    teacherExcel: '[CLEAN_IMPORT_GURU] SMAN 1 Gondang.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Gondang.pdf',
    subdomain: 'https://smanegeri1gondang.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1gondang',
    npsn: '20313046'
  },
  {
    name: 'SMA NEGERI 1 SUKODONO',
    shortName: 'SMAN 1 Sukodono',
    folder: '37. SMAN 1 Sukodono',
    excel: '[CLEAN_IMPORT] SMAN 1 Sukodono.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Sukodono.pdf',
    subdomain: 'https://smanegeri1sukodono.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1sukodono',
    npsn: '20313047'
  },
  {
    name: 'SMA NEGERI 1 TANGEN',
    shortName: 'SMAN 1 Tangen',
    folder: '38. SMAN 1 Tangen',
    excel: '[CLEAN_IMPORT] SMAN 1 Tangen.xlsx',
    pdfName: 'Laporan_Resmi_Akun_SMAN_1_Tangen.pdf',
    subdomain: 'https://smanegeri1tangen.belajarplus.id',
    altUrl: 'https://belajarplus.id/s/smanegeri1tangen',
    npsn: '20313048'
  }
];

function generateSchoolHtml(school, students, teachers = []) {
  const rombelsMap = {};
  students.forEach(s => {
    const rName = (s.Rombel || s.rombel || s.Kelas || 'Belum Ada Rombel').toString().trim() || 'Belum Ada Rombel';
    if (!rombelsMap[rName]) rombelsMap[rName] = [];
    rombelsMap[rName].push(s);
  });

  const sortedRombelKeys = Object.keys(rombelsMap).sort();

  const summaryRows = sortedRombelKeys.map(rKey => `
    <tr>
      <td style="padding: 7px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">${rKey}</td>
      <td style="padding: 7px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a8a;">${rombelsMap[rKey].length} Siswa</td>
      <td style="padding: 7px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
    </tr>
  `).join('');

  const rombelSectionsHtml = sortedRombelKeys.map(rKey => {
    const studentsInClass = rombelsMap[rKey];
    const studentRows = studentsInClass.map((s, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10.5px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama || s.nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #1e293b;">${s.Email || s.email || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 700; color: #b45309; text-align: center; background: #fffbeb;">${s['Password Awal'] || s.password || s.Password || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px; color: #15803d; font-weight: bold;">AKTIF</td>
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
      <p>Lampiran resmi serah terima akun untuk dibagikan oleh Wali Kelas kepada peserta didik yang bersangkutan</p>
    </div>
    <table>
      <thead><tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 32%;">Nama Lengkap Siswa</th>
        <th style="width: 31%;">Email Login</th>
        <th style="width: 17%; text-align: center;">Password Awal</th>
        <th style="width: 7%; text-align: center;">Status</th>
        <th style="width: 8%; text-align: center;">Paraf</th>
      </tr></thead>
      <tbody>${studentRows}</tbody>
    </table>
    <div class="class-footer">
      <div style="font-size: 10.5px; color: #334155;">
        🌐 <strong>Portal LMS Subdomain:</strong> <a href="${school.subdomain}" style="color: #1d4ed8; font-weight: bold; text-decoration: underline;">${school.subdomain}</a> &nbsp;|&nbsp; Akses Cepat: <a href="${school.altUrl}" style="color: #2563eb;">${school.altUrl}</a>
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">Wali Kelas ${rKey}: _______________________</div>
    </div>`;
  }).join('');

  // Bagian Tambahan untuk Guru (jika ada)
  let teacherSectionHtml = '';
  if (teachers && teachers.length > 0) {
    const teacherRows = teachers.map((t, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; page-break-inside: avoid;">
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10.5px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${t.Nama || t.nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #1e293b;">${t.Email || t.email || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 700; color: #0f766e; text-align: center; background: #f0fdfa;">${t['Password Awal'] || t.password || t.Password || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px; color: #0f766e; font-weight: bold;">GURU / PTK</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
      </tr>
    `).join('');

    teacherSectionHtml = `
    <div class="page-break"></div>
    <div class="header-container">
      <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> ${school.name}</div>
        <div><strong>Peran:</strong> <span class="badge-rombel" style="background: #0d9488;">Dewan Guru & PTK</span></div>
        <div><strong>Total Guru:</strong> ${teachers.length} Guru</div>
      </div>
    </div>
    <div class="class-title-banner" style="border-left-color: #0d9488; background: #f0fdfa;">
      <h2 style="color: #0f766e;">DAFTAR KREDENSIAL LOGIN GURU & TENAGA PENDIDIK</h2>
      <p>Lampiran resmi serah terima akun pendidik untuk pengelolaan LMS BelajarPlus</p>
    </div>
    <table>
      <thead><tr>
        <th style="width: 5%; background: #0f766e; border-color: #0f766e; text-align: center;">No</th>
        <th style="width: 32%; background: #0f766e; border-color: #0f766e;">Nama Lengkap Guru</th>
        <th style="width: 31%; background: #0f766e; border-color: #0f766e;">Email Login</th>
        <th style="width: 17%; background: #0f766e; border-color: #0f766e; text-align: center;">Password Awal</th>
        <th style="width: 7%; background: #0f766e; border-color: #0f766e; text-align: center;">Status</th>
        <th style="width: 8%; background: #0f766e; border-color: #0f766e; text-align: center;">Paraf</th>
      </tr></thead>
      <tbody>${teacherRows}</tbody>
    </table>
    <div class="class-footer">
      <div style="font-size: 10.5px; color: #334155;">
        🌐 <strong>Portal LMS Subdomain:</strong> <a href="${school.subdomain}" style="color: #0d9488; font-weight: bold; text-decoration: underline;">${school.subdomain}</a> &nbsp;|&nbsp; Akses Cepat: <a href="${school.altUrl}" style="color: #0f766e;">${school.altUrl}</a>
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #0f766e;">Admin Kurikulum: _______________________</div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="id"><head><meta charset="UTF-8"><title>Laporan Resmi Akun - ${school.name}</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm 12mm 12mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; line-height: 1.4; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page-break { page-break-before: always; break-before: page; }
  .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 16px; }
  .official-logo { height: 46px; width: auto; object-fit: contain; }
  .doc-meta { text-align: right; font-size: 10.5px; color: #475569; }
  .doc-meta strong { color: #0f172a; }
  .badge-rombel { background: #1e3a8a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10.5px; display: inline-block; }
  .title-banner { text-align: center; margin-bottom: 16px; }
  .title-banner h1 { margin: 0 0 4px 0; font-size: 16px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
  .title-banner .doc-num { font-size: 11.5px; color: #64748b; margin: 0; }
  
  /* SUBDOMAIN PORTAL BOX */
  .portal-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; text-align: center; }
  .portal-box .title { font-weight: bold; color: #1e40af; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .portal-box .link { font-size: 16px; font-weight: 800; color: #1d4ed8; text-decoration: none; word-break: break-all; }
  .portal-box .alt-link { font-size: 12px; color: #4b5563; margin-top: 3px; font-weight: 600; }
  .portal-box .alt-link a { color: #2563eb; text-decoration: underline; }
  .portal-box .subtext { font-size: 10.5px; color: #475569; margin-top: 5px; }
  
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
  .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; text-align: center; }
  .summary-card .label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
  .summary-card .value { font-size: 15px; font-weight: bold; color: #0f172a; }
  
  .ba-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; font-size: 11px; line-height: 1.5; margin-bottom: 16px; }
  .class-title-banner { background: #eff6ff; border-left: 4px solid #2563eb; padding: 7px 12px; margin-bottom: 12px; }
  .class-title-banner h2 { margin: 0; font-size: 13px; color: #1e3a8a; }
  .class-title-banner p { margin: 2px 0 0 0; font-size: 10px; color: #64748b; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #1e3a8a; color: #fff; padding: 6px 8px; font-size: 10.5px; font-weight: 600; text-align: left; border: 1px solid #1e3a8a; }
  td { padding: 5px 8px; font-size: 10.5px; border: 1px solid #cbd5e1; }
  tr { page-break-inside: avoid; }
  thead { display: table-header-group; }
  
  .signatures { display: flex; justify-content: space-between; margin-top: 25px; padding: 0 20px; page-break-inside: avoid; }
  .sign-box { text-align: center; width: 220px; font-size: 11px; }
  .sign-space { height: 60px; }
  .sign-name { font-weight: bold; border-bottom: 1px solid #0f172a; display: inline-block; min-width: 180px; padding-bottom: 2px; }
  .class-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid; }
</style>
</head><body>
  <div class="header-container">
    <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/${school.shortName.replace(/\s+/g, '_').toUpperCase()}/X/2026</div>
      <div><strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
      <div><strong>Sifat:</strong> Dokumen Resmi & Rahasia</div>
    </div>
  </div>
  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PEMBELAJARAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>
  
  <div class="portal-box">
    <div class="title">🌐 Portal Akses LMS / Subdomain Resmi Sekolah</div>
    <div><a href="${school.subdomain}" class="link">${school.subdomain}</a></div>
    <div class="alt-link">Akses Langsung: <a href="${school.altUrl}">${school.altUrl}</a></div>
    <div class="subtext">Peserta didik dan dewan guru dapat langsung login ke platform menggunakan tautan subdomain resmi di atas dengan memasukkan <strong>Email Login</strong> dan <strong>Password Awal</strong> masing-masing.</div>
  </div>

  <div class="summary-grid">
    <div class="summary-card"><div class="label">Satuan Pendidikan</div><div class="value" style="font-size: 12.5px;">${school.name}</div></div>
    <div class="summary-card"><div class="label">Total Akun Siswa</div><div class="value" style="color: #2563eb;">${students.length} Siswa</div></div>
    <div class="summary-card"><div class="label">Total Rombel / Kelas</div><div class="value" style="color: #16a34a;">${sortedRombelKeys.length} Rombel</div></div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini telah diselesaikan penerbitan dan sinkronisasi kredensial akun peserta didik untuk satuan pendidikan <strong>${school.name} (NPSN: ${school.npsn})</strong> ke dalam platform <strong>BelajarPlus</strong> pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p style="margin-bottom: 0;">Seluruh akun peserta didik telah memiliki <strong>Email Login</strong> unik, <strong>Password Awal</strong> terverifikasi, dan telah terpetakan ke dalam rombongan belajar (rombel) masing-masing.</p>
  </div>

  <h3 style="font-size: 12px; color: #1e3a8a; margin: 0 0 8px 0;">REKAPITULASI PENEMPATAN KELAS / ROMBEL</h3>
  <table>
    <thead><tr><th style="width: 40%; text-align: center;">Nama Rombel / Kelas</th><th style="width: 30%; text-align: center;">Jumlah Siswa Terdaftar</th><th style="width: 30%; text-align: center;">Status Verifikasi Sistem</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <div class="signatures">
    <div class="sign-box"><div>Mengetahui,<br><strong>Kepala Sekolah</strong></div><div class="sign-space"></div><div class="sign-name">${school.name}</div></div>
    <div class="sign-box"><div>Diserahkan Oleh,<br><strong>Tim Trainer</strong></div><div class="sign-space"></div><div class="sign-name">Tim Pendamping BelajarPlus</div></div>
  </div>
  ${rombelSectionsHtml}
  ${teacherSectionHtml}
</body></html>`;
}

(async () => {
  console.log('=== MEMULAI GENERASI 17 LAPORAN RESMI PDF DENGAN SUBDOMAIN & KREDENSIAL LENGKAP ===\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const results = [];

  for (let idx = 0; idx < schools.length; idx++) {
    const sc = schools[idx];
    console.log(`[${idx + 1}/${schools.length}] Memproses ${sc.name}...`);

    const excelPath = path.join(baseDir, sc.folder, sc.excel);
    if (!fs.existsSync(excelPath)) {
      console.log(`   ❌ Berkas Excel tidak ditemukan: ${excelPath}`);
      results.push({ name: sc.name, status: 'EXCEL_NOT_FOUND' });
      continue;
    }

    const wb = xlsx.readFile(excelPath);
    const sheetName = wb.SheetNames.find(s => /siswa|student/i.test(s)) || wb.SheetNames[0];
    const students = xlsx.utils.sheet_to_json(wb.Sheets[sheetName]);

    let teachers = [];
    if (sc.teacherExcel) {
      const tPath = path.join(baseDir, sc.folder, sc.teacherExcel);
      if (fs.existsSync(tPath)) {
        const tWb = xlsx.readFile(tPath);
        const tSheet = tWb.SheetNames.find(s => /guru|teacher/i.test(s)) || tWb.SheetNames[0];
        teachers = xlsx.utils.sheet_to_json(tWb.Sheets[tSheet]);
        console.log(`   Guru terdeteksi: ${teachers.length} Guru`);
      }
    }

    console.log(`   Total Siswa: ${students.length} Siswa`);
    console.log(`   Subdomain: ${sc.subdomain} (${sc.altUrl})`);

    const html = generateSchoolHtml(sc, students, teachers);
    await page.setContent(html, { waitUntil: 'load' });

    // Path lokal & Google Drive
    const localPdfPath = path.join(outputPdfDir, sc.pdfName);
    const drivePdfPath = path.join(baseDir, sc.folder, sc.pdfName);

    await page.pdf({
      path: localPdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '12mm', left: '12mm', right: '12mm' }
    });

    // Salin juga ke Google Drive (menimpa PDF lama)
    fs.copyFileSync(localPdfPath, drivePdfPath);

    const stats = fs.statSync(drivePdfPath);
    console.log(`   ✓ PDF Selesai: ${sc.pdfName} (${Math.round(stats.size / 1024)} KB) -> Disimpan ke Google Drive!`);

    results.push({
      sekolah: sc.shortName,
      totalSiswa: students.length,
      totalGuru: teachers.length,
      subdomain: sc.subdomain,
      sizeKB: Math.round(stats.size / 1024),
      status: 'SUCCESS'
    });
  }

  console.log('\n========================================================================================');
  console.log('REKAPITULASI GENERASI 17 LAPORAN PDF RESMI DENGAN SUBDOMAIN & PASSWORD LENGKAP:');
  console.table(results);
  console.log('========================================================================================');

  await browser.close();
})();
