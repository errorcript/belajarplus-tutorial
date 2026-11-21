const { chromium } = require('playwright');
const fs = require('fs');

async function checkKurikulumOptions() {
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
  await page.click('button:has-text("Ambil dari Master Kurikulum")');
  await page.waitForTimeout(1000);

  const kurikulumOptions = await page.evaluate(() => {
    const select = document.querySelector('[role="dialog"] select');
    if (!select) return [];
    return Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
  });
  console.log('Kurikulum options:', kurikulumOptions);

  await browser.close();
}

checkKurikulumOptions().catch(console.error);

