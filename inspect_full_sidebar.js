const { chromium } = require('playwright');
const fs = require('fs');

async function inspectFullSidebar() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  // Direct load via token
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  // Navigate to /admin
  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Select SMAN 11 Purworejo
  const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
  if (await sw.count() > 0) {
    await sw.click();
    await page.waitForTimeout(1000);
    const target = page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
    if (await target.count() > 0) {
      await target.click();
      await page.waitForTimeout(3000);
    }
  }

  // Ambil semua links dan text di seluruh aside / navigation
  const navData = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('aside a, nav a').forEach(el => {
      list.push({
        text: el.innerText.replace(/\n+/g, ' ').trim(),
        href: el.getAttribute('href')
      });
    });
    return list;
  });

  console.log('--- DAFTAR LENGKAP MENU SIDEBAR ---');
  navData.forEach((item, i) => console.log(`[${i + 1}] ${item.text} -> ${item.href}`));

  fs.writeFileSync('sidebar_menus.json', JSON.stringify(navData, null, 2));

  await browser.close();
}

inspectFullSidebar().catch(console.error);

