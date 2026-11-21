const { chromium } = require('playwright');
const fs = require('fs');

async function inspectTeachersPage() {
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

  // Intercept network request untuk mencatat serverFn terkait guru
  page.on('request', req => {
    if (req.url().includes('_serverFn') || req.url().includes('supabase')) {
      console.log(`[REQ] ${req.method()} ${req.url()}`);
    }
  });

  console.log('Navigating to /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(3000);

  // Ambil screenshot
  await page.screenshot({ path: 'admin_teachers_page.png', fullPage: true });
  console.log('Screenshot saved to admin_teachers_page.png');

  // Inspect HTML table & actions
  const pageInfo = await page.evaluate(() => {
    const rows = [];
    document.querySelectorAll('tbody tr').forEach(tr => {
      const texts = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim().replace(/\n+/g, ' '));
      const buttons = Array.from(tr.querySelectorAll('button, a')).map(b => b.innerText.trim() || b.getAttribute('aria-label') || b.className);
      rows.push({ texts, buttons });
    });

    const actionButtons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      aria: b.getAttribute('aria-label'),
      title: b.title
    })).filter(b => b.text || b.aria || b.title);

    return {
      rowCount: rows.length,
      sampleRows: rows.slice(0, 10),
      buttons: actionButtons
    };
  });

  console.log('Total table rows:', pageInfo.rowCount);
  console.log('Sample rows:', JSON.stringify(pageInfo.sampleRows, null, 2));
  console.log('Buttons:', JSON.stringify(pageInfo.buttons, null, 2));

  await browser.close();
}

inspectTeachersPage().catch(console.error);

