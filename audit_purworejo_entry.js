const { chromium } = require('playwright');
const fs = require('fs');

async function auditPurworejo() {
  console.log('=== MEMULAI AUDIT SMAN 11 PURWOREJO (READ-ONLY) ===');
  
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);

  // 1. Login menggunakan akun Khansania atau Henri
  // Mari coba login Henri dulu karena kredensialnya sudah terbukti aktif di session sebelumnya
  console.log('Login Henri Susilo...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(4000);

  console.log('Current URL after login:', page.url());

  // Pastikan masuk ke dashboard
  await page.goto('https://belajarplus.com/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Cari kartu SMA NEGERI 11 PURWOREJO
  const schoolCard = page.locator('li, div.border').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
  const count = await schoolCard.count();
  console.log('Kartu SMA NEGERI 11 PURWOREJO ditemukan?', count > 0);

  if (count === 0) {
    console.log('Sekolah tidak ditemukan di akun Henri, mari cek teks dashboard atau coba Khansania...');
    const allText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('dashboard_schools_text.txt', allText);
    await browser.close();
    return;
  }

  // Masuk ke institusi SMAN 11 Purworejo
  await schoolCard.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(4000);

  const schoolUrl = page.url();
  console.log('School URL setelah klik Masuk:', schoolUrl);

  // Ambil schoolId dari localStorage
  const storageData = await page.evaluate(() => {
    const res = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('bp:institution:') || k.includes('school') || k.includes('auth')) {
        res[k] = localStorage.getItem(k);
      }
    }
    return res;
  });
  console.log('Storage data (school id):', storageData);

  // Periksa menu navigasi di sidebar
  const navItems = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('nav a, aside a, [role="navigation"] a').forEach(a => {
      items.push({ text: a.innerText.trim(), href: a.getAttribute('href') });
    });
    return items;
  });
  console.log('Nav items:', navItems);

  // Simpan data temuan awal
  fs.writeFileSync('purworejo_nav_and_storage.json', JSON.stringify({ schoolUrl, storageData, navItems }, null, 2));

  await browser.close();
}

auditPurworejo().catch(console.error);

