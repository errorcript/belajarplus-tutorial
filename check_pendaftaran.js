const { chromium } = require('playwright');

async function checkPendaftaran() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth');
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

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('Clicking "Kode & Pendaftaran"...');
  await page.getByRole('button', { name: /Kode & Pendaftaran/i }).click();
  await page.waitForTimeout(3000);

  const dialog = page.locator('[role="dialog"], [data-state="open"]').first();
  if (await dialog.isVisible()) {
    console.log('Dialog Content:\n', await dialog.innerText());
  } else {
    console.log('Page text snippet:\n', (await page.evaluate(() => document.body.innerText)).slice(0, 800));
  }

  await browser.close();
}

checkPendaftaran().catch(console.error);

