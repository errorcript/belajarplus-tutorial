const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Click institution switcher
  console.log('Opening institution switcher...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => {});
  await page.waitForTimeout(1500);

  // Search input in popover / dropdown if exists
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible()) {
    console.log('Search input found! Searching for "dummy"...');
    await searchInput.fill('dummy');
    await page.waitForTimeout(1000);
    const searchResults = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], li, button, [data-radix-collection-item]'))
        .map(e => e.innerText.trim()).filter(Boolean);
    });
    console.log('Search "dummy" results:', searchResults);

    console.log('Searching for "trainer 3"...');
    await searchInput.fill('trainer 3');
    await page.waitForTimeout(1000);
    const searchResults3 = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], li, button, [data-radix-collection-item]'))
        .map(e => e.innerText.trim()).filter(Boolean);
    });
    console.log('Search "trainer 3" results:', searchResults3);

    console.log('Searching for "trainer"...');
    await searchInput.fill('trainer');
    await page.waitForTimeout(1000);
    const searchResultsTrainer = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="menuitem"], [role="option"], li, button, [data-radix-collection-item]'))
        .map(e => e.innerText.trim()).filter(Boolean);
    });
    console.log('Search "trainer" results:', searchResultsTrainer.slice(0, 30));
  } else {
    console.log('No search input found in switcher');
  }

  await browser.close();
})();

