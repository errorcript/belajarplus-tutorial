const { chromium } = require('playwright');
const fs = require('fs');

async function verifyRombelCountsLive() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
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

  console.log('Navigating to /master-data/rombel...');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'tws_rombel_after_import_live.png', fullPage: true });

  const bodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('tws_rombel_after_import_body.txt', bodyText);

  const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
  const rombelCounts = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Kelas 10-') || lines[i].startsWith('Kelas 11-') || lines[i].startsWith('Kelas 12-')) {
      const name = lines[i];
      const info = lines[i+1] || '';
      const match = info.match(/(\d+)\s+siswa/);
      rombelCounts.push({ name, students: match ? parseInt(match[1]) : 0, raw: info });
    }
  }

  console.table(rombelCounts);
  console.log('Total live students in rombels now:', rombelCounts.reduce((acc, r) => acc + r.students, 0));

  await browser.close();
}

verifyRombelCountsLive().catch(console.error);

