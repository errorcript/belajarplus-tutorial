const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
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

  const authData = await page.evaluate(() => {
    let token = null;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.includes('auth-token')) {
        try { token = JSON.parse(localStorage.getItem(k)).access_token; } catch (e) { }
      }
    }
    const schoolKey = Object.keys(localStorage).find(k => k.startsWith('bp:institution:'));
    return { token, schoolId: schoolKey ? localStorage.getItem(schoolKey) : null };
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData.token}`,
    'x-school-override': authData.schoolId,
    'x-tsr-serverfn': 'true',
    'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
  };

  // Fetch full rombel with headers!
  const fullRombelRes = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId: '96813253-9475-4fc0-a697-888c09313ae1' });

  fs.writeFileSync('full_rombel_gemolong.txt', fullRombelRes);
  console.log('Saved full_rombel_gemolong.txt, size:', fullRombelRes.length);

  // Also let's check ALL academic years
  const fullTaRes = await page.evaluate(async ({ headers, schoolId }) => {
    const res = await fetch('/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, schoolId: authData.schoolId });
  fs.writeFileSync('full_ta_gemolong.txt', fullTaRes);

  // Search directly inside fullRombelRes and fullTaRes:
  console.log('fullRombelRes includes anisca:', fullRombelRes.toLowerCase().includes('anisca'));
  console.log('fullRombelRes includes fa:', fullRombelRes.toLowerCase().includes('fa'));
  console.log('fullRombelRes includes xi:', fullRombelRes.toLowerCase().includes('xi'));
  console.log('fullRombelRes includes 11:', fullRombelRes.toLowerCase().includes('11'));

  // Also let's fetch PTK!
  const ptkRes = await page.evaluate(async ({ headers, schoolId }) => {
    // try to query PTK
    const res = await fetch('/_serverFn/e7456d9a101a1d1fa5c2763116fc53e6ce6fe774b7c688d579efef4081c784e0', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, schoolId: authData.schoolId });
  fs.writeFileSync('full_ptk_gemolong.txt', ptkRes);
  console.log('ptkRes includes anisca:', ptkRes.toLowerCase().includes('anisca'));

  // Now, what if the user is looking at another institution?
  // Let's check which institution in Henri's account has "Gemolong" or "Sragen" or "XI FA 2"?
  await browser.close();
})();

