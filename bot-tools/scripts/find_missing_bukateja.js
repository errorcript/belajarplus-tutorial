const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');

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
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.id/auth');
  await page.locator('input[type="email"]').first().fill('rumaysch@gmail.com');
  await page.locator('input[type="password"]').first().fill('A410Arum');
  await page.locator('button[type="submit"]').click();
  await page.waitForTimeout(3000);

  // Masuk Bukateja
  await page.evaluate(() => {
    Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
  });
  await page.goto('https://belajarplus.id/dashboard');
  await page.waitForTimeout(2000);
  await page.locator('li, div.border').filter({ hasText: /1 BUKATEJA/i }).first().locator('button:has-text("Masuk")').first().click();
  await page.waitForTimeout(3000);

  const authData = await page.evaluate(() => {
    const tokenObj = JSON.parse(localStorage.getItem('sb-jpmfsldnzptdgfhvdqpb-auth-token') || '{}');
    const schoolIdKey = Object.keys(localStorage).find(k => k.startsWith('bp:institution:'));
    const schoolId = schoolIdKey ? localStorage.getItem(schoolIdKey) : null;
    return { token: tokenObj.access_token, schoolId };
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + authData.token,
    'x-school-override': authData.schoolId,
    'x-tsr-serverfn': 'true',
    'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
  };

  const wb = xlsx.readFile('C:/Users/errorscript/Downloads/Impor_Ready_Purbalingga/SMA_Negeri_1_Bukateja_360.xlsx');
  const allRows = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);

  await page.goto('https://belajarplus.id/master-data/rombel');
  await page.waitForTimeout(3000);
  const yearId = await page.locator('select').first().inputValue();

  const rText = await page.evaluate(async ({ headers, yearId }) => {
    const res = await fetch('/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87', {
      method: 'POST',
      headers,
      body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['yearId'], v: [{ t: 1, s: yearId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
    });
    return await res.text();
  }, { headers, yearId });
  const rombels = parseTanStack(rText);

  const enrolledEmails = new Set();
  for (const r of rombels) {
    const memText = await page.evaluate(async ({ headers, rombelId }) => {
      const res = await fetch('/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d', {
        method: 'POST',
        headers,
        body: JSON.stringify({ t: { t: 10, i: 0, p: { k: ['data'], v: [{ t: 10, i: 1, p: { k: ['rombelId'], v: [{ t: 1, s: rombelId }] }, o: 0 }] }, o: 0 }, f: 127, m: [] })
      });
      return await res.text();
    }, { headers, rombelId: r.id });
    const members = parseTanStack(memText);
    members.forEach(m => enrolledEmails.add((m.email || '').toLowerCase().trim()));
    console.log(`Rombel ${r.displayName || r.suffix}: ${members.length} siswa`);
  }

  console.log(`Total siswa unik terdaftar di rombel Bukateja: ${enrolledEmails.size}`);

  const missing = allRows.filter(r => !enrolledEmails.has((r.Email || '').toLowerCase().trim()));
  console.log(`Total siswa di Excel yang BELUM ada di rombel platform: ${missing.length}`);
  console.log('Sample missing students:', JSON.stringify(missing.slice(0, 5), null, 2));

  const missingByRombel = {};
  missing.forEach(r => {
    missingByRombel[r.Rombel] = (missingByRombel[r.Rombel] || 0) + 1;
  });
  console.log('Missing count per Rombel:\n', JSON.stringify(missingByRombel, null, 2));

  // Coba buat 1 file excel berisi siswa missing dan test upload modalnya
  const missingWb = xlsx.utils.book_new();
  const missingWs = xlsx.utils.json_to_sheet(missing);
  xlsx.utils.book_append_sheet(missingWb, missingWs, 'Siswa');
  const missingFile = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/bukateja_missing_students.xlsx';
  xlsx.writeFile(missingWb, missingFile);

  await page.goto('https://belajarplus.id/admin/students');
  await page.waitForTimeout(2500);

  const importBtn = page.locator('button:has-text("Impor Siswa"), button:has-text("Impor")').first();
  await importBtn.click();
  await page.waitForTimeout(1000);
  const fileInput = page.locator('div[role="dialog"] input[type="file"]').first();
  await fileInput.setInputFiles(missingFile);
  await page.waitForTimeout(4000);

  const dialogText = await page.locator('div[role="dialog"]').innerText();
  console.log('\n=== MODAL IMPOR UNTUK SISWA MISSING BUKATEJA ===\n', dialogText.substring(0, 1500));

  await browser.close();
})();
