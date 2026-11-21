const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  // If already logged in or login form
  if (await page.locator('input[type="email"]').isVisible().catch(() => false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SEKOLAH DUMMY TRAINER 3
  console.log('2. Switching institution...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(() => { });
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Going to class page...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'penugasan_status.png' });
  const text = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Current Penugasan text:\n', text);

  // Check if there's "Buat Penugasan" button
  const createBtn = page.locator('button:has-text("Buat Penugasan")');
  console.log('Buat Penugasan button count:', await createBtn.count());
  if (await createBtn.count() > 0) {
    await createBtn.first().click();
    await page.waitForTimeout(3000);

    // Check checkbox
    const cb = page.locator('input[type="checkbox"]').first();
    if (await cb.isVisible().catch(() => false)) {
      await cb.check();
      console.log('Activity checked!');
    }

    // Fill title
    const title = page.locator('input[placeholder*="Baca Bab"], input[placeholder*="penugasan"]').first();
    if (await title.isVisible().catch(() => false)) {
      await title.fill('SIMULASI ASAS SE JATENG');
      console.log('Title filled!');
    }

    await page.waitForTimeout(1000);
    const saveBtn = page.locator('button:has-text("Simpan penugasan")').first();
    if (await saveBtn.isEnabled()) {
      await saveBtn.click();
      console.log('Simpan penugasan clicked!');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'penugasan_berhasil.png' });
    }
  }

  const finalCheck = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Final status:\n', finalCheck);

  await browser.close();
})();

