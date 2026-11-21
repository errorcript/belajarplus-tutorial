const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage();
  
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Clicking "Impor Siswa" button...');
  const imporBtn = page.locator('button:has-text("Impor Siswa")').first();
  await imporBtn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'tws_impor_siswa_modal.png' });

  const modalHtml = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"]');
    return dialog ? dialog.innerHTML : 'No dialog found';
  });

  const modalText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"]');
    return dialog ? dialog.innerText : 'No dialog found';
  });

  console.log('=== MODAL TEXT ===\n', modalText);
  fs.writeFileSync('tws_impor_siswa_modal_text.txt', modalText);

  // Check download template links in modal
  const templateLinks = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"]');
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll('a, button')).map(el => ({
      text: el.innerText.trim(),
      href: el.getAttribute('href'),
      tag: el.tagName
    }));
  });
  console.log('Template links / buttons in modal:', templateLinks);

  await browser.close();
})();

