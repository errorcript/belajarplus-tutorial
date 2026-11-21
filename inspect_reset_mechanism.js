const { chromium } = require('playwright');
const fs = require('fs');

async function testReset() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('dialog', async dialog => {
    console.log('BROWSER DIALOG:', dialog.type(), dialog.message());
    await dialog.accept();
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.includes('reset') || url.includes('password') || url.includes('_serverFn')) {
      const status = res.status();
      try {
        const text = await res.text();
        if (text.includes('password') || text.includes('sandi') || text.includes('success')) {
          console.log(`<< RESPONSE [${status}] ${url}:`, text.slice(0, 200));
        }
      } catch (e) { }
    }
  });

  console.log('1. Navigating to /auth...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('2. Filling credentials...');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();

  console.log('3. Waiting for navigation...');
  await page.waitForURL(url => !url.toString().includes('/auth'), { timeout: 30000 });
  console.log('   Logged in! Current URL:', page.url());
  await page.waitForTimeout(3000);

  // Switch to Bandongan
  console.log('4. Switching to SMAN 1 Bandongan...');
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);

  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  console.log('5. Navigating to /admin/students...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('6. Searching student...');
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('Ahmad Azril');
  await page.waitForTimeout(2000);

  console.log('7. Clicking Lihat...');
  const lihatBtn = page.locator('button:has-text("Lihat"), a:has-text("Lihat")').first();
  await lihatBtn.click();
  await page.waitForTimeout(3000);

  console.log('8. Clicking Atur ulang kata sandi...');
  const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
  if (await resetBtn.isVisible()) {
    await resetBtn.click();
    await page.waitForTimeout(3000);

    const dialogText = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], [role="alertdialog"], div.fixed');
      return d ? d.innerText : 'No dialog found';
    });
    console.log('>>> RESET MODAL TEXT:\n', dialogText);

    // Check if there is an input for new password
    const passwordInputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input')).map(i => ({
        type: i.type,
        placeholder: i.placeholder,
        name: i.name
      }));
    });
    console.log('All visible inputs:', passwordInputs);

    // Check all buttons in dialog
    const modalButtons = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"], [role="alertdialog"]');
      if (!d) return [];
      return Array.from(d.querySelectorAll('button')).map(b => b.innerText.trim());
    });
    console.log('Modal buttons:', modalButtons);
  }

  await browser.close();
}

testReset().catch(console.error);

