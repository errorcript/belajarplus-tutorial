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

  // Cari tombol impor
  const imporBtn = page.getByRole('button', { name: /Impor Siswa/i });
  console.log('Impor button count:', await imporBtn.count());
  await imporBtn.click();
  await page.waitForTimeout(2000);

  // Ambil semua teks di layar sekarang
  const fullText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('tws_after_impor_click_text.txt', fullText);
  console.log('Text after click snippet:');
  console.log(fullText.slice(0, 1000));

  // Cari input type=file
  const fileInputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input[type="file"]')).map(input => ({
      name: input.name,
      id: input.id,
      accept: input.accept
    }));
  });
  console.log('File inputs found:', fileInputs);

  await browser.close();
})();

