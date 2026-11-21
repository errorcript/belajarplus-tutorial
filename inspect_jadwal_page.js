const { chromium } = require('playwright');
const fs = require('fs');

async function inspectJadwalPage() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  console.log('Launching browser with IPv4 preference & initScript...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--dns-result-order=ipv4first']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  // Inject session sebelum dokumen apapun dimuat!
  await context.addInitScript(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  const page = await context.newPage();

  // Retry navigasi jika kena ERR_CONNECTION_RESET
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
    console.error('Failed to load page after 4 attempts');
    await browser.close();
    return;
  }

  await page.waitForTimeout(3000);

  const title = await page.title();
  const url = page.url();
  console.log('Final Page URL:', url);
  console.log('Final Page Title:', title);

  await page.screenshot({ path: 'master_data_jadwal_view.png', fullPage: true });
  console.log('Screenshot saved to master_data_jadwal_view.png');

  const pageText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('jadwal_page_text.txt', pageText);
  console.log('Page text snippet:\n', pageText.slice(0, 500));

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className
    }));
  });
  console.log('Buttons on page:', buttons);

  await browser.close();
}

inspectJadwalPage().catch(console.error);
