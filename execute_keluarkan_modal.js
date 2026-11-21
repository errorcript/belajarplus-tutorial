const { chromium } = require('playwright');

async function keluarkanDariModal() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('1. Logging in as Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  console.log('2. Switching school to SMAN 1 TAWANGSARI...');
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // --- A. Keluarkan sman1taw_siswa621 dari Kelas 11-7 (nth 16) ---
  console.log('\n--- A. Keluarkan sman1taw_siswa621 dari Kelas 11-7 ---');
  await page.getByRole('button', { name: 'Anggota' }).nth(16).click();
  await page.waitForTimeout(3000);

  const row621Found = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], .max-h-\\[90vh\\]');
    if (!dialog) return false;
    const cards = Array.from(dialog.querySelectorAll('div.flex.items-center.gap-2.p-2'));
    for (const card of cards) {
      if (card.innerText.includes('sman1taw_siswa621@belajarplus.com')) {
        const btn = card.querySelector('button[aria-label="Keluarkan"]');
        if (btn) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  });

  console.log('Clicked Keluarkan for 621:', row621Found);
  await page.waitForTimeout(2000);

  // Cek apakah ada alert/dialog konfirmasi
  const confirmBtnA = page.getByRole('button', { name: /Ya|Keluarkan|Konfirmasi|Lanjutkan/i }).last();
  if (await confirmBtnA.isVisible()) {
    console.log('Confirming removal:', await confirmBtnA.innerText());
    await confirmBtnA.click();
    await page.waitForTimeout(3000);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  // --- B. Keluarkan sman1taw_asesmen348 dari Kelas 12-10 (nth 29) ---
  console.log('\n--- B. Keluarkan sman1taw_asesmen348 dari Kelas 12-10 ---');
  await page.getByRole('button', { name: 'Anggota' }).nth(29).click();
  await page.waitForTimeout(3000);

  const row348Found = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"], .max-h-\\[90vh\\]');
    if (!dialog) return false;
    const cards = Array.from(dialog.querySelectorAll('div.flex.items-center.gap-2.p-2'));
    for (const card of cards) {
      if (card.innerText.includes('sman1taw_asesmen348@belajarplus.com')) {
        const btn = card.querySelector('button[aria-label="Keluarkan"]');
        if (btn) {
          btn.click();
          return true;
        }
      }
    }
    return false;
  });

  console.log('Clicked Keluarkan for 348:', row348Found);
  await page.waitForTimeout(2000);

  const confirmBtnB = page.getByRole('button', { name: /Ya|Keluarkan|Konfirmasi|Lanjutkan/i }).last();
  if (await confirmBtnB.isVisible()) {
    console.log('Confirming removal:', await confirmBtnB.innerText());
    await confirmBtnB.click();
    await page.waitForTimeout(3000);
  }

  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  await browser.close();
}

keluarkanDariModal().catch(console.error);

