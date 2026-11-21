const { chromium } = require('playwright');
const fs = require('fs');

async function selectSchool() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to domain...');
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
  }, { session });

  console.log('Going to /admin...');
  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Klik dropdown 'Semua institusi saya'
  console.log('Looking for institution switcher...');
  const switcher = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
  if (await switcher.count() > 0) {
    console.log('Clicking institution switcher...');
    await switcher.click();
    await page.waitForTimeout(2000);
  } else {
    // Coba selector lain yang memuat teks 'Semua institusi saya'
    await page.getByText('Semua institusi saya').first().click();
    await page.waitForTimeout(2000);
  }

  // Ambil semua opsi yang muncul
  const options = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('[role="menuitem"], [role="option"], li, button, div.cursor-pointer').forEach(el => {
      const txt = el.innerText ? el.innerText.trim() : '';
      if (txt.includes('SMA') || txt.includes('Purworejo') || txt.includes('SMAN')) {
        list.push({ text: txt, tag: el.tagName, class: el.className });
      }
    });
    return list;
  });

  console.log('Dropdown options:\n', JSON.stringify(options, null, 2));

  // Ambil screenshot popup dropdown
  await page.screenshot({ path: 'dropdown_institusi.png' });

  // Cari yang cocok dengan SMAN 11 Purworejo
  const target = page.locator('text=/SMA NEGERI 11 PURWOREJO/i').first();
  if (await target.count() > 0) {
    console.log('Target SMA NEGERI 11 PURWOREJO found! Clicking...');
    await target.click();
    await page.waitForTimeout(4000);

    console.log('URL after selecting school:', page.url());

    // Cek localStorage untuk dapat schoolId
    const storage = await page.evaluate(() => {
      const res = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('bp:institution:')) res[k] = localStorage.getItem(k);
      }
      return res;
    });

    console.log('Active school ID:', storage);
    fs.writeFileSync('selected_school_id.json', JSON.stringify({ url: page.url(), storage }, null, 2));
  } else {
    console.log('Target not found in dropdown options.');
  }

  await browser.close();
}

selectSchool().catch(console.error);

