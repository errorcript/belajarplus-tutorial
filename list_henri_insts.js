const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Henri
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Click institution switcher and list ALL institutions
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
  await switcher.click();
  await page.waitForTimeout(1500);

  const insts = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button'));
    return items.map(el => el.innerText.trim()).filter(t => t.length > 3);
  });

  console.log('Institutions in switcher:', insts);

  await browser.close();
})();

