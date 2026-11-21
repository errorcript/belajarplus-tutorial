const { chromium } = require('playwright');

async function debugAddStudentFlow() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Log serverFn & mutation requests
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('_serverFn') || url.includes('/api/')) {
      try {
        const status = res.status();
        const text = await res.text();
        console.log(`[API RESPONSE] ${status} ${url.slice(0, 80)} -> ${text.slice(0, 150)}`);
      } catch (e) {}
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
  
  console.log('Clicking "Periksa"...');
  await dialog.getByRole('button', { name: /Periksa/i }).click();
  await page.waitForTimeout(4000);

  const konfirmasiBtn = dialog.getByRole('button', { name: /Konfirmasi/i });
  console.log('Is Konfirmasi button visible?', await konfirmasiBtn.isVisible());
  if (await konfirmasiBtn.isVisible()) {
    console.log('Clicking "Konfirmasi"...');
    await konfirmasiBtn.click();
    console.log('Clicked Konfirmasi! Waiting for result...');
    await page.waitForTimeout(15000);

    // Cek apakah ada toast / alert
    const toasts = await page.locator('[role="status"], [role="alert"], div[data-sonner-toast]').allInnerTexts();
    console.log('Toasts:', toasts);
  }

  await browser.close();
}

debugAddStudentFlow().catch(console.error);

