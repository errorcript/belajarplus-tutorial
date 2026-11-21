const { chromium } = require('playwright');
const path = require('path');

async function importAndCheckManualAdd() {
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

  // Periksa semua tombol di halaman /admin/students
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons on /admin/students:', buttons.slice(0, 15));

  // Klik Impor Siswa
  const imporBtn = page.getByRole('button', { name: /Impor Siswa/i });
  await imporBtn.click();
  await page.waitForTimeout(1500);

  const filePath = path.resolve('IMPOR_5_SISWA_SISA.xlsx');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(4000);

  const dialog = page.getByRole('dialog');
  const confirmBtn = dialog.getByRole('button', { name: /^Impor$/i });
  const isEnabled = await confirmBtn.isEnabled();
  console.log('Is Impor button enabled?', isEnabled);

  if (isEnabled) {
    console.log('Clicking Impor button...');
    await confirmBtn.click();
    await page.waitForTimeout(10000);
    const postImportText = await page.evaluate(() => document.body.innerText);
    console.log('Post import snippet:\n', postImportText.slice(0, 500));
  }

  await browser.close();
}

importAndCheckManualAdd().catch(console.error);

