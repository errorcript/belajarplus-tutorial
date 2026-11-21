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
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  const rombelCards = await page.evaluate(() => {
    // Get all containers that represent a rombel
    const items = Array.from(document.querySelectorAll('div, tr')).filter(el => {
      const txt = el.innerText || '';
      return (txt.startsWith('Kelas 10-') || txt.startsWith('Kelas 11-') || txt.startsWith('Kelas 12-')) && txt.length < 250;
    });
    return items.map(el => el.innerText.trim());
  });

  console.log('Rombel Cards summary:\n', JSON.stringify(rombelCards, null, 2));
  fs.writeFileSync('rombel_cards_summary.json', JSON.stringify(rombelCards, null, 2));

  await browser.close();
})();

