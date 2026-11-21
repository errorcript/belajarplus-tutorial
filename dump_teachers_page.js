const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to Gemolong
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const gemolongOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /GEMOLONG/i }).first();
  await gemolongOpt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('teachers_page_text.txt', text);
  console.log('Saved teachers_page_text.txt, length:', text.length);
  console.log('Snippet:', text.slice(0, 1500));

  await browser.close();
})();

