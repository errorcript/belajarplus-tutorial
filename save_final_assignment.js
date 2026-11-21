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

  // Switch to SEKOLAH DUMMY TRAINER 3
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => { });
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Direct go to workspace tab penugasan
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan');
  await page.waitForTimeout(4000);

  // Click Buat Penugasan untuk kelas ini
  await page.locator('button:has-text("Buat Penugasan untuk kelas ini")').first().click();
  await page.waitForTimeout(3000);

  // Check the checkbox for the activity
  console.log('2. Checking activity checkbox...');
  const actCheckbox = page.locator('input[type="checkbox"]').first();
  await actCheckbox.check();
  await page.waitForTimeout(1000);

  // Fill Judul penugasan
  console.log('3. Filling title...');
  const titleInput = page.locator('input[placeholder*="Baca Bab"]').first();
  await titleInput.fill('SIMULASI ASAS SE JATENG');
  await page.waitForTimeout(1000);

  // Check save button
  const saveBtn = page.locator('button:has-text("Simpan penugasan")').first();
  console.log('Save button enabled:', await saveBtn.isEnabled());

  if (await saveBtn.isEnabled()) {
    console.log('4. Clicking Simpan penugasan...');
    await saveBtn.click();
    await page.waitForTimeout(5000);

    await page.screenshot({ path: 'penugasan_berhasil_diterbitkan.png' });
    const finalContent = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    console.log('Final page state:\n', finalContent);
  }

  await browser.close();
})();

