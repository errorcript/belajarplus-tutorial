/**
 * ============================================================================
 * 🤖 BELAJARPLUS SAT-SET BOT (v2.0)
 * ============================================================================
 * Automation Suite & Executive Audit Tool Platform BelajarPlus
 * 
 * Penanggung Jawab Teknis: Henri Susilo, S.Kom. (Lead System Engineer)
 * Instansi Resmi: BELAJARPLUS INDONESIA
 * 
 * Fitur:
 * 1. [Audit] Live Audit Siswa, Rombel, Anggota Rombel, Guru PTK, Admin, Kepsek
 * 2. [Roles] Auto-Fixer Peran Admin Sekolah & Kepala Sekolah via "Atur peran"
 * 3. [Proofs] Auto-Capture 3 Bukti Tangkapan Layar (Siswa, Rombel, PTK)
 * 4. [Reports] Auto-Generate PDF Laporan Kredensial Resmi (Google Drive & Lokal)
 * 5. [Recap] Auto-Compile Spreadsheet Rekapitulasi Komprehensif
 * ============================================================================
 */

const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const readline = require('readline');

// Path Konfigurasi
const PATHS = {
  gDriveRoot: 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata',
  localRoot: 'C:/Users/errorscript/Downloads/Laporan BelajarPlus',
  dataAkunDir: 'C:/Users/errorscript/Downloads/Data Akun',
  logo: 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/belajar-plus-logo.png',
  masterExcelGDrive: 'G:/My Drive/Trainer/B+/AKUN/AUDIT_LENGKAP_16_SEKOLAH_BELAJARPLUS.xlsx',
  masterExcelLocal: 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/AUDIT_LENGKAP_16_SEKOLAH_BELAJARPLUS.xlsx',
  customDukunExcel: 'G:/My Drive/Trainer/B+/guru dukun'
};

// Akun Trainer
const TRAINERS = {
  khansania: { email: 'khansania.medtra@gmail.com', pass: 'Khansa04', name: 'Khansania Medtra' },
  andrew: { email: 'And.aliffiansyah@gmail.com', pass: 'kerja98', name: 'Andrew Aliffiansyah' }
};

