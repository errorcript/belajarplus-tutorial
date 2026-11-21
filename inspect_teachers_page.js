const { chromium } = require('playwright');
const fs = require('fs');

async function inspectTeachersPage() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to domain...');
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  console.log('Going to /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Teachers page snippet:\n', bodyText.slice(0, 500));

  // Ambil semua button di halaman
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons on page:', buttons);

  await page.screenshot({ path: 'teachers_page_purworejo11.png' });
  await browser.close();
}

inspectTeachersPage().catch(console.error);

