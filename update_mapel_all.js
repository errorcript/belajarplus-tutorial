const { chromium } = require('playwright');
const fs = require('fs');

async function updateMapelToAllGrades() {
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

  let loaded = false;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      await page.goto('https://belajarplus.com/master-data/mapel', { waitUntil: 'networkidle', timeout: 30000 });
      loaded = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  await page.waitForTimeout(2000);

  // Ambil semua card yang memiliki teks "SMA/MA · Kelas 10"
  // Klik tombol Ubah-nya satu per satu
  console.log('Finding mapels with SMA/MA · Kelas 10...');
  
  // Kita loop selagi masih ada card yang berlabel SMA/MA · Kelas 10
  let updatedCount = 0;
  while (true) {
    const card = page.locator('div:has-text("SMA/MA · Kelas 10")').locator('button:has-text("Ubah")').first();
    const isVisible = await card.isVisible().catch(() => false);
    if (!isVisible) {
      console.log('No more SMA/MA · Kelas 10 cards found!');
      break;
    }

    console.log(`Updating mapel #${updatedCount + 1}...`);
    await card.click();
    await page.waitForTimeout(800);

    // Di modal, pilih "Semua jenjang & kelas" (value: "")
    const select = page.locator('[role="dialog"] select');
    await select.selectOption({ value: '' });
    await page.waitForTimeout(300);

    // Klik simpan
    const saveBtn = page.locator('[role="dialog"] button:has-text("Simpan")');
    await saveBtn.click();
    await page.waitForTimeout(1500);

    updatedCount++;
    if (updatedCount > 25) break; // safety break
  }

  console.log(`Total mapel updated to "Semua kelas": ${updatedCount}`);
  await page.screenshot({ path: 'mapel_all_updated.png', fullPage: true });

  await browser.close();
}

updateMapelToAllGrades().catch(console.error);

