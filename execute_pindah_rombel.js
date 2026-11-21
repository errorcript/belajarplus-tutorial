const { chromium } = require('playwright');

async function pindahRombel() {
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

  const studentsToMove = [
    { email: 'fadhildzuljalilathasaputro@belajarplus.com', targetRombel: 'Kelas 12-6' },
    { email: 'rayyaalvaearlynurfaizah@belajarplus.com', targetRombel: 'Kelas 12-6' },
    { email: 'vanesyaanandaanastasia@belajarplus.com', targetRombel: 'Kelas 12-6' },
    { email: 'fadilfadjrul22@gmail.com', targetRombel: 'Kelas 11-4' }
  ];

  for (const item of studentsToMove) {
    console.log(`\nMoving ${item.email} to ${item.targetRombel}...`);
    await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const searchInput = page.getByPlaceholder('Cari nama atau email…');
    await searchInput.fill(item.email);
    await page.waitForTimeout(2000);

    // Klik tombol Lihat
    const lihatBtn = page.locator('table tbody tr').first().getByRole('button', { name: 'Lihat' });
    await lihatBtn.click();
    await page.waitForTimeout(2000);

    // Klik Ubah data
    const ubahBtn = page.getByRole('button', { name: 'Ubah data' });
    await ubahBtn.click();
    await page.waitForTimeout(2000);

    // Pilih Rombel di select
    const selectLocator = page.locator('select').last();
    // Cari option value yang labelnya sesuai targetRombel
    const optionValue = await selectLocator.evaluate((sel, target) => {
      const opt = Array.from(sel.options).find(o => o.text.trim() === target);
      return opt ? opt.value : null;
    }, item.targetRombel);

    if (!optionValue) {
      console.error(`ERROR: Option for ${item.targetRombel} not found!`);
      continue;
    }

    console.log(`Found option value for ${item.targetRombel}: ${optionValue}`);
    await selectLocator.selectOption(optionValue);
    await page.waitForTimeout(1000);

    // Klik Simpan
    const simpanBtn = page.getByRole('button', { name: 'Simpan' });
    await simpanBtn.click();
    await page.waitForTimeout(3000);

    console.log(`Successfully moved ${item.email} to ${item.targetRombel}!`);
  }

  await browser.close();
}

pindahRombel().catch(console.error);

