const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Monitor network requests
  page.on('request', req => {
    if (req.url().includes('_serverFn') || req.url().includes('password') || req.url().includes('reset')) {
      console.log('REQ:', req.method(), req.url(), req.postData()?.slice(0, 200));
    }
  });

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

  // Go to /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Search "Ahmad Azril"
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('Ahmad Azril');
  await page.waitForTimeout(2000);

  // Click Lihat
  const lihatBtn = page.locator('button:has-text("Lihat"), a:has-text("Lihat")').first();
  await lihatBtn.click();
  await page.waitForTimeout(3000);

  // Click "Atur ulang kata sandi"
  const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
  console.log('Reset button visible?', await resetBtn.isVisible());
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await page.waitForTimeout(2000);

    // Check modal or dialog that appears
    const dialogText = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"], div[class*="alert"]');
      return d ? d.innerText : 'No dialog found';
    });
    console.log('Dialog text after clicking Atur ulang kata sandi:');
    console.log(dialogText);

    // Check inputs inside dialog
    const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[role="dialog"] input, div.fixed input')).map(i => ({
        type: i.type,
        placeholder: i.placeholder,
        name: i.name
      }));
    });
    console.log('Inputs inside reset dialog:', inputs);
  }

  await browser.close();
})();

