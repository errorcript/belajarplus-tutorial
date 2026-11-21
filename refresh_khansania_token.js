const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const page = await browser.newPage();

  console.log('Navigating to auth for Khansania...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('khansania.medtra@gmail.com');
  await page.locator('input[type="password"]').first().fill('Khansa04');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(6000);

  const authData = await page.evaluate(() => {
    let session = null;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.includes('auth-token')) {
        try { session = localStorage.getItem(k); } catch (e) { }
      }
    }
    return session;
  });

  if (authData) {
    fs.writeFileSync('khansania_session.json', authData);
    const parsed = JSON.parse(authData);
    fs.writeFileSync('khansania_token.txt', parsed.access_token);
    console.log('Khansania session saved! User:', parsed.user.email);
  } else {
    console.log('Failed to get token, check page URL:', page.url());
  }

  await browser.close();
})();

