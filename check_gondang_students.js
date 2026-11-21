const { chromium } = require('playwright');

const targetStudents = [
  'AISYAH TASLIMAH NUR SAFARA',
  'ALFIRA RENATA JULIYANI',
  'ALISA ROHMA PAMILIH',
  'ANGGA PRASETYO',
  'ANNISA NUR HIDAYAH',
  'ANNISA SEKAR INDAH FEBYANA',
  'ARIESKA NAVA SAPOETRY',
  'BAGAS DWI PRASETYO',
  'CESIKA ANATASYA NATALIA',
  'CHARISTA DESTYA PRAFAMA',
  'CHIKA ADIANA AGUSTIN',
  'DIVAY SOFIA AGUSTIN'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(() => false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMAN 1 GONDANG
  console.log('2. Switching institution to SMAN 1 GONDANG...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => { });
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('gondang');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("GONDANG"), div:has-text("GONDANG")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Navigating to Master Data Siswa (/admin/students)...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const foundAccounts = [];

  for (const name of targetStudents) {
    console.log(`Searching for: ${name}...`);
    const searchField = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
    await searchField.fill('');
    await page.waitForTimeout(300);
    // Use first 2 words for safe searching
    const query = name.split(' ').slice(0, 2).join(' ');
    await searchField.fill(query);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      return trs.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td, [role="cell"]')).map(td => td.innerText.trim());
        return cells;
      }).filter(c => c.length > 0);
    });

    console.log(`Results for ${query}:`, rows);
    foundAccounts.push({
      targetName: name,
      query: query,
      results: rows
    });
  }

  const fs = require('fs');
  fs.writeFileSync('gondang_search_results.json', JSON.stringify(foundAccounts, null, 2));
  console.log('Done searching all 12 students.');

  await browser.close();
})();

