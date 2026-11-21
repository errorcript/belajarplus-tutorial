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

  fs.writeFileSync('henri_token.txt', authData.token);
  console.log('Saved fresh token, schoolId:', authData.schoolId);

  // Now let's query the TA and Rombels using page.evaluate so it executes with live session
  const result = await page.evaluate(async ({ schoolId }) => {
    // 1. Get TA
    const taRes = await fetch('/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tsr-serverfn': 'true' },
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    }).then(r => r.text());

    // 2. Search for anisca or fa in all PTK / teachers
    // Let's fetch all PTK
    const ptkRes = await fetch('/_serverFn/e7456d9a101a1d1fa5c2763116fc53e6ce6fe774b7c688d579efef4081c784e0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tsr-serverfn': 'true' },
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    }).then(r => r.text()).catch(e => e.message);

    return { taRes, ptkRes };
  }, { schoolId: authData.schoolId });

  fs.writeFileSync('gemolong_ta.txt', result.taRes);
  fs.writeFileSync('gemolong_ptk.txt', result.ptkRes);

  console.log('taRes mentions anisca:', result.taRes.toLowerCase().includes('anisca'));
  console.log('ptkRes mentions anisca:', result.ptkRes.toLowerCase().includes('anisca'));
  console.log('ptkRes mentions anis:', result.ptkRes.toLowerCase().includes('anis'));

  // Also let's check all rombels for the active year
  // In check_xi_fa2.js we saw the active year is 96813253-9475-4fc0-a697-888c09313ae1
  const rombelRaw = await page.evaluate(async () => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tsr-serverfn': 'true' },
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: '96813253-9475-4fc0-a697-888c09313ae1' }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    }).then(r => r.text());
    return res;
  });

  fs.writeFileSync('gemolong_rombel_raw.txt', rombelRaw);
  console.log('rombelRaw length:', rombelRaw.length);
  console.log('rombelRaw mentions anisca:', rombelRaw.toLowerCase().includes('anisca'));
  console.log('rombelRaw mentions anis:', rombelRaw.toLowerCase().includes('anis'));
  console.log('rombelRaw mentions fa:', rombelRaw.toLowerCase().includes('fa'));
  console.log('rombelRaw mentions 11:', rombelRaw.toLowerCase().includes('11'));

  await browser.close();
})();

