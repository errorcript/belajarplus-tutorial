const { chromium } = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Login Alif...');
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

  console.log('2. Ekspor data siswa live dari /admin/students...');
  await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const savePath = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/export_purwokerto_live_now.xlsx';
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('button:has-text("Ekspor")').first().click()
  ]);
  await download.saveAs(savePath);
  console.log(`Berhasil ekspor ke ${savePath}`);

  // 3. Baca export excel
  const liveWb = xlsx.readFile(savePath);
  const liveRows = xlsx.utils.sheet_to_json(liveWb.Sheets[liveWb.SheetNames[0]]);
  console.log(`Total siswa di ekspor platform live: ${liveRows.length} siswa`);

  // Mapping live siswa
  const liveEmailMap = new Map();
  const liveNameMap = new Map();
  liveRows.forEach(r => {
    const e = (r.Email || r.email || '').trim().toLowerCase();
    const n = (r.Nama || r.nama || r['Nama Lengkap'] || '').trim().toLowerCase();
    if (e) liveEmailMap.set(e, r);
    if (n) liveNameMap.set(n, r);
  });

  // 4. Baca master 792 siswa
  const masterPath = 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/SMA Negeri 1 Purwokerto.xlsx';
  const masterWb = xlsx.readFile(masterPath);
  const masterRows = xlsx.utils.sheet_to_json(masterWb.Sheets['Siswa'] || masterWb.Sheets[masterWb.SheetNames[0]]);
  console.log(`Total siswa di Master Excel: ${masterRows.length} siswa`);

  const missingStudents = [];
  masterRows.forEach(s => {
    const ln = (s.lastname || s.cohort1 || '').trim();
    let rName = 'Kelas Cadangan';
    const m10 = ln.match(/sman1pwk_X-0?(\d+)/i);
    const m11 = ln.match(/sman1pwk_XI-0?(\d+)/i);
    if (m10) rName = `Kelas 10-${parseInt(m10[1], 10)}`;
    else if (m11) rName = `Kelas 11-${parseInt(m11[1], 10)}`;

    const rawName = (s.firstname || s.Nama || '').trim();
    let email = (s.email || s.Email || '').trim().toLowerCase();
    email = email.replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com');
    if (!email || !email.includes('@') || email.startsWith('agif')) {
      const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
      email = `${cleanName}@belajarplus.com`;
    }

    const nameKey = rawName.toLowerCase();
    const emailKey = email.toLowerCase();

    if (!liveEmailMap.has(emailKey) && !liveNameMap.has(nameKey)) {
      missingStudents.push({
        'Nama': rawName,
        'Email': email,
        'Password Awal': s.password || s['Password Awal'] || 'sman1pwk_1234',
        'Rombel': rName
      });
    }
  });

  console.log(`\nSiswa yang BELUM ADA di platform: ${missingStudents.length} siswa`);
  const rombelDist = {};
  missingStudents.forEach(m => {
    rombelDist[m.Rombel] = (rombelDist[m.Rombel] || 0) + 1;
  });
  console.log('Distribusi missing per rombel:', rombelDist);

  // Buat file template resmi
  const tplWb = xlsx.readFile('C:/Users/errorscript/.gemini/antigravity-ide/scratch/template_resmi_belajarplus.xlsx');
  const panduanSheet = tplWb.Sheets['Panduan'];

  const outWb = xlsx.utils.book_new();
  const outSheet = xlsx.utils.json_to_sheet(missingStudents);
  xlsx.utils.book_append_sheet(outWb, outSheet, 'Siswa');
  xlsx.utils.book_append_sheet(outWb, panduanSheet, 'Panduan');

  const outPath = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/pwk_missing_final.xlsx';
  xlsx.writeFile(outWb, outPath);
  console.log(`File import disimpan ke: ${outPath}`);

  // Simpan JSON
  fs.writeFileSync('C:/Users/errorscript/.gemini/antigravity-ide/scratch/pwk_missing_final.json', JSON.stringify(missingStudents, null, 2));

  await browser.close();
})();
