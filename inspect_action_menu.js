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

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen338@belajarplus.com');
  await page.waitForTimeout(2000);

  const actionBtn = page.getByRole('button', { name: /Tindakan untuk/i }).first();
  await actionBtn.click();
  await page.waitForTimeout(1500);

  const menuItems = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], div[data-radix-collection-item]'));
    return items.map(el => el.innerText.trim()).filter(Boolean);
  });

  console.log('Action menu items for 338:', menuItems);

  await browser.close();
})();

