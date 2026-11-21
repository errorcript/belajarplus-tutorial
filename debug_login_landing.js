const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('Navigating to auth...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(6000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Page text after login:\n', bodyText.slice(0, 1000));

  await browser.close();
})();

