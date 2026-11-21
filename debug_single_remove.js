const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('response', async res => {
    if (res.url().includes('_serverFn') && res.request().method() === 'POST') {
      try {
        const text = await res.text();
        console.log('API RESPONSE:', res.url().slice(-20), text.slice(0, 150));
      } catch(e) {}
    }
  });

  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Buka Kelas 11-7 (nth 16)
  console.log('Opening Kelas 11-7 modal...');
  await page.getByRole('button', { name: 'Anggota' }).nth(16).click();
  await page.waitForTimeout(3000);

  console.log('Locating card for sman1taw_siswa621@belajarplus.com...');
  const card621 = page.locator('div.flex.items-center.gap-2.p-2').filter({ hasText: 'sman1taw_siswa621@belajarplus.com' });
  console.log('Card count:', await card621.count());

  if (await card621.count() > 0) {
    const removeBtn = card621.locator('button[aria-label="Keluarkan"]');
    console.log('Clicking remove button via Playwright click...');
    await removeBtn.click();
    await page.waitForTimeout(4000);
  }

  // Cek apakah ada alertdialog konfirmasi
  const alertDialog = page.locator('[role="alertdialog"], div[data-state="open"]').last();
  if (await alertDialog.isVisible()) {
    console.log('Alert dialog visible:', await alertDialog.innerText());
    const confirmBtn = alertDialog.getByRole('button', { name: /Keluarkan|Ya|Konfirmasi/i });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await page.waitForTimeout(4000);
    }
  }

  const dialogText = await page.evaluate(() => document.querySelector('[role="dialog"], .max-h-\\[90vh\\]')?.innerText || '');
  console.log('Contains 621 now?:', dialogText.includes('sman1taw_siswa621@belajarplus.com'));

  await browser.close();
})();

