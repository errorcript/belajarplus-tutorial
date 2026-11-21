const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMA NEGERI 1 RAWALO
  console.log('2. Switching to SMA NEGERI 1 RAWALO...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  // Navigate to Master Data Rombel
  console.log('3. Navigating to Master Data Rombel (/admin/rombel)...');
  await page.goto('https://belajarplus.com/admin/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'master_data_rombel_rawalo.png' });

  // Extract all table data / cards from /admin/rombel
  const rombelData = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
    if (rows.length > 0) {
      return rows.map(r => {
        const cells = Array.from(r.querySelectorAll('td, [role="cell"], th')).map(c => c.innerText.trim());
        return cells;
      }).filter(c => c.length > 0);
    }

    // If card-based
    const cards = Array.from(document.querySelectorAll('.card, div[class*="rounded"]')).map(c => c.innerText.trim());
    return cards;
  });

  console.log('Rombel Data from /admin/rombel:\n', JSON.stringify(rombelData, null, 2));

  // Also let's check the target students in /admin/students to verify their exact rombel
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const targets = [
    { name: 'ZAHIRA NUR SALSABILA', expected: 'Kelas 10-2' },
    { name: 'DIAN FITRININGSIH', expected: '— (Belum di Rombel)' },
    { name: 'UZLIFATUL AZIFAH', expected: 'Kelas 11-7' },
    { name: 'LIVIA NUR AZIZAH', expected: 'Kelas 11-8' },
    { name: 'EMYL AGUSTIAN FIFANANDA', expected: 'Kelas 12-7' },
    { name: 'Farendy Hozinatul Asror', expected: 'Kelas 11-3' }
  ];

  const studentVerification = [];

  for (const t of targets) {
    const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
    await sf.fill('');
    await page.waitForTimeout(200);
    await sf.fill(t.name);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      return trs.map(tr => Array.from(tr.querySelectorAll('td, [role="cell"]')).map(td => td.innerText.trim())).filter(c => c.length > 0);
    });

    studentVerification.push({
      target: t.name,
      expected: t.expected,
      results: rows
    });
  }

  fs.writeFileSync('rombel_check_results.json', JSON.stringify({ rombelData, studentVerification }, null, 2));
  console.log('Rombel check complete.');

  await browser.close();
})();

