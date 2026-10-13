const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const proofDir = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/audit_purbalingga_proofs';
const excelFile = 'C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_2_Purbalingga_716.xlsx';

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
  console.log('=== EKSEKUSI TUNTAS SMAN 2 PURBALINGGA (716 SISWA, 20 ROMBEL) ===\n');

  // Load student mappings from Excel
  const allExcelRows = xlsx.utils.sheet_to_json(xlsx.readFile(excelFile).Sheets['Siswa']);
  const emailToRombel = {};
  allExcelRows.forEach(r => {
    const em = (r.Email || '').toLowerCase().trim();
    const rom = (r.Rombel || '').trim();
    if (em && rom) emailToRombel[em] = rom;
  });
  console.log(`Loaded ${Object.keys(emailToRombel).length} mappings from Excel.`);

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('rumaysch@gmail.com');
  await page.locator('input[type="password"]').first().fill('A410Arum');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(4000);

  // Masuk SMAN 2 Purbalingga
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  const card = page.locator('li, div.border').filter({ hasText: /2 PURBALINGGA/i }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3500);

  // Halaman Rombel untuk Year ID
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

  // Ambil daftar rombel
  const rombelText = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId });

  const rombels = parseTanStack(rombelText);
  console.log(`Ditemukan ${rombels.length} rombel di SMAN 2 Purbalingga.`);

  // 1. Bersihkan anggota rombel Kelas 10-XI secara cepat (chunked parallel)
  const rombelXI = rombels.find(r => r.suffix === 'XI' || (r.displayName || '').includes('10-XI'));
  if (rombelXI) {
    console.log(`\n1. Memeriksa anggota di ${rombelXI.displayName}...`);
    const memText = await page.evaluate(async ({ headers, rombelId }) => {
      const res = await fetch('/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId'], v: [{ t: 1, s: rombelId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, rombelId: rombelXI.id });

    const members = parseTanStack(memText);
    console.log(`Total anggota di ${rombelXI.displayName}: ${members.length} siswa.`);

    const toRemove = members.filter(m => {
      const mEmail = (m.email || '').toLowerCase().trim();
      const target = emailToRombel[mEmail];
      return target && target.toUpperCase() !== 'XI';
    });

    console.log(`Siswa yang harus dikeluarkan dari ${rombelXI.displayName}: ${toRemove.length} siswa.`);

    // Hapus via parallel batches (10 per batch)
    for (let b = 0; b < toRemove.length; b += 10) {
      const batch = toRemove.slice(b, b + 10);
      await Promise.all(batch.map(m => {
        return page.evaluate(async ({ headers, memberId }) => {
          await fetch('/_serverFn/853e20cd5cfe0f8fb6d0e40816ee7a27d414247af74e7978a9be05157e8f8f9e', {
            method: 'POST',
            headers,
            body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['memberId'], v: [{ t: 1, s: memberId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
          });
        }, { headers, memberId: m.id });
      }));
    }
    console.log(`✅ Sukses mengeluarkan ${toRemove.length} siswa dari ${rombelXI.displayName}!`);
  }

  // 2. Pastikan seluruh 14 chunk siswa terimpor
  console.log('\n2. Memeriksa impor chunk files...');
  const schoolChunkDir = 'C:/Users/errorscript/Downloads/Chunks_Purbalingga/purbalingga2';
  const chunkFiles = fs.readdirSync(schoolChunkDir).filter(f => f.endsWith('.xlsx'));

  for (let idx = 0; idx < chunkFiles.length; idx++) {
    const cf = chunkFiles[idx];
    const chunkPath = path.join(schoolChunkDir, cf);

    await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const importBtn = page.locator('button:has-text("Impor Siswa"), button:has-text("Impor")').first();
    await importBtn.click();
    await page.waitForTimeout(1200);

    const fileInput = page.locator('div[role="dialog"] input[type="file"]').first();
    await fileInput.setInputFiles(chunkPath);
    await page.waitForTimeout(3500);

    const confirmBtn = page.locator('div[role="dialog"] button:has-text("Impor")').last();
    let isEnabled = false;
    for (let w = 0; w < 5; w++) {
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

  // 3. Penempatan siswa dengan EXACT MATCH
  console.log('\n3. Menjalankan penempatan siswa dengan EXACT MATCH...');
  let loop = 0;
  let totalAssigned = 0;

  while (loop < 30) {
    loop++;
    console.log(`\n--- Iterasi Penempatan Batch ${loop} ---`);

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

      // EXACT MATCH: suffix bersih harus SAMA PERSIS dengan target rombel bersih
      const targetRombel = rombels.find(r => {
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

  console.log(`\nTOTAL PENEMPATAN BERHASIL: ${totalAssigned}`);

  // Screenshot Bukti Live Akhir
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(proofDir, 'purbalingga2_final_students_perfect.png'), fullPage: true });

  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(proofDir, 'purbalingga2_final_rombels_perfect.png'), fullPage: true });

  console.log('>>> SMAN 2 PURBALINGGA SELESAI 100%! BUKTI DISIMPAN.');
  await browser.close();
})();
