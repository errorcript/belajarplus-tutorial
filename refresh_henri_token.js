const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const page = await browser.newPage();

  console.log('Navigating to auth...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  const authData = await page.evaluate(() => {
    let token = null;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.includes('auth-token')) {
        try { token = JSON.parse(localStorage.getItem(k)).access_token; } catch (e) { }
      }
    }
    return token;
  });

  if (authData) {
    fs.writeFileSync('henri_token.txt', authData);
    fs.writeFileSync('tawangsari_token.txt', authData);
    console.log('Fresh token saved! Length:', authData.length);
  } else {
    console.log('Failed to get token, check page URL:', page.url());
  }

  await browser.close();
})();

