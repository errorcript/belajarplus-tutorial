const { chromium } = require('playwright');
const fs = require('fs');

async function downloadTemplateAndInspectData() {
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

  // 1. Dapatkan daftar Mapel resmi di SMAN 11 Purworejo
  console.log('Navigating to /master-data/mapel...');
  await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const mapelText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('mapel_page_text.txt', mapelText);
  console.log('Mapel page saved. Sample text:\n', mapelText.slice(0, 400));

  // 2. Buka jadwal dan unduh template
  console.log('Navigating to /master-data/jadwal...');
  await page.goto('https://belajarplus.com/master-data/jadwal', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const importBtn = page.locator('button:has-text("Impor Jadwal Massal")');
  await importBtn.click();
  await page.waitForTimeout(1000);

  // Tunggu download saat klik "Unduh Contoh"
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Unduh Contoh")')
  ]);
  const downloadPath = await download.path();
  fs.copyFileSync(downloadPath, 'contoh-impor-jadwal.xlsx');
  console.log('Template downloaded to contoh-impor-jadwal.xlsx');

  await browser.close();
}

downloadTemplateAndInspectData().catch(console.error);

