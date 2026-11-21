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

  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  const mismatched = [
    { name: 'Kelas 10-4', idx: 3 },
    { name: 'Kelas 10-5', idx: 4 },
    { name: 'Kelas 11-4', idx: 13 },
    { name: 'Kelas 11-5', idx: 14 },
    { name: 'Kelas 11-6', idx: 15 },
    { name: 'Kelas 11-7', idx: 16 },
    { name: 'Kelas 11-8', idx: 17 },
    { name: 'Kelas 11-10', idx: 19 },
    { name: 'Kelas 12-1', idx: 20 },
    { name: 'Kelas 12-4', idx: 23 },
    { name: 'Kelas 12-10', idx: 29 }
  ];

  const results = {};

  for (const m of mismatched) {
    console.log(`Scraping ${m.name} (nth ${m.idx})...`);
    await page.getByRole('button', { name: 'Anggota' }).nth(m.idx).click();
    await page.waitForTimeout(2500);

    const dialogData = await page.evaluate(() => {
      const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
      if (!dialog) return { error: 'No dialog' };
      return dialog.innerText;
    });

    results[m.name] = dialogData;

    const closeBtn = page.getByRole('button', { name: /Close|Tutup|Batal/i }).last();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);
  }

  fs.writeFileSync('tws_mismatched_rombels_text.json', JSON.stringify(results, null, 2));
  console.log('Successfully saved scraped data for all mismatched rombels!');

  await browser.close();
})();

