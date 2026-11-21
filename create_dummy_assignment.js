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
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Go to Class page tab penugasan
  console.log('2. Opening Penugasan Form...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan');
  await page.waitForTimeout(4000);

  const assignBtn = page.locator('button:has-text("Buat Penugasan untuk kelas ini"), a:has-text("Buat Penugasan untuk kelas ini")').first();
  await assignBtn.click();
  await page.waitForTimeout(3000);

  // Select activity: SIMULASI ASAS SE JATENG
  console.log('3. Selecting SIMULASI ASAS SE JATENG activity...');
  const activityRadio = page.locator('div:has-text("SIMULASI ASAS SE JATENG"):has-text("Aktivitas Soal"), label:has-text("SIMULASI ASAS SE JATENG")').first();
  await activityRadio.click();
  await page.waitForTimeout(1000);

  // Fill Judul penugasan
  console.log('4. Filling Judul penugasan...');
  const judulInput = page.locator('input[placeholder*="penugasan"], input[name*="title"], input[type="text"]').first();
  await judulInput.fill('SIMULASI ASAS SE JATENG');
  await page.waitForTimeout(1000);

  // Click Simpan penugasan
  console.log('5. Clicking Simpan penugasan...');
  const saveBtn = page.locator('button:has-text("Simpan penugasan")').first();
  await saveBtn.click();
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'penugasan_sukses.png' });

  const finalPageText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Penugasan tab after creation:\n', finalPageText);

  await browser.close();
})();

