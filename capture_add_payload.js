const { chromium } = require('playwright');
const fs = require('fs');

async function captureAddPayload() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on('request', req => {
    if (req.url().includes('9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa')) {
      console.log('[REQ TO ADD FN]', req.postData());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa')) {
      const text = await res.text();
      console.log('[RES FROM ADD FN]', text);
    }
  });

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
  await page.getByRole('button', { name: /Tambah Siswa/i }).click();
  await page.waitForTimeout(1500);

  const dialog = page.getByRole('dialog');
  await dialog.locator('#as-email').fill('tyasaulia28@gmail.com');
  await dialog.locator('#as-name').fill('TYAS AULIA MAHARANI');
  await dialog.locator('#as-pw').fill('Sman1tws_siswa105');
  
  await dialog.getByRole('button', { name: /Periksa/i }).click();
  await page.waitForTimeout(3000);

  const konfirmasiBtn = dialog.getByRole('button', { name: /Konfirmasi/i });
  if (await konfirmasiBtn.isVisible()) {
    await konfirmasiBtn.click();
    await page.waitForTimeout(8000);
  }

  await browser.close();
}

captureAddPayload().catch(console.error);

