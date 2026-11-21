const { chromium } = require('playwright');
const fs = require('fs');

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

  // Navigate to Master Data Rombel (/admin/classes or /admin/rombel)
  console.log('2. Navigating to Master Data Rombel...');
  await page.goto('https://belajarplus.com/admin/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const rombelUrl = page.url();
  console.log('Rombel URL:', rombelUrl);
  await page.screenshot({ path: 'rombel_rawalo.png' });

  // Get list of rombel
  const rombels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tr, [role="row"], .card, div[class*="rombel"]')).map(el => el.innerText.trim()).filter(Boolean);
  });
  console.log('Rombels list sample:', rombels.slice(0, 15));

  // Now inspect students in specific classes by filtering in /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Check Ratriningtias with broader spelling
  console.log('Searching for Ratri / Ning / Tias...');
  for (const s of ['Ratri', 'Ningtias', 'Ningtyas', 'Rafa', 'Farendy']) {
    const searchField = page.locator('input[placeholder*="Cari nama atau email"], input[type="search"]').first();
    await searchField.fill('');
    await page.waitForTimeout(200);
    await searchField.fill(s);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      return trs.map(tr => Array.from(tr.querySelectorAll('td, [role="cell"]')).map(td => td.innerText.trim())).filter(c => c.length > 0);
    });
    console.log(`Results for ${s}:`, rows);
  }

  // Filter rombel X-7 to find "Dian"
  console.log('Filtering rombel X-7 for Dian...');
  // Check Farendy details to see his current rombel
  const searchFarendy = page.locator('input[placeholder*="Cari nama atau email"], input[type="search"]').first();
  await searchFarendy.fill('Farendy');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);

  const lihatFarendy = page.locator('button:has-text("Lihat")').first();
  if (await lihatFarendy.isVisible()) {
    await lihatFarendy.click();
    await page.waitForTimeout(2000);
    const farendyDetail = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d ? d.innerText : document.body.innerText.slice(0, 1500);
    });
    console.log('Farendy detail:\n', farendyDetail);
    await page.locator('button:has-text("Close")').click().catch(()=>{});
  }

  await browser.close();
})();

