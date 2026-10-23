/**
 * ============================================================================
 * 🤖 BELAJARPLUS SAT-SET BOT (v3.0 - OFFICIAL PROTOCOL UPDATE)
 * ============================================================================
 * Menyesuaikan pembaruan sistem live BelajarPlus:
 * 1. IMPOR SISWA:
 *    - Sheet [Siswa], header: Nama, Email, Password Awal, Rombel
 *    - Batas keras: Maksimal 500 baris per berkas (auto-chunk jika >500)
 *    - Auto-assign Rombel: Otomatis masuk kelas jika nama Rombel cocok dengan TA Aktif
 * 2. IMPOR PTK / GURU:
 *    - Sheet [PTK], header: Nama, Email, Password (opsional, min. 8), Jadikan Guru (Ya/Tidak)
 *    - Nilai kolom 4: "Ya" agar langsung aktif sebagai Dewan Guru
 *    - Password min. 8 karakter agar akun langsung dibuat instan tanpa email invite
 * 3. ISOLATED BROWSER CONTEXT:
 *    - Mencegah token lock antar multi-tenant sekolah
 * ============================================================================
 */

const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

/**
 * 1. Generator Berkas Siswa Sesuai Protokol Terbaru (Auto-chunk max 500)
 */
function generateCleanStudentFiles(inputRows, schoolPrefix, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const CHUNK_SIZE = 450; // Aman di bawah batas 500
  const chunks = [];
  for (let i = 0; i < inputRows.length; i += CHUNK_SIZE) {
    chunks.push(inputRows.slice(i, i + CHUNK_SIZE));
  }

  const generatedFiles = [];
  chunks.forEach((chunk, chunkIdx) => {
    const wb = xlsx.utils.book_new();

    // Sheet Siswa
    const studentData = [
      ['Nama', 'Email', 'Password Awal', 'Rombel']
    ];
    chunk.forEach(s => {
      studentData.push([
        s.nama.trim(),
        s.email.toLowerCase().trim(),
        s.password || `${schoolPrefix}_${Math.floor(1000 + Math.random() * 9000)}`,
        s.rombel ? s.rombel.trim() : ''
      ]);
    });

    const wsSiswa = xlsx.utils.aoa_to_sheet(studentData);
    xlsx.utils.book_append_sheet(wb, wsSiswa, 'Siswa');

    // Sheet Panduan
    const panduanData = [
      ['Kolom', 'Keterangan'],
      ['Nama', 'Wajib untuk akun baru'],
      ['Email', 'Wajib. Akun yang sudah ada dipakai apa adanya; passwordnya tidak diubah'],
      ['Password Awal', 'Opsional, 8–72 karakter, hanya untuk akun baru (Nama wajib). Kosong = undangan dibuat & email dikirim'],
      ['Rombel', 'Opsional. Nama Rombel tahun ajaran aktif, mis. "Kelas 10-A", "10-A", "10 A" atau "X A"'],
      ['Batas', 'Maksimal 500 baris per berkas']
    ];
    const wsPanduan = xlsx.utils.aoa_to_sheet(panduanData);
    xlsx.utils.book_append_sheet(wb, wsPanduan, 'Panduan');

    const suffix = chunks.length > 1 ? `_part${chunkIdx + 1}` : '';
    const outPath = path.join(outDir, `[CLEAN_IMPORT]_${schoolPrefix}${suffix}.xlsx`);
    xlsx.writeFile(wb, outPath);
    generatedFiles.push(outPath);
  });

  return generatedFiles;
}

/**
 * 2. Generator Berkas PTK / Guru Sesuai Protokol Terbaru BelajarPlus
 */
function generateCleanTeacherFile(teacherRows, schoolPrefix, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const wb = xlsx.utils.book_new();
  const ptkData = [
    ['Nama', 'Email', 'Password (opsional, min. 8)', 'Jadikan Guru (Ya/Tidak)']
  ];

  teacherRows.forEach((t, idx) => {
    ptkData.push([
      t.nama.trim(),
      t.email.toLowerCase().trim(),
      t.password || `${schoolPrefix}guru_${Math.floor(1000 + Math.random() * 9000)}`,
      'Ya'
    ]);
  });

  const wsPTK = xlsx.utils.aoa_to_sheet(ptkData);
  xlsx.utils.book_append_sheet(wb, wsPTK, 'PTK');

  const outPath = path.join(outDir, `[CLEAN_IMPORT_GURU]_${schoolPrefix}.xlsx`);
  xlsx.writeFile(wb, outPath);
  return outPath;
}

/**
 * 3. Eksekusi Live Impor PTK (Guru) via Playwright
 */
async function importTeacherLive(page, teacherFilePath) {
  console.log(`[PTK] Membuka /admin/teachers...`);
  await page.goto('https://belajarplus.id/admin/teachers', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  const importBtn = page.locator('button:has-text("Impor PTK"), button:has-text("Impor")').first();
  if (!await importBtn.isVisible().catch(() => false)) {
    console.log(`[PTK] ❌ Tombol Impor PTK tidak ditemukan.`);
    return false;
  }

  await importBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(teacherFilePath);
  console.log(`[PTK] Berkas diunggah: ${path.basename(teacherFilePath)}`);
  await page.waitForTimeout(3000);

  // Klik tombol Simpan / Impor PTK
  const confirmBtn = page.locator('button[type="submit"], button:has-text("Impor"), button:has-text("Simpan")').last();
  if (await confirmBtn.isVisible() && !await confirmBtn.isDisabled()) {
    await confirmBtn.click();
    console.log(`[PTK] Tombol konfirmasi diklik, menunggu pembuatan akun...`);
    await page.waitForTimeout(5000);
    return true;
  }

  return false;
}

/**
 * 4. Eksekusi Live Impor Siswa via Playwright
 */
async function importStudentLive(page, studentFilePath) {
  console.log(`[Siswa] Membuka /admin/students...`);
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);

  const importBtn = page.locator('button:has-text("Impor Siswa")').first();
  if (!await importBtn.isVisible().catch(() => false)) {
    console.log(`[Siswa] ❌ Tombol Impor Siswa tidak ditemukan.`);
    return false;
  }

  await importBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(studentFilePath);
  console.log(`[Siswa] Berkas diunggah: ${path.basename(studentFilePath)}`);
  await page.waitForTimeout(3000);

  const submitBtn = page.locator('button:has-text("Impor")').last();
  await submitBtn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

  if (!await submitBtn.isDisabled()) {
    await submitBtn.click();
    console.log(`[Siswa] Tombol Impor diklik, memproses sinkronisasi database...`);
    await page.waitForTimeout(6000);
    return true;
  } else {
    console.log(`[Siswa] ⚠️ Tombol Impor masih disabled (periksa pratinjau error).`);
    return false;
  }
}

module.exports = {
  generateCleanStudentFiles,
  generateCleanTeacherFile,
  importTeacherLive,
  importStudentLive
};
