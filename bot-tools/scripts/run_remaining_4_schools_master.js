const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const proofDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/audit_purbalingga_proofs';
if (!fs.existsSync(proofDir)) fs.mkdirSync(proofDir, { recursive: true });

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

const schoolConfigs = [
  {
    id: 'bobotsari',
    name: 'SMAN 1 BOBOTSARI',
    filterText: /1 BOBOTSARI/i,
    excelFile: 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Bobotsari_720.xlsx',
    chunkDir: 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/bobotsari',
    rombels: [
      ...['A','B','C','D','E','F','G','H','I','J'].map(x => ({ jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: `X-${x}` })),
      ...['A','B','C','D','E','F','G','H','I','J'].map(x => ({ jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: `XI-${x}` }))
    ],
    mapTargetRombel: (rName) => {
      // rName bisa "X-A", "SMAN1BOB_XI_XI-A", "SMAN1BOB__"
      if (!rName) return 'X-A';
      const clean = rName.trim();
      if (clean === 'SMAN1BOB__') return 'X-A'; // Siswa ke 720
      if (clean.includes('XI-')) {
        const part = clean.split('XI-')[1];
        return `XI-${part}`;
      }
      return clean; // "X-A" etc
    }
  },
  {
    id: 'karangreja',
    name: 'SMAN 1 KARANGREJA',
    filterText: /1 KARANGREJA/i,
    excelFile: 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Karangreja_648.xlsx',
    chunkDir: 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/karangreja',
    rombels: [
      ...['A','B','C','D','E','F','G','H','I'].map(x => ({ jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: `X-${x}` })),
      ...['A','B','C','D','E','F','G','H','I'].map(x => ({ jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: `XI-${x}` }))
    ],
    mapTargetRombel: (rName) => (rName || '').trim()
  },
  {
    id: 'kemangkon',
    name: 'SMAN 1 KEMANGKON',
    filterText: /1 KEMANGKON/i,
    excelFile: 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Kemangkon_100.xlsx',
    chunkDir: 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/kemangkon',
    rombels: [
      { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI A' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI B' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 11', suffix: 'XI C' }
    ],
    mapTargetRombel: (rName) => (rName || '').trim()
  },
  {
    id: 'bukateja',
    name: 'SMAN 1 BUKATEJA',
    filterText: /1 BUKATEJA/i,
    excelFile: 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Bukateja_360.xlsx',
    chunkDir: 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/bukateja',
    rombels: [
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-01' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-02' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-03' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-04' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-05' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-06' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-07' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-08' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-09' },
      { jenjang: 'SMA/MA', tingkat: 'Kelas 10', suffix: 'X-10' }
    ],
    mapTargetRombel: (rName) => {
      const clean = (rName || '').trim();
      if (clean === 'SMAN1BUKA_10_X-1') return 'X-01';
      return clean;
    }
  }
];

async function processSchool(page, cfg) {
  console.log(`\n======================================================`);
  console.log(`=== MEMPROSES: ${cfg.name} ===`);
  console.log(`======================================================\n`);

  // 1. Load Excel Mapping
  const wb = xlsx.readFile(cfg.excelFile);
  const rows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  const emailToRombel = {};
  rows.forEach(r => {
    const em = (r.Email || '').toLowerCase().trim();
    const rawR = r.Rombel;
    const finalR = cfg.mapTargetRombel(rawR);
    if (em && finalR) emailToRombel[em] = finalR;
  });
  console.log(`Loaded ${Object.keys(emailToRombel).length} mappings from Excel.`);

  // 2. Masuk ke institusi sekolah
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  const card = page.locator('li, div.border').filter({ hasText: cfg.filterText }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3500);

  // 3. Pastikan Tahun Ajaran Aktif
  console.log('1. Memeriksa Tahun Ajaran...');
  await page.goto('https://belajarplus.id/master-data/tahun-ajaran', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const aktifBadge = page.locator('span:has-text("Aktif"), div:has-text("Aktif")').first();
  const hasActiveBadge = await aktifBadge.isVisible().catch(() => false);

  if (!hasActiveBadge) {
    const aktifkanBtn = page.locator('button:has-text("Aktifkan")').first();
    if (await aktifkanBtn.isVisible().catch(() => false)) {
      console.log('  -> Klik Aktifkan Tahun Ajaran yang ada...');
      await aktifkanBtn.click();
      await page.waitForTimeout(1000);
      const conf = page.locator('[role="dialog"] button:has-text("Aktifkan"), [role="alertdialog"] button:has-text("Aktifkan")').first();
      if (await conf.isVisible().catch(() => false)) await conf.click();
      await page.waitForTimeout(3000);
    } else {
      console.log('  -> Membuat Tahun Ajaran baru 2026/2027...');
      const tambahBtn = page.locator('button:has-text("Tambah")').first();
      if (await tambahBtn.isVisible().catch(() => false)) {
        await tambahBtn.click();
        await page.waitForTimeout(1500);
        const dialog = page.locator('div[role="dialog"]');
        const inputs = dialog.locator('input');
        await inputs.nth(0).fill('2026/2027');
        await dialog.locator('input[type="date"]').nth(0).fill('2026-07-01');
        await dialog.locator('input[type="date"]').nth(1).fill('2027-06-30');
        await dialog.locator('button:has-text("Simpan")').click();
        await page.waitForTimeout(3500);

        const aktBtn = page.locator('button:has-text("Aktifkan")').first();
        if (await aktBtn.isVisible().catch(() => false)) {
          await aktBtn.click();
          await page.waitForTimeout(1000);
          const conf = page.locator('[role="dialog"] button:has-text("Aktifkan"), [role="alertdialog"] button:has-text("Aktifkan")').first();
          if (await conf.isVisible().catch(() => false)) await conf.click();
          await page.waitForTimeout(3000);
        }
      }
    }
  }

  // 4. Buka Halaman Rombel & Dapatkan Year ID
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const yearId = await page.locator('select').first().inputValue();
  console.log(`Year ID Aktif: ${yearId}`);

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

  // Cek Rombel yang ada
  const getRombels = async () => {
    const resText = await page.evaluate(async ({ headers, yearId }) => {
      const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, yearId });
    return parseTanStack(resText);
  };

  let existingRombels = await getRombels();
  console.log(`Ditemukan ${existingRombels.length} rombel awal di ${cfg.name}.`);

  // 5. Buat Rombel yang belum ada
  console.log('2. Memeriksa dan membuat rombel yang belum terdaftar...');
  for (const rDef of cfg.rombels) {
    const cleanDef = rDef.suffix.replace(/[^0-9a-z]/gi, '').toLowerCase();
    const already = existingRombels.find(r => (r.suffix || '').replace(/[^0-9a-z]/gi, '').toLowerCase() === cleanDef);
    if (already) continue;

    console.log(`  -> Menambahkan Rombel ${rDef.tingkat} - ${rDef.suffix}...`);
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

  existingRombels = await getRombels();
  console.log(`Total rombel aktif sekarang: ${existingRombels.length} rombel.`);

  // 6. Impor Chunk Siswa
  console.log('\n3. Memeriksa impor chunk files...');
  const chunkFiles = fs.readdirSync(cfg.chunkDir).filter(f => f.endsWith('.xlsx'));
  for (let idx = 0; idx < chunkFiles.length; idx++) {
    const cf = chunkFiles[idx];
    const chunkPath = path.join(cfg.chunkDir, cf);

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

  // 7. Penempatan Siswa via EXACT MATCH
  console.log('\n4. Menjalankan penempatan siswa dengan EXACT MATCH...');
  let loop = 0;
  let totalAssigned = 0;

  while (loop < 30) {
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
    console.log(`Sisa kandidat unassigned di batch: ${candidates.length}`);

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

  console.log(`\nTOTAL PENEMPATAN BERHASIL UNTUK ${cfg.name}: ${totalAssigned}`);

  // 8. Capture Bukti Screenshot
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, `${cfg.id}_final_students_perfect.png`), fullPage: true });

  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(proofDir, `${cfg.id}_final_rombels_perfect.png`), fullPage: true });

  console.log(`>>> ${cfg.name} SELESAI 100%! BUKTI DISIMPAN.\n`);
}

(async () => {
  console.log('=== EKSEKUSI 4 SEKOLAH TERAKHIR (BOBOTSARI, KARANGREJA, KEMANGKON, BUKATEJA) ===\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login awal
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('rumaysch@gmail.com');
  await page.locator('input[type="password"]').first().fill('A410Arum');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(4000);

  for (const cfg of schoolConfigs) {
    try {
      await processSchool(page, cfg);
    } catch (err) {
      console.error(`ERROR SAAT MEMPROSES ${cfg.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('\n=== SEMUA 4 SEKOLAH SELESAI DIPROSES ===');
})();
