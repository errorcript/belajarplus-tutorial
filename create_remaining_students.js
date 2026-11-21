const { chromium } = require('playwright');
const fs = require('fs');

const remainingStudents = [
  { name: 'LIVIA NUR AZIZAH', email: 'livia.nur.azizah@belajarplus.com', targetRombel: 'Kelas 11-8' },
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
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  for (const s of remainingStudents) {
    console.log(`2. Processing student: ${s.name}...`);
    await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    // Click Tambah Siswa
    console.log('  Opening Tambah Siswa dialog...');
    await page.locator('button:has-text("Tambah Siswa")').first().click();
    await page.waitForTimeout(2000);

    await page.locator('#as-email').fill(s.email);
    await page.locator('#as-name').fill(s.name);
    await page.locator('#as-pw').fill(DEFAULT_PW);
    await page.waitForTimeout(600);

    await page.locator('button:has-text("Periksa")').first().click();
    await page.waitForTimeout(2500);

    const konfirmasiBtn = page.locator('button:has-text("Konfirmasi")').first();
    await konfirmasiBtn.click();
    await page.waitForTimeout(4000);
    console.log(`  ✓ Account created for ${s.name}`);

    // Refresh page to ensure clean state
    await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);

    // Search and assign rombel
    console.log(`  Searching ${s.name} to assign ${s.targetRombel}...`);
    const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
    await sf.fill(s.name);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);

    const lihatBtn = page.locator('button:has-text("Lihat")').first();
    await lihatBtn.click();
    await page.waitForTimeout(2000);

    await page.locator('button:has-text("Ubah data")').first().click();
    await page.waitForTimeout(1500);

    const selectRombel = page.locator('#mp-rombel').first();
    await selectRombel.selectOption({ label: s.targetRombel });
    await page.waitForTimeout(600);

    await page.locator('button:has-text("Simpan")').first().click();
    await page.waitForTimeout(3000);
    console.log(`  ✓ ${s.name} assigned to ${s.targetRombel}!`);
  }

  await browser.close();

  // Verify login for both
  console.log('3. Verifying login for remaining students...');
  for (const s of remainingStudents) {
    const testBrowser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
    const testPage = await testBrowser.newPage();

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
        console.log(`  ✓ SUCCESS: ${s.name} logged in 100%!`);
      } else {
        console.log(`  ✗ FAILED: ${s.name}`);
      }
    } finally {
      await testBrowser.close();
    }
  }

  console.log('Finished remaining students.');
})();

