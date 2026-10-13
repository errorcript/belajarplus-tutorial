const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Login Khansania / Henri...');
  let loggedIn = false;

  // Try Khansania first
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('khansania.medtra@gmail.com');
  await page.locator('input[type="password"]').first().fill('Khansa04');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  if (page.url().includes('dashboard') || page.url().includes('admin')) {
    console.log('Login Khansania berhasil!');
    loggedIn = true;
  } else {
    console.log('Coba login Henri...');
    await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').first().fill('henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(4000);
    if (page.url().includes('dashboard') || page.url().includes('admin')) {
      console.log('Login Henri berhasil!');
      loggedIn = true;
    }
  }

  if (!loggedIn) {
    console.error('Gagal login ke akun Dukun!');
    await browser.close();
    return;
  }

  // Clear institution and select SMAN 1 Dukun
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"], input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('SMA NEGERI 1 DUKUN');
    await page.waitForTimeout(1500);
  }

  const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'SMA NEGERI 1 DUKUN' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3000);

  console.log('Navigasi ke https://belajarplus.id/absensi/pengaturan ...');
  await page.goto('https://belajarplus.id/absensi/pengaturan', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Toggle Absensi aktif jika belum aktif
  const switch0 = page.locator('button[role="switch"]').first();
  const isChecked = await switch0.getAttribute('aria-checked') || await switch0.getAttribute('data-state');
  console.log('Current Absensi aktif state:', isChecked);
  if (isChecked !== 'true' && isChecked !== 'checked') {
    console.log('Toggling Absensi aktif to ON...');
    await switch0.click();
    await page.waitForTimeout(500);
  }

  const allInputs = page.locator('input');
  // SMAN 1 Dukun: Lat -7.5515, Lng 110.3531, Radius 120m
  await allInputs.nth(8).fill('-7.5515');
  await page.waitForTimeout(300);

  await allInputs.nth(9).fill('110.3531');
  await page.waitForTimeout(300);

  await allInputs.nth(10).fill('120');
  await page.waitForTimeout(300);

  console.log('Klik Simpan Pengaturan Dukun...');
  const saveBtn = page.locator('button:has-text("Simpan Pengaturan")').first();
  await saveBtn.click();
  await page.waitForTimeout(4000);

  const ssPath = 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/6_pengaturan_absensi.png';
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log(`Screenshot saved to: ${ssPath}`);

  // Recheck
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

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
  console.log('Recheck values Dukun:', recheck);

  await browser.close();
  console.log('=== SMAN 1 DUKUN SELESAI DISETTING ABSENSI! ===');
})();
