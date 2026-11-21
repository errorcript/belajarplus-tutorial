const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function importTeachersUI() {
  console.log('=== MEMULAI PROSES IMPOR 10 GURU SMAN 11 PURWOREJO KE PLATFORM ===');
  const session = fs.readFileSync('khansania_session.json', 'utf8');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  // Set session
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
  }, { session });

  console.log('Membuka /admin...');
  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Buka dropdown institusi
  console.log('Membuka dropdown institusi...');
  const switcher = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
  if (await switcher.count() > 0) {
    await switcher.click();
  } else {
    await page.getByText('Semua institusi saya').first().click();
  }
  await page.waitForTimeout(2000);

  // Pilih SMA NEGERI 11 PURWOREJO
  console.log('Memilih SMA NEGERI 11 PURWOREJO...');
  const schoolOption = page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
  await schoolOption.click();
  await page.waitForTimeout(4000);

  console.log('Institusi aktif sekarang:', await page.evaluate(() => document.body.innerText.slice(0, 200)));

  // Buka halaman /admin/teachers
  console.log('Navigasi ke /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  console.log('Current URL:', page.url());
  await page.screenshot({ path: 'teachers_list_before.png' });

  // Cari tombol Impor PTK atau sejenisnya
  const importBtn = page.locator('button').filter({ hasText: /Impor PTK|Impor Guru|Impor/i }).first();
  const hasImportBtn = await importBtn.count() > 0;
  console.log('Tombol Impor PTK ditemukan?', hasImportBtn);

  if (hasImportBtn) {
    console.log('Mengklik tombol Impor PTK...');
    await importBtn.click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'import_ptk_modal.png' });

    // Cari input file
    const fileInput = page.locator('input[type="file"]').first();
    const filePath = path.resolve(__dirname, '[IMPOR_PTK]_SMAN_11_Purworejo_10_Guru.xlsx');
    console.log('Mengunggah file:', filePath);
    await fileInput.setInputFiles(filePath);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'import_ptk_preview.png' });

    // Cari tombol Konfirmasi / Simpan / Unggah
    const confirmBtn = page.locator('button').filter({ hasText: /Lanjutkan|Simpan|Impor|Konfirmasi|Unggah/i }).last();
    if (await confirmBtn.count() > 0) {
      console.log('Mengklik tombol konfirmasi impor:', await confirmBtn.innerText());
      await confirmBtn.click();
      await page.waitForTimeout(6000);

      await page.screenshot({ path: 'import_ptk_result.png' });
      console.log('Hasil impor telah dicapture ke import_ptk_result.png');
    }
  } else {
    console.log('Melihat semua tombol yang tersedia di halaman:');
    const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()));
    console.log(btns);
  }

  await browser.close();
  console.log('=== SELESAI PROSES IMPOR ===');
}

importTeachersUI().catch(console.error);

