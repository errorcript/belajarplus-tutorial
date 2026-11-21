const { chromium } = require('playwright');
const fs = require('fs');

async function inspectJadwalPage() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  console.log('Launching browser with Chrome channel & session initScript...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--dns-result-order=ipv4first']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  await context.addInitScript(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  const page = await context.newPage();

  let loaded = false;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      console.log(`Navigating to /master-data/jadwal (attempt ${attempt})...`);
      await page.goto('https://belajarplus.com/master-data/jadwal', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      loaded = true;
      break;
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  if (!loaded) {
    console.error('Failed to load page');
    await browser.close();
    return;
  }

  await page.waitForTimeout(4000);

  // Ambil screenshot full page
  await page.screenshot({ path: 'master_data_jadwal_live_720.png', fullPage: false });
  console.log('Screenshot saved to master_data_jadwal_live_720.png');

  await browser.close();
}

inspectJadwalPage().catch(console.error);
