const { chromium } = require('playwright');
const fs = require('fs');

async function inspectRombelLive() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const pageText = await page.evaluate(() => document.body.innerText);
  console.log('Snippet /master-data/rombel:\n', pageText.slice(0, 800));

  // Ambil semua rombel yang terdaftar
  const rombels = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('h3, h4, div.font-semibold, div.font-medium, tr').forEach(el => {
      const txt = el.innerText ? el.innerText.trim() : '';
      if (txt.match(/X|XI|XII|Kelas\s+1[0-2]/i)) {
        list.push(txt.replace(/\n+/g, ' | '));
      }
    });
    return [...new Set(list)];
  });

  console.log('Rombel yang ditemukan di platform:', rombels);
  await page.screenshot({ path: 'master_rombel_purworejo11.png' });
  await browser.close();
}

inspectRombelLive().catch(console.error);

