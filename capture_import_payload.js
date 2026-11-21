const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureImportPayload() {
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

  page.on('request', req => {
    if (req.url().includes('_serverFn') && req.method() === 'POST') {
      console.log('REQ URL:', req.url());
      console.log('REQ HEADERS:', JSON.stringify(req.headers(), null, 2));
      console.log('REQ POST DATA:\n', req.postData());
      fs.writeFileSync('last_request_import.txt', `URL: ${req.url()}\nHEADERS: ${JSON.stringify(req.headers(), null, 2)}\nDATA: ${req.postData()}`);
    }
  });

  let loaded = false;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await page.goto('https://belajarplus.com/master-data/jadwal', { waitUntil: 'networkidle', timeout: 30000 });
      loaded = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await page.waitForTimeout(2000);

  const importBtn = page.locator('button:has-text("Impor Jadwal Massal")');
  await importBtn.click();
  await page.waitForTimeout(1000);

  const fileInput = page.locator('input[type="file"]');
  const filePath = path.resolve('test_impor_upacara.xlsx');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(1500);

  const submitBtn = page.locator('[role="dialog"] button:has-text("Impor")');
  await submitBtn.click();
  await page.waitForTimeout(3000);

  await browser.close();
}

captureImportPayload().catch(console.error);

