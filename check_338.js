const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
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

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen338@belajarplus.com');
  await page.waitForTimeout(2000);

  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('table tbody tr')).map(tr => tr.innerText.replace(/\n+/g, ' | '));
  });
  console.log('Search results for 338:', rows);

  if (rows.length > 0) {
    const lihatBtn = page.locator('table tbody tr').first().getByRole('button', { name: 'Lihat' });
    await lihatBtn.click();
    await page.waitForTimeout(2000);

    const dialogData = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"], [data-state="open"]');
      if (!dialog) return { error: 'No dialog' };
      return {
        text: dialog.innerText,
        buttons: Array.from(dialog.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)
      };
    });

    console.log('Dialog data for 338:\n', dialogData);
  }

  await browser.close();
})();

