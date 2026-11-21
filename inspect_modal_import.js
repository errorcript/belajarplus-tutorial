const { chromium } = require('playwright');
const fs = require('fs');

async function inspectModalImport() {
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

  console.log('Navigating to /master-data/jadwal...');
  await page.goto('https://belajarplus.com/master-data/jadwal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Klik tombol "Impor Jadwal Massal"
  console.log('Clicking "Impor Jadwal Massal" button...');
  const importBtn = page.locator('button:has-text("Impor Jadwal Massal")');
  await importBtn.click();
  await page.waitForTimeout(1500);

  // Ambil screenshot modal
  await page.screenshot({ path: 'modal_impor_jadwal.png' });
  console.log('Screenshot modal saved to modal_impor_jadwal.png');

  // Ambil teks dialog
  const dialogText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]') || document.querySelector('.max-w-2xl');
    return dialog ? dialog.innerText : 'Dialog not found';
  });
  console.log('Dialog text:\n', dialogText);

  // Cek file input di dalam modal
  const hasFileInput = await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]');
    return !!input;
  });
  console.log('File input exists:', hasFileInput);

  await browser.close();
}

inspectModalImport().catch(console.error);

