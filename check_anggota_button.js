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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Finding all Anggota buttons...');
  const anggotaBtns = page.locator('button:has-text("Anggota"), a:has-text("Anggota")');
  const count = await anggotaBtns.count();
  console.log('Found Anggota buttons:', count);

  if (count > 0) {
    console.log('Clicking first Anggota button...');
    await anggotaBtns.first().click();
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'anggota_dialog_first.png' });

    const dialogHtml = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"], [data-state="open"], div.fixed');
      return dialog ? dialog.outerHTML : document.body.innerHTML;
    });

    const dialogText = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"], [data-state="open"], div.fixed');
      return dialog ? dialog.innerText : document.body.innerText;
    });

    console.log('=== DIALOG TEXT ===\n', dialogText.slice(0, 1500));
    fs.writeFileSync('anggota_dialog_text.txt', dialogText);

    // List all buttons inside dialog
    const dialogButtons = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"], [data-state="open"], div.fixed');
      if (!dialog) return [];
      return Array.from(dialog.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(Boolean);
    });
    console.log('Buttons inside Anggota dialog:', dialogButtons);
  }

  await browser.close();
})();

