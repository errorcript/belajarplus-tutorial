const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    if (req.url().includes('_serverFn') && req.method() === 'POST') {
      const p = req.postData();
      console.log('>> POST SERVER FN:', req.url(), p ? p.slice(0, 150) : '');
    }
  });

  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

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

  // Search Ahmad Azril
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('Ahmad Azril');
  await page.waitForTimeout(2000);

  // Click Lihat
  const lihatBtn = page.locator('button:has-text("Lihat"), a:has-text("Lihat")').first();
  await lihatBtn.click();
  await page.waitForTimeout(3000);

  // Click "Atur ulang kata sandi"
  const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
  console.log('Clicking reset password button...');
  await resetBtn.click();
  await page.waitForTimeout(2000);

  // Print all dialogs or alerts
  const dialogHtml = await page.evaluate(() => {
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"], div.fixed'));
    return dialogs.map(d => ({ text: d.innerText, html: d.outerHTML }));
  });

  fs.writeFileSync('reset_dialog_dump.json', JSON.stringify(dialogHtml, null, 2));
  console.log(`Captured ${dialogHtml.length} dialog elements.`);
  if (dialogHtml.length > 0) {
    console.log('Dialog 0 text:', dialogHtml[0].text);
  }

  await browser.close();
})();

