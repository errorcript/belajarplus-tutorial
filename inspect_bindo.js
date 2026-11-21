const { chromium } = require('playwright');
const fs = require('fs');

async function inspectBindoModal() {
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

  await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Cari elemen dengan teks BAHASA INDONESIA
  console.log('Finding BAHASA INDONESIA card...');
  const card = page.locator('div:has-text("BAHASA INDONESIA")').filter({ hasText: 'Ubah' }).first();
  await card.locator('button:has-text("Ubah")').click();
  await page.waitForTimeout(1000);

  const dialogHtml = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerHTML : 'no dialog';
  });
  fs.writeFileSync('dialog_bindo.html', dialogHtml);
  console.log('Saved dialog_bindo.html');

  const dialogText = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText : '';
  });
  console.log('Dialog text:\n', dialogText);

  await browser.close();
}

inspectBindoModal().catch(console.error);

