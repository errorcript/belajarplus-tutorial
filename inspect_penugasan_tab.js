const { chromium } = require('playwright');
const fs = require('fs');

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
  console.log('2. Switching to SEKOLAH DUMMY TRAINER 3...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Go to Penugasan tab
  console.log('3. Navigating to Penugasan tab...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=penugasan');
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Penugasan tab snippet:\n', bodyText);

  await page.screenshot({ path: 'penugasan_tab_detail.png' });

  // Look for buttons like "Buat Tugas", "Buat Asesmen", "Tambah Penugasan"
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a'))
      .map(el => el.innerText.trim()).filter(t => t.toLowerCase().includes('buat') || t.toLowerCase().includes('tambah') || t.toLowerCase().includes('tugas') || t.toLowerCase().includes('asesmen'));
  });
  console.log('Action buttons in Penugasan tab:', buttons);

  // Click create button
  const createBtn = page.locator('button:has-text("Buat Penugasan"), button:has-text("Buat Tugas"), button:has-text("Tambah"), a:has-text("Buat")').first();
  if (await createBtn.isVisible()) {
    console.log('4. Clicking create button:', await createBtn.innerText());
    await createBtn.click();
    await page.waitForTimeout(3000);
    console.log('URL after click:', page.url());
    await page.screenshot({ path: 'create_assignment_form.png' });
    const formText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    console.log('Create assignment form text:\n', formText);
  }

  await browser.close();
})();

