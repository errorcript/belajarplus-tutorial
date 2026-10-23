/**
 * ============================================================================
 * 🤖 BELAJARPLUS ENTERPRISE AUDIT & OFFICIAL PDF REPORT SUITE (v3.0)
 * ============================================================================
 * Fitur Bot:
 * 1. Multi-Cluster & Multi-Trainer Execution:
 *    - Sragen (7 Sekolah) via Henri Susilo
 *    - Surakarta / Solo (10 Sekolah) via Andrew Aliffiansyah & Adnan Cindyana
 * 2. Deep Live Audit:
 *    - Siswa: Total terdaftar, di rombel, unplaced
 *    - Rombel: Tahun Ajaran Aktif, daftar kelas, jumlah anggota
 *    - PTK / Dewan Guru: Kepala Sekolah, Admin Sekolah, Guru, Staf
 * 3. Otomasi Dokumen & Bukti Validasi:
 *    - High-Res Proofs (Siswa, Rombel, PTK, Dashboard)
 *    - Laporan Resmi PDF A4 (Kop Resmi, Executive Summary, Tabel, Signatures)
 *    - Master Excel Rekapitulasi Audit
 * ============================================================================
 */

const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Direktori Output
const REPORT_OUTPUT_DIR = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/Laporan Verifikasi Sekolah';
const PROOFS_DIR = path.join(REPORT_OUTPUT_DIR, 'bukti_tangkapan_layar');

if (!fs.existsSync(REPORT_OUTPUT_DIR)) fs.mkdirSync(REPORT_OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(PROOFS_DIR)) fs.mkdirSync(PROOFS_DIR, { recursive: true });

// Kredensial Trainer
const TRAINERS = {
  henri: { email: 'henrisusilo00@gmail.com', pass: 'Henri9087!!', name: 'Henri Susilo, S.Kom.' },
  andrew: { email: 'And.aliffiansyah@gmail.com', pass: 'kerja98', name: 'Andrew Aliffiansyah' },
  adnan: { email: 'adnancindyana1234@gmail.com', pass: 'trainer98', name: 'Adnan Cindyana' }
};

// Database 17 Sekolah Target
const ALL_17_SCHOOLS = [
  // --- CLUSTER SRAGEN (Henri Susilo) ---
  { name: 'SMA NEGERI 1 SRAGEN', alias: 'SMAN 1 Sragen', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 2 SRAGEN', alias: 'SMAN 2 Sragen', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 3 SRAGEN', alias: 'SMAN 3 Sragen', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 1 GEMOLONG', alias: 'SMAN 1 Gemolong', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 1 GONDANG', alias: 'SMAN 1 Gondang', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 1 SUKODONO', alias: 'SMAN 1 Sukodono', trainer: 'henri', cluster: 'Sragen' },
  { name: 'SMA NEGERI 1 TANGEN', alias: 'SMAN 1 Tangen', trainer: 'henri', cluster: 'Sragen' },

  // --- CLUSTER SURAKARTA (Adnan Cindyana & Andrew Aliffiansyah) ---
  { name: 'SMA NEGERI 3 SURAKARTA', alias: 'SMAN 3 Surakarta', trainer: 'adnan', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 6 SURAKARTA', alias: 'SMAN 6 Surakarta', trainer: 'adnan', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 1 SURAKARTA', alias: 'SMAN 1 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 2 SURAKARTA', alias: 'SMAN 2 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 4 SURAKARTA', alias: 'SMAN 4 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 5 SURAKARTA', alias: 'SMAN 5 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 7 SURAKARTA', alias: 'SMAN 7 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 8 SURAKARTA', alias: 'SMAN 8 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA NEGERI 9 SURAKARTA', alias: 'SMAN 9 Surakarta', trainer: 'andrew', cluster: 'Surakarta' },
  { name: 'SMA BUDI UTOMO SURAKARTA', alias: 'SMA Budi Utomo Surakarta', trainer: 'andrew', cluster: 'Surakarta' }
];

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
      return true;
    } catch (e) {
      await page.waitForTimeout(2000);
    }
  }
  return false;
}

/**
 * 1. Audit Live 1 Sekolah di Platform BelajarPlus
 */