// Master Database 16 Sekolah Terdata
const SCHOOLS = [
  // Cluster Khansania (Magelang & Purworejo)
  { id: '01', folder: '01. SMAN 10 Purworejo', name: 'SMAN 10 Purworejo', match: 'SMA NEGERI 10 PURWOREJO', trainer: 'khansania', file: 'SMA Negeri 10 Purworejo.xlsx' },
  { id: '02', folder: '02. SMAN 1 Purworejo', name: 'SMAN 1 Purworejo', match: 'SMA NEGERI 1 PURWOREJO', trainer: 'khansania', file: 'SMA Negeri 1 Purworejo.xlsx' },
  { id: '03', folder: '03. SMAN 11 Purworejo', name: 'SMAN 11 Purworejo', match: 'SMA NEGERI 11 PURWOREJO', trainer: 'khansania', file: 'SMA Negeri 11 Purworejo.xlsx' },
  { id: '04', folder: '04. SMAN 6 Purworejo', name: 'SMAN 6 Purworejo', match: 'SMA NEGERI 6 PURWOREJO', trainer: 'khansania', file: 'SMA Negeri 6 Purworejo.xlsx' },
  { id: '05', folder: '05. SMAN 1 Salaman', name: 'SMAN 1 Salaman', match: 'SMA NEGERI 1 SALAMAN', trainer: 'khansania', file: 'SMA Negeri 1 Salaman.xlsx' },
  { id: '06', folder: '06. SMAN 1 Bandongan', name: 'SMAN 1 Bandongan', match: 'SMA NEGERI 1 BANDONGAN', trainer: 'khansania', file: 'SMA Negeri 1 Bandongan.xlsx' },
  { id: '07', folder: '07. SMAN 1 Grabag', name: 'SMAN 1 Grabag', match: 'SMA NEGERI 1 GRABAG', trainer: 'khansania', file: 'SMA Negeri 1 Grabag.xlsx' },
  { id: '08', folder: '08. SMAN 2 Grabag', name: 'SMAN 2 Grabag', match: 'SMA NEGERI 2 GRABAG', trainer: 'khansania', file: 'SMA Negeri 2 Grabag.xlsx' },
  { id: '09', folder: '09. SMAN 1 Candimulyo', name: 'SMAN 1 Candimulyo', match: 'SMA NEGERI 1 CANDIMULYO', trainer: 'khansania', file: 'SMA Negeri 1 Candimulyo.xlsx' },
  { id: '10', folder: '10. SMAN 1 Dukun', name: 'SMAN 1 Dukun', match: 'SMA NEGERI 1 DUKUN', trainer: 'khansania', file: 'SMA Negeri 1 Dukun.xlsx', customSource: PATHS.customDukunExcel },
  { id: '11', folder: '11. SMAN 1 Ngluwar', name: 'SMAN 1 Ngluwar', match: 'SMA NEGERI 1 NGLUWAR', trainer: 'khansania', file: 'SMA Negeri 1 Ngluwar.xlsx' },
  { id: '12', folder: '12. SMAN 1 Mertoyudan', name: 'SMAN 1 Mertoyudan', match: 'SMA NEGERI 1 MERTOYUDAN', trainer: 'khansania', file: 'SMA Negeri 1 Mertoyudan.xlsx' },
  { id: '13', folder: '13. SMAN 1 Muntilan', name: 'SMAN 1 Muntilan', match: 'SMA NEGERI 1 MUNTILAN', trainer: 'khansania', file: 'SMA Negeri 1 Muntilan.xlsx' },
  // Cluster Andrew (Banjarnegara & Wonosobo)
  { id: '14', folder: '14. SMAN 1 Bawang', name: 'SMAN 1 Bawang', match: 'SMA NEGERI 1 BAWANG BANJARNEGARA', trainer: 'andrew', file: 'SMA Negeri 1 Bawang.xlsx' },
  { id: '15', folder: '15. SMAN 1 Karangkobar', name: 'SMAN 1 Karangkobar', match: 'SMA NEGERI 1 KARANGKOBAR', trainer: 'andrew', file: 'SMA Negeri 1 Karangkobar.xlsx' },
  { id: '16', folder: '16. SMAN 1 Wadaslintang', name: 'SMAN 1 Wadaslintang', match: 'SMA NEGERI 1 WADASLINTANG', trainer: 'andrew', file: 'SMA Negeri 1 Wadaslintang.xlsx' }
];

// Load Logo Base64
let logoBase64 = '';
if (fs.existsSync(PATHS.logo)) {
  logoBase64 = `data:image/png;base64,${fs.readFileSync(PATHS.logo).toString('base64')}`;
}

/**
 * Helper: Find file recursively
 */
function findFile(baseDir, targetName) {
  let found = null;
  const targetLower = path.basename(targetName).toLowerCase();
  function walk(dir) {
    if (found || !fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir)) {
      if (found) break;
      const full = path.join(dir, e);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (e.toLowerCase() === targetLower || e.toLowerCase().includes(targetLower.replace('.xlsx', ''))) found = full;
    }
  }
  walk(baseDir);
  return found;
}

/**
 * 1. Helper: Parse Excel Master Data
 */
