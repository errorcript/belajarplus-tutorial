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

  const fileInfo = await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]');
    if (!input) return null;
    let p = input.parentElement;
    return {
      accept: input.accept,
      outer: input.outerHTML,
      parentOuter: p ? p.outerHTML : ''
    };
  });
  console.log('File info:\n', fileInfo);

  // Cari juga apakah ada template download atau instruksi impor di page
  const allButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(el => ({
      text: el.innerText.trim(),
      href: el.getAttribute('href'),
      title: el.getAttribute('title')
    })).filter(el => el.text.toLowerCase().includes('impor') || el.text.toLowerCase().includes('template') || el.text.toLowerCase().includes('format') || el.text.toLowerCase().includes('contoh'));
  });
  console.log('Matching buttons/links:\n', allButtons);

  await browser.close();
})();

