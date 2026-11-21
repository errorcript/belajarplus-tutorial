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
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // Go to Exercise page
  await page.goto('https://belajarplus.com/admin/exercises/a6f2f900-91c2-43e5-bb5e-5c7313cf22a5');
  await page.waitForTimeout(4000);

  // Check "Atur waktu mulai"
  console.log('2. Setting Atur waktu mulai...');
  const waktuMulaiCheckbox = page.locator('label:has-text("Atur waktu mulai") input[type="checkbox"]');
  if (!(await waktuMulaiCheckbox.isChecked())) {
    await waktuMulaiCheckbox.check();
    await page.waitForTimeout(1000);
  }

  // Find inputs under Atur waktu mulai
  const dateInputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      name: i.name,
      value: i.value,
      placeholder: i.placeholder,
      parentText: i.parentElement ? i.parentElement.innerText.slice(0, 80) : ''
    })).filter(i => i.type === 'date' || i.type === 'time' || i.type === 'datetime-local' || i.parentText.includes('mulai'));
  });
  console.log('Date/time inputs found:', dateInputs);

  // If there's datetime-local or date & time
  const dtInput = page.locator('input[type="datetime-local"], input[type="date"]').first();
  if (await dtInput.count() > 0) {
    const inputType = await dtInput.getAttribute('type');
    if (inputType === 'datetime-local') {
      await dtInput.fill('2026-11-19T08:00');
    } else if (inputType === 'date') {
      await dtInput.fill('2026-11-19');
      const timeInput = page.locator('input[type="time"]').first();
      if (await timeInput.count() > 0) {
        await timeInput.fill('08:00');
      }
    }
  }

  // Ensure Mode Ujian is checked
  console.log('3. Setting Mode Ujian & Terkunci...');
  const modeUjianCheckbox = page.locator('label:has-text("Mode Ujian") input[type="checkbox"]');
  if (!(await modeUjianCheckbox.isChecked())) {
    await modeUjianCheckbox.check();
    await page.waitForTimeout(1000);
  }

  // Click Terkunci radio
  const terkunciRadio = page.locator('label:has-text("Terkunci") input[type="radio"]');
  await terkunciRadio.check();
  await page.waitForTimeout(1500);

  // Fill password
  console.log('4. Filling password keluar pengawas: kitabisa');
  const passwordInput = page.locator('input[type="password"]').first();
  await passwordInput.fill('kitabisa');
  await page.waitForTimeout(1000);

  // Save settings
  console.log('5. Clicking Simpan pengaturan...');
  const saveBtn = page.locator('button:has-text("Simpan pengaturan")').first();
  await saveBtn.click();
  await page.waitForTimeout(4000);

  // Check toast / notification or saved state
  await page.screenshot({ path: 'after_save_exam_settings.png' });
  console.log('Settings saved screenshot captured.');

  const pageNotification = await page.evaluate(() => {
    const alerts = Array.from(document.querySelectorAll('[role="alert"], [role="status"], .toast, div[class*="toast"]')).map(a => a.innerText);
    return alerts;
  });
  console.log('Notifications/alerts:', pageNotification);

  await browser.close();
})();

