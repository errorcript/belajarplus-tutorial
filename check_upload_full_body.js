const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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

  const filePath = path.resolve('impor_kelas_11_1.xlsx');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(4000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync('full_body_after_upload.txt', bodyText);
  console.log('Body text length:', bodyText.length);

  // Cari semua teks yang berhubungan dengan pratinjau, valid, error, baris, nama siswa
  const matches = bodyText.split('\n').filter(l => 
    l.includes('Zivanna') || l.includes('11-1') || l.includes('Pratinjau') || 
    l.includes('Valid') || l.includes('Error') || l.includes('Siswa') || l.includes('Impor')
  );
  console.log('Matching lines in body:\n', matches);

  await browser.close();
})();

