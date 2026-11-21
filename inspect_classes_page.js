const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  console.log('2. Switching to SEKOLAH DUMMY TRAINER 3...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => {});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Navigating to /admin/classes...');
  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Classes page body:\n', bodyText);

  // Check buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button'))
      .map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons on classes page:', buttons);

  await page.screenshot({ path: 'dummy_trainer_3_classes.png' });

  // Look for "Buat Kelas" or "Tambah Kelas"
  const buatBtn = page.locator('button:has-text("Buat Kelas"), button:has-text("Tambah Kelas"), button:has-text("Buat"), button:has-text("Tambah")').first();
  if (await buatBtn.isVisible()) {
    console.log('Clicking button:', await buatBtn.innerText());
    await buatBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'dummy_trainer_3_create_class_modal.png' });

    const modalText = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"], [data-state="open"], .modal');
      return modal ? modal.innerText : 'No modal found';
    });
    console.log('Create class modal text:\n', modalText);
  }

  await browser.close();
})();

