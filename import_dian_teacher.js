const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function importDianTeacher() {
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

  console.log('Navigating to /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const importBtn = page.locator('button').filter({ hasText: /Impor PTK|Impor/i }).first();
  await importBtn.click();
  await page.waitForTimeout(1500);

  const fileInput = page.locator('input[type="file"]').first();
  const filePath = path.resolve('[IMPOR_PTK]_SMAN_11_Purworejo_Dian2.xlsx');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(2000);

  const confirmBtn = page.locator('button').filter({ hasText: /Lanjutkan|Simpan|Impor|Konfirmasi|Unggah/i }).last();
  console.log('Clicking confirm button:', await confirmBtn.innerText());
  await confirmBtn.click();
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'import_dian2_result.png' });
  console.log('Saved import_dian2_result.png');

  await browser.close();
}

importDianTeacher().catch(console.error);

