const { chromium } = require('playwright');

function parseTanStack(jsonStr) {
  try {
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
  } catch (e) {}
  return [];
}

(async () => {
  console.log('=== INVESTIGASI ROMBEL & SISWA KELAS XI / XI FA 2 SMAN 1 GEMOLONG ===');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  // Login Henri
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

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
        try { token = JSON.parse(localStorage.getItem(k)).access_token; } catch (e) {}
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

  // 1. Ambil seluruh Tahun Ajaran
  const taRes = await page.evaluate(async ({ headers, schoolId }) => {
    const res = await fetch('/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, schoolId: authData.schoolId });

  const taList = parseTanStack(taRes);
  console.log('Daftar Tahun Ajaran:', taList.map(t => ({ id: t.id, name: t.name, active: t.active, rombelCount: t.rombelCount })));

  // 2. Untuk setiap tahun ajaran, ambil rombelnya
  for (const ta of taList) {
    const rombelRes = await page.evaluate(async ({ headers, yearId }) => {
      const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, yearId: ta.id });

    const rombels = parseTanStack(rombelRes);
    console.log(`\nRombel di TA ${ta.name} (Total: ${rombels.length}):`);
    rombels.forEach(r => {
      console.log(`   - [ID: ${r.id}] ${r.displayName} (${r.gradeLabel}) | Suffix: ${r.suffix} | Wali: ${r.homeroomName} | Siswa: ${r.studentCount}`);
    });
  }

  // 3. Cek di /admin/students apakah ada pencarian "FA" atau "XI"
  console.log('\nMembuka /admin/students untuk filter rombel...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Cek apakah ada siswa dengan keyword "FA" atau rombel "FA 2"
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('FA');
    await page.waitForTimeout(2000);
    const searchResult = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\n+/g, ' ').trim());
    });
    console.log('Pencarian siswa "FA":', searchResult.slice(0, 5));
  }

  // 4. Buka /admin/classes (E-Learning / Kelas KBM)
  // Guru biasanya membuat "Kelas E-learning" yang diberi nama "XI FA 2"!
  console.log('\nMembuka E-Learning / Kelas KBM (/admin/classes atau /classes)...');
  await page.goto('https://belajarplus.com/admin/classes', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  console.log('URL Kelas KBM:', page.url());

  const kbmClasses = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div.border, tr, li, div.card'))
      .map(el => el.innerText.replace(/\n+/g, ' ').trim())
      .filter(t => t.includes('XI') || t.includes('FA') || t.includes('Kelas') || t.includes('Siswa'));
  });
  console.log('Kelas E-Learning / KBM terdeteksi:', kbmClasses.slice(0, 10));

  await browser.close();
})();

