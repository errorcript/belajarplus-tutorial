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

  // Click menu "Rombel" in sidebar
  console.log('2. Clicking sidebar menu Rombel...');
  const rombelMenu = page.locator('aside a:has-text("Rombel"), nav a:has-text("Rombel")').first();
  console.log('Rombel href:', await rombelMenu.getAttribute('href'));
  await rombelMenu.click();
  await page.waitForTimeout(4000);

  console.log('Current URL after clicking Rombel:', page.url());
  await page.screenshot({ path: 'rombel_page_rawalo.png' });

  const pageText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  console.log('Rombel page text:\n', pageText);

  // Read student details for the 4 newly assigned + Dian
  console.log('3. Checking student detail modal for rombel values...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const studentsToCheck = [
    'ZAHIRA NUR SALSABILA',
    'UZLIFATUL AZIFAH',
    'LIVIA NUR AZIZAH',
    'EMYL AGUSTIAN FIFANANDA',
    'DIAN FITRININGSIH'
  ];

  for (const name of studentsToCheck) {
    const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
    await sf.fill('');
    await page.waitForTimeout(200);
    await sf.fill(name);
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
      await page.waitForTimeout(500);
    }
  }

  await browser.close();
})();

