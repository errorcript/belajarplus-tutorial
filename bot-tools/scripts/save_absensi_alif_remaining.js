const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');

const schools = [
  {
    name: 'SMA NEGERI 1 JATILAWANG',
    shortName: '56. SMAN 1 Jatilawang',
    lat: '-7.5339',
    lng: '109.1161',
    radius: '120',
    ssPath: 'G:/My Drive/Trainer/B+/AKUN/56. SMAN 1 Jatilawang/Bukti_Impor/6_pengaturan_absensi.png'
  },
  {
    name: 'SMA NEGERI 1 RAWALO',
    shortName: '58. SMAN 1 Rawalo',
    lat: '-7.5290',
    lng: '109.1666',
    radius: '120',
    ssPath: 'G:/My Drive/Trainer/B+/AKUN/58. SMAN 1 Rawalo/Bukti_Impor/6_pengaturan_absensi.png'
  },
  {
    name: 'SMA NEGERI 1 PATIKRAJA',
    shortName: '57. SMAN 1 Patikraja',
    lat: '-7.4849',
    lng: '109.2280',
    radius: '120',
    ssPath: 'G:/My Drive/Trainer/B+/AKUN/57. SMAN 1 Patikraja/Bukti_Impor/6_pengaturan_absensi.png'
  }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Login Alif...');
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('And.aliffiansyah@gmail.com');
  await page.locator('input[type="password"]').first().fill('kerja98');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  for (const s of schools) {
    console.log(`\n========================================`);
    console.log(`PENGATURAN ABSENSI: ${s.name}`);
    console.log(`========================================`);

    // Reset institution in localStorage
    await page.evaluate(() => {
      Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
    });
    await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"], input[type="text"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(s.name);
      await page.waitForTimeout(1500);
    }

    const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: s.name }).first();
    await card.locator('button:has-text("Masuk")').first().click();
    await page.waitForTimeout(3000);

    console.log(`Navigasi ke https://belajarplus.id/absensi/pengaturan ...`);
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
    // Input 8: Latitude, Input 9: Longitude, Input 10: Radius
    await allInputs.nth(8).fill(s.lat);
    await page.waitForTimeout(300);

    await allInputs.nth(9).fill(s.lng);
    await page.waitForTimeout(300);

    await allInputs.nth(10).fill(s.radius);
    await page.waitForTimeout(300);

    console.log(`Klik Simpan Pengaturan (Lat: ${s.lat}, Lng: ${s.lng}, Radius: ${s.radius}m)...`);
    const saveBtn = page.locator('button:has-text("Simpan Pengaturan")').first();
    await saveBtn.click();
    await page.waitForTimeout(4000);

    // Screenshot
    await page.screenshot({ path: s.ssPath, fullPage: true });
    console.log(`Screenshot saved to: ${s.ssPath}`);

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
    console.log('Recheck values:', recheck);
  }

  await browser.close();
  console.log('\n=== SEMUA SEKOLAH ALIF SELESAI DISETTING ABSENSI! ===');
})();
