const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Login Alif...');
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('And.aliffiansyah@gmail.com');
  await page.locator('input[type="password"]').first().fill('kerja98');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Clear institution and select Patikraja
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"], input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('SMA NEGERI 1 PATIKRAJA');
    await page.waitForTimeout(1500);
  }

  const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'SMA NEGERI 1 PATIKRAJA' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3000);

  console.log('2. Buka Master Data Rombel...');
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Buat Rombel Kelas 11-XI-1 s/d 11-XI-9 dan Kelas 12-XII-1 s/d 12-XII-8
  const targetRombels = [
    { grade: 'Kelas 11', suffix: 'XI-1', fullName: 'Kelas 11-XI-1' },
    { grade: 'Kelas 11', suffix: 'XI-2', fullName: 'Kelas 11-XI-2' },
    { grade: 'Kelas 11', suffix: 'XI-3', fullName: 'Kelas 11-XI-3' },
    { grade: 'Kelas 11', suffix: 'XI-4', fullName: 'Kelas 11-XI-4' },
    { grade: 'Kelas 11', suffix: 'XI-5', fullName: 'Kelas 11-XI-5' },
    { grade: 'Kelas 11', suffix: 'XI-6', fullName: 'Kelas 11-XI-6' },
    { grade: 'Kelas 11', suffix: 'XI-7', fullName: 'Kelas 11-XI-7' },
    { grade: 'Kelas 11', suffix: 'XI-8', fullName: 'Kelas 11-XI-8' },
    { grade: 'Kelas 11', suffix: 'XI-9', fullName: 'Kelas 11-XI-9' },
    { grade: 'Kelas 12', suffix: 'XII-1', fullName: 'Kelas 12-XII-1' },
    { grade: 'Kelas 12', suffix: 'XII-2', fullName: 'Kelas 12-XII-2' },
    { grade: 'Kelas 12', suffix: 'XII-3', fullName: 'Kelas 12-XII-3' },
    { grade: 'Kelas 12', suffix: 'XII-4', fullName: 'Kelas 12-XII-4' },
    { grade: 'Kelas 12', suffix: 'XII-5', fullName: 'Kelas 12-XII-5' },
    { grade: 'Kelas 12', suffix: 'XII-6', fullName: 'Kelas 12-XII-6' },
    { grade: 'Kelas 12', suffix: 'XII-7', fullName: 'Kelas 12-XII-7' },
    { grade: 'Kelas 12', suffix: 'XII-8', fullName: 'Kelas 12-XII-8' }
  ];

  for (const tr of targetRombels) {
    const exists = await page.evaluate((name) => {
      const titles = Array.from(document.querySelectorAll('p.font-medium')).map(p => p.innerText.trim());
      return titles.includes(name);
    }, tr.fullName);

    if (exists) {
      console.log(`[SUDAH ADA] ${tr.fullName}`);
      continue;
    }

    console.log(`[MEMBUAT] ${tr.fullName}...`);
    await page.locator('button:has-text("Tambah Rombel")').first().click();
    await page.waitForTimeout(1000);

    const dialog = page.locator('[role="dialog"]');
    const selects = dialog.locator('select');
    await selects.nth(0).selectOption({ label: 'SMA/MA' });
    await page.waitForTimeout(300);
    await selects.nth(1).selectOption({ label: tr.grade });
    await page.waitForTimeout(300);

    const suffixInput = dialog.locator('input').first();
    await suffixInput.fill(tr.suffix);
    await page.waitForTimeout(300);

    const submitBtn = dialog.locator('button:has-text("Tambah Rombel")').first();
    await submitBtn.click();
    await page.waitForTimeout(2500);
    console.log(`[BERHASIL DIBUAT] ${tr.fullName}`);
  }

  // Refresh halaman untuk reload rombel list
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  console.log('3. Assign Siswa Adjie Wisnu Pratama ke Kelas 11-XI-1...');
  const card11_1 = page.locator('div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'Kelas 11-XI-1' }).first();
  if (await card11_1.isVisible()) {
    await card11_1.locator('button:has-text("Kelola Kelas")').first().click();
    await page.waitForTimeout(2000);

    const tambahAnggotaBtn = page.locator('button:has-text("Tambah Anggota")').first();
    if (await tambahAnggotaBtn.isVisible()) {
      await tambahAnggotaBtn.click();
      await page.waitForTimeout(1500);

      const dialog = page.locator('[role="dialog"]');
      const searchBox = dialog.locator('input[placeholder*="Cari"]').first();
      if (await searchBox.isVisible()) {
        await searchBox.fill('Adjie');
        await page.waitForTimeout(1000);
      }

      const checkbox = dialog.locator('button[role="checkbox"], input[type="checkbox"]').first();
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await page.waitForTimeout(500);
      }

      const simpanBtn = dialog.locator('button:has-text("Simpan"), button:has-text("Tambah"), button:has-text("Pilih")').first();
      if (await simpanBtn.isVisible()) {
        await simpanBtn.click();
        await page.waitForTimeout(2000);
        console.log('[BERHASIL ASSIGN] Adjie Wisnu Pratama ke Kelas 11-XI-1');
      }
    }
  }

  // Tangkap screenshot bukti setelah assign
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'G:/My Drive/Trainer/B+/AKUN/57. SMAN 1 Patikraja/Bukti_Impor/4_siswa_setelah_assign_rombel.png' });

  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'G:/My Drive/Trainer/B+/AKUN/57. SMAN 1 Patikraja/Bukti_Impor/5_rombel_setelah_assign.png' });

  console.log('Selesai setup rombel Patikraja & screenshot tersimpan.');
  await browser.close();
})();
