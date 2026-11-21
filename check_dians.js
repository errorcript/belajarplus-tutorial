const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMA NEGERI 1 RAWALO
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const dianNames = ['DIAN FITRININGSIH', 'DIAN MAULIDA', 'DIAN NUR FADHILAH', 'DIAN SATRIANI'];

  for (const name of dianNames) {
    const searchField = page.locator('input[placeholder*="Cari nama atau email"], input[type="search"]').first();
    await searchField.fill('');
    await page.waitForTimeout(200);
    await searchField.fill(name);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const lihatBtn = page.locator('button:has-text("Lihat")').first();
    if (await lihatBtn.isVisible()) {
      await lihatBtn.click();
      await page.waitForTimeout(1500);
      const detail = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        return d ? d.innerText : '';
      });
      console.log(`Detail for ${name}:\n`, detail);
      await page.locator('button:has-text("Close")').click().catch(()=>{});
      await page.waitForTimeout(1000);
    }
  }

  await browser.close();
})();

