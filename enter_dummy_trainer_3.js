const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  console.log('2. Opening switcher and selecting "SEKOLAH DUMMY TRAINER 3"...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => {});
  await page.waitForTimeout(1500);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);

  // Click on the item
  const item = page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), [role="option"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last();
  await item.click();
  await page.waitForTimeout(5000);

  console.log('Selected institution! Current URL:', page.url());
  const activeSchool = await page.evaluate(() => {
    return document.body.innerText.slice(0, 500);
  });
  console.log('Page header preview:\n', activeSchool);

  // Check sidebar navigation items
  const navItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button'))
      .map(el => ({ text: el.innerText.trim(), href: el.getAttribute('href') }))
      .filter(item => item.text.length > 2 && item.text.length < 50);
  });
  console.log('Navigation items:', navItems.slice(0, 25));

  await page.screenshot({ path: 'dummy_trainer_3_dashboard.png' });
  console.log('Saved dummy_trainer_3_dashboard.png');

  await browser.close();
})();

