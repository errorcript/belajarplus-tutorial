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

  // Direct go to workspace tab penugasan
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan');
  await page.waitForTimeout(4000);

  // Click Buat Penugasan untuk kelas ini
  await page.locator('button:has-text("Buat Penugasan untuk kelas ini"), a:has-text("Buat Penugasan untuk kelas ini")').first().click();
  await page.waitForTimeout(3000);

  // Click on the activity card
  console.log('Selecting activity SIMULASI ASAS SE JATENG...');
  await page.locator('text=SIMULASI ASAS SE JATENG').last().click();
  await page.waitForTimeout(1500);

  // Let's check what input fields are present
  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, textarea, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder,
      value: el.value,
      text: el.innerText ? el.innerText.trim().slice(0, 30) : ''
    }));
  });
  console.log('Inputs present on penugasan form:', inputs);

  // Submit if "Simpan penugasan" button is ready
  const saveBtn = page.locator('button:has-text("Simpan penugasan")').first();
  console.log('Save button enabled:', await saveBtn.isEnabled());
  if (await saveBtn.isEnabled()) {
    await saveBtn.click();
    await page.waitForTimeout(4000);
    console.log('Clicked Simpan penugasan!');
    await page.screenshot({ path: 'penugasan_selesai.png' });
    const resText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    console.log('Result:\n', resText);
  }

  await browser.close();
})();

