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
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Go to Aktivitas Belajar tab
  console.log('2. Navigating to Aktivitas Belajar tab...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=aktivitas');
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Aktivitas tab body snippet:\n', bodyText);

  await page.screenshot({ path: 'aktivitas_tab_detail.png' });

  // Look for buttons like "Buat Aktivitas", "Tambah", "Impor"
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a'))
      .map(el => el.innerText.trim()).filter(t => t.length > 2 && t.length < 50);
  });
  console.log('Buttons on Aktivitas tab:', buttons);

  const addBtn = page.locator('button:has-text("Buat"), button:has-text("Tambah"), a:has-text("Buat"), a:has-text("Tambah")').first();
  if (await addBtn.isVisible()) {
    console.log('Clicking add button:', await addBtn.innerText());
    await addBtn.click();
    await page.waitForTimeout(3000);
    console.log('URL after add click:', page.url());
    await page.screenshot({ path: 'add_aktivitas_dialog.png' });
    const afterText = await page.evaluate(() => document.body.innerText.slice(0, 1000));
    console.log('After add click text:\n', afterText);
  }

  await browser.close();
})();

