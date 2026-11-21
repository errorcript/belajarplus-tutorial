const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const targets = [
    { name: 'Kelas 11-3', idx: 12 },
    { name: 'Kelas 11-4', idx: 13 },
    { name: 'Kelas 11-7', idx: 16 },
    { name: 'Kelas 11-8', idx: 17 },
    { name: 'Kelas 11-9', idx: 18 },
    { name: 'Kelas 11-10', idx: 19 },
    { name: 'Kelas 12-2', idx: 21 },
    { name: 'Kelas 12-6', idx: 25 },
    { name: 'Kelas 12-10', idx: 29 }
  ];

  const results = {};

  for (const t of targets) {
    console.log(`Inspecting ${t.name} (nth ${t.idx})...`);
    await page.getByRole('button', { name: 'Anggota' }).nth(t.idx).click();
    await page.waitForTimeout(2500);

    const dialogData = await page.evaluate(() => {
      const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
      if (!dialog) return { error: 'No dialog' };
      return dialog.innerText;
    });

    results[t.name] = dialogData;

    // Close modal
    const closeBtn = page.getByRole('button', { name: /Close|Tutup|Batal/i }).last();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);
  }

  fs.writeFileSync('tws_specific_rombels_text.json', JSON.stringify(results, null, 2));
  console.log('Saved all specific rombel texts to tws_specific_rombels_text.json');

  await browser.close();
})();

