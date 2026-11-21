const { chromium } = require('playwright');
const fs = require('fs');

async function checkLmsActiveUI() {
  console.log('=== CHECK UI SMAN 11 PURWOREJO ===');
  const session = fs.readFileSync('khansania_session.json', 'utf8');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  // Set session
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
  }, { session });

  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Buka dropdown institusi
  const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
  if (await sw.count() > 0) {
    await sw.click();
    await page.waitForTimeout(1500);
  }

  // Cari teks item SMA NEGERI 11 PURWOREJO di dropdown
  const targetOption = await page.evaluate(() => {
    let match = null;
    document.querySelectorAll('button, [role=\"menuitem\"]').forEach(el => {
      const txt = el.innerText || '';
      if (txt.includes('SMA NEGERI 11 PURWOREJO')) {
        match = txt.replace(/\n+/g, ' | ');
      }
    });
    return match;
  });

  console.log('Item SMA NEGERI 11 PURWOREJO di dropdown:', targetOption);

  // Klik SMA NEGERI 11 PURWOREJO
  const targetBtn = page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
  if (await targetBtn.count() > 0) {
    await targetBtn.click();
    await page.waitForTimeout(4000);

    console.log('URL setelah pilih sekolah:', page.url());

    // Ambil semua menu di sidebar
    const sidebarText = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll('aside a, nav a, aside button').forEach(el => {
        items.push(el.innerText.replace(/\n+/g, ' ').trim());
      });
      return items;
    });

    console.log('Sidebar items setelah pilih sekolah:\n', sidebarText);
    await page.screenshot({ path: 'lms_active_sidebar.png' });
  }

  await browser.close();
}

checkLmsActiveUI().catch(console.error);