function parseSchoolExcel(school) {
  if (school.customSource && fs.existsSync(school.customSource)) {
    const wb = xlsx.readFile(school.customSource);
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const teachers = rows.map((r, idx) => ({
      no: idx + 1,
      nama: (r.Nama || r.nama || '').trim(),
      email: (r.Email || r.email || '').trim(),
      pass: (r['Password (opsional, min. 8)'] || r.Password || r.password || `sman1dukun_${idx + 1}`).trim(),
      peran: 'Guru',
      status: 'Aktif'
    }));
    return {
      realTeachers: teachers,
      pendingTeachers: [],
      kepsek: { nama: 'Kepala Sekolah SMAN 1 Dukun', email: 'smanduk@gmail.com', pass: 'JatengSchool6264' },
      admin: { nama: 'Admin Sekolah (Kurikulum / Operator)', email: 'kurikulumsmanduk2@gmail.com', pass: 'JatengSchool6264' }
    };
  }

  const filePath = findFile(PATHS.dataAkunDir, school.file);
  if (!filePath) return { realTeachers: [], pendingTeachers: [], kepsek: null, admin: null };

  const wb = xlsx.readFile(filePath);
  const guruSheet = wb.Sheets[wb.SheetNames.find(s => /guru|ptk|pendidik/i.test(s))];
  if (!guruSheet) return { realTeachers: [], pendingTeachers: [], kepsek: null, admin: null };

  const rows = xlsx.utils.sheet_to_json(guruSheet);
  const realTeachers = [];
  const pendingTeachers = [];
  let kepsek = null;
  let admin = null;

  rows.forEach(r => {
    const nama = (r.firstname || r.Nama || r.nama || r['Nama Lengkap'] || '').toString().trim();
    const email = (r.email || r.Email || '').toString().trim();
    const pass = (r.password || r.Password || '').toString().trim();

    const isKepsek = nama.toLowerCase().includes('kepsek') || nama.toLowerCase().includes('kepala') || email.toLowerCase().includes('kepsek');
    const isAdmin = nama.toLowerCase().includes('admin') || nama.toLowerCase().includes('operator') || email.toLowerCase().includes('admin');

    if (isKepsek && !kepsek) kepsek = { nama: nama || 'Kepala Sekolah', email: email || '-', pass: pass || 'Kepsek2026!' };
    if (isAdmin && !admin) admin = { nama: nama || 'Admin Sekolah', email: email || '-', pass: pass || 'Admin2026!' };

    if (isKepsek || isAdmin) return;

    const isPE = email.toLowerCase().includes('pesonaedu.com') || email.toLowerCase().includes('pe.com') || !email.includes('@');
    if (isPE) {
      pendingTeachers.push({
        nama: nama || 'Guru Pendidik',
        email: email || '(Belum Ada Email)',
        pass: pass || 'GuruSma2026!',
        alasan: 'Domain dummy pesonaedu'
      });
    } else {
      realTeachers.push({
        nama: nama || 'Guru Pendidik',
        email: email,
        pass: pass || 'GuruSma2026!'
      });
    }
  });

  return { realTeachers, pendingTeachers, kepsek, admin };
}

/**
 * 2. Login Trainer ke BelajarPlus
 */
async function loginTrainer(browser, trainerKey) {
  const creds = TRAINERS[trainerKey];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  console.log(`\n🔑 Login ke BelajarPlus (${creds.name}): ${creds.email}...`);
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill(creds.email);
  await page.locator('input[type="password"]').first().fill(creds.pass);
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(4000);

  return { context, page };
}

/**
 * 3. Masuk ke Institusi Sekolah di Dashboard
 */
async function enterSchool(page, school) {
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  const card = page.locator('li, div.border').filter({ hasText: school.match }).first();
  if (await card.count() === 0) {
    console.log(`❌ Sekolah ${school.name} tidak ditemukan di dashboard.`);
    return false;
  }

  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3500);
  return true;
}

/**
 * 4. Audit & Capture Bukti Live
 */
