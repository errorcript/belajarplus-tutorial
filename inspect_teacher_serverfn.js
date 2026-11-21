const { chromium } = require('playwright');
const fs = require('fs');

async function logTeacherRequests() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--dns-result-order=ipv4first']
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  const page = await context.newPage();

  page.on('request', req => {
    if (req.url().includes('_serverFn')) {
      console.log(`[REQ] ${req.method()} ${req.url()}`);
      if (req.postData()) {
        console.log(`  Payload:`, req.postData().slice(0, 300));
      }
    }
  });

  page.on('response', async res => {
    if (res.url().includes('_serverFn')) {
      try {
        const text = await res.text();
        console.log(`[RES] ${res.status()} ${res.url()} | len: ${text.length}`);
      } catch (e) { }
    }
  });

  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Cari elemen tabel atau tombol aksi pada baris guru
  const rows = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).map(tr => {
      const name = tr.querySelector('td:nth-child(1)')?.innerText?.trim();
      const actionBtns = Array.from(tr.querySelectorAll('button, [role="button"]')).map(b => b.innerText.trim() || b.getAttribute('aria-label') || b.title);
      return { name, actionBtns };
    });
  });

  console.log('Table rows found in DOM:', rows.length);
  console.log('Sample rows in DOM:', rows.slice(0, 5));

  await browser.close();
}

logTeacherRequests().catch(console.error);

