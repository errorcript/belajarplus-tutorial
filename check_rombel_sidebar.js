const { chromium } = require('playwright');
const fs = require('fs');

async function checkRombelViaSidebar() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
  }, { session });

  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Pastikan SMAN 11 Purworejo terpilih
  const headText = await page.evaluate(() => document.body.innerText);
  if (!headText.includes('SMA NEGERI 11 PURWOREJO')) {
    console.log('Selecting SMA NEGERI 11 PURWOREJO...');
    const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
    await sw.click();
    await page.waitForTimeout(1500);
    await page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first().click();
    await page.waitForTimeout(3000);
  }

  console.log('Institusi aktif confirmed.');

  // Klik menu Rombel di sidebar
  console.log('Clicking Rombel menu...');
  const rombelMenu = page.locator('a[href*="/master-data/rombel"], nav a:has-text("Rombel")').first();
  await rombelMenu.click();
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Rombel Page Body:\n', bodyText.slice(0, 1000));

  await page.screenshot({ path: 'rombel_page_purworejo11.png' });
  await browser.close();
}

checkRombelViaSidebar().catch(console.error);

