const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('====================================================================');
  console.log('🤖 MENJALANKAN BOT DENGAN AKUN ARUM (RUMAYSCH@GMAIL.COM)');
  console.log('====================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const page = await browser.newPage();

  console.log('1. Login Trainer Arum (rumaysch@gmail.com)...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  await page.fill('input[type="email"]', 'rumaysch@gmail.com');
  await page.fill('input[type="password"]', 'A410Arum');
  await page.click('button[type="submit"]');
  console.log('   Submit login diklik, menunggu dashboard...');
  await page.waitForTimeout(6000);
  console.log('   Current URL:', page.url());

  // Check institutional switcher / list
  console.log('2. Memeriksa daftar institusi di akun Arum...');
  const institutions = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div, li, a, button, tr'))
      .map(el => el.innerText ? el.innerText.trim() : '')
      .filter(t => t.includes('SMA NEGERI') || t.includes('SMAN') || t.includes('SMAS'))
      .map(t => t.split('\n')[0].trim());
  });
  console.log('   Institusi terlihat:', [...new Set(institutions)]);

  // Cari apakah ada SMAN 1 Sukodono
  const sukodonoLocator = page.locator('div, li, tr').filter({ hasText: /SUKODONO/i }).first();
  const hasSukodono = await sukodonoLocator.isVisible().catch(() => false);
  console.log('   Apakah SMAN 1 Sukodono ada di akun Arum?', hasSukodono);

  if (hasSukodono) {
    console.log('🎯 DITEMUKAN SMAN 1 SUKODONO DI AKUN ARUM!');
    const masukBtn = sukodonoLocator.locator('button:has-text("Masuk")').first();
    if (await masukBtn.isVisible().catch(() => false)) {
      console.log('   Mengklik tombol Masuk SMAN 1 Sukodono...');
      await masukBtn.click();
      await page.waitForTimeout(4000);
    }

    // Buka /admin/students
    console.log('3. Navigasi ke /admin/students...');
    await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    const imporBtn = page.locator('button:has-text("Impor Siswa"), button:has-text("Impor")').first();
    const isImporVisible = await imporBtn.isVisible().catch(() => false);
    console.log('   Tombol Impor Siswa terlihat?', isImporVisible);

    if (isImporVisible) {
      const batchDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/sukodono_batches';
      const batchFiles = fs.readdirSync(batchDir).filter(f => f.endsWith('.xlsx')).sort();

      for (let b = 0; b < batchFiles.length; b++) {
        const fName = batchFiles[b];
        const fullPath = path.join(batchDir, fName);
        console.log(`\n   --- Mengimpor Batch ${b + 1} dari ${batchFiles.length}: ${fName} ---`);

        await imporBtn.click();
        await page.waitForTimeout(2000);

        const fileInput = page.locator('input[accept*="xlsx"], input[type="file"]').first();
        await fileInput.setInputFiles(fullPath);
        console.log('   File batch berhasil diinput ke form.');
        await page.waitForTimeout(4000);

        const dialog = page.locator('div[role="dialog"]');
        const submitBtn = dialog.locator('button:has-text("Impor")').last();

        let isReady = false;
        for (let w = 1; w <= 15; w++) {
          await page.waitForTimeout(1000);
          if (!(await submitBtn.isDisabled())) {
            isReady = true;
            break;
          }
        }

        if (isReady) {
          console.log(`   Tombol Impor aktif! Klik Impor untuk ${fName}...`);
          await submitBtn.click();

          let isDone = false;
          let pollCount = 0;
          while (!isDone && pollCount < 40) {
            pollCount++;
            await page.waitForTimeout(3000);
            const text = await dialog.innerText().catch(() => '');

            if (text.includes('Selesai') || text.includes('Tutup') || text.includes('Berhasil')) {
              console.log(`   ✓ Batch ${fName} sukses selesai diproses!`);
              const closeBtn = dialog.locator('button:has-text("Selesai"), button:has-text("Tutup")').first();
              await closeBtn.click().catch(() => { });
              isDone = true;
              break;
            }

            if (pollCount % 4 === 0) {
              console.log(`   [Polling ${pollCount * 3}s] Memproses data di server...`);
            }
          }
        } else {
          console.log(`   ⚠️ Tombol Impor masih disabled untuk ${fName}:`);
          const dText = await dialog.innerText().catch(() => '');
          console.log('   Isi dialog:', dText.replace(/\n+/g, ' '));
        }
      }
      console.log('\n🎉 SELURUH BATCH SISWA SMAN 1 SUKODONO SUKSES DIIMPOR KE PLATFORM!');
    }
  } else {
    console.log('   SMAN 1 Sukodono tidak ditemukan di akun Arum.');
  }

  await browser.close();
})();

