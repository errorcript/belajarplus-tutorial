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

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  const testEmails = [
    'fadilfadjrul22@gmail.com',
    'sman1taw_siswa621@belajarplus.com',
    'sman1taw_siswa622@belajarplus.com',
    'sman1taw_asesmen348@belajarplus.com',
    'sman1taw_asesmen338@belajarplus.com',
    'fadhildzuljalilathasaputro@belajarplus.com',
    'rayyaalvaearlynurfaizah@belajarplus.com',
    'vanesyaanandaanastasia@belajarplus.com'
  ];

  const searchInput = page.getByPlaceholder('Cari nama atau email…');

  const statusMap = {};

  for (const email of testEmails) {
    console.log(`Searching for: ${email}...`);
    await searchInput.fill('');
    await searchInput.fill(email);
    await page.waitForTimeout(2000);

    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('table tbody tr'));
      return trs.map(tr => tr.innerText.replace(/\n+/g, ' | '));
    });

    statusMap[email] = rows;
    console.log(`Found ${rows.length} rows for ${email}:`, rows[0] || 'EMPTY');

    // Cek tombol Lihat jika ada baris
    if (rows.length > 0) {
      const lihatBtn = page.getByRole('button', { name: 'Lihat' }).first();
      await lihatBtn.click();
      await page.waitForTimeout(2000);

      const modalData = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"], [data-state="open"]');
        if (!dialog) return { error: 'No dialog' };
        const buttons = Array.from(dialog.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
        return {
          text: dialog.innerText,
          buttons
        };
      });

      console.log(`Detail modal for ${email}:`, modalData.buttons, modalData.text.slice(0, 300).replace(/\n+/g, ' '));
      
      // Close modal
      const closeBtn = page.getByRole('button', { name: /Close|Tutup|Batal/i }).last();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);
    }
  }

  fs.writeFileSync('tws_students_search_results.json', JSON.stringify(statusMap, null, 2));

  await browser.close();
})();

