const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const proofDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/deployment_proofs';
if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

const rombelSpecs = JSON.parse(fs.readFileSync('C:/Users/errorscript/.gemini/antigravity-ide/scratch/school_rombel_specs.json', 'utf8'))['SMAN 1 Ambarawa'];

(async () => {
  console.log('====================================================================');
  console.log('MEMULAI DEPLOYMENT SMAN 1 AMBARAWA (1.260 SISWA, 35 ROMBEL)');
  console.log('====================================================================\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const page = await browser.newPage();

  console.log('1. Login Trainer Adnan...');
  await page.goto('https://belajarplus.id/auth?redirect=%2Fdashboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.fill('input[type="email"]', 'adnancindyana1234@gmail.com');
  await page.fill('input[type="password"]', 'trainer98');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(4000);

  console.log('2. Masuk ke SMA NEGERI 1 AMBARAWA...');
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:') || k.includes('institution')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'SMA NEGERI 1 AMBARAWA' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(4000);

  // 3. Setup TA 2026/2027
  console.log('3. Setup & Aktifkan TA 2026/2027 di /master-data/tahun-ajaran...');
  await page.goto('https://belajarplus.id/master-data/tahun-ajaran', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  if (!bodyText.includes('2026/2027')) {
    const tambahBtn = page.locator('button:has-text("Tambah")').first();
    if (await tambahBtn.isVisible().catch(() => false)) {
      await tambahBtn.click();
      await page.waitForTimeout(1000);
      const dialog = page.locator('div[role="dialog"]');
      await dialog.locator('input').nth(0).fill('2026/2027');
      await dialog.locator('input[type="date"]').nth(0).fill('2026-07-01');
      await dialog.locator('input[type="date"]').nth(1).fill('2027-06-30');
      await dialog.locator('button:has-text("Simpan")').click();
      await page.waitForTimeout(3000);
    }
  }

  const card2026 = page.locator('div.border, div.rounded-lg, tr').filter({ hasText: '2026/2027' }).first();
  if (await card2026.isVisible().catch(() => false)) {
    const actBtn = card2026.locator('button:has-text("Aktifkan")').first();
    if (await actBtn.isVisible().catch(() => false)) {
      console.log('   Mengaktifkan TA 2026/2027...');
      await actBtn.click();
      await page.waitForTimeout(3000);
    }
  }
  console.log('   ✓ TA 2026/2027 sudah Aktif di SMAN 1 Ambarawa!');

  // 4. Buat Rombel
  console.log(`\n4. Memeriksa dan Membuat ${rombelSpecs.length} Rombel di /master-data/rombel...`);
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const existingRombels = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.border, div.rounded-lg, tr'))
      .map(el => el.innerText.split('\n')[0].trim())
      .filter(t => t.startsWith('Kelas '));
  });
  const existingSet = new Set(existingRombels);
  console.log(`   Rombel sudah ada: ${existingSet.size} rombel.`);

  for (let r = 0; r < rombelSpecs.length; r++) {
    const rombelName = rombelSpecs[r];
    if (existingSet.has(rombelName)) {
      continue;
    }

    const match = rombelName.match(/^Kelas\s+(\d+)[\-_](.+)$/i);
    if (!match) continue;
    const tingkatNumber = match[1];
    const suffix = match[2];

    const tambahBtn = page.locator('button:has-text("Tambah Rombel")').first();
    await tambahBtn.waitFor({ state: 'visible', timeout: 15000 });
    await tambahBtn.click();
    await page.waitForTimeout(1000);

    const dialog = page.locator('div[role="dialog"]');
    const selects = dialog.locator('select');
    await selects.nth(0).selectOption('SMA');
    await page.waitForTimeout(300);
    await selects.nth(1).selectOption(tingkatNumber);
    await page.waitForTimeout(300);

    const suffixInput = dialog.locator('input[placeholder="A"], input[type="text"]').first();
    await suffixInput.fill(suffix);
    await page.waitForTimeout(300);

    const submitBtn = dialog.locator('button:has-text("Tambah Rombel")').last();
    await submitBtn.click();
    await page.waitForTimeout(2000);

    existingSet.add(rombelName);
    console.log(`   [+ ${r + 1}/${rombelSpecs.length}] ${rombelName} sukses dibuat.`);
  }
  console.log(`✓ Seluruh rombel (${existingSet.size}) sudah siap di SMAN 1 Ambarawa!`);

  // 5. Impor Batch Siswa
  const batchDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/semarang_batches/SMAN 1 Ambarawa';
  const batchFiles = fs.readdirSync(batchDir).filter(f => f.endsWith('.xlsx')).sort();

  console.log(`\n5. Mengimpor ${batchFiles.length} file batch siswa untuk SMAN 1 Ambarawa...`);
  for (let b = 0; b < batchFiles.length; b++) {
    const fName = batchFiles[b];
    const fullPath = path.join(batchDir, fName);
    console.log(`\n   --- Mengimpor Batch ${b + 1} dari ${batchFiles.length}: ${fName} ---`);

    await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(5000);

    const imporBtn = page.locator('button:has-text("Impor Siswa")').first();
    await imporBtn.waitFor({ state: 'visible', timeout: 30000 });
    await imporBtn.click();
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[accept*="xlsx"], input[type="file"]').first();
    await fileInput.setInputFiles(fullPath);
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
      console.log(`       Tombol Impor aktif! Klik Impor untuk ${fName}...`);
      await submitBtn.click();

      let isDone = false;
      let pollCount = 0;
      while (!isDone && pollCount < 40) {
        pollCount++;
        await page.waitForTimeout(3000);
        const text = await dialog.innerText().catch(() => '');

        if (text.includes('Selesai') || text.includes('Tutup') || text.includes('Berhasil')) {
          console.log(`       ✓ Batch ${fName} sukses selesai diproses!`);
          const closeBtn = dialog.locator('button:has-text("Selesai"), button:has-text("Tutup")').first();
          await closeBtn.click().catch(() => {});
          isDone = true;
          break;
        }

        if (pollCount % 4 === 0) {
          console.log(`       [Polling ${pollCount * 3}s] Memproses data di server...`);
        }
      }
    } else {
      console.log(`       ⚠️ Tombol Impor masih disabled untuk ${fName}`);
    }
    await page.waitForTimeout(2000);
  }

  // 6. Verifikasi Akhir
  console.log('\n6. Verifikasi Akhir dan Screenshot SMAN 1 Ambarawa...');
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);

  const stats = await page.evaluate(() => {
    const text = document.body.innerText;
    const mTotal = text.match(/(\d+)\s*Total\s+Siswa/i);
    const mSudah = text.match(/(\d+)\s*Sudah\s+di\s+Rombel/i);
    const mBelum = text.match(/(\d+)\s*Belum\s+di\s+Rombel/i);
    return {
      total: mTotal ? mTotal[1] : '0',
      sudah: mSudah ? mSudah[1] : '0',
      belum: mBelum ? mBelum[1] : '0'
    };
  });

  const ssPath = path.join(proofDir, 'SMAN_1_Ambarawa_final_success.png');
  await page.screenshot({ path: ssPath, fullPage: false });

  console.log('\n======================================================');
  console.log('🎉 HASIL AKHIR SMAN 1 AMBARAWA:', stats);
  console.log(`📸 Bukti screenshot tersimpan di: ${ssPath}`);
  console.log('======================================================');

  await browser.close();
})();
