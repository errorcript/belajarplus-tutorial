const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const text = await page.evaluate(() => document.body.innerText);
  
  // Parse rombel counts
  const matches = [];
  const regex = /(Kelas\s+(?:10|11|12)-(?:[1-9]|10))\s*\n\s*(\d+)\s+siswa/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push({ rombel: match[1], count: parseInt(match[2], 10) });
  }

  console.log('Total rombels parsed:', matches.length);
  matches.forEach(m => console.log(`${m.rombel.padEnd(15)}: ${m.count} siswa`));
  fs.writeFileSync('tws_live_rombel_counts_after_revision.json', JSON.stringify(matches, null, 2));

  await browser.close();
})();

