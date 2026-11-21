const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());

  // Capture all institutions from the UI
  // Look for institution switcher button
  const switcher = page.locator('button:has-text("Semua institusi"), button:has-text("Rekap gabungan"), [data-state]').first();
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => {});
  await page.waitForTimeout(2000);

  const insts = await page.evaluate(() => {
    // Check localStorage for institutions or active institution
    const lsKeys = Object.keys(localStorage);
    const lsData = {};
    lsKeys.forEach(k => {
      try {
        lsData[k] = JSON.parse(localStorage.getItem(k));
      } catch(e) {
        lsData[k] = localStorage.getItem(k);
      }
    });

    const domItems = Array.from(document.querySelectorAll('*'))
      .map(el => el.textContent.trim())
      .filter(t => t.toLowerCase().includes('trainer') || t.toLowerCase().includes('dummy'));

    return { lsData, domItems: Array.from(new Set(domItems)).slice(0, 20) };
  });

  console.log('DOM items matching trainer/dummy:', insts.domItems);

  // Take screenshot of dashboard
  await page.screenshot({ path: 'henri_dashboard.png' });
  console.log('Saved henri_dashboard.png');

  await browser.close();
})();

