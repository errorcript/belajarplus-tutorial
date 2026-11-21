const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    if (req.url().includes('supabase.co/auth/v1/token')) {
      console.log('CAPTURED AUTH REQ URL:', req.url());
      console.log('CAPTURED HEADERS:', JSON.stringify(req.headers(), null, 2));
    }
  });

  page.on('response', async res => {
    if (res.url().includes('supabase.co/auth/v1/token')) {
      const text = await res.text();
      fs.writeFileSync('production_supabase_session.json', text);
      const json = JSON.parse(text);
      fs.writeFileSync('henri_token.txt', json.access_token);
      console.log('SAVED FRESH PRODUCTION TOKEN! Length:', json.access_token.length);
    }
  });

  let loaded = false;
  for (let i = 1; i <= 5; i++) {
    try {
      console.log(`Navigation attempt ${i}...`);
      await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 20000 });
      loaded = true;
      break;
    } catch (e) {
      console.log(`Attempt ${i} error:`, e.message);
      await page.waitForTimeout(2000);
    }
  }

  if (!loaded) {
    console.error('Failed to load auth page after 5 attempts.');
    await browser.close();
    return;
  }

  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(6000);

  await browser.close();
})();
