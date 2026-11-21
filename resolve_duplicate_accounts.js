const { chromium } = require('playwright');

async function resolveDuplicates() {
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

  // --- Step A: Unassign sman1taw_siswa621@belajarplus.com from Kelas 11-7 ---
  console.log('\n--- Step A: Unassigning sman1taw_siswa621@belajarplus.com (Akun Dobel Herdha) ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  let searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_siswa621@belajarplus.com');
  await page.waitForTimeout(2000);

  let row = page.locator('table tbody tr').first();
  if (await row.isVisible()) {
    await row.getByRole('button', { name: 'Lihat' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ubah data' }).click();
    await page.waitForTimeout(2000);

    const sel = page.locator('select').last();
    // Cari option untuk "—" (unassign)
    const emptyVal = await sel.evaluate(s => {
      const opt = Array.from(s.options).find(o => o.text.trim() === '—' || o.text.trim() === '' || o.value === '');
      return opt ? opt.value : '';
    });
    console.log('Empty rombel option value:', emptyVal);
    await sel.selectOption(emptyVal);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
    console.log('Unassigned sman1taw_siswa621@belajarplus.com successfully!');
  }

  // --- Step B: Unassign sman1taw_asesmen348@belajarplus.com from Kelas 12-10 ---
  console.log('\n--- Step B: Unassigning sman1taw_asesmen348@belajarplus.com (Akun Dobel Nurdiansyah) ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen348@belajarplus.com');
  await page.waitForTimeout(2000);

  row = page.locator('table tbody tr').first();
  if (await row.isVisible()) {
    await row.getByRole('button', { name: 'Lihat' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ubah data' }).click();
    await page.waitForTimeout(2000);

    const sel = page.locator('select').last();
    const emptyVal = await sel.evaluate(s => {
      const opt = Array.from(s.options).find(o => o.text.trim() === '—' || o.text.trim() === '' || o.value === '');
      return opt ? opt.value : '';
    });
    await sel.selectOption(emptyVal);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Simpan' }).click();
    await page.waitForTimeout(3000);
    console.log('Unassigned sman1taw_asesmen348@belajarplus.com successfully!');
  }

  // --- Step C: Assign sman1taw_asesmen338@belajarplus.com to Kelas 12-10 ---
  console.log('\n--- Step C: Assigning sman1taw_asesmen338@belajarplus.com to Kelas 12-10 ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  searchInput = page.getByPlaceholder('Cari nama atau email…');
  await searchInput.fill('sman1taw_asesmen338@belajarplus.com');
  await page.waitForTimeout(2000);

  row = page.locator('table tbody tr').first();
  if (await row.isVisible()) {
    await row.getByRole('button', { name: 'Lihat' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Ubah data' }).click();
    await page.waitForTimeout(2000);

    const sel = page.locator('select').last();
    const k1210Val = await sel.evaluate(s => {
      const opt = Array.from(s.options).find(o => o.text.trim() === 'Kelas 12-10');
      return opt ? opt.value : null;
    });
    console.log('Kelas 12-10 option value:', k1210Val);
    if (k1210Val) {
      await sel.selectOption(k1210Val);
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Simpan' }).click();
      await page.waitForTimeout(3000);
      console.log('Assigned sman1taw_asesmen338@belajarplus.com to Kelas 12-10 successfully!');
    }
  }

  await browser.close();
}

resolveDuplicates().catch(console.error);

