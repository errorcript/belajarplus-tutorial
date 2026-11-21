const { chromium } = require('playwright');
const fs = require('fs');

async function updateMuhChotibName() {
  const session = fs.readFileSync('khansania_session.json', 'utf8');
  const schoolId = '33e9a6d4-e923-43da-8465-befe9ba55d0b';

  console.log('Launching browser to update Pak Muh Chotib name...');
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

  // Log requests
  page.on('request', req => {
    if (req.url().includes('_serverFn') && req.method() === 'POST') {
      console.log(`[REQ] ${req.url()}`);
      if (req.postData()) console.log(`  Payload: ${req.postData().slice(0, 200)}`);
    }
  });

  page.on('response', async res => {
    if (res.url().includes('_serverFn') && res.request().method() === 'POST') {
      try {
        const text = await res.text();
        console.log(`[RES ${res.status()}] ${res.url()} | len: ${text.length} | snippet: ${text.slice(0, 200)}`);
      } catch (e) {}
    }
  });

  console.log('Navigating to /admin/teachers...');
  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Search "kangmuh"
  console.log('Searching for kangmuh_ in search input...');
  const searchInput = page.locator('input[placeholder*="Cari nama atau email" i], input[aria-label="Cari PTK"]').first();
  await searchInput.fill('kangmuh');
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'step1_search_kangmuh.png' });
  console.log('Step 1 screenshot saved.');

  // Klik tombol "Lihat" pada hasil pencarian
  console.log('Clicking "Lihat" button...');
  const lihatBtn = page.locator('button:has-text("Lihat")').first();
  await lihatBtn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'step2_modal_profile_opened.png' });
  console.log('Step 2 screenshot saved (profile modal opened).');

  // Klik tombol "Ubah data"
  console.log('Clicking "Ubah data" button in modal...');
  const ubahDataBtn = page.locator('button:has-text("Ubah data")').first();
  await ubahDataBtn.click();
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'step3_form_edit_name.png' });
  console.log('Step 3 screenshot saved (form opened).');

  // Isi nama lengkap dengan "Muh. Chotib, S.Pd.I."
  const nameInput = page.locator('#mp-name, input[value="kangmuh_"]').first();
  console.log('Filling new name: Muh. Chotib, S.Pd.I....');
  await nameInput.fill('Muh. Chotib, S.Pd.I.');
  await page.waitForTimeout(500);

  // Klik Simpan
  console.log('Submitting form (Clicking Simpan)...');
  const simpanBtn = page.locator('button[type="submit"]:has-text("Simpan")').first();
  await simpanBtn.click();
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'step4_after_save.png' });
  console.log('Step 4 screenshot saved (after save).');

  // Close modal jika masih terbuka
  const closeBtn = page.locator('button:has-text("Batal"), button[aria-label="Close"], button[aria-label="Tutup"]').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click().catch(() => {});
  }

  await browser.close();
  console.log('Browser closed. Step completed!');
}

updateMuhChotibName().catch(console.error);

