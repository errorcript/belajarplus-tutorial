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

  // Switch to SEKOLAH DUMMY TRAINER 3
  console.log('2. Switching institution...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Going to class page...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Click "Buat Penugasan untuk kelas ini"
  const createBtn = page.locator(':is(a, button):has-text("Buat Penugasan untuk kelas ini")').first();
  console.log('Clicking Buat Penugasan untuk kelas ini...');
  await createBtn.click();
  await page.waitForTimeout(3000);

  // Check activity checkbox
  const cb = page.locator('input[type="checkbox"]').first();
  await cb.check();
  console.log('Activity checked!');
  await page.waitForTimeout(500);

  // Fill title
  const title = page.locator('input[placeholder*="Baca Bab"], input[placeholder*="penugasan"]').first();
  await title.fill('SIMULASI ASAS SE JATENG');
  console.log('Title filled!');
  await page.waitForTimeout(1000);

  // Click Simpan penugasan
  const saveBtn = page.locator('button:has-text("Simpan penugasan")').first();
  console.log('Save button enabled:', await saveBtn.isEnabled());
  if (await saveBtn.isEnabled()) {
    await saveBtn.click();
    console.log('Simpan penugasan clicked!');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'penugasan_berhasil_published.png' });
  }

  const finalCheck = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Final penugasan tab text:\n', finalCheck);

  await browser.close();
})();