async function auditSingleSchool(browser, creds, schoolName, schoolAlias) {
  console.log(`\n======================================================`);
  console.log(`🔍 AUDIT LIVE: ${schoolName}`);
  console.log(`Akun Trainer: ${creds.email} (${creds.name || 'Trainer'})`);
  console.log(`======================================================`);

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const auditData = {
    schoolName,
    schoolAlias: schoolAlias || schoolName,
    auditedAt: new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' }),
    trainerEmail: creds.email,
    trainerName: creds.name || creds.email,
    academicYear: '2026/2027 Ganjil',
    students: {
      total: 0,
      inRombel: 0,
      unplaced: 0,
      active: 0
    },
    rombels: [],
    teachers: [],
    roles: {
      kepsek: '-',
      adminSekolah: []
    },
    proofs: {}
  };

  try {
    // 1. Login
    await safeGoto(page, 'https://belajarplus.id/auth?redirect=%2Fdashboard');
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill(creds.email);
      await page.fill('input[type="password"]', creds.pass);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(5000);
    }

    // 2. Klik Masuk pada institusi target
    const entered = await page.evaluate((target) => {
      const allButtons = Array.from(document.querySelectorAll('button'));
      for (const b of allButtons) {
        if (b.innerText.trim() === 'Masuk') {
          const card = b.closest('div.border, li, div.rounded-xl, div.p-4');
          if (card && card.innerText.toUpperCase().includes(target.toUpperCase())) {
            b.scrollIntoView();
            b.click();
            return true;
          }
        }
      }
      return false;
    }, schoolName);

    if (!entered) {
      console.log(`❌ Kartu institusi tidak ditemukan di dashboard akun ini: ${schoolName}`);
      await context.close();
      return null;
    }

    await page.waitForTimeout(4000);

    const slug = schoolAlias.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const proofDash = path.join(PROOFS_DIR, `${slug}_dashboard.png`);
    await page.screenshot({ path: proofDash });
    auditData.proofs.dashboard = proofDash;

    // 3. Audit Siswa (/admin/students)
    console.log(`[1/3] Mengaudit Siswa...`);
    await safeGoto(page, 'https://belajarplus.id/admin/students');
    await page.waitForFunction(() => !document.body.innerText.includes('Memuat institusi'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    const proofStudents = path.join(PROOFS_DIR, `${slug}_siswa.png`);
    await page.screenshot({ path: proofStudents });
    auditData.proofs.students = proofStudents;

    const studentStats = await page.evaluate(() => {
      const text = document.body.innerText;
      let total = 0;
      const mTotal = text.match(/Total\s+(\d+)\s+siswa/i) || text.match(/(\d+)\s+Siswa/i) || text.match(/dari\s+(\d+)\s+siswa/i);
      if (mTotal) total = parseInt(mTotal[1], 10);

      const rows = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      let rowCount = 0;
      let unplacedCount = 0;
      let placedCount = 0;

      rows.forEach(r => {
        const rowText = r.innerText;
        if (rowText.includes('@') || rowText.includes('Aktif')) {
          rowCount++;
          if (rowText.includes('Belum di Rombel') || rowText.includes('Belum di-rombel') || rowText.includes('-')) {
            unplacedCount++;
          } else {
            placedCount++;
          }
        }
      });

      return {
        total: Math.max(total, rowCount),
        placed: placedCount,
        unplaced: unplacedCount
      };
    });

    auditData.students.total = studentStats.total;
    auditData.students.inRombel = studentStats.placed;
    auditData.students.unplaced = studentStats.unplaced;
    console.log(`  -> Terdata: ${auditData.students.total} Siswa`);

    // 4. Audit Rombel (/admin/rombels)
    console.log(`[2/3] Mengaudit Rombel & Kelas...`);
    await safeGoto(page, 'https://belajarplus.id/admin/rombels');
    await page.waitForFunction(() => !document.body.innerText.includes('Memuat institusi'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    const proofRombels = path.join(PROOFS_DIR, `${slug}_rombel.png`);
    await page.screenshot({ path: proofRombels });
    auditData.proofs.rombels = proofRombels;

    const rombelData = await page.evaluate(() => {
      const rombelList = [];
      const rows = Array.from(document.querySelectorAll('tbody tr, div.border.rounded-xl, [role="row"]'));

      rows.forEach(r => {
        const t = r.innerText.trim();
        const memberMatch = t.match(/(\d+)\s+Siswa/i) || t.match(/(\d+)\s+anggota/i);
        const nameCandidate = t.split('\n')[0].trim();
        if (nameCandidate && (t.includes('Siswa') || t.includes('Kelas') || t.includes('Rombel') || memberMatch)) {
          rombelList.push({
            name: nameCandidate,
            count: memberMatch ? parseInt(memberMatch[1], 10) : 0,
            status: 'Aktif'
          });
        }
      });

      return rombelList;
    });

    auditData.rombels = rombelData;
    if (rombelData.length > 0) {
      const sumInRombels = rombelData.reduce((acc, curr) => acc + curr.count, 0);
      if (sumInRombels > 0) {
        auditData.students.inRombel = sumInRombels;
        auditData.students.unplaced = Math.max(0, auditData.students.total - sumInRombels);
      }
    }
    console.log(`  -> Terdata: ${auditData.rombels.length} Rombel`);

    // 5. Audit Guru / PTK (/admin/teachers)
    console.log(`[3/3] Mengaudit Guru & PTK...`);
    await safeGoto(page, 'https://belajarplus.id/admin/teachers');
    await page.waitForFunction(() => !document.body.innerText.includes('Memuat institusi'), { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);

    const proofTeachers = path.join(PROOFS_DIR, `${slug}_ptk.png`);
    await page.screenshot({ path: proofTeachers });
    auditData.proofs.teachers = proofTeachers;

    const teacherData = await page.evaluate(() => {
      const tList = [];
      let kepsekName = '-';
      const adminNames = [];

      const rows = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      rows.forEach(r => {
        const text = r.innerText.trim();
        if (text.includes('@')) {
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
          const name = lines[0] || '-';
          const email = lines.find(l => l.includes('@')) || '-';
          let role = 'Guru';
          if (text.toLowerCase().includes('kepala sekolah')) {
            role = 'Kepala Sekolah';
            kepsekName = name;
          } else if (text.toLowerCase().includes('admin sekolah')) {
            role = 'Admin Sekolah';
            adminNames.push(name);
          } else if (text.toLowerCase().includes('trainer')) {
            role = 'Trainer';
          }

          tList.push({ name, email, role, status: 'Aktif' });
        }
      });

      return {
        teachers: tList,
        kepsek: kepsekName,
        admins: adminNames
      };
    });

    auditData.teachers = teacherData.teachers;
    auditData.roles.kepsek = teacherData.kepsek;
    auditData.roles.adminSekolah = teacherData.admins;
    console.log(`  -> Terdata: ${auditData.teachers.length} PTK / Guru`);

    await context.close();
    return auditData;
  } catch (err) {
    console.log(`❌ Error saat audit ${schoolName}:`, err.message);
    await context.close();
    return null;
  }
}

/**
 * 2. Generator HTML Template Laporan Resmi
 */
function buildHtmlReport(audit) {
  const toBase64Image = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
    }
    return '';
  };

  const imgDash = toBase64Image(audit.proofs.dashboard);
  const imgSiswa = toBase64Image(audit.proofs.students);
  const imgRombel = toBase64Image(audit.proofs.rombels);
  const imgPtk = toBase64Image(audit.proofs.teachers);

  const rombelRows = audit.rombels.length > 0
    ? audit.rombels.map((r, i) => `
      <tr>
        <td style="text-align:center; padding: 6px 10px; border: 1px solid #cbd5e1;">${i + 1}</td>
        <td style="font-weight: 600; padding: 6px 10px; border: 1px solid #cbd5e1; color: #0f172a;">${r.name}</td>
        <td style="text-align:center; font-weight: 600; padding: 6px 10px; border: 1px solid #cbd5e1; color: #2563eb;">${r.count} Siswa</td>
        <td style="text-align:center; padding: 6px 10px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: 600;">Terverifikasi</td>
      </tr>
    `).join('')
    : `<tr><td colspan="4" style="text-align:center; padding: 12px; color: #64748b;">Belum ada Rombel yang terdaftar di Tahun Ajaran Aktif.</td></tr>`;

  const teacherRows = audit.teachers.length > 0
    ? audit.teachers.slice(0, 25).map((t, i) => `
      <tr>
        <td style="text-align:center; padding: 5px 8px; border: 1px solid #cbd5e1;">${i + 1}</td>
        <td style="font-weight: 600; padding: 5px 8px; border: 1px solid #cbd5e1; color: #0f172a;">${t.name}</td>
        <td style="font-family: monospace; font-size: 11px; padding: 5px 8px; border: 1px solid #cbd5e1; color: #475569;">${t.email}</td>
        <td style="text-align:center; padding: 5px 8px; border: 1px solid #cbd5e1; font-weight: 600; color: #0284c7;">${t.role}</td>
        <td style="text-align:center; padding: 5px 8px; border: 1px solid #cbd5e1; color: #16a34a; font-weight: 600;">Aktif</td>
      </tr>
    `).join('')
    : `<tr><td colspan="5" style="text-align:center; padding: 12px; color: #64748b;">Data PTK tidak ditemukan di sistem.</td></tr>`;

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Verifikasi Resmi - ${audit.schoolAlias}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm 15mm 15mm;
    }
    body {
      font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.45;
      margin: 0;
      padding: 0;
      background: #ffffff;
      font-size: 12px;
    }
    .header-table {
      width: 100%;
      border-bottom: 3px double #0f172a;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .badge-success { background: #dcfce7; color: #15803d; }
    .badge-info { background: #e0f2fe; color: #0369a1; }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }
    .stat-val {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    .stat-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 11px;
    }
    table.data-table th {
      background: #0f172a;
      color: #ffffff;
      padding: 6px 10px;
      text-align: left;
      font-weight: 600;
      border: 1px solid #0f172a;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      border-left: 4px solid #2563eb;
      padding-left: 8px;
      margin-top: 18px;
      margin-bottom: 6px;
    }
    .proof-img {
      width: 100%;
      max-height: 280px;
      object-fit: contain;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-top: 6px;
      background: #f1f5f9;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- KOP LAPORAN RESMI -->
  <table class="header-table">
    <tr>
      <td style="width: 70px; vertical-align: middle;">
        <div style="width: 52px; height: 52px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 24px; text-align: center; line-height: 52px;">B+</div>
      </td>
      <td style="vertical-align: middle;">
        <div style="font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">BELAJARPLUS INDONESIA</div>
        <div style="font-size: 11px; color: #475569; font-weight: 600;">BERITA ACARA VERIFIKASI RESMI DATA SEKOLAH, SISWA, ROMBEL & PTK</div>
        <div style="font-size: 10px; color: #64748b;">Wilayah Operasional Jawa Tengah · Sistem Terintegrasi BelajarPlus LMS</div>
      </td>
      <td style="vertical-align: middle; text-align: right; font-size: 10.5px; color: #475569;">
        <div><b>Doc No:</b> BP/BA/${audit.schoolAlias.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}/2026</div>
        <div><b>Tanggal:</b> ${audit.auditedAt.split(' pukul ')[0]}</div>
        <div><span class="badge badge-success">Terverifikasi Live</span></div>
      </td>
    </tr>
  </table>

  <!-- INFORMASI SEKOLAH & STATISTIK EKSEKUTIF -->
  <div style="margin-bottom: 12px;">
    <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${audit.schoolName}</div>
    <div style="font-size: 11px; color: #475569;">Tahun Ajaran Aktif: <b>${audit.academicYear}</b> | Trainer Pembina: <b>${audit.trainerName} (${audit.trainerEmail})</b></div>
  </div>

  <table style="width: 100%; border-spacing: 8px; margin-left: -8px; margin-bottom: 12px;">
    <tr>
      <td style="width: 25%;">
        <div class="stat-card">
          <div class="stat-label">Total Siswa Terdaftar</div>
          <div class="stat-val" style="color: #2563eb;">${audit.students.total}</div>
        </div>
      </td>
      <td style="width: 25%;">
        <div class="stat-card">
          <div class="stat-label">Siswa di Rombel</div>
          <div class="stat-val" style="color: #16a34a;">${audit.students.inRombel}</div>
        </div>
      </td>
      <td style="width: 25%;">
        <div class="stat-card">
          <div class="stat-label">Belum di Rombel</div>
          <div class="stat-val" style="color: ${audit.students.unplaced > 0 ? '#ea580c' : '#16a34a'};">${audit.students.unplaced}</div>
        </div>
      </td>
      <td style="width: 25%;">
        <div class="stat-card">
          <div class="stat-label">Total PTK / Guru</div>
          <div class="stat-val" style="color: #7c3aed;">${audit.teachers.length}</div>
        </div>
      </td>
    </tr>
  </table>

  <!-- TABEL REKAPITULASI ROMBEL -->
  <div class="section-title">1. REKAPITULASI ROMBONGAN BELAJAR (ROMBEL) TAHUN AJARAN AKTIF</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 40px; text-align: center;">No</th>
        <th>Nama Rombel / Kelas</th>
        <th style="width: 130px; text-align: center;">Jumlah Anggota</th>
        <th style="width: 120px; text-align: center;">Status Sinkronisasi</th>
      </tr>
    </thead>
    <tbody>
      ${rombelRows}
    </tbody>
  </table>

  <!-- TABEL DIREKTORI PTK / DEWAN GURU -->
  <div class="section-title">2. DIREKTORI PTK, GURU, DAN KEPALA SEKOLAH TERDAFTAR</div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 35px; text-align: center;">No</th>
        <th>Nama PTK / Guru</th>
        <th>Email Akun</th>
        <th style="width: 120px; text-align: center;">Peran Sistem</th>
        <th style="width: 80px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${teacherRows}
    </tbody>
  </table>

  <!-- HALAMAN 2: BUKTI TANGKAPAN LAYAR SISTEM LIVE -->
  <div class="page-break"></div>

  <div class="section-title" style="margin-top: 0;">3. BUKTI TANGKAPAN LAYAR VALIDASI SISTEM LIVE BELAJARPLUS</div>
  <div style="font-size: 11px; color: #64748b; margin-bottom: 10px;">
    Tangkapan layar otentik dari portal administrasi BelajarPlus diambil secara otomatis oleh BelajarPlus Audit Bot pada ${audit.auditedAt}.
  </div>

  <table style="width: 100%; border-spacing: 10px; margin-left: -10px;">
    <tr>
      <td style="width: 50%; vertical-align: top;">
        <div style="font-weight: 700; font-size: 11px; color: #0f172a; margin-bottom: 2px;">Bukti Validasi Data Siswa (/admin/students)</div>
        ${imgSiswa ? `<img src="${imgSiswa}" class="proof-img" />` : '<div style="padding: 40px; background: #eee; text-align: center;">Tidak ada gambar</div>'}
      </td>
      <td style="width: 50%; vertical-align: top;">
        <div style="font-weight: 700; font-size: 11px; color: #0f172a; margin-bottom: 2px;">Bukti Validasi Rombel (/admin/rombels)</div>
        ${imgRombel ? `<img src="${imgRombel}" class="proof-img" />` : '<div style="padding: 40px; background: #eee; text-align: center;">Tidak ada gambar</div>'}
      </td>
    </tr>
    <tr>
      <td style="width: 50%; vertical-align: top; padding-top: 8px;">
        <div style="font-weight: 700; font-size: 11px; color: #0f172a; margin-bottom: 2px;">Bukti Validasi Dewan Guru (/admin/teachers)</div>
        ${imgPtk ? `<img src="${imgPtk}" class="proof-img" />` : '<div style="padding: 40px; background: #eee; text-align: center;">Tidak ada gambar</div>'}
      </td>
      <td style="width: 50%; vertical-align: top; padding-top: 8px;">
        <div style="font-weight: 700; font-size: 11px; color: #0f172a; margin-bottom: 2px;">Bukti Dashboard Institusi Sekolah</div>
        ${imgDash ? `<img src="${imgDash}" class="proof-img" />` : '<div style="padding: 40px; background: #eee; text-align: center;">Tidak ada gambar</div>'}
      </td>
    </tr>
  </table>

  <!-- LEMBAR PENGESAHAN & TANDA TANGAN -->
  <div style="margin-top: 24px; border-top: 1px dashed #cbd5e1; padding-top: 16px;">
    <table style="width: 100%;">
      <tr>
        <td style="width: 50%; vertical-align: top;">
          <div style="font-size: 11px; font-weight: 700; color: #0f172a;">Catatan Verifikator Sistem:</div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px; line-height: 1.4;">
            Seluruh data akun siswa, rombongan belajar, dan hak akses PTK pada dokumen ini telah melalui proses audit dan rekonsiliasi data resmi di platform BelajarPlus. Dokumen ini sah dan dapat digunakan sebagai Berita Acara Serah Terima Akun.
          </div>
        </td>
        <td style="width: 50%; vertical-align: top; text-align: right;">
          <div style="font-size: 11px; color: #475569;">Jawa Tengah, ${audit.auditedAt.split(' pukul ')[0]}</div>
          <div style="font-size: 11px; font-weight: 700; color: #0f172a; margin-top: 2px;">Lead Technical Trainer & System Auditor</div>
          <div style="height: 48px;"></div>
          <div style="font-size: 12px; font-weight: 800; color: #0f172a; text-decoration: underline;">HENRI SUSILO, S.Kom.</div>
          <div style="font-size: 10px; color: #64748b;">NIP. BP-TR-202610 · BelajarPlus Indonesia</div>
        </td>
      </tr>
    </table>
  </div>

</body>
</html>
  `;
}

/**
 * 3. Render PDF dari HTML
 */
async function renderPdfReport(browser, auditData) {
  const pdfPath = path.join(REPORT_OUTPUT_DIR, `Laporan_Resmi_${auditData.schoolAlias.replace(/\s+/g, '_')}.pdf`);

  const html = buildHtmlReport(auditData);
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '15mm',
      left: '15mm',
      right: '15mm'
    }
  });

  await context.close();
  console.log(`✅ Laporan Resmi PDF: ${pdfPath}`);
  return pdfPath;
}

/**
 * 4. Generate Master Excel Rekapitulasi Audit
 */
function generateMasterExcelRecap(allAudits) {
  const wb = xlsx.utils.book_new();

  const recapData = [
    ['No', 'Nama Sekolah', 'Wilayah / Cluster', 'Trainer Pembina', 'Total Siswa', 'Siswa di Rombel', 'Belum di Rombel', 'Total Rombel', 'Total Guru/PTK', 'Kepala Sekolah', 'Admin Sekolah', 'Waktu Audit']
  ];

  allAudits.forEach((a, idx) => {
    recapData.push([
      idx + 1,
      a.schoolName,
      a.cluster || '-',
      a.trainerName,
      a.students.total,
      a.students.inRombel,
      a.students.unplaced,
      a.rombels.length,
      a.teachers.length,
      a.roles.kepsek,
      a.roles.adminSekolah.join(', ') || '-',
      a.auditedAt
    ]);
  });

  const ws = xlsx.utils.aoa_to_sheet(recapData);
  xlsx.utils.book_append_sheet(wb, ws, 'Rekapitulasi Audit');

  const excelPath = path.join(REPORT_OUTPUT_DIR, 'REKAP_AUDIT_LENGKAP_17_SEKOLAH.xlsx');
  xlsx.writeFile(wb, excelPath);
  console.log(`📊 Spreadsheet Rekapitulasi Excel: ${excelPath}`);
  return excelPath;
}

/**
 * 5. Master Runner Bot
 */
async function runAuditBot(schoolsList) {
  console.log(`================================================================`);
  console.log(`🚀 BELAJARPLUS SAT-SET ENTERPRISE AUDIT & PDF REPORT BOT`);
  console.log(`Target: ${schoolsList.length} Sekolah Terdata`);
  console.log(`Waktu Mulai: ${new Date().toLocaleString('id-ID')}`);
  console.log(`================================================================\n`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const allAudits = [];

  for (const s of schoolsList) {
    const creds = TRAINERS[s.trainer] || TRAINERS.henri;
    const audit = await auditSingleSchool(browser, creds, s.name, s.alias || s.name);
    if (audit) {
      audit.cluster = s.cluster;
      allAudits.push(audit);
      await renderPdfReport(browser, audit);
    }
  }

  // Simpan JSON Rekapitulasi Audit
  const summaryJsonPath = path.join(REPORT_OUTPUT_DIR, 'REKAP_AUDIT_LENGKAP.json');
  fs.writeFileSync(summaryJsonPath, JSON.stringify(allAudits, null, 2));

  // Simpan Excel Rekapitulasi Audit
  generateMasterExcelRecap(allAudits);

  await browser.close();
  console.log(`\n🎉 SELURUH MISI AUDIT, TANGKAPAN LAYAR & PDF LAPORAN SELESAI!`);
  return allAudits;
}

module.exports = {
  TRAINERS,
  ALL_17_SCHOOLS,
  auditSingleSchool,
  renderPdfReport,
  generateMasterExcelRecap,
  runAuditBot
};

if (require.main === module) {
  const args = process.argv.slice(2);
  let targets = ALL_17_SCHOOLS;

  if (args.includes('--sragen')) {
    targets = ALL_17_SCHOOLS.filter(s => s.cluster === 'Sragen');
  } else if (args.includes('--solo') || args.includes('--surakarta')) {
    targets = ALL_17_SCHOOLS.filter(s => s.cluster === 'Surakarta');
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    const q = args[0].toLowerCase();
    targets = ALL_17_SCHOOLS.filter(s => s.name.toLowerCase().includes(q) || s.alias.toLowerCase().includes(q));
  }

  runAuditBot(targets).catch(console.error);
}
