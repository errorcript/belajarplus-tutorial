const { chromium } = require('playwright');
const fs = require('fs');

async function inspectMapelPage() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

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

  page.on('response', async res => {
    if (res.url().includes('_serverFn') && res.request().method() === 'POST') {
      try {
        const text = await res.text();
        console.log('MAPEL SERVERFN URL:', res.url());
        console.log('MAPEL SERVERFN BODY SNIPPET:', text.slice(0, 300));
        fs.writeFileSync('last_mapel_response.json', text);
      } catch (e) {}
    }
  });

  let loaded = false;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle', timeout: 30000 });
      loaded = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'master_data_mapel_view.png', fullPage: true });

  // Cek tombol-tombol yang ada di halaman
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons on mapel page:', buttons);

  await browser.close();
}

inspectMapelPage().catch(console.error);

