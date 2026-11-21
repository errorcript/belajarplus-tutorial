const { chromium } = require('playwright');

async function manageStatus() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('1. Logging in as Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  console.log('2. Switching school to SMAN 1 TAWANGSARI...');
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  // --- Step 1: Aktifkan kembali sman1taw_asesmen338@belajarplus.com ---
  console.log('\n--- Step 1: Mengaktifkan kembali sman1taw_asesmen338@belajarplus.com ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  let searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen338@belajarplus.com');
  await page.waitForTimeout(2000);

  let actionBtn = page.getByRole('button', { name: /Tindakan untuk/i }).first();
  if (await actionBtn.isVisible()) {
    await actionBtn.click();
    await page.waitForTimeout(1000);
    const aktifkanItem = page.locator('[role="menuitem"]').filter({ hasText: 'Aktifkan kembali' }).first();
    await aktifkanItem.click();
    await page.waitForTimeout(2000);

    // Cek apakah ada dialog konfirmasi
    const confirmBtn = page.getByRole('button', { name: /Ya|Konfirmasi|Aktifkan|Lanjutkan/i }).last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(3000);
    }
    console.log('Akun 338 berhasil diaktifkan kembali!');
  }

  // Masukkan 338 ke Kelas 12-10
  console.log('Menempatkan akun 338 ke Kelas 12-10...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen338@belajarplus.com');
  await page.waitForTimeout(2000);

  let row = page.locator('table tbody tr').first();
  if (await row.isVisible()) {
    await row.getByRole('button', { name: 'Lihat' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ubah data' }).click();
    await page.waitForTimeout(2000);

    const sel = page.locator('select').last();
    const optVal = await sel.evaluate(s => {
      const o = Array.from(s.options).find(opt => opt.text.trim() === 'Kelas 12-10');
      return o ? o.value : null;
    });
    if (optVal) {
      await sel.selectOption(optVal);
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Simpan' }).click();
      await page.waitForTimeout(3000);
      console.log('Akun 338 berhasil masuk Kelas 12-10!');
    }
  }

  // --- Step 2: Tangguhkan / Akhiri Hubungan sman1taw_asesmen348@belajarplus.com (Akun Dobel) ---
  console.log('\n--- Step 2: Menonaktifkan akun dobel sman1taw_asesmen348@belajarplus.com ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen348@belajarplus.com');
  await page.waitForTimeout(2000);

  actionBtn = page.getByRole('button', { name: /Tindakan untuk/i }).first();
  if (await actionBtn.isVisible()) {
    await actionBtn.click();
    await page.waitForTimeout(1000);
    const tangguhkanItem = page.locator('[role="menuitem"]').filter({ hasText: /Tangguhkan|Akhiri hubungan/i }).first();
    console.log('Clicking item:', await tangguhkanItem.innerText());
    await tangguhkanItem.click();
    await page.waitForTimeout(2000);
    const confirmBtn = page.getByRole('button', { name: /Ya|Konfirmasi|Tangguhkan|Lanjutkan/i }).last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(3000);
    }
    console.log('Akun 348 berhasil dinonaktifkan!');
  }

  // --- Step 3: Tangguhkan / Akhiri Hubungan sman1taw_siswa621@belajarplus.com (Akun Dobel Herdha) ---
  console.log('\n--- Step 3: Menonaktifkan akun dobel sman1taw_siswa621@belajarplus.com ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_siswa621@belajarplus.com');
  await page.waitForTimeout(2000);

  actionBtn = page.getByRole('button', { name: /Tindakan untuk/i }).first();
  if (await actionBtn.isVisible()) {
    await actionBtn.click();
    await page.waitForTimeout(1000);
    const tangguhkanItem = page.locator('[role="menuitem"]').filter({ hasText: /Tangguhkan|Akhiri hubungan/i }).first();
    console.log('Clicking item:', await tangguhkanItem.innerText());
    await tangguhkanItem.click();
    await page.waitForTimeout(2000);
    const confirmBtn = page.getByRole('button', { name: /Ya|Konfirmasi|Tangguhkan|Lanjutkan/i }).last();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(3000);
    }
    console.log('Akun 621 berhasil dinonaktifkan!');
  }

  await browser.close();
}

manageStatus().catch(console.error);

