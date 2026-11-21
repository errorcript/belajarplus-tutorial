const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to Gemolong
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const gemolongOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /GEMOLONG/i }).first();
  await gemolongOpt.click();
  await page.waitForTimeout(4000);

  // Go to /admin/teachers
  console.log('Navigating to /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Search input for "anis"
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('anis');
    await page.waitForTimeout(2000);
    const searchRes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log('Search "anis" in teachers:', searchRes);
  }

  // Print all teachers in current page
  const allTeachers = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
  });
  console.log(`Total teachers visible: ${allTeachers.length}`);
  console.log('Teachers snippet:', allTeachers.slice(0, 10));

  await browser.close();
})();

