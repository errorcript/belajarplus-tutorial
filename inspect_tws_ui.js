const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage();
  
  console.log('Logging in as Henri...');
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

  // 1. Periksa halaman /master-data/rombel
  console.log('\n--- MASTER DATA ROMBEL ---');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const rombelBodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('tws_rombel_body.txt', rombelBodyText);
  console.log('Rombel body text len:', rombelBodyText.length);

  // Buttons di rombel page
  const rombelButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a[role="button"]')).map(b => (b.innerText || '').trim()).filter(Boolean);
  });
  console.log('Rombel page buttons:', [...new Set(rombelButtons)]);

  // 2. Periksa halaman /admin/students
  console.log('\n--- ADMIN STUDENTS ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'tws_students_page_live.png', fullPage: true });

  const studentsBodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('tws_students_body.txt', studentsBodyText);
  console.log('Students body text len:', studentsBodyText.length);

  const studentButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a[role="button"]')).map(b => (b.innerText || '').trim()).filter(Boolean);
  });
  console.log('Students page buttons:', [...new Set(studentButtons)]);

  await browser.close();
})();
