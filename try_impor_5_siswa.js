const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function tryImpor5() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('1. Logging in as Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  console.log('2. Switching school to SMAN 1 TAWANGSARI...');
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  console.log('3. Navigating to /admin/students...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('4. Clicking "Impor Siswa" button...');
  const imporBtn = page.getByRole('button', { name: /Impor Siswa/i });
  await imporBtn.click();
  await page.waitForTimeout(1500);

  const filePath = path.resolve('IMPOR_5_SISWA_SISA.xlsx');
  console.log('5. Uploading file:', filePath);
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(4000);

  const dialog = page.getByRole('dialog');
  const dialogText = await dialog.innerText();
  console.log('--- DIALOG CONTENT ---');
  console.log(dialogText);

  await page.screenshot({ path: 'impor_5_dialog_preview.png' });

  await browser.close();
}

tryImpor5().catch(console.error);
