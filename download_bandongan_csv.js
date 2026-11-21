const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to Bandongan
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  // Navigate to /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Download ekspor CSV
  const downloadPromise = page.waitForEvent('download', { timeout: 15000 }).catch(() => null);
  const eksporBtn = page.locator('button:has-text("Ekspor"), a:has-text("Ekspor")').first();
  if (await eksporBtn.isVisible()) {
    console.log('Clicking Ekspor button...');
    await eksporBtn.click();
    const download = await downloadPromise;
    if (download) {
      await download.saveAs('bandongan_ekspor_students.csv');
      console.log('Saved bandongan_ekspor_students.csv successfully!');
    }
  }

  await browser.close();
})();

