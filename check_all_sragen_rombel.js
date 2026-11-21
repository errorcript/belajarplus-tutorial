const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  const sragenSchools = [
    'SMAN 1 GEMOLONG',
    'SMA NEGERI 1 GEMOLONG',
    'SMAN 1 SRAGEN',
    'SMA NEGERI 1 SRAGEN',
    'SMAN 2 SRAGEN',
    'SMA NEGERI 2 SRAGEN',
    'SMAN 3 SRAGEN',
    'SMA NEGERI 3 SRAGEN',
    'SMAN 1 SUKODONO',
    'SMA NEGERI 1 SUKODONO',
    'SMAN 1 GONDANG',
    'SMA NEGERI 1 GONDANG',
    'SMAN 1 TANGEN',
    'SMA NEGERI 1 TANGEN'
  ];

  for (const sName of ['GEMOLONG', 'SRAGEN', 'SUKODONO', 'GONDANG', 'TANGEN']) {
    // Click switcher
    const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
    await switcher.click();
    await page.waitForTimeout(1000);

    const matchOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: new RegExp(sName, 'i') }).all();
    const opts = await matchOpt;
    console.log(`Found ${opts.length} schools matching ${sName}`);

    for (let i = 0; i < opts.length; i++) {
      // Re-click switcher
      const sw = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
      await sw.click().catch(() => { });
      await page.waitForTimeout(1000);
      const items = await page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: new RegExp(sName, 'i') }).all();
      if (!items[i]) continue;
      const text = await items[i].innerText().catch(() => '');
      console.log(`Checking [${i}] ${text.replace(/\n+/g, ' ')}...`);
      await items[i].click().catch(() => { });
      await page.waitForTimeout(3000);

      // Check /master-data/rombel
      await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => { });
      await page.waitForTimeout(2500);
      const pageText = await page.evaluate(() => document.body.innerText);

      if (pageText.toLowerCase().includes('anisca') || pageText.toLowerCase().includes('fa 2') || pageText.toLowerCase().includes('fa2')) {
        console.log(`>>> BINGO! Found in school: ${text}!`);
        const rows = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('tbody tr, div[class*="card"], div[class*="border"]'))
            .map(el => el.innerText.replace(/\s+/g, ' ').trim())
            .filter(t => t.includes('FA') || t.includes('Anisca') || t.includes('11'));
        });
        console.log('Details:', rows);
        await browser.close();
        return;
      } else {
        console.log(`   No anisca/fa 2 here. (Has rombel: ${pageText.includes('Kelas')})`);
      }
    }
  }

  console.log('Search across Sragen schools complete.');
  await browser.close();
})();

