const { chromium } = require('playwright');

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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Buka Kelas 11-7 (nth 16)
  await page.getByRole('button', { name: 'Anggota' }).nth(16).click();
  await page.waitForTimeout(3000);

  const listItems = await page.evaluate(() => {
    const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
    if (!dialog) return [];
    
    // Cari semua label di dalam dialog
    const labels = Array.from(dialog.querySelectorAll('label'));
    return labels.map(l => ({
      text: l.innerText.trim().replace(/\n+/g, ' | '),
      hasInput: !!l.querySelector('input'),
      inputType: l.querySelector('input')?.type,
      outerHTML: l.outerHTML.substring(0, 200)
    }));
  });

  console.log('Total labels in 11-7 dialog:', listItems.length);
  const herdha = listItems.filter(l => l.text.toLowerCase().includes('herdha'));
  console.log('Herdha labels:', JSON.stringify(herdha, null, 2));

  await browser.close();
})();

