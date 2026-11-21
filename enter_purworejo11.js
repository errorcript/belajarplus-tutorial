const { chromium } = require('playwright');
const fs = require('fs');

async function launchWithKhansania() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-ipv6']
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Retry goto function
  async function safeGoto(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Navigating to ${url} (attempt ${i + 1})...`);
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        return;
      } catch (err) {
        console.warn(`Attempt ${i + 1} failed: ${err.message}. Retrying in 2s...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    throw new Error(`Failed to navigate to ${url} after ${maxRetries} attempts`);
  }

  // 1. Init domain
  await safeGoto('https://belajarplus.com');

  // 2. Inject session
  await page.evaluate(({ session }) => {
    localStorage.setItem('sb-rwmcfzsnkjkklytthmow-auth-token', session);
  }, { session });

  // 3. Navigate to /dashboard
  await safeGoto('https://belajarplus.com/dashboard');
  await page.waitForTimeout(4000);

  console.log('Current URL:', page.url());

  // Tunggu kartu sekolah muncul
  await page.waitForSelector('li, div.border', { timeout: 15000 }).catch(() => {});

  // Extract all cards and button actions
  const institutions = await page.evaluate(() => {
    const cards = [];
    document.querySelectorAll('li, div.border').forEach(el => {
      const text = el.innerText || '';
      if (text.includes('SMA') || text.includes('PURWOREJO') || text.includes('Purworejo')) {
        const btn = el.querySelector('button');
        cards.push({
          title: text.split('\n')[0],
          allText: text.replace(/\n+/g, ' | '),
          hasButton: !!btn,
          btnText: btn ? btn.innerText.trim() : null
        });
      }
    });
    return cards;
  });

  console.log('Institutions found:', JSON.stringify(institutions, null, 2));

  // Klik SMA NEGERI 11 PURWOREJO
  const purworejoCard = page.locator('li, div.border').filter({ hasText: /SMA NEGERI 11 PURWOREJO/i }).first();
  if (await purworejoCard.count() > 0) {
    console.log('✔ Kartu SMA NEGERI 11 PURWOREJO ditemukan! Mengklik Masuk...');
    await purworejoCard.locator('button:has-text("Masuk")').first().click();
    await page.waitForTimeout(4000);

    console.log('URL setelah masuk:', page.url());

    // Ambil schoolId dari localStorage
    const storage = await page.evaluate(() => {
      const res = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('bp:institution:')) res[k] = localStorage.getItem(k);
      }
      return res;
    });

    console.log('Active institution keys:', storage);
    fs.writeFileSync('purworejo11_active_institution.json', JSON.stringify({
      url: page.url(),
      storage
    }, null, 2));
  } else {
    console.log('❌ Kartu SMA NEGERI 11 PURWOREJO tidak ditemukan di kartu dashboard.');
    fs.writeFileSync('khansania_dashboard_full.txt', await page.evaluate(() => document.body.innerText));
  }

  await browser.close();
}

launchWithKhansania().catch(console.error);

