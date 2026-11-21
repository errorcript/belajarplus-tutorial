const { chromium } = require('playwright');

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

  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(4000);

  const btn = page.locator('button:has-text("Buat Kelas Sekolah")').first();
  console.log('Btn visible:', await btn.isVisible());
  await btn.click();
  await page.waitForTimeout(2000);
  console.log('URL after click:', page.url());

  const dialogHtml = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText : 'No dialog found';
  });
  console.log('Dialog innerText:\n', dialogHtml);

  // Also check form fields inside dialog
  const inputs = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return [];
    return Array.from(d.querySelectorAll('input, select, textarea, button'))
      .map(el => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        placeholder: el.getAttribute('placeholder'),
        name: el.getAttribute('name'),
        text: el.innerText.trim()
      }));
  });
  console.log('Dialog form elements:', inputs);

  await page.screenshot({ path: 'create_class_modal_open.png' });
  await browser.close();
})();

