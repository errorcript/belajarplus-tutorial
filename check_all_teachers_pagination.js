const { chromium } = require('playwright');
const fs = require('fs');

async function checkAllTeachers() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const text = await page.evaluate(() => document.body.innerText);
  const match = text.match(/Menampilkan[\s\S]*?dari\s+(\d+)\s+data/i) || text.match(/Total\s+(\d+)\s+Guru/i);
  console.log('Pagination info:', match ? match[0] : 'No pagination match');

  // Next page
  const nextBtn = page.locator('button').filter({ hasText: /Berikutnya|Next/i }).first();
  if (await nextBtn.count() > 0 && await nextBtn.isEnabled()) {
    console.log('Clicking Next page...');
    await nextBtn.click();
    await page.waitForTimeout(2000);
    const p2Names = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('tbody tr').forEach(tr => {
        list.push(tr.innerText.replace(/\n+/g, ' '));
      });
      return list;
    });
    console.log('Page 2 items count:', p2Names.length);
    p2Names.forEach((n, i) => console.log(`  P2 [${i + 1}]`, n));
  }

  await browser.close();
}

checkAllTeachers().catch(console.error);

