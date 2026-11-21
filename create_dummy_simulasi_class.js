const { chromium } = require('playwright');

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
  const taSelect = dialog.locator('select').first();
  const options = await taSelect.locator('option').allInnerTexts();
  const activeOpt = options.find(o => o.toLowerCase().includes('aktif')) || options[1];
  await taSelect.selectOption({ label: activeOpt });
  await page.waitForTimeout(1000);

  // Select Beberapa Rombel
  await dialog.locator('label:has-text("Beberapa Rombel"), input[type="radio"]').nth(1).click();
  await page.waitForTimeout(1000);

  // Fill Nama Kelas
  const namaKelasInput = dialog.locator('input[placeholder*="Nama kelas"], input[type="text"]').first();
  await namaKelasInput.fill('SIMULASI ASAS SE JATENG');
  await page.waitForTimeout(500);

  // Select Guru Pengampu
  const guruSelect = dialog.locator('select').nth(1);
  const guruOpts = await guruSelect.locator('option').allInnerTexts();
  console.log('Guru options:', guruOpts);
  if (guruOpts.length > 1) {
    await guruSelect.selectOption({ index: 1 });
  }

  // Pilih Rombel Kelas 10 (10-A, 10-B, 10-C, 10-D)
  const rombelCheckboxes = dialog.locator('input[type="checkbox"]');
  const count = await rombelCheckboxes.count();
  console.log('Total rombel checkboxes:', count);
  // Klik beberapa rombel kelas 10
  for (let i = 0; i < Math.min(4, count); i++) {
    await rombelCheckboxes.nth(i).check().catch(() => {});
  }
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'ready_to_create_class.png' });

  // Click Buat Kelas
  console.log('4. Clicking "Buat Kelas"...');
  await dialog.locator('button:has-text("Buat Kelas")').click();
  await page.waitForTimeout(5000);

  console.log('Class created! Checking class list...');
  await page.screenshot({ path: 'class_created_list.png' });

  const pageText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Classes list snippet:\n', pageText);

  // Look for our newly created class "SIMULASI ASAS SE JATENG"
  const createdClass = page.locator('div:has-text("SIMULASI ASAS SE JATENG")').first();
  console.log('Created class visible:', await createdClass.isVisible());

  // Click "Buka Workspace" on SIMULASI ASAS SE JATENG
  const workspaceBtn = page.locator('div:has-text("SIMULASI ASAS SE JATENG")').locator('..').locator('button:has-text("Buka Workspace"), a:has-text("Buka Workspace")').first();
  if (await workspaceBtn.isVisible()) {
    console.log('5. Clicking Buka Workspace...');
    await workspaceBtn.click();
    await page.waitForTimeout(5000);
    console.log('Workspace URL:', page.url());
    await page.screenshot({ path: 'workspace_simulasi_class.png' });
    const wsText = await page.evaluate(() => document.body.innerText.slice(0, 1000));
    console.log('Workspace text:\n', wsText);
  }

  await browser.close();
})();

