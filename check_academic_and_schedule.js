const { chromium } = require('playwright');
const fs = require('fs');

async function checkAcademicAndSchedule() {
  console.log('=== MEMERIKSA TAHUN AJARAN & JADWAL SMAN 11 PURWOREJO ===');
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  // Set session
  await page.goto('https://belajarplus.com', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ session, schoolId }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
    localStorage.setItem('bp:institution:ae613e51-f4de-4233-961b-0497c473a764', schoolId);
  }, { session, schoolId });

  await page.goto('https://belajarplus.com/admin', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Pastikan SMAN 11 Purworejo aktif
  const hText = await page.evaluate(() => document.body.innerText.slice(0, 100));
  if (!hText.includes('SMA NEGERI 11 PURWOREJO')) {
    const sw = page.locator('button, div').filter({ hasText: /^Semua institusi saya$/i }).first();
    await sw.click();
    await page.waitForTimeout(1000);
    await page.locator('button').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first().click();
    await page.waitForTimeout(3000);
  }

  // 1. Cek Tahun Ajaran
  console.log('--- 1. Cek /master-data/tahun-ajaran ---');
  await page.goto('https://belajarplus.com/master-data/tahun-ajaran', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(3000);
  const taText = await page.evaluate(() => document.body.innerText);
  console.log('Tahun Ajaran Page Snippet:\n', taText.slice(0, 600));
  await page.screenshot({ path: 'audit_tahun_ajaran_purworejo11.png' });

  // 2. Cek Menu & Navigasi Sidebar untuk mencari rute Jadwal
  console.log('\n--- 2. Cek Seluruh Menu Sidebar ---');
  const sidebarLinks = await page.evaluate(() => {
    const links = [];
    document.querySelectorAll('nav a, aside a, [role="navigation"] a').forEach(a => {
      links.push({ text: a.innerText.replace(/\n+/g, ' ').trim(), href: a.getAttribute('href') });
    });
    return links;
  });
  console.log('Sidebar Links:', JSON.stringify(sidebarLinks, null, 2));

  // 3. Coba akses beberapa rute umum jadwal di BelajarPlus
  const possibleScheduleRoutes = [
    '/master-data/jadwal',
    '/master-data/jadwal-pelajaran',
    '/admin/schedules',
    '/admin/schedule',
    '/admin/classes',
    '/master-data/rombel'
  ];

  for (const route of possibleScheduleRoutes) {
    console.log(`\nMencoba akses https://belajarplus.com${route}...`);
    await page.goto(`https://belajarplus.com${route}`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.waitForTimeout(2500);
    const body = await page.evaluate(() => document.body.innerText);
    const isError = body.includes('404') || body.includes('Halaman tidak ditemukan') || body.includes('Terjadi kesalahan');
    console.log(`Route ${route}: Valid? ${!isError}. Snippet: ${body.slice(0, 150).replace(/\n+/g, ' ')}`);
    if (!isError && !body.includes('Failed to fetch')) {
      await page.screenshot({ path: `route_${route.replace(/\//g, '_')}.png` });
    }
  }

  await browser.close();
}

checkAcademicAndSchedule().catch(console.error);

