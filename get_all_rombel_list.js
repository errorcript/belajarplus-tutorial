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

  // Switch to SMA NEGERI 1 RAWALO
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  // Extract all links and text on rombel page
  const rombels = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button, [role="row"]')).map(el => ({
      tag: el.tagName,
      text: el.innerText.trim(),
      href: el.href || ''
    })).filter(x => x.text.includes('Kelas') || x.text.includes('10-') || x.text.includes('11-') || x.text.includes('12-'));
    return links;
  });
  console.log('Rombel elements found:\n', JSON.stringify(rombels, null, 2));

  const fullText = await page.evaluate(() => document.body.innerText);
  console.log('Full Page Text length:', fullText.length);
  // Look for Kelas 10-2, 10-7, 11-7, 11-8, 12-7
  const matches = fullText.match(/Kelas 1[0-2]-[0-8][^\n]*/g);
  console.log('Matched Rombel lines:\n', matches);

  await browser.close();
})();

