/**
 * ============================================================================
 * 🤖 BELAJARPLUS MASTER BOT (v4.0 - LATEST 2026 OFFICIAL PLATFORM PROTOCOL)
 * ============================================================================
 * Modul otomatisasi lengkap untuk platform BelajarPlus (https://belajarplus.com)
 * Memperbarui seluruh protokol:
 * 1. URL Route Baru:
 *    - Rombel: /master-data/rombel (bukan /admin/rombels)
 *    - Tahun Ajaran: /master-data/tahun-ajaran (bukan /admin/academic-years)
 *    - Siswa: /admin/students
 *    - PTK: /admin/teachers
 * 2. Impor Siswa Otomatis:
 *    - Format resmi: Sheet ['Siswa', 'Panduan']
 *    - Kolom: Nama, Email, Password Awal, Rombel
 *    - Auto-chunking: Maksimal 450 baris per file (di bawah limit 500)
 *    - Auto-assign Rombel: Otomatis masuk kelas jika nama Rombel sudah ada di TA aktif
 * 3. Fitur Baru Impor PTK (Guru):
 *    - Format resmi: Sheet ['PTK']
 *    - Kolom: Nama, Email, Password (opsional, min. 8), Jadikan Guru (Ya/Tidak)
 *    - Akun aktif instan tanpa nunggu tautan email invite
 * 4. Otomasi Buat Rombel (/master-data/rombel):
 *    - Jenjang (SMA/MA / SMK), Kelas (Kelas 10-12), Suffix, Wali Kelas
 * 5. Batch Assign Anggota Rombel:
 *    - Memasukkan siswa berstatus 'Belum ditempatkan' ke rombel target
 * ============================================================================
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const BASE_URL = 'https://belajarplus.com';

/**
 * 1. Helper Generator Berkas Excel Siswa Sesuai Template Resmi B+
 */
function generateStudentImportFiles(studentRows, schoolPrefix, outDir, defaultPassword = 'Siswa2026!') {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const CHUNK_SIZE = 450; // Aman di bawah batas 500 baris
  const chunks = [];
  for (let i = 0; i < studentRows.length; i += CHUNK_SIZE) {
    chunks.push(studentRows.slice(i, i + CHUNK_SIZE));
  }

  const generatedFiles = [];
  chunks.forEach((chunk, idx) => {
    const wb = xlsx.utils.book_new();

    // Sheet Siswa
    const studentData = [
      ['Nama', 'Email', 'Password Awal', 'Rombel']
    ];
    chunk.forEach(s => {
      studentData.push([
        (s.Nama || s.nama || '').trim(),
        (s.Email || s.email || '').toLowerCase().trim(),
        (s['Password Awal'] || s.Password || s.password || defaultPassword).trim(),
        (s.Rombel || s.rombel || s.Kelas || s.kelas || '').trim()
      ]);
    });

    const wsSiswa = xlsx.utils.aoa_to_sheet(studentData);
    xlsx.utils.book_append_sheet(wb, wsSiswa, 'Siswa');

    // Sheet Panduan Resmi
    const panduanData = [
      ['Kolom', 'Keterangan'],
      ['Nama', 'Wajib untuk akun baru'],
      ['Email', 'Wajib. Akun yang sudah ada dipakai apa adanya; passwordnya tidak diubah'],
      ['Password Awal', 'Opsional, 8–72 karakter, hanya untuk akun baru (Nama wajib). Kosong = undangan dibuat & email dikirim'],
      ['Rombel', 'Opsional. Nama Rombel tahun ajaran aktif, mis. "Kelas 10-A", "10-A", "10 A" atau "X A"'],
      ['Batas Kapasitas', 'Maksimal 500 baris per berkas']
    ];
    const wsPanduan = xlsx.utils.aoa_to_sheet(panduanData);
    xlsx.utils.book_append_sheet(wb, wsPanduan, 'Panduan');

    const suffix = chunks.length > 1 ? `_part${idx + 1}` : '';
    const outPath = path.join(outDir, `[CLEAN_IMPORT]_${schoolPrefix}${suffix}.xlsx`);
    xlsx.writeFile(wb, outPath);
    generatedFiles.push(outPath);
  });

  return generatedFiles;
}

/**
 * 2. Helper Generator Berkas Excel PTK (Guru) Sesuai Template Resmi B+
 */
