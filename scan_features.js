const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SEKOLAH DUMMY TRAINER 3
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), [aria-haspopup="menu"]').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('trainer 3');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("SEKOLAH DUMMY TRAINER 3"), div:has-text("SEKOLAH DUMMY TRAINER 3")').last().click();
  await page.waitForTimeout(5000);

  // 1. Check sidebar menus
  const sidebarMenus = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('aside a, aside button')).map(el => ({
      text: el.innerText.trim(),
      href: el.href || ''
    })).filter(x => x.text.length > 0);
  });
  console.log('Sidebar menus in active school:\n', JSON.stringify(sidebarMenus, null, 2));

  // 2. Check Beranda Admin content
  await page.goto('https://belajarplus.com/admin');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'admin_dashboard_home.png' });
  const adminHomeText = await page.evaluate(() => document.body.innerText.slice(0, 2500));
  console.log('Admin Home text:\n', adminHomeText);

  // 3. Check Pengumuman
  await page.goto('https://belajarplus.com/announcements').catch(()=>{});
  await page.waitForTimeout(3000);
  const announcementsText = await page.evaluate(() => document.body.innerText.slice(0, 2000));
  console.log('Announcements text:\n', announcementsText);

  // 4. Check Kredit AI
  await page.goto('https://belajarplus.com/admin/ai-credits');
  await page.waitForTimeout(3000);
  const aiText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('AI Credits detail:\n', aiText);

  // 5. Check Absensi
  await page.goto('https://belajarplus.com/admin/attendance');
  await page.waitForTimeout(3000);
  const absensiText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Absensi detail:\n', absensiText);

  // 6. Check Rapor
  await page.goto('https://belajarplus.com/admin/report-cards');
  await page.waitForTimeout(3000);
  const raporText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Rapor detail:\n', raporText);

  await browser.close();
})();

