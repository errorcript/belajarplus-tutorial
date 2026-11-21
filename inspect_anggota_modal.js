const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage();
  
  // Tangkap semua network traffic
  const apiRequests = [];
  page.on('request', req => {
    if (req.url().includes('_serverFn') || req.url().includes('supabase') || req.url().includes('/api/')) {
      apiRequests.push({ url: req.url(), method: req.method(), postData: req.postData() });
    }
  });

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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Clear tracked requests before clicking Anggota
  apiRequests.length = 0;

  console.log('Clicking "Anggota" on first card (Kelas 10-1)...');
  const card101 = page.locator('div').filter({ hasText: 'Kelas 10-1' }).last();
  const anggotaBtn = card101.getByRole('button', { name: /Anggota/i });
  await anggotaBtn.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'tws_anggota_modal.png' });
  console.log('API requests triggered on Anggota click:\n', JSON.stringify(apiRequests, null, 2));

  const modalText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, [data-state="open"]');
    return dialog ? dialog.innerText : 'NO DIALOG';
  });
  console.log('Modal text snippet:\n', modalText.slice(0, 1000));
  fs.writeFileSync('tws_anggota_modal_text.txt', modalText);

  // Periksa tombol dan aksi di dalam modal anggota
  const modalButtons = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, [data-state="open"]');
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Buttons inside Anggota modal:', modalButtons);

  await browser.close();
})();

