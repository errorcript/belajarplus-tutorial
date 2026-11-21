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

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Buka Kelas 11-7 (nth 16)
  console.log('Opening Kelas 11-7 (nth 16)...');
  await page.getByRole('button', { name: 'Anggota' }).nth(16).click();
  await page.waitForTimeout(3000);

  // Ambil semua daftar anggota di dialog
  const members = await page.evaluate(() => {
    const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
    if (!dialog) return [];
    
    // Cari elemen baris anggota
    const cards = Array.from(dialog.querySelectorAll('div.flex.items-center.justify-between, div.flex.items-center.gap-3, div.flex.items-center.space-x-3'));
    return cards.map((c, i) => {
      const text = c.innerText.replace(/\n+/g, ' | ');
      const checkbox = c.querySelector('input[type="checkbox"], button[role="checkbox"]');
      return {
        i,
        text,
        hasCheckbox: !!checkbox,
        html: c.outerHTML.substring(0, 300)
      };
    });
  });

  console.log('Members found in 11-7 dialog:');
  const herdhaItems = members.filter(m => m.text.toLowerCase().includes('herdha') || m.text.includes('621') || m.text.includes('622'));
  console.log(herdhaItems);

  fs.writeFileSync('tws_11_7_members_dom.json', JSON.stringify({ members, herdhaItems }, null, 2));

  await browser.close();
})();

