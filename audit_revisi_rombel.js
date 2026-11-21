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

  // Ambil semua cards rombel
  const rombelCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.border.bg-card'));
    return cards.map((c, idx) => {
      const nameEl = c.querySelector('h3, .font-semibold, .font-bold');
      const text = c.innerText;
      return {
        idx,
        name: nameEl ? nameEl.innerText.trim() : text.split('\n')[0].trim(),
        text: text.replace(/\n+/g, ' | ')
      };
    });
  });

  console.log('Found rombels:', rombelCards.length);
  fs.writeFileSync('tws_all_rombel_cards.json', JSON.stringify(rombelCards, null, 2));

  // Rombel target yang ingin kita inspect anggotanya
  const targetNames = [
    'Kelas 10-1', 'Kelas 10-10',
    'Kelas 11-3', 'Kelas 11-4', 'Kelas 11-7', 'Kelas 11-8', 'Kelas 11-9', 'Kelas 11-10',
    'Kelas 12-2', 'Kelas 12-6', 'Kelas 12-10'
  ];

  const targetCards = rombelCards.filter(c => targetNames.some(t => c.name.includes(t)));
  console.log('Target rombels to inspect:', targetCards.map(t => `${t.idx}: ${t.name}`));

  const rombelDetails = {};

  for (const tc of targetCards) {
    console.log(`\n--- Inspecting ${tc.name} (index ${tc.idx}) ---`);
    const cardLoc = page.locator('div.border.bg-card').nth(tc.idx);
    const anggotaBtn = cardLoc.getByRole('button', { name: /Anggota/i });
    await anggotaBtn.click();
    await page.waitForTimeout(2500);

    const data = await page.evaluate(() => {
      const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
      if (!dialog) return { error: 'No dialog' };
      
      const fullText = dialog.innerText;
      // Cari nama-nama siswa di dalam dialog
      const items = Array.from(dialog.querySelectorAll('div.flex.items-center.justify-between, div.space-y-1, div[role="listitem"], .border-b, .p-2')).map(el => el.innerText.trim()).filter(Boolean);
      return {
        fullText,
        items
      };
    });

    rombelDetails[tc.name] = data;

    // Close dialog
    const closeBtn = page.getByRole('button', { name: /Close|Tutup|Batal/i }).last();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(1000);
  }

  fs.writeFileSync('tws_target_rombels_audit.json', JSON.stringify(rombelDetails, null, 2));
  console.log('\nAudit done! Saved to tws_target_rombels_audit.json');

  await browser.close();
})();

