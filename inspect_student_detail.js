const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to Bandongan
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  // Navigate to /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Search one of the manual students, e.g. "Ahmad Azril" or "afridaulissaidah"
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('Ahmad Azril');
  await page.waitForTimeout(2000);

  // Click "Lihat"
  const lihatBtn = page.locator('button:has-text("Lihat"), a:has-text("Lihat")').first();
  console.log('Lihat button visible?', await lihatBtn.isVisible());
  await lihatBtn.click();
  await page.waitForTimeout(3000);

  console.log('Current URL after clicking Lihat:', page.url());
  const modalOrPageText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, div[class*="sheet"], div[class*="modal"]');
    return dialog ? dialog.innerText : document.body.innerText;
  });

  fs.writeFileSync('student_detail_view.txt', modalOrPageText);
  console.log('Detail text snippet:');
  console.log(modalOrPageText.slice(0, 1000));

  // Check buttons inside dialog/page
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a')).map(b => b.innerText.trim()).filter(t => t.length > 0);
  });
  console.log('Actions available on student:', buttons.filter(b => b.toLowerCase().includes('sandi') || b.toLowerCase().includes('pass') || b.toLowerCase().includes('ubah') || b.toLowerCase().includes('edit') || b.toLowerCase().includes('reset')));

  await browser.close();
})();

