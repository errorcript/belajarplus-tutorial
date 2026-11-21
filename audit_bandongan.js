const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('=== AUDIT READ-ONLY SMAN 1 BANDONGAN ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Henri
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to SMAN 1 BANDONGAN
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);

  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  const authData = await page.evaluate(() => {
    let token = null;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.includes('auth-token')) {
        try { token = JSON.parse(localStorage.getItem(k)).access_token; } catch (e) {}
      }
    }
    const schoolKey = Object.keys(localStorage).find(k => k.startsWith('bp:institution:'));
    return { token, schoolId: schoolKey ? localStorage.getItem(schoolKey) : null };
  });

  console.log(`Switched to Bandongan, schoolId: ${authData.schoolId}`);

  // 1. Audit Rombel di /master-data/rombel
  console.log('\n--- Membuka /master-data/rombel ---');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const rombelItems = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr, div[class*="border"], div[class*="card"]'))
      .map(el => el.innerText.replace(/\s+/g, ' ').trim())
      .filter(t => t.includes('Kelas') || t.includes('siswa') || t.includes('Wali'));
  });
  console.log('Rombel terdeteksi di Bandongan:');
  rombelItems.forEach((r, idx) => console.log(`  [${idx+1}] ${r}`));

  // 2. Audit Siswa di /admin/students
  console.log('\n--- Membuka /admin/students ---');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Stats header
  const studentStats = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[class*="card"], div.border'))
      .map(el => el.innerText.replace(/\s+/g, ' ').trim())
      .filter(t => t.includes('Total') || t.includes('Siswa'));
  });
  console.log('Student Stats:', studentStats.slice(0, 5));

  // Filter or search for FA 2 / XI FA 2
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('FA 2');
    await page.waitForTimeout(2000);
    const searchFa2 = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log(`Hasil search 'FA 2' di /admin/students (${searchFa2.length} hasil):`);
    searchFa2.slice(0, 10).forEach(r => console.log('  ', r));
  }

  // 3. Audit PTK untuk mencari Anisca
  console.log('\n--- Membuka /admin/teachers ---');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  const teacherSearch = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await teacherSearch.isVisible()) {
    await teacherSearch.fill('Anisca');
    await page.waitForTimeout(2000);
    const foundAnisca = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log('Hasil pencarian guru "Anisca":', foundAnisca);
  }

  await browser.close();
})();

