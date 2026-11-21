const { chromium } = require('playwright');

(async () => {
  console.log('=== CEK LANGSUNG DI UI PLATFORM: SMAN 1 GEMOLONG & ANISCA ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Henri
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to Gemolong
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const gemolongOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /GEMOLONG/i }).first();
  await gemolongOpt.click();
  await page.waitForTimeout(4000);

  // 1. Periksa Master Data Rombel di UI
  console.log('--- Membuka /master-data/rombel ---');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const rombelRows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
  });
  console.log(`Jumlah baris rombel di halaman 1: ${rombelRows.length}`);
  rombelRows.forEach((r, i) => console.log(`  [${i+1}] ${r}`));

  // Cek apakah ada pagination di rombel
  const paginationInfo = await page.evaluate(() => {
    const pag = document.querySelector('div.pagination, nav[aria-label="pagination"], div:has(> button)');
    return document.body.innerText.match(/Halaman \d+ dari \d+|\d+-\d+ dari \d+|Page \d+ of \d+/i)?.[0] || 'No pagination text';
  });
  console.log('Info pagination rombel:', paginationInfo);

  // Cek dropdown tahun ajaran di halaman rombel
  const tahunAjaranSelect = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('select, button[role="combobox"]')).map(el => el.innerText.trim());
  });
  console.log('Select/Combobox di halaman rombel:', tahunAjaranSelect);

  // 2. Periksa PTK / Guru (cari Anisca)
  console.log('\n--- Membuka /master-data/ptk ---');
  await page.goto('https://belajarplus.com/master-data/ptk', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Cari Anisca di input search PTK
  const ptkSearch = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await ptkSearch.isVisible()) {
    await ptkSearch.fill('Anisca');
    await page.waitForTimeout(2000);
    const ptkFound = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log('Hasil pencarian PTK "Anisca":', ptkFound);
  }

  // 3. Periksa Siswa (cari XI FA 2 atau filter rombel di /admin/students)
  console.log('\n--- Membuka /admin/students ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Ambil opsi filter rombel jika ada
  const rombelFilterOptions = await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select option')).map(o => o.innerText.trim());
    return selects;
  });
  console.log('Options di /admin/students:', rombelFilterOptions.slice(0, 30));

  // Ambil daftar siswa baris pertama
  const sampleStudents = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).slice(0, 10).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
  });
  console.log('Sample siswa:', sampleStudents);

  await browser.close();
})();

