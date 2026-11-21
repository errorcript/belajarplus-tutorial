const { chromium } = require('playwright');
const fs = require('fs');

const students = [
  { no: 1, name: 'AISYAH TASLIMAH NUR SAFARA', email: 'sman1gon_siswa108@belajarplus.com' },
  { no: 2, name: 'ALFIRA RENATA JULIYANI', email: 'sman1gon_siswa109@belajarplus.com' },
  { no: 3, name: 'ALISA ROHMA PAMILIH', email: 'sman1gon_siswa110@belajarplus.com' },
  { no: 4, name: 'ANGGA PRASETYO', email: 'sman1gon_siswa111@belajarplus.com' },
  { no: 5, name: 'ANNISA NUR HIDAYAH', email: 'sman1gon_siswa112@belajarplus.com' },
  { no: 6, name: 'ANNISA SEKAR INDAH FEBYANA', email: 'sman1gon_siswa113@belajarplus.com' },
  { no: 7, name: 'ARIESKA NAVA SAPOETRY', email: 'sman1gon_siswa114@belajarplus.com' },
  { no: 8, name: 'BAGAS DWI PRASETYO', email: 'sman1gon_siswa115@belajarplus.com' },
  { no: 9, name: 'CESIKA ANATASYA NATALIA', email: 'sman1gon_siswa117@belajarplus.com' },
  { no: 10, name: 'CHARISTA DESTYA PRAFAMA', email: 'sman1gon_siswa118@belajarplus.com' },
  { no: 11, name: 'CHIKA ADIANA AGUSTIN', email: 'sman1gon_siswa119@belajarplus.com' },
  { no: 12, name: 'DIVAY SOFIA AGUSTIN', email: 'sman1gon_siswa120@belajarplus.com' }
];

async function tryLogin(email, password) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  let success = false;
  let reason = '';

  try {
    await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(1500);

    // If redirected or already logged in, logout or clear
    if (!page.url().includes('/auth')) {
      await page.goto('https://belajarplus.com/auth');
    }

    await page.locator('input[type="email"]').first().fill(email);
    await page.locator('input[type="password"]').first().fill(password);
    await page.locator('button[type="submit"]').first().click();

    // Wait for response
    await page.waitForTimeout(4000);

    const url = page.url();
    const body = await page.evaluate(() => document.body.innerText);

    if (!url.includes('/auth') || body.includes('Beranda') || body.includes('Perpustakaan') || body.includes('Buku')) {
      success = true;
      reason = 'Login Berhasil (Redirect to ' + url + ')';
    } else {
      const errorMsg = await page.evaluate(() => {
        const err = document.querySelector('[role="alert"], .text-destructive, .text-red-500, p[class*="error"]');
        return err ? err.innerText : 'Unknown auth failure';
      });
      reason = 'Gagal: ' + errorMsg;
    }
  } catch (e) {
    reason = 'Exception: ' + e.message;
  } finally {
    await browser.close();
  }

  return { success, reason };
}

(async () => {
  const results = [];

  for (const s of students) {
    console.log(`Checking [${s.no}/12] ${s.name} (${s.email})...`);

    // First try "sman1gon"
    let test = await tryLogin(s.email, 'sman1gon');
    let workingPassword = 'sman1gon';

    if (!test.success) {
      console.log(`  Failed with sman1gon (${test.reason}), trying sman11gon...`);
      const test2 = await tryLogin(s.email, 'sman11gon');
      if (test2.success) {
        test = test2;
        workingPassword = 'sman11gon';
      } else {
        console.log(`  Also failed with sman11gon (${test2.reason})`);
      }
    }

    console.log(`  Result for ${s.name}: ${test.success ? 'SUCCESS with ' + workingPassword : 'FAILED (' + test.reason + ')'}`);

    results.push({
      ...s,
      workingPassword: test.success ? workingPassword : 'Gagal Login',
      status: test.success ? 'Aktif & Terverifikasi (Bisa Login)' : test.reason
    });
  }

  fs.writeFileSync('login_verification_results.json', JSON.stringify(results, null, 2));
  console.log('All 12 students checked.');
})();

