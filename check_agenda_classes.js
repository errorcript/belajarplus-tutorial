const { chromium } = require('playwright');
const fs = require('fs');

async function checkAgendaAndClasses() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Inject session directly
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'commit' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  // 1. Cek /admin/classes
  console.log('Testing /admin/classes...');
  await page.goto('https://belajarplus.com/admin/classes', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const classesText = await page.evaluate(() => document.body.innerText);
  console.log('Classes text:\n', classesText.slice(0, 400).replace(/\n+/g, ' '));
  await page.screenshot({ path: 'admin_classes_view.png' });

  // 2. Cek /informasi/agenda
  console.log('Testing /informasi/agenda...');
  await page.goto('https://belajarplus.com/informasi/agenda', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const agendaText = await page.evaluate(() => document.body.innerText);
  console.log('Agenda text:\n', agendaText.slice(0, 400).replace(/\n+/g, ' '));
  await page.screenshot({ path: 'agenda_view.png' });

  await browser.close();
}

checkAgendaAndClasses().catch(console.error);

