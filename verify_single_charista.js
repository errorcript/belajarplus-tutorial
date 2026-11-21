const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('Testing CHARISTA DESTYA PRAFAMA...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  await page.locator('input[type="email"]').first().fill('sman1gon_siswa118@belajarplus.com');
  await page.locator('input[type="password"]').first().fill('sman1gon');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  const url = page.url();
  const body = await page.evaluate(() => document.body.innerText);

  console.log('URL:', url);
  if (!url.includes('/auth') || body.includes('Beranda') || body.includes('Perpustakaan') || body.includes('Buku')) {
    console.log('✓ SUCCESS: CHARISTA DESTYA PRAFAMA logged in 100%!');
    
    // Update final_verified_students.json
    const file = JSON.parse(fs.readFileSync('final_verified_students.json', 'utf8'));
    const target = file.find(x => x.email === 'sman1gon_siswa118@belajarplus.com');
    if (target) {
      target.loginStatus = 'BERHASIL';
      target.detail = 'Login Berhasil 100%';
    }
    fs.writeFileSync('final_verified_students.json', JSON.stringify(file, null, 2));
  } else {
    console.log('Failed:', body.slice(0, 300));
  }

  await browser.close();
})();

