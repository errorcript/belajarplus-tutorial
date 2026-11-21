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

  // Grab all links in sidebar / page
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map(a => ({ text: a.innerText.replace(/\n+/g, ' ').trim(), href: a.getAttribute('href') }));
  });
  console.log('Sidebar links:', links);

  // Let's find the link for Rombel
  const rombelLink = links.find(l => l.text.toLowerCase().includes('rombel'));
  console.log('Rombel link:', rombelLink);

  if (rombelLink) {
    await page.goto('https://belajarplus.com' + rombelLink.href, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(4000);
    console.log('Navigated to rombel page:', page.url());

    // Print all text on the rombel page
    const bodyText = await page.evaluate(() => document.body.innerText);
    console.log('Does rombel page text contain "anisca"?', bodyText.toLowerCase().includes('anisca'));
    console.log('Does rombel page text contain "fa"?', bodyText.toLowerCase().includes('fa'));
    console.log('Does rombel page text contain "xi"?', bodyText.toLowerCase().includes('xi'));
    console.log('Does rombel page text contain "36"?', bodyText.toLowerCase().includes('36'));

    // Print table or cards on rombel page
    const items = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr, div[class*="card"], div[class*="border"]'))
        .map(el => el.innerText.replace(/\s+/g, ' ').trim())
        .filter(t => t.includes('Kelas') || t.includes('XII') || t.includes('XI') || t.includes('10'));
    });
    console.log('Rombel items on screen (first 20):', items.slice(0, 20));
  }

  await browser.close();
})();

