const { chromium } = require('playwright');
const fs = require('fs');

async function checkKhansania() {
  console.log('=== MEMERIKSA AKUN KHANSANIA MEDTRA ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  console.log('Login Khansania...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  await page.locator('input[type="email"]').first().fill('khansania.medtra@gmail.com');
  await page.locator('input[type="password"]').first().fill('Khansa04');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();

  // Tunggu URL berubah atau navigasi ke dashboard
  console.log('Menunggu navigasi ke dashboard...');
  await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(async () => {
    console.log('Fallback goto /dashboard...');
    await page.goto('https://belajarplus.com/dashboard', { waitUntil: 'domcontentloaded' });
  });

  // Tunggu sampai teks 'Memuat institusi' hilang dan list sekolah muncul
  console.log('Menunggu institusi selesai loading...');
  await page.waitForFunction(() => !document.body.innerText.includes('Memuat institusi'), { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // Ambil semua nama sekolah di dashboard
  const schools = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('h3, h4, div.font-semibold, div.font-medium, [role="listitem"]').forEach(el => {
      const text = el.innerText ? el.innerText.trim() : '';
      if (text.toUpperCase().includes('SMA') || text.toUpperCase().includes('PURWOREJO')) {
        list.push(text);
      }
    });
    return [...new Set(list)];
  });

  console.log('Sekolah yang ditemukan di akun Khansania:', schools);

  // Cari elemen SMA NEGERI 11 PURWOREJO
  const card = page.locator('li, div.border').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
  if (await card.count() > 0) {
    console.log('✅ KARTU SMA NEGERI 11 PURWOREJO DITEMUKAN!');
    await card.locator('button:has-text("Masuk")').first().click();
    await page.waitForTimeout(4000);

    console.log('Current URL setelah masuk:', page.url());

    // Tangkap localStorage untuk dapat schoolId
    const schoolIdEntry = await page.evaluate(() => {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('bp:institution:')) {
          return { key: k, schoolId: localStorage.getItem(k) };
        }
      }
      return null;
    });

    console.log('School ID info:', schoolIdEntry);

    // Ambil menu sidebar
    const navs = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('nav a, aside a, [role="navigation"] a').forEach(a => {
        links.push({ text: a.innerText.trim().replace(/\n/g, ' '), href: a.getAttribute('href') });
      });
      return links;
    });
    console.log('Sidebar Navigation Menus:\n', JSON.stringify(navs, null, 2));

    fs.writeFileSync('purworejo_school_info.json', JSON.stringify({
      schoolIdEntry,
      navs,
      url: page.url()
    }, null, 2));
  } else {
    console.log('❌ SMA NEGERI 11 PURWOREJO tidak ditemukan di kartu dashboard.');
    fs.writeFileSync('khansania_dashboard.txt', await page.evaluate(() => document.body.innerText));
  }

  await browser.close();
}

checkKhansania().catch(console.error);

