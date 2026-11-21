const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function findConflictDetails() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
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

  const filePath = path.resolve('IMPOR_47_SISWA_TERBARU_SMAN1_TAWANGSARI.xlsx');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
  await page.waitForTimeout(4000);

  // Filter baris yang konflik / error di pratinjau
  const conflicts = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr, [role="row"], div.border-b'));
    return rows.map(r => r.innerText.replace(/\n+/g, ' | ')).filter(t => t.includes('Konflik') || t.includes('Error') || t.includes('Gagal') || t.includes('Dilewati'));
  });

  console.log('Conflict rows found:\n', conflicts);

  // Ambil teks lengkap tabel pratinjau
  const fullPreviewText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], [data-state="open"]');
    return dialog ? dialog.innerText : 'NO DIALOG';
  });

  fs.writeFileSync('preview_conflicts_full.txt', fullPreviewText);
  await browser.close();
}

findConflictDetails().catch(console.error);