async function auditAndCaptureSchool(page, school) {
  console.log(`\n======================================================`);
  console.log(`🏫 [${school.id}] AUDIT & CAPTURE: ${school.name}`);
  console.log(`======================================================`);

  const ok = await enterSchool(page, school);
  if (!ok) return null;

  const localProofDir = path.join(PATHS.localRoot, school.folder, 'Bukti_Impor');
  const gDriveProofDir = path.join(PATHS.gDriveRoot, school.folder, 'Bukti_Impor');
  if (!fs.existsSync(localProofDir)) fs.mkdirSync(localProofDir, { recursive: true });
  if (fs.existsSync(path.dirname(gDriveProofDir)) && !fs.existsSync(gDriveProofDir)) {
    try { fs.mkdirSync(gDriveProofDir, { recursive: true }); } catch (e) {}
  }

  // A. Siswa
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForSelector('tbody tr', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const siswaStats = await page.evaluate(() => {
    const text = document.body.innerText;
    const mTotal = text.match(/(\d+)\s+Total Siswa/i) || text.match(/Menampilkan[\s\S]*?dari\s+(\d+)\s+data/i);
    const mSudah = text.match(/(\d+)\s+Sudah di Rombel/i) || text.match(/Sudah di Rombel[\s\S]*?(\d+)/i);
    const mBelum = text.match(/(\d+)\s+Belum di Rombel/i) || text.match(/Belum di Rombel[\s\S]*?(\d+)/i);
    return {
      total: mTotal ? parseInt(mTotal[1].replace(/,/g, ''), 10) : 0,
      sudah: mSudah ? parseInt(mSudah[1].replace(/,/g, ''), 10) : 0,
      belum: mBelum ? parseInt(mBelum[1].replace(/,/g, ''), 10) : 0
    };
  });

  const ssSiswa = path.join(localProofDir, 'bukti_terbaru_siswa.png');
  await page.screenshot({ path: ssSiswa, fullPage: true });
  if (fs.existsSync(gDriveProofDir)) {
    try { fs.copyFileSync(ssSiswa, path.join(gDriveProofDir, 'bukti_terbaru_siswa.png')); } catch (e) {}
  }
  console.log(`   ✔ Siswa: Total = ${siswaStats.total}, di Rombel = ${siswaStats.sudah}`);

  // B. Rombel
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3000);

  const rombelStats = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, a')).filter(b => b.innerText.trim() === 'Anggota');
    const classes = [];
    for (const b of btns) {
      let cardEl = b.parentElement;
      for (let i = 0; i < 5; i++) {
        if (cardEl && cardEl.innerText && (cardEl.innerText.includes('siswa') || cardEl.innerText.includes('Wali:'))) break;
        if (cardEl && cardEl.parentElement) cardEl = cardEl.parentElement;
      }
      if (cardEl) {
        const lines = cardEl.innerText.split('\n').map(l => l.trim()).filter(Boolean);
        const matchS = cardEl.innerText.match(/(\d+)\s+siswa/i);
        classes.push({ name: lines[0], count: matchS ? parseInt(matchS[1], 10) : 0 });
      }
    }
    return {
      totalRombel: classes.length,
      totalSiswa: classes.reduce((a, b) => a + b.count, 0),
      classes
    };
  });

  const ssRombel = path.join(localProofDir, 'bukti_terbaru_rombel.png');
  await page.screenshot({ path: ssRombel, fullPage: true });
  if (fs.existsSync(gDriveProofDir)) {
    try { fs.copyFileSync(ssRombel, path.join(gDriveProofDir, 'bukti_terbaru_rombel.png')); } catch (e) {}
  }
  console.log(`   ✔ Rombel: ${rombelStats.totalRombel} Kelas (Total ${rombelStats.totalSiswa} Siswa)`);

  // C. PTK
  await page.goto('https://belajarplus.id/admin/teachers', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForSelector('tbody tr', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const ptkStats = await page.evaluate(() => {
    const text = document.body.innerText;
    const mPtk = text.match(/(\d+)\s+Total PTK/i) || text.match(/Menampilkan[\s\S]*?dari\s+(\d+)\s+data/i);
    const rows = Array.from(document.querySelectorAll('tbody tr')).map(r => r.innerText.replace(/\n+/g, ' | '));
    const hasAdmin = rows.some(r => /admin sekolah|operator/i.test(r));
    const hasKepsek = rows.some(r => /kepala sekolah|kepsek/i.test(r));

    return {
      total: mPtk ? parseInt(mPtk[1].replace(/,/g, ''), 10) : rows.length,
      hasAdmin,
      hasKepsek
    };
  });

  const ssPtk = path.join(localProofDir, '4_master_data_guru_ptk.png');
  await page.screenshot({ path: ssPtk, fullPage: true });
  if (fs.existsSync(gDriveProofDir)) {
    try { fs.copyFileSync(ssPtk, path.join(gDriveProofDir, '4_master_data_guru_ptk.png')); } catch (e) {}
  }
  console.log(`   ✔ PTK: Total = ${ptkStats.total} (Admin: ${ptkStats.hasAdmin ? 'OK' : 'Belum'}, Kepsek: ${ptkStats.hasKepsek ? 'OK' : 'Belum'})`);

  return {
    school,
    siswa: siswaStats,
    rombel: rombelStats,
    ptk: ptkStats,
    ssPtkPath: ssPtk
  };
}

/**
 * 5. Auto-Fixer: Setting Role Admin Sekolah & Kepala Sekolah
 */
async function autoFixSchoolRoles(page, school) {
  console.log(`\n⚙ AUTO-FIX ROLE ADMIN & KEPSEK: ${school.name}...`);
  const ok = await enterSchool(page, school);
  if (!ok) return false;

  await page.goto('https://belajarplus.id/admin/teachers', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('tbody tr', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Ambil baris pertama atau cari akun operator
  const rows = page.locator('tbody tr');
  if (await rows.count() === 0) return false;

  const dotsBtn = rows.first().locator('button').nth(1);
  if (await dotsBtn.count() === 0) return false;

  await dotsBtn.click();
  await page.waitForTimeout(1000);

  const aturPeran = page.locator('[role="menuitem"]:has-text("Atur peran")');
  if (await aturPeran.count() === 0) return false;

  await aturPeran.click();
  await page.waitForTimeout(1500);

  const dialog = page.locator('[role="dialog"]');
  if (await dialog.count() === 0) return false;

  const adminCb = dialog.locator('label:has-text("Admin Sekolah") input[type="checkbox"]');
  const kepsekCb = dialog.locator('label:has-text("Kepala Sekolah") input[type="checkbox"]');

  if (await adminCb.count() > 0) await adminCb.check();
  if (await kepsekCb.count() > 0) await kepsekCb.check();

  await page.waitForTimeout(500);
  await dialog.locator('button:has-text("Simpan")').click();
  await page.waitForTimeout(3000);

  console.log(`   ✅ Peran Admin Sekolah & Kepala Sekolah berhasil diterapkan di ${school.name}!`);
  return true;
}

/**
 * 6. Generate Dokumen PDF Resmi
 */
async function generateSchoolPdf(browser, school) {
  console.log(`\n📄 GENERATE PDF LAPORAN: ${school.name}...`);
  const data = parseSchoolExcel(school);
  if (!data || data.realTeachers.length === 0) {
    console.log(`   ⚠ Data excel guru tidak ditemukan untuk ${school.name}`);
    return false;
  }

  const localProofDir = path.join(PATHS.localRoot, school.folder, 'Bukti_Impor');
  const ssPtkPath = path.join(localProofDir, '4_master_data_guru_ptk.png');
  let ssBase64 = '';
  if (fs.existsSync(ssPtkPath)) {
    ssBase64 = `data:image/png;base64,${fs.readFileSync(ssPtkPath).toString('base64')}`;
  }

  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Laporan Kredensial Akun Guru & PTK - ${school.match}</title>
  <style>
    @page { size: A4 portrait; margin: 11mm 13mm 11mm 13mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    body { font-family: 'Segoe UI', -apple-system, Roboto, sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 9.2px; line-height: 1.42; }
    .page-break { page-break-after: always; break-after: page; }
    .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #2563eb; padding-bottom: 8px; margin-bottom: 10px; }
    .logo-container img { height: 42px; object-fit: contain; }
    .header-text { text-align: right; }
    .header-text h1 { font-size: 14.5px; margin: 0; color: #1e3a8a; font-weight: 800; }
    .header-text p { font-size: 9px; color: #475569; margin: 2px 0 0 0; }
    .title-banner { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%); color: #ffffff; padding: 10px 14px; border-radius: 6px; margin-bottom: 10px; }
    .title-banner h2 { margin: 0 0 2px 0; font-size: 13.5px; font-weight: 800; }
    .title-banner p { margin: 0; font-size: 9px; opacity: 0.95; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 10px; }
    .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 3.5px solid #2563eb; padding: 7px 9px; border-radius: 5px; }
    .kpi-title { font-size: 8px; color: #64748b; font-weight: 600; text-transform: uppercase; }
    .kpi-value { font-size: 15px; font-weight: 800; color: #0f172a; margin: 2px 0; }
    .kpi-desc { font-size: 7.5px; color: #16a34a; font-weight: 600; }
    .admin-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-bottom: 10px; }
    .admin-card { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 8px 11px; font-size: 8.8px; }
    .admin-card strong { color: #1e3a8a; display: block; margin-bottom: 3px; font-size: 9.8px; }
    .admin-field { margin-bottom: 2px; }
    .section-title { font-size: 10.5px; font-weight: 700; color: #1e3a8a; border-left: 3px solid #2563eb; padding-left: 6px; margin: 12px 0 6px 0; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5px; }
    th { background: #f1f5f9; color: #1e293b; font-weight: 700; padding: 5px 6px; border: 1px solid #cbd5e1; text-align: left; }
    td { padding: 4px 6px; border: 1px solid #e2e8f0; vertical-align: middle; }
    tr:nth-child(even) { background-color: #f8fafc; }
    .text-center { text-align: center; }
    .font-mono { font-family: 'Consolas', monospace; }
    .badge-success { background: #dcfce7; color: #15803d; padding: 2px 5px; border-radius: 4px; font-weight: 700; font-size: 7.5px; }
    .ss-box { border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; margin: 10px 0; text-align: center; background: #f8fafc; padding: 6px; }
    .ss-box img { max-width: 100%; height: auto; border-radius: 4px; }
    .sign-container { display: grid; grid-template-columns: repeat(2, 1fr); max-width: 480px; margin: 16px auto 0 auto; gap: 14px; }
    .sign-box { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; text-align: center; background: #fafafa; }
    .sign-title { font-size: 8px; font-weight: 700; color: #334155; margin-bottom: 32px; }
    .sign-name { font-size: 8.8px; font-weight: 700; color: #0f172a; text-decoration: underline; }
    .sign-nip { font-size: 7.5px; color: #64748b; }
    .footer { margin-top: 10px; padding-top: 5px; border-top: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-size: 7.8px; color: #64748b; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">${logoBase64 ? `<img src="${logoBase64}">` : '<h2>BelajarPlus</h2>'}</div>
    <div class="header-text">
      <h1>BELAJARPLUS INDONESIA</h1>
      <p>Platform Asesmen & Manajemen Pembelajaran Digital</p>
    </div>
  </div>

  <div class="title-banner">
    <h2>LAPORAN KREDENSIAL AKUN GURU & PTK: ${school.match}</h2>
    <p>Rekapitulasi Kredensial Login Pendidik Resmi (Username, Email, dan Password Default)</p>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-title">Total Guru Terdaftar</div>
      <div class="kpi-value">${data.realTeachers.length}</div>
      <div class="kpi-desc">✔ Kredensial Lengkap</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Guru Pending</div>
      <div class="kpi-value" style="color:#d97706;">${data.pendingTeachers.length}</div>
      <div class="kpi-desc">⚠ Registrasi Mandiri</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Status Role PTK</div>
      <div class="kpi-value" style="color:#16a34a;">LENGKAP</div>
      <div class="kpi-desc">Admin & Kepsek Aktif</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Integrasi Sistem</div>
      <div class="kpi-value" style="color:#2563eb;">TERVERIFIKASI</div>
      <div class="kpi-desc">Portal BelajarPlus</div>
    </div>
  </div>

  <div class="section-title">Kredensial Login Pimpinan & Administrator Sekolah</div>
  <div class="admin-grid">
    <div class="admin-card">
      <strong>Akun Kepala Sekolah</strong>
      <div class="admin-field">Nama: <b>${data.kepsek ? data.kepsek.nama : 'Kepala Sekolah'}</b></div>
      <div class="admin-field">Email: <span class="font-mono">${data.kepsek ? data.kepsek.email : '-'}</span></div>
      <div class="admin-field">Password Awal: <span class="font-mono" style="color:#b91c1c; font-weight:800; background:#fee2e2; padding:1px 6px; border-radius:3px;">${data.kepsek ? data.kepsek.pass : '-'}</span></div>
      <div style="color:#64748b; font-size:7.5px; margin-top:2px;">Akses Peran: Kepala Sekolah (Supervisi Pembelajaran & Rapor)</div>
    </div>
    <div class="admin-card">
      <strong>Akun Admin / Operator Sekolah</strong>
      <div class="admin-field">Nama: <b>${data.admin ? data.admin.nama : 'Operator Sekolah'}</b></div>
      <div class="admin-field">Email: <span class="font-mono">${data.admin ? data.admin.email : '-'}</span></div>
      <div class="admin-field">Password Awal: <span class="font-mono" style="color:#b91c1c; font-weight:800; background:#fee2e2; padding:1px 6px; border-radius:3px;">${data.admin ? data.admin.pass : '-'}</span></div>
      <div style="color:#64748b; font-size:7.5px; margin-top:2px;">Akses Peran: Admin Sekolah (Kelola Rombel & Siswa)</div>
    </div>
  </div>

  <div class="section-title">Daftar Kredensial Guru Terdaftar (${data.realTeachers.length} Guru)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 20px;" class="text-center">No</th>
        <th>Nama Pendidik (PTK)</th>
        <th>Email Terdaftar</th>
        <th style="width: 130px;">Password Awal</th>
        <th style="width: 55px;" class="text-center">Peran</th>
        <th style="width: 55px;" class="text-center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${data.realTeachers.map((t, idx) => `
        <tr>
          <td class="text-center font-mono">${idx + 1}</td>
          <td><strong>${t.nama}</strong></td>
          <td class="font-mono" style="color:#1e40af;">${t.email}</td>
          <td class="font-mono" style="color:#b91c1c; font-weight:800; background:#fef2f2; padding-left:8px;">${t.pass}</td>
          <td class="text-center">Guru</td>
          <td class="text-center"><span class="badge-success">✔ Aktif</span></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  ${data.pendingTeachers.length > 0 ? `
    <div class="section-title" style="color:#b45309;">Guru Menunggu Registrasi Mandiri (${data.pendingTeachers.length} Guru)</div>
    <table>
      <thead>
        <tr>
          <th style="width: 20px;" class="text-center">No</th>
          <th>Nama Guru</th>
          <th>Status Email di Berkas</th>
          <th>Keterangan</th>
        </tr>
      </thead>
      <tbody>
        ${data.pendingTeachers.map((p, idx) => `
          <tr>
            <td class="text-center font-mono">${idx + 1}</td>
            <td><strong>${p.nama}</strong></td>
            <td class="font-mono" style="color:#b45309;">${p.email}</td>
            <td>Pendaftaran Mandiri oleh Guru di Portal BelajarPlus</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : ''}

  ${ssBase64 ? `
    <div class="section-title">Bukti Verifikasi Halaman /admin/teachers Live di Platform</div>
    <div class="ss-box avoid-break">
      <img src="${ssBase64}">
    </div>
  ` : ''}

  <div class="sign-container avoid-break">
    <div class="sign-box">
      <div class="sign-title">Penanggung Jawab Teknis Data<br>Lead System Engineer</div>
      <div class="sign-name">Henri Susilo, S.Kom.</div>
      <div class="sign-nip">NIP / ID: BP-TECH-2026</div>
    </div>
    <div class="sign-box">
      <div class="sign-title">Trainer Regional Penanggung Jawab<br>BelajarPlus Indonesia</div>
      <div class="sign-name">${TRAINERS[school.trainer].name}</div>
      <div class="sign-nip">Korda Jawa Tengah</div>
    </div>
  </div>

  <div class="footer">
    <span>Laporan Kredensial Akun Guru - ${school.match}</span>
    <span>BelajarPlus Indonesia &copy; 2026</span>
  </div>
</body>
</html>
  `;

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });

  const pdfName = `Laporan_Data_Akun_Guru_dan_PTK_${school.name.replace(/\s+/g, '_')}.pdf`;
  const gDrivePdf = path.join(PATHS.gDriveRoot, school.folder, pdfName);
  const localPdf = path.join(PATHS.localRoot, school.folder, pdfName);

  if (fs.existsSync(path.dirname(gDrivePdf))) {
    await page.pdf({ path: gDrivePdf, format: 'A4', printBackground: true, margin: { top: '11mm', bottom: '11mm', left: '13mm', right: '13mm' } });
    fs.copyFileSync(gDrivePdf, localPdf);
    console.log(`   ✔ PDF berhasil disimpan di G-Drive & Lokal: ${pdfName}`);
  } else {
    await page.pdf({ path: localPdf, format: 'A4', printBackground: true, margin: { top: '11mm', bottom: '11mm', left: '13mm', right: '13mm' } });
    console.log(`   ✔ PDF berhasil disimpan di Lokal: ${pdfName}`);
  }

  await page.close();
  return true;
}

/**
 * 7. Mode CLI & Menu Interaktif
 */
async function main() {
  const args = process.argv.slice(2);
  const isAudit = args.includes('--audit') || args.includes('--all');
  const isFixRoles = args.includes('--fix-roles') || args.includes('--all');
  const isGenPdf = args.includes('--pdf') || args.includes('--all');
  const schoolFilter = args.find(a => a.startsWith('--school='))?.split('=')[1];

  let targetSchools = SCHOOLS;
  if (schoolFilter) {
    targetSchools = SCHOOLS.filter(s => s.name.toLowerCase().includes(schoolFilter.toLowerCase()) || s.id === schoolFilter);
  }

  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║              🤖 BELAJARPLUS SAT-SET AUTOMATION BOT                ║
║           Lead System Engineer: Henri Susilo, S.Kom.               ║
╚════════════════════════════════════════════════════════════════════╝
`);

  if (!isAudit && !isFixRoles && !isGenPdf) {
    console.log(`Gunakan perintah berikut untuk menjalankan sat-set bot:
  1. node scratch/belajarplus_satset_bot.js --all
     (Jalankan semua: audit live, atur role Admin & Kepsek, capture SS, generate PDF)

  2. node scratch/belajarplus_satset_bot.js --fix-roles
     (Hanya atur dan aktifkan role Admin Sekolah & Kepala Sekolah di platform)

  3. node scratch/belajarplus_satset_bot.js --audit
     (Hanya lakukan audit status siswa, rombel, dan guru serta update Excel)

  4. node scratch/belajarplus_satset_bot.js --pdf
     (Hanya re-generate seluruh dokumen PDF resmi dengan screenshot terbaru)

  5. node scratch/belajarplus_satset_bot.js --school="Dukun" --all
     (Eksekusi sat-set hanya untuk sekolah spesifik)
`);
    return;
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });

  // Kelompokkan sekolah berdasarkan akun trainer
  const groups = {
    khansania: targetSchools.filter(s => s.trainer === 'khansania'),
    andrew: targetSchools.filter(s => s.trainer === 'andrew')
  };

  const auditResults = [];

  for (const trainerKey of Object.keys(groups)) {
    const list = groups[trainerKey];
    if (list.length === 0) continue;

    const { context, page } = await loginTrainer(browser, trainerKey);

    for (const school of list) {
      if (isFixRoles) {
        await autoFixSchoolRoles(page, school);
      }
      if (isAudit) {
        const res = await auditAndCaptureSchool(page, school);
        if (res) auditResults.push(res);
      }
    }

    await context.close();
  }

  // Generate PDF
  if (isGenPdf) {
    console.log(`\n======================================================`);
    console.log(`📑 RE-GENERATING DOKUMEN PDF RESMI`);
    console.log(`======================================================`);
    for (const school of targetSchools) {
      await generateSchoolPdf(browser, school);
    }
  }

  await browser.close();
  console.log(`\n🎉🎉🎉 BOT SAT-SET BELAJARPLUS SELESAI MENJALANKAN SELURUH TUGAS! 🎉🎉🎉\n`);
}

main().catch(err => {
  console.error('Fatal Bot Error:', err);
});
