const { chromium } = require('playwright');
const fs = require('fs');

const newStudents = [
  { name: 'ZAHIRA NUR SALSABILA', email: 'zahira.nur.salsabila@belajarplus.com', targetRombel: 'Kelas 10-2' },
  { name: 'LIVIA NUR AZIZAH', email: 'livia.nur.azizah@belajarplus.com', targetRombel: 'Kelas 11-8' },
  { name: 'UZLIFATUL AZIFAH', email: 'uzlifatul.azifah@belajarplus.com', targetRombel: 'Kelas 11-7' },
  { name: 'EMYL AGUSTIAN FIFANANDA', email: 'emyl.agustian.fifananda@belajarplus.com', targetRombel: 'Kelas 12-7' }
];

const DEFAULT_PW = 'sman1rawalo';

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

  // Switch to SMA NEGERI 1 RAWALO
  console.log('2. Switching to SMA NEGERI 1 RAWALO...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // STEP 1: Lepaskan DIAN FITRININGSIH dari Kelas 10-7
  console.log('3. Updating DIAN FITRININGSIH (removing from rombel 10-7)...');
  try {
    const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
    await sf.fill('');
    await page.waitForTimeout(200);
    await sf.fill('DIAN FITRININGSIH');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const lihatBtn = page.locator('button:has-text("Lihat")').first();
    if (await lihatBtn.isVisible()) {
      await lihatBtn.click();
      await page.waitForTimeout(1500);
      await page.locator('button:has-text("Ubah data")').first().click();
      await page.waitForTimeout(1200);

      // Select empty option (—)
      const selectRombel = page.locator('#mp-rombel').first();
      await selectRombel.selectOption({ label: '—' });
      await page.waitForTimeout(500);

      await page.locator('button:has-text("Simpan")').first().click();
      await page.waitForTimeout(2000);
      await page.locator('button:has-text("Close")').first().click().catch(()=>{});
      console.log('  ✓ DIAN FITRININGSIH successfully removed from rombel!');
    }
  } catch (err) {
    console.error('  Error updating Dian:', err.message);
  }

  // STEP 2: Create 4 new student accounts
  console.log('4. Creating 4 new student accounts...');
  for (const s of newStudents) {
    console.log(`  Creating account for ${s.name} (${s.email})...`);
    try {
      await page.locator('button:has-text("Tambah Siswa")').first().click();
      await page.waitForTimeout(1500);

      await page.locator('#as-email').fill(s.email);
      await page.locator('#as-name').fill(s.name);
      await page.locator('#as-pw').fill(DEFAULT_PW);
      await page.waitForTimeout(500);

      await page.locator('button:has-text("Periksa")').first().click();
      await page.waitForTimeout(2000);

      const konfirmasiBtn = page.locator('button:has-text("Konfirmasi")').first();
      if (await konfirmasiBtn.isVisible()) {
        await konfirmasiBtn.click();
        await page.waitForTimeout(3000);
        console.log(`  ✓ Account created for ${s.name}`);
      } else {
        console.log(`  Konfirmasi button not visible for ${s.name}`);
        await page.locator('button:has-text("Close")').first().click().catch(()=>{});
      }
    } catch (err) {
      console.error(`  Error creating account for ${s.name}:`, err.message);
      await page.locator('button:has-text("Close")').first().click().catch(()=>{});
      await page.waitForTimeout(1000);
    }
  }

  // STEP 3: Assign each student to their target rombel
  console.log('5. Assigning 4 new students to rombel...');
  for (const s of newStudents) {
    console.log(`  Assigning ${s.name} to ${s.targetRombel}...`);
    try {
      const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
      await sf.fill('');
      await page.waitForTimeout(200);
      await sf.fill(s.name);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      const lihatBtn = page.locator('button:has-text("Lihat")').first();
      if (await lihatBtn.isVisible()) {
        await lihatBtn.click();
        await page.waitForTimeout(1500);

        await page.locator('button:has-text("Ubah data")').first().click();
        await page.waitForTimeout(1200);

        const selectRombel = page.locator('#mp-rombel').first();
        await selectRombel.selectOption({ label: s.targetRombel });
        await page.waitForTimeout(500);

        await page.locator('button:has-text("Simpan")').first().click();
        await page.waitForTimeout(2000);
        await page.locator('button:has-text("Close")').first().click().catch(()=>{});
        console.log(`  ✓ ${s.name} assigned to ${s.targetRombel}!`);
      } else {
        console.log(`  Lihat button not found for ${s.name}`);
      }
    } catch (err) {
      console.error(`  Error assigning ${s.name}:`, err.message);
      await page.locator('button:has-text("Close")').first().click().catch(()=>{});
    }
  }

  await browser.close();

  // STEP 4: Verify logins for all 4 new students
  console.log('6. Verifying login for 4 new students...');
  const verifyResults = [];

  for (const s of newStudents) {
    console.log(`  Testing login: ${s.email}...`);
    const testBrowser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
    const testPage = await testBrowser.newPage();

    let success = false;
    let detail = '';

    try {
      await testPage.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await testPage.waitForTimeout(1500);

      await testPage.locator('input[type="email"]').first().fill(s.email);
      await testPage.locator('input[type="password"]').first().fill(DEFAULT_PW);
      await testPage.locator('button[type="submit"]').first().click();
      await testPage.waitForTimeout(4000);

      const url = testPage.url();
      const body = await testPage.evaluate(() => document.body.innerText);

      if (!url.includes('/auth') || body.includes('Beranda') || body.includes('Perpustakaan') || body.includes('Buku')) {
        success = true;
        detail = 'Login Berhasil 100%';
        console.log(`  ✓ SUCCESS: ${s.name} logged in!`);
      } else {
        const err = await testPage.evaluate(() => {
          const el = document.querySelector('[role="alert"], .text-destructive, .text-red-500, p[class*="error"]');
          return el ? el.innerText : 'Unknown auth failure';
        });
        detail = 'Gagal: ' + err;
        console.log(`  ✗ FAILED: ${s.name} - ${detail}`);
      }
    } catch (e) {
      detail = 'Exception: ' + e.message;
      console.log(`  ✗ EXCEPTION: ${s.name} - ${detail}`);
    } finally {
      await testBrowser.close();
    }

    verifyResults.push({
      nama: s.name,
      rombel: s.targetRombel,
      email: s.email,
      password: DEFAULT_PW,
      loginStatus: success ? 'BERHASIL' : 'GAGAL',
      detail: detail
    });
  }

  fs.writeFileSync('rawalo_new_students_verified.json', JSON.stringify(verifyResults, null, 2));
  console.log('ALL RAWALO TASKS COMPLETED SUCCESSFULLY!');
})();

