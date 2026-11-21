const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switcher
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(4000);

  await page.locator('button:has-text("Buat Kelas Sekolah")').first().click();
  await page.waitForTimeout(2000);

  const dialog = page.locator('[role="dialog"]').first();
  await dialog.locator('select').first().selectOption({ index: 1 });
  await page.waitForTimeout(1000);

  // Click Beberapa Rombel radio
  await dialog.locator('label:has-text("Beberapa Rombel"), input[type="radio"]').nth(1).click();
  await page.waitForTimeout(1500);

  const html = await dialog.evaluate(el => el.innerHTML);
  fs.writeFileSync('dialog_full_html.html', html);
  console.log('Saved dialog_full_html.html (length:', html.length, ')');

  await browser.close();
})();

