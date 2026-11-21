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

  const imporBtn = page.getByRole('button', { name: /Impor Siswa/i });
  await imporBtn.click();
  await page.waitForTimeout(1500);

  const inputDetail = await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]');
    if (!input) return 'NO INPUT';
    // Cari elemen terdekat atau container modal
    let el = input;
    let parents = [];
    while (el && el !== document.body) {
      parents.push(`${el.tagName}.${el.className}`);
      el = el.parentElement;
    }
    return {
      parents,
      outer: input.outerHTML,
      containerOuter: input.closest('[role="dialog"], [data-state], div.fixed, div.relative')?.outerHTML?.slice(0, 2000)
    };
  });

  console.log('Input detail:\n', JSON.stringify(inputDetail, null, 2));

  await browser.close();
})();

