const { chromium } = require('playwright');
const fs = require('fs');

async function inspectEditMapelModal() {
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

  // Klik tombol "Ubah" pertama (atau ubah Bahasa Indonesia)
  console.log('Clicking Ubah on first mapel...');
  // Temukan tombol ubah
  const ubahButtons = page.locator('button:has-text("Ubah")');
  const count = await ubahButtons.count();
  console.log('Total Ubah buttons:', count);

  // Klik ubah untuk Bahasa Indonesia (ke-4 atau cari teks BAHASA INDONESIA)
  const bindoCard = page.locator('div:has-text("BAHASA INDONESIA")').locator('button:has-text("Ubah")').first();
  await bindoCard.click();
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'modal_ubah_mapel.png' });
  console.log('Screenshot modal ubah mapel saved');

  const dialogText = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    return d ? d.innerText : 'no dialog';
  });
  console.log('Dialog text:\n', dialogText);

  // Ambil input dan checkbox di modal
  const inputs = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return [];
    return Array.from(d.querySelectorAll('input, select, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      value: el.value,
      checked: el.checked,
      text: el.innerText
    }));
  });
  console.log('Dialog inputs:', inputs);

  await browser.close();
}

inspectEditMapelModal().catch(console.error);

