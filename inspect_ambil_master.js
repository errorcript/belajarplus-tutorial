const { chromium } = require('playwright');
const fs = require('fs');

async function inspectAmbilMasterKurikulum() {
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

  console.log('Clicking "Ambil dari Master Kurikulum"...');
  await page.click('button:has-text("Ambil dari Master Kurikulum")');
  await page.waitForTimeout(1500);

  const dialogText = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText : 'no dialog';
  });
  console.log('Dialog Ambil Master text:\n', dialogText);
  await page.screenshot({ path: 'modal_ambil_master.png' });

  await browser.close();
}

inspectAmbilMasterKurikulum().catch(console.error);

