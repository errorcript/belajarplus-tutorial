const { chromium } = require('playwright');

async function debugDashboardNetwork() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('request', req => {
    if (req.url().includes('supabase') || req.url().includes('_serverFn') || req.url().includes('api')) {
      console.log('>> REQ:', req.method(), req.url());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('supabase') || res.url().includes('_serverFn') || res.url().includes('api')) {
      let status = res.status();
      console.log('<< RES:', status, res.url());
      if (status >= 400) {
        try {
          const body = await res.text();
          console.log('   ERR BODY:', body.slice(0, 200));
        } catch (e) {}
      }
    }
  });

  console.log('Opening /auth...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  await page.locator('input[type="email"]').first().fill('khansania.medtra@gmail.com');
  await page.locator('input[type="password"]').first().fill('Khansa04');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();

  console.log('Submitted login form, waiting 10s...');
  await page.waitForTimeout(10000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body Text snippet:\n', bodyText.slice(0, 400));

  await browser.close();
}

debugDashboardNetwork().catch(console.error);

