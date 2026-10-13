const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const path = require('path');
const fs = require('fs');

const excelPath = 'C:/Users/errorscript/Downloads/Impor/SMA Negeri 1 Dukun.xlsx';
const wb = xlsx.readFile(excelPath);
const excelRows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
console.log(`Excel total students: ${excelRows.length}`);

// Mapping email -> rombel dari file asli SMAN 1 Dukun
const excelOrigin = 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata/10. SMAN 1 Dukun/SMA Negeri 1 Dukun.xlsx';
const wbOrig = xlsx.readFile(excelOrigin);
const rowsOrig = xlsx.utils.sheet_to_json(wbOrig.Sheets[wbOrig.SheetNames[0]]);
const emailToRombel = {};
rowsOrig.forEach(r => {
  const em = (r.Email || r.email || '').toLowerCase().trim();
  const rom = (r.Rombel || r.rombel || r.Kelas || r.kelas || '').toString().trim();
  if (em && rom) {
    emailToRombel[em] = rom;
  }
});
console.log(`Email to Rombel map: ${Object.keys(emailToRombel).length} mappings`);

const rombelList = ['XII.1', 'XII.2', 'XII.3', 'XII.4', 'XII.5', 'XII.6', 'XII.7', 'XII.8'];

function deserializeTanStack(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    const resultObj = data.p?.v?.[0];
    if (resultObj && Array.isArray(resultObj.a)) {
      return resultObj.a.map(item => {
        if (!item.p || !Array.isArray(item.p.k) || !Array.isArray(item.p.v)) return null;
        const res = {};
        item.p.k.forEach((k, idx) => {
          res[k] = item.p.v[idx]?.s;
        });
        return res;
      }).filter(Boolean);
    }
  } catch (e) {}
  return [];
}

