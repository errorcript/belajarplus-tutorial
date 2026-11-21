const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage();
  
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const anggotaInfo = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('a, button')).filter(el => (el.innerText || '').trim() === 'Anggota');
    return btns.map(b => ({
      tagName: b.tagName,
      href: b.getAttribute('href'),
      outer: b.outerHTML,
      parentOuter: b.parentElement ? b.parentElement.outerHTML : ''
    }));
  });

  console.log('Anggota buttons count:', anggotaInfo.length);
  console.log('Sample button:', anggotaInfo[0]);

  await browser.close();
})();

