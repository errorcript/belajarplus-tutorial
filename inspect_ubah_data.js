const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
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

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('fadhildzuljalilathasaputro@belajarplus.com');
  await page.waitForTimeout(2000);

  // Klik Lihat
  const btn = page.locator('a, button').filter({ hasText: /^Lihat$/ }).first();
  await btn.click();
  await page.waitForTimeout(2000);

  // Klik "Ubah data"
  console.log('Clicking "Ubah data"...');
  const ubahBtn = page.getByRole('button', { name: 'Ubah data' });
  await ubahBtn.click();
  await page.waitForTimeout(2500);

  const editModalData = await page.evaluate(() => {
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [data-state="open"]'));
    const topDialog = dialogs[dialogs.length - 1];
    if (!topDialog) return { error: 'No dialog' };
    
    const inputs = Array.from(topDialog.querySelectorAll('input, select, [role="combobox"]')).map(el => ({
      tagName: el.tagName,
      type: el.type,
      name: el.name,
      value: el.value,
      innerText: el.innerText,
      placeholder: el.placeholder
    }));

    const buttons = Array.from(topDialog.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);

    return {
      text: topDialog.innerText,
      inputs,
      buttons
    };
  });

  console.log('Edit modal data:\n', JSON.stringify(editModalData, null, 2));
  fs.writeFileSync('tws_edit_modal_data.json', JSON.stringify(editModalData, null, 2));

  await browser.close();
})();

