const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
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

  // Buka Kelas 12-10 (nth 29)
  console.log('Opening Kelas 12-10 modal...');
  await page.getByRole('button', { name: 'Anggota' }).nth(29).click();
  await page.waitForTimeout(3000);

  const dialogText = await page.evaluate(() => document.querySelector('[role="dialog"], .max-h-\\[90vh\\]')?.innerText || '');
  console.log('Dialog 12-10 text:\n', dialogText);

  // Cek apakah 348 ada di anggota aktif
  const card348 = page.locator('div.flex.items-center.gap-2.p-2').filter({ hasText: 'sman1taw_asesmen348@belajarplus.com' });
  if (await card348.count() > 0) {
    console.log('Clicking Keluarkan on 348...');
    await card348.locator('button[aria-label="Keluarkan"]').click();
    await page.waitForTimeout(3000);
    console.log('348 successfully removed from Kelas 12-10!');
  } else {
    console.log('348 is NOT in active members of Kelas 12-10!');
  }

  await browser.close();
})();

