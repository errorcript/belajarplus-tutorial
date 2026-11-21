const { chromium } = require('playwright');
const fs = require('fs');

async function getAccurateTeachers() {
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

  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const teachers = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    return rows.map(r => {
      const cols = Array.from(r.querySelectorAll('td')).map(td => td.innerText.trim());
      // Kolom 0 biasanya Nama & Email
      const nameCol = cols[0] || '';
      const lines = nameCol.split('\n').map(l => l.trim()).filter(Boolean);
      return {
        fullName: lines[0],
        email: lines.find(l => l.includes('@')) || '',
        nuptk: cols[1],
        role: cols[2],
        status: cols[3]
      };
    });
  });

  fs.writeFileSync('official_teachers_purworejo11.json', JSON.stringify(teachers, null, 2));
  console.log('Total table rows (teachers):', teachers.length);
  console.log('Sample table rows:\n', teachers.slice(0, 5));

  // Ambil juga mapel dari /master-data/mapel secara akurat
  await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const mapels = await page.evaluate(() => {
    // Ambil semua judul mapel dari halaman
    const h = [];
    document.querySelectorAll('h3, h4, p, div').forEach(el => {
      // jika di dalam card mapel
      const text = el.innerText.trim();
      if (text && el.className && el.className.includes('font-semibold') && !text.includes('SMA') && !text.includes('Kurikulum') && !text.includes('Master')) {
        h.push(text);
      }
    });
    return [...new Set(h)];
  });
  fs.writeFileSync('official_mapels_purworejo11.json', JSON.stringify(mapels, null, 2));
  console.log('Official mapels sample:', mapels);

  await browser.close();
}

getAccurateTeachers().catch(console.error);

