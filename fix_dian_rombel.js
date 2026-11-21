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

  // Search DIAN FITRININGSIH
  const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
  await sf.fill('DIAN FITRININGSIH');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  await page.locator('button:has-text("Lihat")').first().click();
  await page.waitForTimeout(1500);

  await page.locator('button:has-text("Ubah data")').first().click();
  await page.waitForTimeout(1500);

  // Inspect options in #mp-rombel
  const options = await page.evaluate(() => {
    const sel = document.querySelector('#mp-rombel');
    return Array.from(sel.options).map(o => ({
      index: o.index,
      value: o.value,
      text: o.text,
      selected: o.selected
    }));
  });
  console.log('Options in #mp-rombel:\n', JSON.stringify(options.slice(0, 10), null, 2));

  // Select the first option (unassigned)
  console.log('Selecting index 0 (—)...');
  await page.locator('#mp-rombel').selectOption({ index: 0 });
  await page.waitForTimeout(500);

  const selectedValue = await page.locator('#mp-rombel').inputValue();
  console.log('Selected value now:', selectedValue);

  // Click Simpan
  await page.locator('button:has-text("Simpan")').first().click();
  await page.waitForTimeout(3000);

  // Re-verify modal
  await page.screenshot({ path: 'dian_after_save.png' });
  const updatedDetail = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText : '';
  });
  console.log('Updated Dian Detail:\n', updatedDetail);

  await browser.close();
})();

