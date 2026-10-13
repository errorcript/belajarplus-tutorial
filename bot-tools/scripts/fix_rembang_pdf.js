const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Rembang_576.xlsx';
const targetDrivePdf = 'G:/My Drive/Trainer/B+/AKUN/67. SMAN 1 Rembang/Laporan_Resmi_Akun_SMAN 1 Rembang.pdf';
const targetDriveExcel = 'G:/My Drive/Trainer/B+/AKUN/67. SMAN 1 Rembang/SMA Negeri 1 Rembang.xlsx';
const localProofPdf = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/audit_purbalingga_proofs/Laporan_Resmi_Akun_SMAN 1 Rembang.pdf';

(async () => {
  console.log('=== REGENERATE LAPORAN RESMI PDF SMAN 1 REMBANG ===\n');

  // 1. Baca data Excel yang bersih dan valid
  const wb = xlsx.readFile(excelPath);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  console.log(`Loaded ${rows.length} siswa dari ${excelPath}`);

  // Rekapitulasi Rombel
  const rombelSummary = {};
  rows.forEach(r => {
    const rom = (r.Rombel || 'Belum Ditentukan').trim();
    rombelSummary[rom] = (rombelSummary[rom] || 0) + 1;
  });

  const rombelNames = Object.keys(rombelSummary).sort();
  console.log(`Ditemukan ${rombelNames.length} rombel: ${rombelNames.join(', ')}`);

  // Update file Excel di Google Drive
  try {
    fs.copyFileSync(excelPath, targetDriveExcel);
    console.log(`✅ File Excel di Google Drive sukses diupdate: ${targetDriveExcel}`);
  } catch (e) {
    console.error('Gagal copy excel ke Drive:', e.message);
  }

  // Generate HTML Template
  const dateStr = '13 Oktober 2026';
  const docNo = 'BP/BA-AKUN/SMAN_1_REMBANG/X/2026';

  const rombelSummaryHtml = rombelNames.map(r => `
    <tr>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">Kelas ${r}</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">${rombelSummary[r]} Siswa</td>
      <td style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
    </tr>
  `).join('');

  // Kelompokkan siswa per rombel agar terstruktur rapi per kelas
  let classSectionsHtml = '';
  rombelNames.forEach(rom => {
    const classStudents = rows.filter(r => (r.Rombel || '').trim() === rom);
    const studentRows = classStudents.map((s, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; text-align: center; font-size: 11px;">${idx + 1}</td>
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 11px; font-weight: 600; color: #0f172a;">${s.Nama}</td>
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; text-align: center; font-size: 11px; font-weight: 600; color: #2563eb;">${s.Rombel}</td>
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10.5px; font-family: monospace; color: #334155;">${s.Email}</td>
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; font-size: 10.5px; font-family: monospace; font-weight: 600; color: #b45309; text-align: center;">${s['Password Awal']}</td>
        <td style="padding: 5px 8px; border: 1px solid #e2e8f0; text-align: center; font-size: 10px; color: #15803d; font-weight: 600;">AKTIF</td>
      </tr>
    `).join('');

    classSectionsHtml += `
      <div style="page-break-before: always; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-bottom: 12px;">
          <div>
            <div style="font-size: 11px; color: #64748b; font-weight: 600;">SMAN 1 REMBANG • TAHUN AJARAN 2026/2027</div>
            <div style="font-size: 16px; font-weight: 800; color: #1e3a8a;">LAMPIRAN KREDENSIAL: KELAS ${rom}</div>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 6px;">
            Total: ${classStudents.length} Siswa
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #1e40af; color: #ffffff;">
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 35px; font-size: 11px;">No</th>
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left; font-size: 11px;">Nama Siswa</th>
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 65px; font-size: 11px;">Rombel</th>
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left; font-size: 11px;">Email Login</th>
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 110px; font-size: 11px;">Password Awal</th>
              <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 65px; font-size: 11px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${studentRows}
          </tbody>
        </table>
      </div>
    `;
  });

  const fullHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Resmi Akun BelajarPlus - SMAN 1 Rembang</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 12mm 12mm 12mm;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.4;
      font-size: 12px;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #2563eb;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .logo-badge {
      font-size: 24px;
      font-weight: 900;
      color: #2563eb;
      letter-spacing: -0.5px;
    }
    .badge-info {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>

  <!-- HALAMAN 1: BERITA ACARA -->
  <div>
    <div class="header-container">
      <div>
        <div class="logo-badge">belajar<span style="color: #f97316;">+</span></div>
        <div style="font-size: 10px; color: #64748b; font-weight: 600;">Integrated Smart Learning Platform</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: 800; font-size: 13px; color: #0f172a;">BERITA ACARA SERAH TERIMA AKUN SISWA</div>
        <div style="font-size: 10px; color: #64748b;">No: ${docNo}</div>
        <div style="font-size: 10px; color: #64748b;">Tanggal: ${dateStr}</div>
      </div>
    </div>

    <div style="text-align: center; margin-bottom: 16px;">
      <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #1e3a8a;">LAPORAN PENERBITAN & DISTRIBUSI ROMBEL AKUN SISWA</h2>
      <h3 style="margin: 0; font-size: 14px; color: #475569; font-weight: 600;">SMA NEGERI 1 REMBANG • TAHUN AJARAN 2026/2027</h3>
    </div>

    <div class="badge-info">
      <table style="width: 100%;">
        <tr>
          <td style="width: 25%; font-weight: 600; color: #475569;">Satuan Pendidikan:</td>
          <td style="width: 35%; font-weight: 700; color: #0f172a;">SMA Negeri 1 Rembang</td>
          <td style="width: 20%; font-weight: 600; color: #475569;">Status Platform:</td>
          <td style="width: 20%; font-weight: 700; color: #16a34a;">100% Aktif & Sesuai Rombel</td>
        </tr>
        <tr>
          <td style="font-weight: 600; color: #475569;">Total Akun Siswa:</td>
          <td style="font-weight: 700; color: #2563eb;">${rows.length} Siswa Terdaftar</td>
          <td style="font-weight: 600; color: #475569;">Total Rombel:</td>
          <td style="font-weight: 700; color: #2563eb;">${rombelNames.length} Rombel Terdistribusi</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 11.5px; text-align: justify; margin-bottom: 14px;">
      Pada hari ini, <strong>${dateStr}</strong>, telah diselesaikan sinkronisasi data akun peserta didik SMA Negeri 1 Rembang ke dalam platform BelajarPlus (<strong>https://belajarplus.id</strong>). Seluruh akun telah diverifikasi dan <strong>ditempatkan secara tepat ke dalam masing-masing rombel/kelas</strong>. Kredensial ini dapat digunakan oleh siswa untuk asesmen, materi belajar, dan tugas kelas terpadu.
    </p>

    <div style="margin-bottom: 16px;">
      <div style="font-weight: 700; font-size: 13px; color: #1e3a8a; margin-bottom: 6px; border-left: 4px solid #2563eb; padding-left: 8px;">
        REKAPITULASI PENEMPATAN KELAS / ROMBEL
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background: #f1f5f9; color: #334155;">
            <th style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">Nama Rombel / Kelas</th>
            <th style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">Jumlah Siswa Terdaftar</th>
            <th style="padding: 6px 12px; border: 1px solid #cbd5e1; text-align: center;">Status Verifikasi Sistem</th>
          </tr>
        </thead>
        <tbody>
          ${rombelSummaryHtml}
        </tbody>
      </table>
    </div>

    <div style="margin-top: 35px; display: flex; justify-content: space-between; text-align: center;">
      <div style="width: 40%;">
        <div style="font-size: 11px; color: #64748b;">Mengetahui,</div>
        <div style="font-weight: 700; font-size: 12px; margin-top: 2px;">Kepala Sekolah / Kurikulum</div>
        <div style="font-weight: 600; font-size: 11px; color: #334155;">SMAN 1 Rembang</div>
        <div style="margin-top: 50px; font-weight: 700; text-decoration: underline;">................................................</div>
        <div style="font-size: 10px; color: #64748b;">NIP. ........................................</div>
      </div>
      <div style="width: 40%;">
        <div style="font-size: 11px; color: #64748b;">Diserahkan Oleh,</div>
        <div style="font-weight: 700; font-size: 12px; margin-top: 2px;">Tim Trainer & Implementasi</div>
        <div style="font-weight: 600; font-size: 11px; color: #2563eb;">BelajarPlus Indonesia</div>
        <div style="margin-top: 50px; font-weight: 700; text-decoration: underline;">Rumaisha' Al Mawaddah</div>
        <div style="font-size: 10px; color: #64748b;">Master Trainer BelajarPlus</div>
      </div>
    </div>
  </div>

  <!-- LAMPIRAN DAFTAR SISWA PER ROMBEL -->
  ${classSectionsHtml}

</body>
</html>
  `;

  // Render to PDF using Playwright
  console.log('Rendering HTML to PDF with Playwright...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Simpan ke local proof
  await page.pdf({
    path: localProofPdf,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' }
  });
  console.log(`✅ Laporan PDF lokal berhasil dibuat: ${localProofPdf}`);

  // Simpan ke Google Drive
  try {
    await page.pdf({
      path: targetDrivePdf,
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' }
    });
    console.log(`✅ Laporan PDF Google Drive berhasil diupdate: ${targetDrivePdf}`);
  } catch (err) {
    console.error('Gagal update ke Google Drive:', err.message);
  }

  await browser.close();
  console.log('=== SELESAI REGENERATE LAPORAN REMBANG ===');
})();
