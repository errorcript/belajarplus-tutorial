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

  // Klik tombol Anggota pertama
  console.log('Clicking first Anggota button...');
  await page.getByRole('button', { name: /Anggota/i }).first().click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'clicked_anggota_view.png', fullPage: true });

  const drawerOrDialog = await page.evaluate(() => {
    // Cari semua element fixed atau z-index tinggi
    const elements = Array.from(document.querySelectorAll('div')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.position === 'fixed' && style.display !== 'none' && el.offsetWidth > 100;
    });
    return elements.map(el => ({
      className: el.className,
      innerText: el.innerText.slice(0, 500)
    }));
  });

  console.log('Fixed elements found:', drawerOrDialog);

  await browser.close();
})();

