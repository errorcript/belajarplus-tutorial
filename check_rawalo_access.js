const { chromium } = require('playwright');

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

  // Check institution list
  console.log('2. Checking if Rawalo is in institutions list...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1500);

  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="menuitem"], div[class*="menuitem"], button')).map(el => el.innerText.trim()).filter(t => t.toLowerCase().includes('rawalo'));
  });
  console.log('Institutions found with Rawalo:', items);

  await page.screenshot({ path: 'search_rawalo_inst.png' });

  await browser.close();
})();

