const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to SEKOLAH DUMMY TRAINER 3
  console.log('2. Switching to SEKOLAH DUMMY TRAINER 3...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Navigating to /admin/classes...');
  await page.goto('https://belajarplus.com/admin/classes');
  await page.waitForTimeout(4000);

  // Click Buat Kelas Sekolah
  await page.locator('button:has-text("Buat Kelas Sekolah")').first().click();
  await page.waitForTimeout(2000);

  const dialog = page.locator('[role="dialog"]').first();

  // Select TA
  await dialog.locator('select').first().selectOption({ index: 1 });
  await page.waitForTimeout(500);

  // Click Beberapa Rombel
  await dialog.locator('label:has-text("Beberapa Rombel"), input[type="radio"]').nth(1).click();
  await page.waitForTimeout(1000);

  // Fill Nama Kelas
  const nameInput = dialog.locator('input[placeholder*="Persiapan TKA"]').first();
  await nameInput.fill('SIMULASI ASAS SE JATENG');
  await page.waitForTimeout(500);

  // Select Guru
  await dialog.locator('select').nth(1).selectOption({ index: 1 });
  await page.waitForTimeout(500);

  // Check rombels 10-A, 10-B, 10-C, 10-D
  const checkboxes = dialog.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  console.log(`Found ${count} checkboxes`);
  for (let i = 0; i < Math.min(4, count); i++) {
    await checkboxes.nth(i).check().catch(() => {});
  }
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'ready_submit_class.png' });

  // Click Buat Kelas
  console.log('4. Submitting Buat Kelas...');
  await dialog.locator('button:has-text("Buat Kelas")').click();
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'after_class_created.png' });
  console.log('Class created! URL:', page.url());

  // Find the class card and click Buka Workspace
  const classCard = page.locator('div:has-text("SIMULASI ASAS SE JATENG")').last();
  console.log('Card found:', await classCard.isVisible());

  // Find workspace link
  const workspaceBtn = page.locator('div:has-text("SIMULASI ASAS SE JATENG")').locator('..').locator('button:has-text("Buka Workspace"), a:has-text("Buka Workspace")').first();
  if (await workspaceBtn.isVisible()) {
    console.log('5. Clicking Buka Workspace...');
    await workspaceBtn.click();
    await page.waitForTimeout(5000);
    console.log('Workspace URL:', page.url());
    await page.screenshot({ path: 'simulasi_workspace.png' });
    const wsText = await page.evaluate(() => document.body.innerText.slice(0, 1000));
    console.log('Workspace content snippet:\n', wsText);
  } else {
    console.log('Workspace button not directly found, scanning buttons in card...');
    const cardButtons = await page.evaluate(() => {
      const card = Array.from(document.querySelectorAll('*')).find(el => el.innerText && el.innerText.includes('SIMULASI ASAS SE JATENG') && el.innerText.includes('Buka Workspace'));
      return card ? card.innerText : 'Card not found';
    });
    console.log('Card details:\n', cardButtons);
  }

  await browser.close();
})();

