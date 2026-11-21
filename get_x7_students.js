const { chromium } = require('playwright');

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

  // Switch to SMA NEGERI 1 RAWALO
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(() => { });
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  console.log('2. Navigating to Master Data Siswa (/admin/students)...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Click filter Rombel
  console.log('Filtering Rombel...');
  await page.locator('button:has-text("Semua Rombel")').first().click();
  await page.waitForTimeout(1500);

  // Find 10-7 or X-7 option
  const rombelItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], div[class*="item"]')).map(el => el.innerText.trim());
  });
  console.log('Available rombel filter options:', rombelItems);

  // Click the option for X-7 / 10-7
  const x7Option = page.locator('[role="menuitem"]:has-text("10-7"), [role="menuitem"]:has-text("X-7"), div:has-text("10-7"), div:has-text("X-7")').first();
  if (await x7Option.isVisible().catch(() => false)) {
    await x7Option.click();
    await page.waitForTimeout(3000);

    // Get all students in X-7
    const studentsX7 = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      return rows.map(r => r.innerText.trim()).filter(Boolean);
    });
    console.log('Total students in X-7:', studentsX7.length);
    console.log('Students in X-7 matching Dian:', studentsX7.filter(s => s.toUpperCase().includes('DIAN')));
    console.log('All students in X-7:\n', studentsX7.slice(0, 40));
  }

  await browser.close();
})();