function generateTeacherImportFile(teacherRows, schoolPrefix, outDir, defaultPassword = 'Guru2026!') {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const wb = xlsx.utils.book_new();
  const ptkData = [
    ['Nama', 'Email', 'Password (opsional, min. 8)', 'Jadikan Guru (Ya/Tidak)']
  ];

  teacherRows.forEach(t => {
    ptkData.push([
      (t.Nama || t.nama || '').trim(),
      (t.Email || t.email || '').toLowerCase().trim(),
      (t['Password (opsional, min. 8)'] || t.Password || t.password || defaultPassword).trim(),
      (t['Jadikan Guru (Ya/Tidak)'] || t.Role || 'Ya').trim()
    ]);
  });

  const wsPTK = xlsx.utils.aoa_to_sheet(ptkData);
  xlsx.utils.book_append_sheet(wb, wsPTK, 'PTK');

  const outPath = path.join(outDir, `[CLEAN_IMPORT_GURU]_${schoolPrefix}.xlsx`);
  xlsx.writeFile(wb, outPath);
  return outPath;
}

/**
 * 3. Otomasi Login & Switch Tenant Sekolah
 */
async function loginAndSelectSchool(browser, trainerEmail, trainerPassword, schoolNameOrRegex) {
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  console.log(`[AUTH] Login sebagai: ${trainerEmail}...`);
  await page.goto(`${BASE_URL}/auth`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[type="email"]').first();
  if (await emailInput.isVisible().catch(() => false)) {
    await emailInput.fill(trainerEmail);
    await page.locator('input[type="password"]').first().fill(trainerPassword);
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
  }

  if (!page.url().includes('/dashboard')) {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
  }

  console.log(`[TENANT] Mencari kartu sekolah: ${schoolNameOrRegex}...`);
  const card = page.locator('li').filter({ hasText: new RegExp(schoolNameOrRegex, 'i') }).first();
  if (await card.count() === 0) {
    throw new Error(`Sekolah "${schoolNameOrRegex}" tidak ditemukan di dashboard akun trainer!`);
  }

  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForURL('**/admin', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2500);

  const currentInstitution = await page.evaluate(() => {
    return document.querySelector('header')?.innerText?.split('\n')?.[0] || 'Unknown';
  });
  console.log(`[TENANT] Berhasil masuk ke institusi: "${currentInstitution}"`);

  return { context, page, currentInstitution };
}

/**
 * 4. Otomasi Verifikasi & Aktivasi Tahun Ajaran (/master-data/tahun-ajaran)
 */
async function ensureTahunAjaranActive(page, targetYear = '2026/2027') {
  console.log(`[TA] Memeriksa Tahun Ajaran di ${BASE_URL}/master-data/tahun-ajaran...`);
  await page.goto(`${BASE_URL}/master-data/tahun-ajaran`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const taStatus = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasActive = text.includes('(aktif)') || text.includes('Aktif\n\n1 Jul');
    const mYear = text.match(/(202\d[\/\-]202\d)/i);
    return {
      hasActive,
      year: mYear ? mYear[1] : 'Belum Ada',
      canActivate: text.includes('Aktifkan')
    };
  });

  console.log(`[TA] Status Tahun Ajaran: ${taStatus.year} (Aktif: ${taStatus.hasActive})`);

  if (!taStatus.hasActive && taStatus.canActivate) {
    console.log(`[TA] Mengaktifkan Tahun Ajaran...`);
    const aktifkanBtn = page.locator('button:has-text("Aktifkan")').first();
    if (await aktifkanBtn.isVisible()) {
      await aktifkanBtn.click();
      await page.waitForTimeout(2500);
      console.log(`[TA] Tahun Ajaran berhasil diaktifkan!`);
    }
  }

  return taStatus;
}

/**
 * 5. Otomasi Pembuatan Rombel Massal (/master-data/rombel)
 * @param {Array<{jenjang: string, kelas: string, suffix: string}>} rombelsToCreate
 */
