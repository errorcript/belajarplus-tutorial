const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');

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

function rombelToCohort(name) {
  const m10 = name.match(/Kelas\s*10-(\d+)/i);
  if (m10) return `sman1pwk_X-${m10[1].padStart(2, '0')}`;
  const m11 = name.match(/Kelas\s*11-(\d+)/i);
  if (m11) return `sman1pwk_XI-${m11[1].padStart(2, '0')}`;
  return null;
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== ASSIGN SEMUA SISWA SMAN 1 PURWOKERTO ===');
  console.log('1. Login Alif...');
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('And.aliffiansyah@gmail.com');
  await page.locator('input[type="password"]').first().fill('kerja98');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  console.log('2. Dashboard & pilih SMAN 1 Purwokerto...');
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"], input[type="text"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('SMA NEGERI 1 PURWOKERTO');
    await page.waitForTimeout(1500);
  }

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

  // Baca Excel Master Purwokerto
  const wb = xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/SMA Negeri 1 Purwokerto.xlsx');
  const excelSiswa = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  const excelLookupByEmail = new Map();
  const excelLookupByName = new Map();

  excelSiswa.forEach(s => {
    const email = (s.email || '').trim().toLowerCase();
    const name = (s.firstname || '').trim().toLowerCase();
    const cohort = (s.cohort1 || s.lastname || '').trim();
    if (email) excelLookupByEmail.set(email, cohort);
    if (name) excelLookupByName.set(name, cohort);
  });

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
  console.log(`Ditemukan ${rombels.length} rombel.`);

  let loop = 0;
  let totalAssigned = 0;

  while (loop < 20) {
    loop++;
    console.log(`\n--- Iterasi Batch ${loop} ---`);

    // Ambil calon siswa unassigned
    const candText = await page.evaluate(async ({ headers, rombelId }) => {
      const res = await fetch('/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId', 'q'], v: [{ t: 1, s: rombelId }, { t: 1, s: '' }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, rombelId: rombels[0].id });

    const candidates = parseTanStack(candText);
    console.log(`Sisa kandidat unassigned di batch: ${candidates.length}`);

    if (candidates.length === 0) {
      console.log('Semua siswa sudah masuk ke rombel!');
      break;
    }

    // Kelompokkan siswa berdasarkan target rombel
    const groups = {};
    let matchedInBatch = 0;
    let unmatchedInBatch = 0;

    for (const cand of candidates) {
      const email = (cand.email || '').trim().toLowerCase();
      const name = (cand.name || '').trim().toLowerCase();
      let cohort = excelLookupByEmail.get(email) || excelLookupByName.get(name);

      if (!cohort) {
        unmatchedInBatch++;
        continue;
      }

      const targetRombel = rombels.find(r => rombelToCohort(r.displayName) === cohort);
      if (!targetRombel) {
        unmatchedInBatch++;
        continue;
      }

      if (!groups[targetRombel.id]) {
        groups[targetRombel.id] = { rombel: targetRombel, studentIds: [] };
      }
      groups[targetRombel.id].studentIds.push(cand.id);
      matchedInBatch++;
    }

    console.log(`Matched: ${matchedInBatch}, Unmatched: ${unmatchedInBatch}`);

    if (matchedInBatch === 0) {
      console.log('Tidak ada siswa matched lagi di batch ini. Stop loop.');
      break;
    }

    // Eksekusi assign per rombel
    for (const rId of Object.keys(groups)) {
      const grp = groups[rId];
      console.log(`Menempatkan ${grp.studentIds.length} siswa -> ${grp.rombel.displayName}...`);

      const res = await page.evaluate(async ({ headers, rombelId, studentIds }) => {
        const payload = {
          t: {
            t: 10, i: 0, p: {
              k: ['data'],
              v: [{
                t: 10, i: 1, p: {
                  k: ['rombelId', 'studentIds'],
                  v: [
                    { t: 1, s: rombelId },
                    { t: 9, i: 2, a: studentIds.map(id => ({ t: 1, s: id })), o: 0 }
                  ]
                }, o: 0
              }]
            }, o: 0
          },
          f: 127,
          m: []
        };
        const r = await fetch('/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        return { status: r.status, ok: r.ok };
      }, { headers, rombelId: grp.rombel.id, studentIds: grp.studentIds });

      if (res.ok) {
        totalAssigned += grp.studentIds.length;
      } else {
        console.log(`[GAGAL] Assign ${grp.rombel.displayName}: status ${res.status}`);
      }
      await page.waitForTimeout(300);
    }
  }

  console.log(`\n========================================`);
  console.log(`Total siswa Purwokerto berhasil di-assign: ${totalAssigned}`);

  // 5. Verifikasi Final & Ambil Screenshot
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/Bukti_Impor/4_siswa_setelah_assign_rombel.png' });

  const finalStats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.border.rounded-xl, div.border.rounded-lg, div.p-4'));
    return cards.map(c => c.innerText.trim()).filter(t => t.includes('Siswa') || t.includes('Rombel')).slice(0, 3);
  });
  console.log('Status Akhir Siswa Purwokerto:', finalStats);

  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/Bukti_Impor/5_rombel_setelah_assign.png' });

  await browser.close();
  console.log('SMAN 1 Purwokerto Rombel Placement SELESAI!');
})();
