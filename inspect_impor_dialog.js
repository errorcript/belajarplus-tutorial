const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
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

  // Look for "Impor Siswa" button
  const imporBtn = page.locator('button:has-text("Impor Siswa"), a:has-text("Impor Siswa"), button:has-text("Impor")').first();
  console.log('Impor Siswa button visible?', await imporBtn.isVisible());
  if (await imporBtn.isVisible()) {
    console.log('Clicking Impor Siswa...');
    await imporBtn.click();
    await page.waitForTimeout(2000);

    const dialogText = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"]');
      return d ? d.innerText : document.body.innerText;
    });
    console.log('Impor dialog text:\n', dialogText);

    // Check file input inside dialog
    const fileInput = page.locator('input[type="file"]');
    console.log('File input count in dialog:', await fileInput.count());
  }

  await browser.close();
})();

