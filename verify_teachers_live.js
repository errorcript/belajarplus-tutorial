const { chromium } = require('playwright');
const fs = require('fs');

async function verifyTeachersLive() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  // Open /admin to make sure active institution cookie is primed
  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Switcher to SMAN 11 Purworejo if needed
  const textHead = await page.evaluate(() => document.body.innerText.slice(0, 100));
  if (!textHead.includes('SMA NEGERI 11 PURWOREJO')) {
    const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
    if (await sw.count() > 0) {
      await sw.click();
      await page.waitForTimeout(1000);
      await page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first().click();
      await page.waitForTimeout(3000);
    }
  }

  // Go to teachers
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('tbody tr, table', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const teacherData = await page.evaluate(() => {
    const rows = [];
    document.querySelectorAll('tbody tr').forEach(tr => {
      const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n/g, ' '));
      if (cells.length > 0) rows.push(cells);
    });
    return {
      totalRows: rows.length,
      sampleRows: rows.slice(0, 35),
      fullBodySnippet: document.body.innerText.slice(0, 800)
    };
  });

  console.log('Total Guru live di /admin/teachers:', teacherData.totalRows);
  console.log('Daftar Guru Live:');
  teacherData.sampleRows.forEach((r, i) => console.log(`[${i + 1}]`, r.join(' | ')));

  await page.screenshot({ path: 'teachers_live_verified.png' });
  await browser.close();
}

verifyTeachersLive().catch(console.error);

