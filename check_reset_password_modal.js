const { chromium } = require('playwright');

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

  // Switch to SMAN 1 GONDANG
  console.log('2. Switching institution to SMAN 1 GONDANG...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SEKOLAH DUMMY"), button:has-text("SMA NEGERI")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible().catch(()=>false)) {
    await searchInput.fill('gondang');
    await page.waitForTimeout(1000);
    await page.locator('[role="menuitem"]:has-text("GONDANG"), div:has-text("GONDANG")').last().click();
    await page.waitForTimeout(5000);
  }

  console.log('3. Navigating to Master Data Siswa (/admin/students)...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Search for AISYAH TASLIMAH
  const searchField = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchField.fill('AISYAH TASLIMAH');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // Click Lihat
  console.log('4. Clicking Lihat...');
  await page.locator('button:has-text("Lihat")').first().click();
  await page.waitForTimeout(2000);

  // Click "Atur ulang kata sandi"
  console.log('5. Clicking Atur ulang kata sandi...');
  const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
  await resetBtn.click();
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'modal_reset_sandi.png' });

  const modalText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"], [data-state="open"]')).map(d => d.innerText);
  });
  console.log('Open Dialogs Content:\n', JSON.stringify(modalText, null, 2));

  await browser.close();
})();
