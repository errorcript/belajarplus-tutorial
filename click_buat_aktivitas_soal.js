const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

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

  // Go to Aktivitas tab of the class
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=aktivitas');
  await page.waitForTimeout(4000);

  const btn = page.locator('button:has-text("Buat Aktivitas Soal")').first();
  console.log('Buat Aktivitas Soal visible:', await btn.isVisible());
  await btn.click();
  await page.waitForTimeout(3000);

  console.log('URL after clicking Buat Aktivitas Soal:', page.url());
  await page.screenshot({ path: 'buat_aktivitas_soal_view.png' });

  const viewText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Page content after click:\n', viewText);

  // Check form elements / modal
  const elements = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button'))
      .map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        placeholder: el.getAttribute('placeholder'),
        text: el.innerText.trim()
      })).filter(e => e.text.length > 0 || e.placeholder);
  });
  console.log('Interactive elements:\n', elements.slice(0, 30));

  await browser.close();
})();

