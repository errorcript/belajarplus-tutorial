const { chromium } = require('playwright');
const path = require('path');

async function executeImportTyas() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Impor Siswa/i }).click();
  await page.waitForTimeout(1500);

  const filePath = path.resolve('IMPOR_47_SISWA_TERBARU_SMAN1_TAWANGSARI.xlsx');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.waitForTimeout(5000);

  const dialog = page.getByRole('dialog');
  const confirmBtn = dialog.getByRole('button', { name: /^Impor$/i });
  console.log('Is Impor button enabled?', await confirmBtn.isEnabled());

  if (await confirmBtn.isEnabled()) {
    console.log('Clicking "Impor"...');
    await confirmBtn.click();
    console.log('Clicked Impor! Waiting 15s for processing...');
    await page.waitForTimeout(15000);

    const postText = await page.evaluate(() => document.body.innerText);
    console.log('Post import snippet:\n', postText.slice(0, 500));
  }

  await browser.close();
}

executeImportTyas().catch(console.error);

