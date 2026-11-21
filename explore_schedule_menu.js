const { chromium } = require('playwright');
const fs = require('fs');

async function exploreScheduleMenu() {
  console.log('=== EKSPLORASI FITUR JADWAL BELAJARPLUS ===');
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  // Set session
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Pastikan SMAN 11 Purworejo aktif
  const hText = await page.evaluate(() => document.body.innerText.slice(0, 100));
  if (!hText.includes('SMA NEGERI 11 PURWOREJO')) {
    const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
    if (await sw.count() > 0) {
      await sw.click();
      await page.waitForTimeout(1000);
      await page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Ambil semua links dan text di sidebar
  const sidebarData = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('nav a, aside a, [role="navigation"] a, a').forEach(a => {
      const text = a.innerText ? a.innerText.replace(/\n+/g, ' ').trim() : '';
      const href = a.getAttribute('href');
      if (text && href && !href.startsWith('#')) {
        items.push({ text, href });
      }
    });
    return items;
  });

  console.log('Semua link navigasi:', JSON.stringify(sidebarData, null, 2));

  // Ambil teks lengkap halaman
  const bodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('admin_dashboard_full_text.txt', bodyText);
  await page.screenshot({ path: 'dashboard_purworejo11.png', fullPage: true });

  // Cari elemen yang mengandung teks Jadwal
  const jadwalElements = await page.evaluate(() => {
    const res = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.innerText && /jadwal/i.test(el.innerText)) {
        res.push({ tag: el.tagName, text: el.innerText, parentText: el.parentElement ? el.parentElement.innerText.slice(0, 50) : '' });
      }
    });
    return res;
  });
  console.log('Elemen bertuliskan "jadwal":', jadwalElements);

  await browser.close();
}

exploreScheduleMenu().catch(console.error);

