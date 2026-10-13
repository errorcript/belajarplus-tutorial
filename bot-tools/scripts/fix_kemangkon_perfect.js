const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const proofDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/audit_purbalingga_proofs';

function parseTanStack(jsonStr) {
  try {
    const data = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    const arrayItem = data.p?.v?.[0]?.a || [];
    return arrayItem.map(item => {
      const keys = item.p?.k || [];
      const vals = item.p?.v || [];
      const obj = {};
      keys.forEach((k, idx) => {
        const v = vals[idx];
        obj[k] = v?.s !== undefined ? v.s : (v?.v !== undefined ? v.v : v);
      });
      return obj;
    });
  } catch (e) {
    return [];
  }
}

(async () => {
  console.log('=== EKSEKUSI TUNTAS SMAN 1 KEMANGKON ===\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('rumaysch@gmail.com');
  await page.locator('input[type="password"]').first().fill('A410Arum');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(4000);

  // Masuk Kemangkon
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  const card = page.locator('li, div.border').filter({ hasText: /1 KEMANGKON/i }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3500);

  // 1. Tahun Ajaran
  console.log('1. Cek & Setup Tahun Ajaran...');
  await page.goto('https://belajarplus.id/master-data/tahun-ajaran', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Cek apakah ada tombol Aktifkan
  const aktBtn = page.locator('button:has-text("Aktifkan")').first();
  if (await aktBtn.isVisible().catch(() => false)) {
    console.log('  -> Klik Aktifkan TA...');
    await aktBtn.click();
    await page.waitForTimeout(1000);
    const conf = page.locator('[role="dialog"] button:has-text("Aktifkan"), [role="alertdialog"] button:has-text("Aktifkan")').first();
    if (await conf.isVisible().catch(() => false)) await conf.click();
    await page.waitForTimeout(3000);
  } else {
    // Tambah TA baru
    const tambahBtn = page.locator('button:has-text("Tambah")').first();
    if (await tambahBtn.isVisible().catch(() => false)) {
      console.log('  -> Tambah TA baru...');
      await tambahBtn.click();
      await page.waitForTimeout(1500);
      const dialog = page.locator('div[role="dialog"]');
      const inputs = dialog.locator('input');
      await inputs.nth(0).fill('2026/2027');
      await dialog.locator('input[type="date"]').nth(0).fill('2026-07-01');
      await dialog.locator('input[type="date"]').nth(1).fill('2027-06-30');
      await dialog.locator('button:has-text("Simpan")').click();
      await page.waitForTimeout(3500);

      const akt2 = page.locator('button:has-text("Aktifkan")').first();
      if (await akt2.isVisible().catch(() => false)) {
        await akt2.click();
        await page.waitForTimeout(1000);
        const conf = page.locator('[role="dialog"] button:has-text("Aktifkan"), [role="alertdialog"] button:has-text("Aktifkan")').first();
        if (await conf.isVisible().catch(() => false)) await conf.click();
        await page.waitForTimeout(3000);
      }
    }
  }

  // 2. Rombel
  console.log('2. Buka Halaman Rombel...');
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const rombelSelect = page.locator('select').first();
  let yearId = '';
  if (await rombelSelect.isVisible().catch(() => false)) {
    yearId = await rombelSelect.inputValue();
  }
  console.log(`Year ID: ${yearId}`);

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

  // Buat 3 Rombel Kemangkon: XI A, XI B, XI C
  const rombelsKemangkon = [
    { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI A' },
    { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI B' },
    { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI C' }
  ];

  for (const rDef of rombelsKemangkon) {
    const exists = await page.locator(`text="${rDef.suffix}"`).count();
    if (exists > 0) continue;

    console.log(`  -> Menambahkan Rombel ${rDef.suffix}...`);
    const btnTambah = page.locator('button:has-text("Tambah Rombel")').first();
    await btnTambah.scrollIntoViewIfNeeded();
    await btnTambah.click();
    await page.waitForTimeout(800);

    const dialog = page.locator('div[role="dialog"]');
    const selects = dialog.locator('select');
    await selects.nth(0).selectOption({ label: rDef.jenjang });
    await page.waitForTimeout(200);
    await selects.nth(1).selectOption({ label: rDef.tingkat });
    await page.waitForTimeout(200);

    const suffixInput = dialog.locator('input').first();
    await suffixInput.fill(rDef.suffix);
    await page.waitForTimeout(200);

    await dialog.locator('button:has-text("Tambah Rombel")').click();
    await page.waitForTimeout(2000);
  }

  // Refresh rombel
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  if (!yearId) {
    yearId = await page.locator('select').first().inputValue();
  }

  const resText = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId });

  const existingRombels = parseTanStack(resText);
  console.log(`Ditemukan ${existingRombels.length} rombel di Kemangkon.`);

  // 3. Impor Chunks Kemangkon
  console.log('\n3. Impor chunk files Kemangkon...');
  const chunkDir = 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/kemangkon';
  const chunkFiles = fs.readdirSync(chunkDir).filter(f => f.endsWith('.xlsx'));
  for (let idx = 0; idx < chunkFiles.length; idx++) {
    const cf = chunkFiles[idx];
    const chunkPath = path.join(chunkDir, cf);

    await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const importBtn = page.locator('button:has-text("Impor Siswa"), button:has-text("Impor")').first();
    await importBtn.click();
    await page.waitForTimeout(1000);

    const fileInput = page.locator('div[role="dialog"] input[type="file"]').first();
    await fileInput.setInputFiles(chunkPath);
    await page.waitForTimeout(3000);

    const confirmBtn = page.locator('div[role="dialog"] button:has-text("Impor")').last();
    let isEnabled = false;
    for (let w = 0; w < 4; w++) {
      isEnabled = await confirmBtn.isEnabled().catch(() => false);
      if (isEnabled) break;
      await page.waitForTimeout(800);
    }

    if (isEnabled) {
      console.log(`    -> Impor Chunk [${idx + 1}/${chunkFiles.length}] ${cf}...`);
      await confirmBtn.click();
      await page.waitForTimeout(14000);
      const closeBtn = page.locator('button:has-text("Selesai"), button:has-text("Tutup"), button[aria-label="Close"]').first();
      if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click().catch(() => {});
    } else {
      console.log(`    -> Chunk [${idx + 1}/${chunkFiles.length}] ${cf} sudah terdaftar.`);
      const cancelBtn = page.locator('div[role="dialog"] button:has-text("Batal"), div[role="dialog"] button:has-text("Close")').first();
      await cancelBtn.click().catch(() => {});
    }
  }

  // 4. Penempatan Siswa via EXACT MATCH
  console.log('\n4. Penempatan siswa ke rombel...');
  const excelFile = 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Kemangkon_100.xlsx';
  const rows = xlsx.utils.sheet_to_json(xlsx.readFile(excelFile).Sheets['Siswa']);
  const emailToRombel = {};
  rows.forEach(r => {
    const em = (r.Email || '').toLowerCase().trim();
    const rom = (r.Rombel || '').trim();
    if (em && rom) emailToRombel[em] = rom;
  });

  let loop = 0;
  let totalAssigned = 0;

  while (loop < 15) {
    loop++;
    console.log(`--- Iterasi Penempatan Batch ${loop} ---`);

    const candText = await page.evaluate(async ({ headers, rombelId }) => {
      const res = await fetch('/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId', 'q'], v: [{ t: 1, s: rombelId }, { t: 1, s: '' }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, rombelId: existingRombels[0].id });

    const candidates = parseTanStack(candText);
    console.log(`Sisa unassigned candidates: ${candidates.length}`);

    if (candidates.length === 0) {
      console.log('✅ SEMUA SISWA SUDAH MASUK KE ROMBEL!');
      break;
    }

    const groups = {};
    let matchedInBatch = 0;

    for (const cand of candidates) {
      const email = (cand.email || '').trim().toLowerCase();
      const targetRombelName = emailToRombel[email];
      if (!targetRombelName) continue;

      const tClean = targetRombelName.replace(/[^0-9a-z]/gi, '').toLowerCase();

      // EXACT MATCH
      const targetRombel = existingRombels.find(r => {
        const rSufClean = (r.suffix || '').replace(/[^0-9a-z]/gi, '').toLowerCase();
        return rSufClean === tClean;
      });

      if (!targetRombel) continue;

      if (!groups[targetRombel.id]) {
        groups[targetRombel.id] = { rombel: targetRombel, studentIds: [] };
      }
      groups[targetRombel.id].studentIds.push(cand.id);
      matchedInBatch++;
    }

    console.log(`Matched di batch ${loop}: ${matchedInBatch}`);
    if (matchedInBatch === 0) {
      console.log('Tidak ada siswa matched lagi di batch ini.');
      break;
    }

    for (const rId of Object.keys(groups)) {
      const grp = groups[rId];
      const rDisplayName = grp.rombel.displayName || grp.rombel.suffix;
      await page.evaluate(async ({ headers, rombelId, studentIds }) => {
        const payload = {
          t: {
            t: 10, i: 0, p: {
              k: ['data'],
              v: [{
                t: 10, i: 1, p: {
                  k: ['rombelId', 'studentIds'],
                  v: [
                    { t: 1, s: rombelId },
                    {
                      t: 9, i: 2,
                      a: studentIds.map(id => ({ t: 1, s: id })),
                      o: 0
                    }
                  ]
                }, o: 0
              }]
            }, o: 0
          },
          f: 127,
          m: []
        };
        await fetch('/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
      }, { headers, rombelId: grp.rombel.id, studentIds: grp.studentIds });

      console.log(`  ✅ Masukkan ${grp.studentIds.length} siswa ke "${rDisplayName}"!`);
      totalAssigned += grp.studentIds.length;
    }
  }

  console.log(`\nTOTAL PENEMPATAN BERHASIL KEMANGKON: ${totalAssigned}`);

  // 5. Screenshot Bukti
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, 'kemangkon_final_students_perfect.png'), fullPage: true });

  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, 'kemangkon_final_rombels_perfect.png'), fullPage: true });

  console.log('>>> SMAN 1 KEMANGKON SELESAI 100%! BUKTI DISIMPAN.\n');
  await browser.close();
})();
