const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to SEKOLAH DUMMY TRAINER 3
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Navigate to classes list
  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(4000);

  // Click on SIMULASI ASAS SE JATENG
  await page.locator('a:has-text("SIMULASI ASAS SE JATENG"), div:has-text("SIMULASI ASAS SE JATENG")').first().click();
  await page.waitForTimeout(4000);
  console.log('Current URL in class:', page.url());

  // Click tab Penugasan
  await page.locator('button:has-text("Penugasan"), a:has-text("Penugasan")').first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'penugasan_view.png' });
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Body Text:\n', bodyText);

  // Check if any button to create assignment
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons:\n', buttons);

  await browser.close();
})();