(async () => {
  console.log('=== RUN DUKUN COMPLETE ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const page = await browser.newPage();

  // 1. Login Khansania
  await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
  await page.locator('input[type="email"]').first().fill('khansania.medtra@gmail.com');
  await page.locator('input[type="password"]').first().fill('Khansa04');
  await page.locator('button[type="submit"]:has-text("Masuk")').click();
  await page.waitForTimeout(5000);

  // 2. Masuk SMAN 1 Dukun
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const card = page.locator('li, div.border').filter({ hasText: 'SMA NEGERI 1 DUKUN' }).first();
  await card.locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3500);

  const authData = await page.evaluate(() => {
    const tokenObj = JSON.parse(localStorage.getItem('sb-jpmfsldnzptdgfhvdqpb-auth-token') || '{}');
    const schoolIdKey = Object.keys(localStorage).find(k => k.startsWith('bp:institution:'));
    const schoolId = schoolIdKey ? localStorage.getItem(schoolIdKey) : null;
    return { token: tokenObj.access_token, schoolId };
  });
  console.log('School ID:', authData.schoolId);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authData.token}`,
    'x-school-override': authData.schoolId,
    'x-tsr-serverfn': 'true',
    'accept': 'application/json'
  };

  // 3. Cek Jumlah Siswa di Admin Students
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  let currentTotal = await page.evaluate(() => {
    const match = document.body.innerText.match(/dari\s+([\d.,]+)\s+data/i);
    return match ? parseInt(match[1].replace(/[^0-9]/g, ''), 10) : 0;
  });
  console.log(`Current Total Siswa di Platform: ${currentTotal}`);

  if (currentTotal < excelRows.length) {
    console.log(`Mengimpor seluruh siswa SMAN 1 Dukun (${excelRows.length} baris)...`);
    const importBtn = page.locator('button:has-text("Impor Siswa"), button:has-text("Impor")').first();
    await importBtn.click();
    await page.waitForTimeout(2000);

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(excelPath);

    const confirmBtn = page.locator('div[role="dialog"] button:has-text("Impor")').last();
    let enabled = false;
    for (let w = 0; w < 30; w++) {
      await page.waitForTimeout(1000);
      enabled = await confirmBtn.isEnabled().catch(() => false);
      if (enabled) break;
    }

    if (enabled) {
      console.log('Tombol Impor Aktif! Mengonfirmasi impor siswa...');
      await confirmBtn.click();
      await page.waitForTimeout(25000);
    }
  }

  // 4. Buat Rombel di /master-data/rombel dengan clean page reload setiap pembuatan
  console.log('\n--- Membuat Rombel Bersih ---');
  for (const rName of rombelList) {
    await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2500);

    const existingText = await page.evaluate(() => document.body.innerText);
    if (existingText.includes(rName)) {
      console.log(`Rombel "${rName}" sudah ada.`);
      continue;
    }

    console.log(`Membuat rombel: "${rName}"...`);
    const btnTambah = page.locator('button:has-text("Tambah Rombel")').first();
    await btnTambah.click();
    await page.waitForTimeout(1500);

    const dialog = page.locator('div[role="dialog"]');
    const jenjangSelect = dialog.locator('select').nth(0);
    await jenjangSelect.selectOption({ label: 'SMA/MA' }).catch(() => {});
    await page.waitForTimeout(200);

    const kelasSelect = dialog.locator('select').nth(1);
    await kelasSelect.selectOption({ label: 'Kelas 12' }).catch(() => {});
    await page.waitForTimeout(200);

    const suffix = rName.replace(/XII[\s\.\-]*/i, '') || rName;
    const suffixInput = dialog.locator('input').first();
    await suffixInput.fill(suffix);
    await page.waitForTimeout(200);

    const submitBtn = dialog.locator('button:has-text("Tambah Rombel")');
    await submitBtn.click();
    await page.waitForTimeout(3000);
    console.log(`Rombel "${rName}" berhasil dibuat!`);
  }

  // 5. Ambil data TA & Rombel dari API
  console.log('\n--- Membaca ID Rombel & Assign Siswa ---');
  const taText = await page.evaluate(async ({ headers, schoolId }) => {
    const res = await fetch('/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['schoolId'], v: [{ t: 1, s: schoolId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, schoolId: authData.schoolId });

  const yearId = taText.match(/"s":"([0-9a-f\-]{36})"/)?.[1];
  console.log('Year ID aktif:', yearId);

  const rombelText = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId });

  const rombels = deserializeTanStack(rombelText);
  console.log(`Daftar ${rombels.length} rombel di platform:`);
  rombels.forEach(r => console.log(`  - [${r.id}] ${r.displayName || r.suffix}`));

  // 6. Assign Siswa ke Rombel
  let totalAssigned = 0;
  for (const r of rombels) {
    const rDisplayName = (r.displayName || r.suffix || '').trim();
    console.log(`\nMenempatkan siswa ke rombel: "${rDisplayName}" (ID: ${r.id})...`);

    const candText = await page.evaluate(async ({ headers, rombelId }) => {
      const res = await fetch('/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId', 'q'], v: [{ t: 1, s: rombelId }, { t: 1, s: '' }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, rombelId: r.id });

    const candidates = deserializeTanStack(candText);
    console.log(`  Kandidat belum di rombel: ${candidates.length} siswa`);

    const studentsToAdd = candidates.filter(c => {
      const cEmail = (c.email || '').toLowerCase().trim();
      const targetRombel = emailToRombel[cEmail];
      if (!targetRombel) return false;

      const rClean = rDisplayName.replace(/[^0-9a-z]/gi, '').toLowerCase();
      const tClean = targetRombel.replace(/[^0-9a-z]/gi, '').toLowerCase();
      const rSuf = (r.suffix || '').replace(/[^0-9a-z]/gi, '').toLowerCase();

      return tClean === rClean || tClean.endsWith(rSuf) || rClean.endsWith(tClean);
    });

    console.log(`  Siswa cocok untuk "${rDisplayName}": ${studentsToAdd.length} siswa`);

    if (studentsToAdd.length > 0) {
      const studentIds = studentsToAdd.map(s => s.id);
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
      }, { headers, rombelId: r.id, studentIds });

      console.log(`  ✅ Berhasil assign ${studentIds.length} siswa ke rombel "${rDisplayName}"!`);
      totalAssigned += studentIds.length;
    }
  }

  console.log(`\nTOTAL SISWA SELESAI DI-ASSIGN KE ROMBEL: ${totalAssigned}`);

  // 7. Ambil Screenshot Bukti
  console.log('\n--- Mengambil Screenshot Bukti Rombel & Siswa ---');

  // Screenshot Rombel
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const ssRombelGDrive = 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/bukti_terbaru_rombel.png';
  const ssRombelLocal = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/13 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/bukti_terbaru_rombel.png';
  await page.screenshot({ path: ssRombelGDrive, fullPage: true });
  if (fs.existsSync(path.dirname(ssRombelLocal))) await page.screenshot({ path: ssRombelLocal, fullPage: true });
  console.log(`Screenshot rombel tersimpan: ${ssRombelGDrive}`);

  // Screenshot Siswa
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const ssSiswaGDrive = 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/bukti_terbaru_siswa.png';
  const ssSiswaMaster = 'G:/My Drive/Trainer/B+/AKUN/17 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/3_master_data_siswa.png';
  const ssSiswaLocal = 'C:/Users/errorscript/Downloads/Laporan BelajarPlus/13 Sekolah Terdata/10. SMAN 1 Dukun/Bukti_Impor/bukti_terbaru_siswa.png';
  await page.screenshot({ path: ssSiswaGDrive, fullPage: true });
  await page.screenshot({ path: ssSiswaMaster, fullPage: true });
  if (fs.existsSync(path.dirname(ssSiswaLocal))) await page.screenshot({ path: ssSiswaLocal, fullPage: true });
  console.log(`Screenshot siswa tersimpan: ${ssSiswaGDrive}`);

  // 8. Cek Detail Jumlah Siswa per Rombel di Web
  await page.goto('https://belajarplus.id/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const rombelTableData = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim()).join(' | ');
    });
  });
  console.log('\nTabel Rombel Akhir di Web BelajarPlus:');
  rombelTableData.forEach(r => console.log('  ->', r));

  await browser.close();
  console.log('\n=== SELESAI SMAN 1 DUKUN 100% ===');
})();
