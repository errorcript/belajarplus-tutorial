const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');

function parseTanStack(jsonStr) {
  const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
  const v0 = data.p?.v?.[0];
  if (v0 && Array.isArray(v0.a)) {
    return v0.a.map(item => {
      if (!item.p?.k || !item.p?.v) return null;
      const obj = {};
      item.p.k.forEach((key, idx) => {
        const valObj = item.p.v[idx];
        if (!valObj) return;
        obj[key] = valObj.s !== undefined ? valObj.s : (valObj.v !== undefined ? valObj.v : valObj);
      });
      return obj;
    }).filter(Boolean);
  }
  return [];
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Login Alif...');
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('And.aliffiansyah@gmail.com');
  await page.locator('input[type="password"]').first().fill('kerja98');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Masuk Purwokerto
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const card = page.locator('li, div.border.rounded-xl, div.border.rounded-lg, div.p-4').filter({ hasText: 'SMA NEGERI 1 PURWOKERTO' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3000);

  const authData = await page.evaluate(() => {
    const tokenObj = JSON.parse(localStorage.getItem('sb-jpmfsldnzptdgfhvdqpb-auth-token') || '{}');
    const schoolIdKey = Object.keys(localStorage).find(k => k.startsWith('bp:institution:'));
    const schoolId = schoolIdKey ? localStorage.getItem(schoolIdKey) : null;
    return { token: tokenObj.access_token, schoolId };
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData.token}`,
    'x-school-override': authData.schoolId,
    'x-tsr-serverfn': 'true',
    'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
  };

  // Ambil Tahun Ajaran Aktif
  const taText = await page.evaluate(async ({ headers, schoolId }) => {
    const res = await fetch('/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, schoolId: authData.schoolId });

  const taList = parseTanStack(taText);
  const activeYear = taList.find(y => y.active === 2) || taList[0];
  console.log('TA Aktif:', activeYear.name, activeYear.id);

  // Ambil Rombel
  const rombelText = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId: activeYear.id });

  const rombels = parseTanStack(rombelText);
  console.log(`\nTotal Rombel di BelajarPlus Purwokerto: ${rombels.length}`);
  rombels.forEach(r => {
    console.log(`- ${r.displayName || r.name} (ID: ${r.id}, Count: ${r.studentCount || r.totalStudent || r.count || '?'})`);
  });

  // Ambil kandidat unassigned
  const candText = await page.evaluate(async ({ headers, rombelId }) => {
    const res = await fetch('/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId', 'q'], v: [{ t: 1, s: rombelId }, { t: 1, s: '' }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, rombelId: rombels[0].id });

  const candidates = parseTanStack(candText);
  console.log(`\nSiswa yang BELUM masuk rombel (Unassigned): ${candidates.length}`);
  if (candidates.length > 0) {
    console.log('Sample Unassigned:');
    candidates.slice(0, 20).forEach((c, i) => console.log(`${i+1}. ${c.name} | ${c.email}`));
  }

  await browser.close();
})();
