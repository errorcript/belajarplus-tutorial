const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(5000);

  // Switch to SEKOLAH DUMMY TRAINER 3
  console.log('2. Switching to SEKOLAH DUMMY TRAINER 3...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Navigating to the created class workspace with active institution...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=ringkasan');
  await page.waitForTimeout(5000);

  console.log('Workspace URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Workspace body:\n', bodyText);

  await page.screenshot({ path: 'dummy_3_workspace_active.png' });

  // Check tabs on the page
  const pageButtons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, [role="tab"]'))
      .map(el => ({ text: el.innerText.trim(), href: el.getAttribute('href') }))
      .filter(t => t.text.length > 1 && t.text.length < 50);
  });
  console.log('Buttons/Tabs inside workspace:', pageButtons);

  // Look for "Tugas" or "Asesmen" or "Buat Tugas" / "Buat Asesmen"
  const buatTugas = page.locator('button:has-text("Tugas"), a:has-text("Tugas"), button:has-text("Asesmen"), a:has-text("Asesmen"), button:has-text("Buat")').all();
  const allBuat = await buatTugas;
  console.log('Found action buttons count:', allBuat.length);
  for (let i = 0; i < allBuat.length; i++) {
    console.log(`Action ${i}:`, await allBuat[i].innerText().catch(()=>''));
  }

  await browser.close();
})();

