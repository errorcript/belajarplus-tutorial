const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMA NEGERI 1 RAWALO
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  // Direct go to /master-data/rombel
  console.log('2. Navigating directly to /master-data/rombel...');
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.screenshot({ path: 'master_data_rombel_page.png' });

  const rombelRows = await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
    return trs.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td, [role="cell"]')).map(c => c.innerText.trim());
      return cells;
    }).filter(c => c.length > 0);
  });
  console.log('Rombel table rows:\n', JSON.stringify(rombelRows, null, 2));

  // Check student details for target students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const studentsToCheck = [
    { name: 'ZAHIRA NUR SALSABILA', rombel: '10-2' },
    { name: 'UZLIFATUL AZIFAH', rombel: '11-7' },
    { name: 'LIVIA NUR AZIZAH', rombel: '11-8' },
    { name: 'EMYL AGUSTIAN FIFANANDA', rombel: '12-7' },
    { name: 'DIAN FITRININGSIH', rombel: 'X-7' },
    { name: 'Farendy Hozinatul Asror', rombel: '11-3' }
  ];

  const studentDetails = [];

  for (const s of studentsToCheck) {
    const sf = page.locator('input[placeholder*="Cari nama atau email"]').first();
    await sf.fill('');
    await page.waitForTimeout(200);
    await sf.fill(s.name);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const lihatBtn = page.locator('button:has-text("Lihat")').first();
    if (await lihatBtn.isVisible()) {
      await lihatBtn.click();
      await page.waitForTimeout(1500);
      const text = await page.evaluate(() => {
        const d = document.querySelector('[role="dialog"]');
        return d ? d.innerText : '';
      });

      // parse rombel from text
      const rombelMatch = text.match(/Rombel\n([^\n]+)/);
      const tingkaMatch = text.match(/Tingkat\n([^\n]+)/);
      const statusMatch = text.match(/Status\n([^\n]+)/);

      studentDetails.push({
        nama: s.name,
        targetRombel: s.rombel,
        tingkat: tingkaMatch ? tingkaMatch[1] : '-',
        rombelAktif: rombelMatch ? rombelMatch[1] : '-',
        status: statusMatch ? statusMatch[1] : '-'
      });

      await page.locator('button:has-text("Close")').click().catch(()=>{});
      await page.waitForTimeout(500);
    }
  }

  console.log('Student details verification:\n', JSON.stringify(studentDetails, null, 2));

  fs.writeFileSync('full_rombel_and_students.json', JSON.stringify({ rombelRows, studentDetails }, null, 2));

  await browser.close();
})();

