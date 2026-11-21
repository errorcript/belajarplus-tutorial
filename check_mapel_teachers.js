const { chromium } = require('playwright');
const fs = require('fs');

async function checkSchoolMapelAndTeachers() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--dns-result-order=ipv4first']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true
  });

  await context.addInitScript(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  const page = await context.newPage();

  // 1. Ambil semua mapel dari /master-data/mapel
  await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const mapelList = await page.evaluate(() => {
    // Cari semua kartu / item mapel
    const items = [];
    document.querySelectorAll('div, li').forEach(el => {
      // jika ada tombol Ubah di dalamnya, ambil nama mapel
      const btn = el.querySelector('button');
      if (btn && btn.innerText.includes('Ubah')) {
        const text = el.innerText.split('\n');
        items.push({
          raw: text.filter(t => t && t !== 'Ubah')
        });
      }
    });
    return items;
  });
  fs.writeFileSync('all_school_mapels.json', JSON.stringify(mapelList, null, 2));
  console.log('Mapel count:', mapelList.length);

  // 2. Ambil semua guru dari /admin/teachers
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const teacherNames = await page.evaluate(() => {
    const names = [];
    // tabel atau card guru
    document.querySelectorAll('tr, div').forEach(el => {
      const text = el.innerText;
      if (text && text.includes('@')) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          names.push({ name: lines[0], email: lines.find(l => l.includes('@')) });
        }
      }
    });
    return names;
  });
  fs.writeFileSync('all_school_teachers_live.json', JSON.stringify(teacherNames, null, 2));
  console.log('Live teacher items:', teacherNames.length);

  await browser.close();
}

checkSchoolMapelAndTeachers().catch(console.error);

