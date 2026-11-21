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

  // Cek Kelas 11-7 (nth 16)
  await page.getByRole('button', { name: 'Anggota' }).nth(16).click();
  await page.waitForTimeout(2500);
  let text = await page.evaluate(() => document.querySelector('[role="dialog"], .max-h-\\[90vh\\]')?.innerText || '');
  console.log('Herdha in 11-7 now:');
  console.log(text.split('\n').filter(l => l.includes('621') || l.includes('622') || l.includes('herdhabayu')));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);

  // Cek Kelas 12-10 (nth 29)
  await page.getByRole('button', { name: 'Anggota' }).nth(29).click();
  await page.waitForTimeout(2500);
  text = await page.evaluate(() => document.querySelector('[role="dialog"], .max-h-\\[90vh\\]')?.innerText || '');
  console.log('Nurdiansyah in 12-10 now:');
  console.log(text.split('\n').filter(l => l.includes('338') || l.includes('348') || l.toLowerCase().includes('nurdiansyah')));

  await browser.close();
})();