async function createRombels(page, rombelsToCreate) {
  console.log(`[ROMBEL] Membuka ${BASE_URL}/master-data/rombel...`);
  await page.goto(`${BASE_URL}/master-data/rombel`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Ambil daftar rombel yang sudah ada
  const existingRombels = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.border, li, tr'));
    const names = [];
    cards.forEach(c => {
      const t = c.innerText;
      const m = t.match(/Kelas\s+\d+[\-\s][A-Za-z0-9]+/i);
      if (m) names.push(m[0].trim());
    });
    return Array.from(new Set(names));
  });

  console.log(`[ROMBEL] Rombel yang sudah ada (${existingRombels.length}):`, existingRombels.slice(0, 5));

  for (const r of rombelsToCreate) {
    const expectedName = `${r.kelas}-${r.suffix}`;
    const alreadyExists = existingRombels.some(ex => ex.toLowerCase().includes(expectedName.toLowerCase()));

    if (alreadyExists) {
      console.log(`[ROMBEL] ⏭️ Rombel ${expectedName} sudah ada, lewati.`);
      continue;
    }

    console.log(`[ROMBEL] ➕ Membuat Rombel baru: ${r.jenjang} | ${r.kelas} | Suffix: ${r.suffix}...`);
    const tambahBtn = page.locator('button:has-text("Tambah Rombel"), button:has-text("Tambah")').first();
    await tambahBtn.click();
    await page.waitForTimeout(1500);

    // Select Jenjang (default SMA/MA)
    const modal = page.locator('[role="dialog"]').first();
    const jenjangSelect = modal.locator('select').first();
    await jenjangSelect.selectOption({ label: r.jenjang || 'SMA/MA' }).catch(async () => {
      await jenjangSelect.selectOption({ index: 5 }); // Fallback index SMA/MA
    });

    // Select Kelas (Kelas 10 / 11 / 12)
    const kelasSelect = modal.locator('select').nth(1);
    await kelasSelect.selectOption({ label: r.kelas }).catch(async () => {
      const val = r.kelas.replace(/[^0-9]/g, '');
      await kelasSelect.selectOption({ value: val });
    });

    // Input Suffix (misal: 1, 2, A, B, IPA 1)
    const suffixInput = modal.locator('input').first();
    await suffixInput.fill(r.suffix);
    await page.waitForTimeout(500);

    // Submit Tambah Rombel
    const submitBtn = modal.locator('button:has-text("Tambah Rombel")').last();
    await submitBtn.click();
    await page.waitForTimeout(2500);
    console.log(`[ROMBEL] ✅ Berhasil dibuat: ${expectedName}`);
  }
}

/**
 * 6. Otomasi Eksekusi Impor Siswa (/admin/students)
 */
async function importStudents(page, studentExcelPath) {
  console.log(`[SISWA] Membuka ${BASE_URL}/admin/students...`);
  await page.goto(`${BASE_URL}/admin/students`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const importBtn = page.locator('button:has-text("Impor Siswa")').first();
  if (!await importBtn.isVisible().catch(() => false)) {
    throw new Error('Tombol "Impor Siswa" tidak ditemukan di halaman!');
  }

  await importBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(studentExcelPath);
  console.log(`[SISWA] Berkas Excel diunggah: ${path.basename(studentExcelPath)}`);
  await page.waitForTimeout(3500);

  const modal = page.locator('[role="dialog"]').first();
  const submitBtn = modal.locator('button:has-text("Impor")').last();
  await submitBtn.waitFor({ state: 'visible', timeout: 10000 });

  if (await submitBtn.isDisabled()) {
    const errorText = await modal.innerText();
    throw new Error(`Tombol Impor disabled! Pesan modal: ${errorText.slice(0, 300)}`);
  }

  console.log(`[SISWA] Mengonfirmasi impor siswa ke database...`);
  await submitBtn.click();
  await page.waitForTimeout(6000);
  console.log(`[SISWA] ✅ Impor siswa berhasil diproses!`);
}

/**
 * 7. Otomasi Eksekusi Impor PTK (Guru) (/admin/teachers)
 */
async function importTeachers(page, teacherExcelPath) {
  console.log(`[PTK] Membuka ${BASE_URL}/admin/teachers...`);
  await page.goto(`${BASE_URL}/admin/teachers`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const importBtn = page.locator('button:has-text("Impor PTK")').first();
  if (!await importBtn.isVisible().catch(() => false)) {
    throw new Error('Tombol "Impor PTK" tidak ditemukan di halaman!');
  }

  await importBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(teacherExcelPath);
  console.log(`[PTK] Berkas PTK diunggah: ${path.basename(teacherExcelPath)}`);
  await page.waitForTimeout(3500);

  const modal = page.locator('[role="dialog"]').first();
  const submitBtn = modal.locator('button:has-text("Impor"), button:has-text("Simpan")').last();
  
  if (await submitBtn.isVisible() && !await submitBtn.isDisabled()) {
    console.log(`[PTK] Mengonfirmasi impor PTK ke database...`);
    await submitBtn.click();
    await page.waitForTimeout(5000);
    console.log(`[PTK] ✅ Impor PTK berhasil diproses!`);
  } else {
    throw new Error('Tombol submit Impor PTK tidak aktif atau tidak ditemukan!');
  }
}

module.exports = {
  BASE_URL,
  generateStudentImportFiles,
  generateTeacherImportFile,
  loginAndSelectSchool,
  ensureTahunAjaranActive,
  createRombels,
  importStudents,
  importTeachers
};
