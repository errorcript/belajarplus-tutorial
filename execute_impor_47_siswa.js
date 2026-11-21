const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function executeImpor47() {
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

  const filePath = path.resolve('IMPOR_47_SISWA_TERBARU_SMAN1_TAWANGSARI.xlsx');
  console.log('5. Uploading file:', filePath);
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(4000);

  // Periksa teks pratinjau
  const bodyText = await page.evaluate(() => document.body.innerText);
  const idx = bodyText.indexOf('Unggah template Excel');
  const previewSnippet = bodyText.slice(idx, idx + 400);
  console.log('Preview Header:\n', previewSnippet);

  // Cari tombol konfirmasi "Impor" di dalam dialog
  console.log('6. Looking for confirm "Impor" button...');
  const dialog = page.locator('[role="dialog"], [data-state="open"]');
  const confirmBtn = dialog.getByRole('button', { name: /^Impor$/i });
  
  const isEnabled = await confirmBtn.isEnabled();
  console.log('Is confirm button enabled?', isEnabled);

  if (isEnabled) {
    console.log('7. Clicking confirm "Impor" button...');
    await confirmBtn.click();
    console.log('Clicked! Waiting for import process to complete...');
    
    // Tunggu proses impor (bisa beberapa detik sampai menit untuk 47 akun baru)
    await page.waitForTimeout(15000);

    // Ambil screenshot setelah impor
    await page.screenshot({ path: 'after_impor_47_executed.png', fullPage: true });

    const resultText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('after_impor_47_text.txt', resultText);
    console.log('Snippet result after import:\n', resultText.slice(0, 1500));
  } else {
    console.error('Confirm button is NOT enabled!');
  }

  await browser.close();
  console.log('Finished executeImpor47.');
}

executeImpor47().catch(console.error);

