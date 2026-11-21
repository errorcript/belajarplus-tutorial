const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to SEKOLAH DUMMY TRAINER 3
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(4000);
  await page.screenshot({ path: 'classes_list_debug.png' });

  const classLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, tr, [role="row"]')).map(el => ({
      href: el.href,
      text: el.innerText ? el.innerText.trim().slice(0, 80) : ''
    })).filter(x => x.text.includes('SIMULASI') || (x.href && x.href.includes('/admin/classes/')));
  });
  console.log('Class links found:', classLinks);

  await browser.close();
})();

