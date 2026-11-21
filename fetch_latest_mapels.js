const { chromium } = require('playwright');
const fs = require('fs');

async function fetchLatestSchoolSubjects() {
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
        if (text.includes('BAHASA INDONESIA') && text.includes('sortOrder')) {
          console.log('SAVED LATEST MAPELS DATA, length:', text.length);
          fs.writeFileSync('last_mapel_response.json', text);
        }
      } catch (e) {}
    }
  });

  await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  await browser.close();
}

fetchLatestSchoolSubjects().catch(console.error);

