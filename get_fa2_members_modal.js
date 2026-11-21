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

  // Navigate to /master-data/rombel
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Find the button "Anggota" inside the card containing "XI FA 2"
  const fa2Card = page.locator('div').filter({ hasText: 'Kelas 11-XI FA 2' }).last();
  const anggotaBtn = fa2Card.locator('button, a').filter({ hasText: 'Anggota' }).first();
  
  console.log('Clicking Anggota button on XI FA 2...');
  await anggotaBtn.click();
  await page.waitForTimeout(3000);

  // Check if dialog / modal or page loaded
  console.log('Current URL after click:', page.url());
  const modalText = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], div.fixed, div[class*="modal"]');
    return dialog ? dialog.innerText : document.body.innerText;
  });

  fs.writeFileSync('fa2_modal_text.txt', modalText);
  console.log('Snippet of modal text:');
  console.log(modalText.slice(0, 1500));

  await browser.close();
})();

