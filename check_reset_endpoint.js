const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  page.on('request', req => {
    if (req.method() === 'POST' || req.method() === 'PUT' || req.method() === 'PATCH') {
      console.log('>> REQ:', req.method(), req.url());
      const p = req.postData();
      if (p) console.log('   POST BODY:', p.slice(0, 300));
    }
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('_serverFn') || url.includes('password') || url.includes('reset') || url.includes('admin')) {
      try {
        const t = await res.text();
        if (t.includes('password') || t.includes('sandi') || t.includes('Success') || t.includes('sukses')) {
          console.log(`<< RES [${res.status()}] ${url}:`, t.slice(0, 300));
        }
      } catch (e) {}
    }
  });

  let ok = false;
  for (let i = 1; i <= 3; i++) {
    try {
      await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 25000 });
      ok = true;
      break;
    } catch (e) {
      await page.waitForTimeout(2000);
    }
  }

  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();

  await page.waitForURL(url => !url.toString().includes('/auth'), { timeout: 30000 });
  await page.waitForTimeout(3000);

  // Switch to Bandongan
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  // Go to /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Search Ahmad Azril
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('Ahmad Azril');
  await page.waitForTimeout(2000);

  // Click Lihat
  const lihatBtn = page.locator('button:has-text("Lihat"), a:has-text("Lihat")').first();
  await lihatBtn.click();
  await page.waitForTimeout(3000);

  // Click "Atur ulang kata sandi"
  const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
  console.log('Reset button visible?', await resetBtn.isVisible());
  if (await resetBtn.isVisible()) {
    console.log('Clicking Atur ulang kata sandi...');
    await resetBtn.click();
    await page.waitForTimeout(3000);

    const dialogText = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], [role="alertdialog"], div.fixed');
      return d ? d.innerText : 'No dialog found';
    });
    console.log('>>> DIALOG TEXT:\n', dialogText);

    // Let's see all buttons and inputs in dialog
    const elements = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
      if (!d) return [];
      return Array.from(d.querySelectorAll('button, input, select')).map(el => ({
        tag: el.tagName,
        type: el.type,
        text: el.innerText.trim(),
        placeholder: el.placeholder
      }));
    });
    console.log('Elements in dialog:', elements);
  }

  await browser.close();
})();

