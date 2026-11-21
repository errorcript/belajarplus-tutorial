const { chromium } = require('playwright');
const fs = require('fs');

async function downloadAdminStudentsBundle() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  const jsFiles = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.js') && !url.includes('google') && !url.includes('clarity')) {
      try {
        const text = await res.text();
        if (text.includes('9504974c76ed6f9869c7b103d7bd9625c81d11ca1599aa') || text.includes('resumable') || text.includes('Tambah Siswa')) {
          console.log('Found relevant JS bundle:', url);
          fs.writeFileSync('admin_students_bundle.js', text);
        }
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
  await page.waitForTimeout(2000);

  await browser.close();
}

downloadAdminStudentsBundle().catch(console.error);

