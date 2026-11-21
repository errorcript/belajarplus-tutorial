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
  console.log('2. Searching DIAN FITRININGSIH...');
  const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
  await sf.fill('DIAN FITRININGSIH');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  // Click Lihat
  await page.locator('button:has-text("Lihat")').first().click();
  await page.waitForTimeout(2000);

  // Click Ubah data
  console.log('3. Clicking Ubah data...');
  await page.locator('button:has-text("Ubah data")').first().click();
  await page.waitForTimeout(2000);

  const editDialogText = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
    return d ? d.innerText : '';
  });
  console.log('Edit Dialog Text:\n', editDialogText);

  const editInputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder,
      value: el.value,
      text: el.innerText ? el.innerText.trim() : ''
    }));
  });
  console.log('Edit Form Elements:\n', editInputs);

  await browser.close();
})();

