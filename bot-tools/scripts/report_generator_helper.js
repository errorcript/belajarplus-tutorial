const path = require('path');
const fs = require('fs');

const logoPath = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png';
const logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');

function generateGroupedHtml(school, allStudents, rombelsMap) {
  const dateStr = '12 Oktober 2026';
  const docNo = `BP/BA-AKUN/${school.shortName.replace(/\s+/g, '_').toUpperCase()}/X/2026`;
  const portalUrl = school.subdomainUrl || 'https://belajarplus.id';

  const sortedRombelKeys = Object.keys(rombelsMap).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });

  const summaryRows = sortedRombelKeys.map(rKey => `
    <tr>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">${rKey}</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">${rombelsMap[rKey].length} Siswa</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
    </tr>
  `).join('');

  const rombelSectionsHtml = sortedRombelKeys.map(rKey => {
    const studentsInClass = rombelsMap[rKey];
    const studentRows = studentsInClass.map((s, idx) => {
      let emailVal = (s.Email || s.email || '-').replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
      return `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama || s.nama || '-'}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #334155;">${emailVal}</td>
        <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 600; color: #b45309; text-align: center;">${s['Password Awal'] || s.password || '-'}</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #15803d; font-weight: 600;">AKTIF</td>
        <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
      </tr>
      `;
    }).join('');

    return `
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
        * Portal Akses Masuk: <strong>${portalUrl}</strong> &bull; Harap jaga kerahasiaan password masing-masing siswa demi keamanan data.
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">
        Wali Kelas ${rKey}: _______________________
      </div>
    </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Resmi Akun - ${school.shortName}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm 12mm 15mm 12mm; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 0; font-size: 11px; }
    .page-break { page-break-before: always; }
    .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 12px; }
    .official-logo { height: 38px; width: auto; object-fit: contain; }
    .doc-meta { text-align: right; font-size: 10px; color: #475569; }
    .badge-rombel { background: #dbeafe; color: #1e40af; font-weight: bold; padding: 2px 6px; border-radius: 4px; }
    .title-banner { text-align: center; margin-bottom: 16px; }
    .title-banner h1 { margin: 0; font-size: 16px; color: #1e3a8a; letter-spacing: 0.5px; }
    .title-banner .doc-num { margin: 4px 0 0 0; font-size: 11px; color: #64748b; }
    .class-title-banner { margin-bottom: 12px; border-left: 4px solid #2563eb; padding-left: 10px; }
    .class-title-banner h2 { margin: 0; font-size: 13.5px; color: #1e3a8a; }
    .class-title-banner p { margin: 2px 0 0 0; font-size: 10.5px; color: #64748b; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; text-align: center; }
    .summary-card .label { font-size: 10.5px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
    .summary-card .value { font-size: 16px; font-weight: bold; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    th { background: #1e3a8a; color: #fff; padding: 7px 8px; font-size: 11px; font-weight: 600; text-align: left; border: 1px solid #1e3a8a; }
    td { padding: 6px 8px; font-size: 11px; border: 1px solid #cbd5e1; }
    .ba-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; font-size: 11.5px; line-height: 1.6; margin-bottom: 24px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 30px; padding: 0 20px; }
    .sign-box { text-align: center; width: 220px; font-size: 11.5px; }
    .sign-space { height: 65px; }
    .sign-name { font-weight: bold; border-bottom: 1px solid #0f172a; display: inline-block; min-width: 180px; padding-bottom: 2px; }
    .class-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 10px; border-top: 1px dashed #cbd5e1; }
  </style>
</head>
<body>
  <div class="header-container">
    <div class="logo-box"><img src="${logoBase64}" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> ${docNo}</div>
      <div><strong>Tanggal:</strong> ${dateStr}</div>
      <div><strong>Sifat:</strong> Resmi / Rahasia</div>
    </div>
  </div>

  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PEMBELAJARAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; Tahun Ajaran 2024/2025</p>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Satuan Pendidikan</div>
      <div class="value" style="font-size: 13px;">${school.shortName}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Akun Siswa</div>
      <div class="value" style="color: #2563eb;">${allStudents.length} Siswa</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Rombel / Kelas</div>
      <div class="value" style="color: #16a34a;">${sortedRombelKeys.length} Rombel</div>
    </div>
  </div>

  <div class="ba-section">
    <p style="margin: 0 0 8px 0;">Pada hari ini, <strong>${dateStr}</strong>, telah diselesaikan penerbitan, sinkronisasi, dan penempatan rombel akun peserta didik untuk satuan pendidikan <strong>${school.name}</strong> ke dalam platform <strong>BelajarPlus</strong> melalui subdomain resmi <strong>${portalUrl}</strong>.</p>
    <p style="margin: 0 0 8px 0;">Seluruh <strong>100% peserta didik telah berhasil ditempatkan ke dalam rombel kelasnya masing-masing</strong> dan siap digunakan untuk pelaksanaan kegiatan asesmen, pembelajaran digital, dan manajemen kelas terpadu.</p>
    <p style="margin: 0;">Pihak sekolah melalui masing-masing Wali Kelas berkewajiban mendistribusikan kredensial login kepada siswa sesuai lembar rombel terlampir dan menghimbau siswa menjaga keamanan kredensial.</p>
  </div>

  <h3 style="font-size: 13px; color: #1e3a8a; margin: 0 0 8px 0;">REKAPITULASI PENEMPATAN KELAS / ROMBEL</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 40%; text-align: center;">Nama Rombel / Kelas</th>
        <th style="width: 30%; text-align: center;">Jumlah Siswa Terdaftar</th>
        <th style="width: 30%; text-align: center;">Status Verifikasi Sistem</th>
      </tr>
    </thead>
    <tbody>
      ${summaryRows}
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box">
      <div>Mengetahui,<br><strong>Kepala Sekolah / Kurikulum</strong></div>
      <div class="sign-space"></div>
      <div class="sign-name">${school.shortName}</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 3px;">NIP. ........................................</div>
    </div>
    <div class="sign-box">
      <div>Diserahkan Oleh,<br><strong>Tim Trainer & Implementasi</strong></div>
      <div class="sign-space"></div>
      <div class="sign-name">Tim Pendamping BelajarPlus</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 3px;">BelajarPlus Indonesia</div>
    </div>
  </div>

  ${rombelSectionsHtml}
</body>
</html>`;
}

module.exports = { generateGroupedHtml };
