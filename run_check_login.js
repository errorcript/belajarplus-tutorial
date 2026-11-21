const { chromium } = require('playwright');
const fs = require('fs');

const students = [
  { no: 1, name: 'ZAHIRA NUR SALSABILA', email: 'zahira.nur.salsabila@belajarplus.com', pass: 'sman1rawalo', rombel: 'Kelas 10-2' },
  { no: 2, name: 'UZLIFATUL AZIFAH', email: 'uzlifatul.azifah@belajarplus.com', pass: 'sman1rawalo', rombel: 'Kelas 11-7' },
  { no: 3, name: 'LIVIA NUR AZIZAH', email: 'livia.nur.azizah@belajarplus.com', pass: 'sman1rawalo', rombel: 'Kelas 11-8' },
  { no: 4, name: 'EMYL AGUSTIAN FIFANANDA', email: 'emyl.agustian.fifananda@belajarplus.com', pass: 'sman1rawalo', rombel: 'Kelas 12-7' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });

  const results = [];

  for (const s of students) {
    console.log(`Checking login for [${s.no}/4]: ${s.name} (${s.email})...`);
    const context = await browser.newContext();
    const page = await context.newPage();

    let status = 'GAGAL';
    let currentUrl = '';
    let greeting = '';

    try {
      await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1500);

      await page.locator('input[type="email"]').first().fill(s.email);
      await page.locator('input[type="password"]').first().fill(s.pass);
      await page.locator('button[type="submit"]').first().click();

      // Wait for redirect to dashboard
      await page.waitForTimeout(5000);
      currentUrl = page.url();

      const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1000));

      if (!currentUrl.includes('/auth') || bodyText.includes('Beranda') || bodyText.includes('Perpustakaan') || bodyText.includes('Buku Saya')) {
        status = 'BERHASIL (100%)';
        const shotPath = `login_success_${s.no}_${s.name.split(' ')[0]}.png`;
        await page.screenshot({ path: shotPath });
        console.log(`  ✓ SUCCESS: Logged in! URL: ${currentUrl}. Screenshot: ${shotPath}`);

        // Extract student name or banner from page
        greeting = await page.evaluate(() => {
          const h1 = document.querySelector('h1, h2, [class*="greeting"], [class*="header"]');
          return h1 ? h1.innerText.trim() : '';
        });
      } else {
        const errText = await page.evaluate(() => {
          const el = document.querySelector('[role="alert"], .text-destructive, .text-red-500, p[class*="error"]');
          return el ? el.innerText : 'Unknown login failure';
        });
        status = 'GAGAL: ' + errText;
        console.log(`  ✗ FAILED: ${errText}`);
      }
    } catch (e) {
      status = 'ERROR: ' + e.message;
      console.log(`  ✗ ERROR: ${e.message}`);
    } finally {
      await context.close();
    }

    results.push({
      ...s,
      loginResult: status,
      redirectUrl: currentUrl,
      greeting: greeting
    });
  }

  await browser.close();

  fs.writeFileSync('cek_login_rawalo_results.json', JSON.stringify(results, null, 2));
  console.log('All 4 accounts tested.');
})();

