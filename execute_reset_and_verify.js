const { chromium } = require('playwright');
const fs = require('fs');

const students = [
  { no: 1, name: 'AISYAH TASLIMAH NUR SAFARA', query: 'AISYAH TASLIMAH', email: 'sman1gon_siswa108@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 2, name: 'ALFIRA RENATA JULIYANI', query: 'ALFIRA RENATA', email: 'sman1gon_siswa109@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 3, name: 'ALISA ROHMA PAMILIH', query: 'ALISA ROHMA', email: 'sman1gon_siswa110@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 4, name: 'ANGGA PRASETYO', query: 'ANGGA PRASETYO', email: 'sman1gon_siswa111@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 5, name: 'ANNISA NUR HIDAYAH', query: 'ANNISA NUR', email: 'sman1gon_siswa112@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 6, name: 'ANNISA SEKAR INDAH FEBYANA', query: 'ANNISA SEKAR', email: 'sman1gon_siswa113@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 7, name: 'ARIESKA NAVA SAPOETRY', query: 'ARIESKA NAVA', email: 'sman1gon_siswa114@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 8, name: 'BAGAS DWI PRASETYO', query: 'BAGAS DWI', email: 'sman1gon_siswa115@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 9, name: 'CESIKA ANATASYA NATALIA', query: 'CESIKA ANATASYA', email: 'sman1gon_siswa117@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 10, name: 'CHARISTA DESTYA PRAFAMA', query: 'CHARISTA DESTYA', email: 'sman1gon_siswa118@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 11, name: 'CHIKA ADIANA AGUSTIN', query: 'CHIKA ADIANA', email: 'sman1gon_siswa119@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 12, name: 'DIVAY SOFIA AGUSTIN', query: 'DIVAY SOFIA', email: 'sman1gon_siswa120@belajarplus.com', rombel: 'Kelas 12-D' }
];

const NEW_PASSWORD = 'sman1gon';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMAN 1 GONDANG
  console.log('2. Switching institution to SMAN 1 GONDANG...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SEKOLAH DUMMY"), button:has-text("SMA NEGERI")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible().catch(()=>false)) {
    await searchInput.fill('gondang');
    await page.waitForTimeout(1000);
    await page.locator('[role="menuitem"]:has-text("GONDANG"), div:has-text("GONDANG")').last().click();
    await page.waitForTimeout(5000);
  }

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  console.log('3. Starting password reset for all 12 students...');
  const resetResults = [];

  for (const s of students) {
    console.log(`Setting password for [${s.no}/12]: ${s.name}...`);
    try {
      const searchBox = page.locator('input[placeholder*="Cari nama atau email"]').first();
      await searchBox.fill('');
      await page.waitForTimeout(300);
      await searchBox.fill(s.query);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      // Click "Lihat"
      const lihatBtn = page.locator('button:has-text("Lihat")').first();
      await lihatBtn.click();
      await page.waitForTimeout(1500);

      // Click "Atur ulang kata sandi"
      const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
      await resetBtn.click();
      await page.waitForTimeout(1000);

      // Fill #mp-pw
      const pwInput = page.locator('#mp-pw').first();
      await pwInput.fill(NEW_PASSWORD);
      await page.waitForTimeout(400);

      // Click "Simpan kata sandi"
      const saveBtn = page.locator('button:has-text("Simpan kata sandi")').first();
      await saveBtn.click();
      await page.waitForTimeout(2000);

      // Close modal
      const closeBtn = page.locator('button:has-text("Close")').first();
      if (await closeBtn.isVisible().catch(()=>false)) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);

      console.log(`  ✓ Password successfully set to ${NEW_PASSWORD} for ${s.name}`);
      resetResults.push({ ...s, resetSuccess: true });
    } catch (err) {
      console.error(`  ✗ Error setting password for ${s.name}:`, err.message);
      resetResults.push({ ...s, resetSuccess: false, error: err.message });
      await page.keyboard.press('Escape').catch(()=>{});
      await page.waitForTimeout(1000);
    }
  }

  await browser.close();
  fs.writeFileSync('reset_all_done.json', JSON.stringify(resetResults, null, 2));
  console.log('All passwords updated. Now verifying logins...');

  // Verification step: Login each student
  const verifiedList = [];
  for (const s of students) {
    console.log(`Verifying login [${s.no}/12]: ${s.name} (${s.email})...`);
    const testBrowser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
    const testPage = await testBrowser.newPage();

    let loginOk = false;
    let detail = '';

    try {
      await testPage.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await testPage.waitForTimeout(1500);

      await testPage.locator('input[type="email"]').first().fill(s.email);
      await testPage.locator('input[type="password"]').first().fill(NEW_PASSWORD);
      await testPage.locator('button[type="submit"]').first().click();
      await testPage.waitForTimeout(4000);

      const url = testPage.url();
      const body = await testPage.evaluate(() => document.body.innerText);

      if (!url.includes('/auth') || body.includes('Beranda') || body.includes('Perpustakaan') || body.includes('Buku')) {
        loginOk = true;
        detail = 'Login Berhasil 100%';
        console.log(`  ✓ SUCCESS: ${s.name} logged in!`);
      } else {
        const errorMsg = await testPage.evaluate(() => {
          const el = document.querySelector('[role="alert"], .text-destructive, .text-red-500, p[class*="error"]');
          return el ? el.innerText : 'Unknown auth failure';
        });
        detail = 'Gagal: ' + errorMsg;
        console.log(`  ✗ FAILED: ${s.name} - ${detail}`);
      }
    } catch (e) {
      detail = 'Exception: ' + e.message;
      console.log(`  ✗ EXCEPTION: ${s.name} - ${detail}`);
    } finally {
      await testBrowser.close();
    }

    verifiedList.push({
      no: s.no,
      nama: s.name,
      rombel: s.rombel,
      email: s.email,
      password: NEW_PASSWORD,
      loginStatus: loginOk ? 'BERHASIL' : 'GAGAL',
      detail: detail
    });
  }

  fs.writeFileSync('final_verified_students.json', JSON.stringify(verifiedList, null, 2));
  console.log('ALL VERIFICATIONS FINISHED!');
})();

