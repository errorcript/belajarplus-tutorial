const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Login Alif...');
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('And.aliffiansyah@gmail.com');
  await page.locator('input[type="password"]').first().fill('kerja98');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Clear institution and select SMAN 1 Purwokerto
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"], input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('SMA NEGERI 1 PURWOKERTO');
    await page.waitForTimeout(1500);
  }

  const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'SMA NEGERI 1 PURWOKERTO' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3000);

  console.log('2. Buka https://belajarplus.id/absensi/pengaturan ...');
  await page.goto('https://belajarplus.id/absensi/pengaturan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // 1. Toggle "Absensi aktif" jika belum aktif
  const switch0 = page.locator('button[role="switch"]').first();
  const isChecked = await switch0.getAttribute('aria-checked') || await switch0.getAttribute('data-state');
  console.log('Current Absensi aktif state:', isChecked);
  if (isChecked !== 'true' && isChecked !== 'checked') {
    console.log('Toggling Absensi aktif to ON...');
    await switch0.click();
    await page.waitForTimeout(500);
  }

  // 2. Isi Latitude (-7.4213)
  const latContainer = page.locator('div').filter({ has: page.locator('label, span, div', { hasText: 'Latitude' }) }).last();
  const latInput = page.locator('input').filter({ hasText: '' }).nth(8); // or find by placeholder / label
  // Let's use more robust selector:
  const allInputs = page.locator('input');
  // From our inspection: input 8 is Latitude, input 9 is Longitude, input 10 is Radius
  await allInputs.nth(8).fill('-7.4213');
  await page.waitForTimeout(300);

  // 3. Isi Longitude (109.2372)
  await allInputs.nth(9).fill('109.2372');
  await page.waitForTimeout(300);

  // 4. Isi Radius (120)
  await allInputs.nth(10).fill('120');
  await page.waitForTimeout(300);

  console.log('3. Klik Simpan Pengaturan...');
  const saveBtn = page.locator('button:has-text("Simpan Pengaturan")').first();
  await saveBtn.click();
  await page.waitForTimeout(4000);

  // Ambil screenshot bukti
  await page.screenshot({ path: 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/Bukti_Impor/6_pengaturan_absensi.png', fullPage: true });
  await page.screenshot({ path: 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/purwokerto_absensi_saved.png', fullPage: true });

  console.log('4. Cek ulang nilai setelah simpan:');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const recheck = await page.evaluate(() => {
    const sw = document.querySelector('button[role="switch"]');
    const inps = Array.from(document.querySelectorAll('input'));
    return {
      absensiAktif: sw ? (sw.getAttribute('aria-checked') || sw.getAttribute('data-state')) : null,
      lat: inps[8]?.value,
      lng: inps[9]?.value,
      radius: inps[10]?.value
    };
  });
  console.log('Recheck values:', recheck);

  await browser.close();
})();
