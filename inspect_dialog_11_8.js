const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Clicking Anggota button for index 17 (Kelas 11-8)...');
  await page.getByRole('button', { name: 'Anggota' }).nth(17).click();
  await page.waitForTimeout(3000);

  const dialogText = await page.evaluate(() => {
    const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
    return dialog ? dialog.innerText : 'NO DIALOG';
  });
  console.log('=== KELAS 11-8 DIALOG TEXT SNIPPET ===\n', dialogText.slice(0, 1500));
  fs.writeFileSync('dialog_11_8_text.txt', dialogText);

  await browser.close();
})();

