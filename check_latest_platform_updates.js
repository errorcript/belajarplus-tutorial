const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(() => false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  console.log('2. Inspecting Beranda / Announcements / Updates...');
  await page.screenshot({ path: 'dashboard_home.png' });

  // Check Pengumuman link
  const pengumumanBtn = page.locator('a:has-text("Pengumuman")').first();
  if (await pengumumanBtn.isVisible()) {
    console.log('Opening Pengumuman...');
    await pengumumanBtn.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: 'pengumuman_page.png' });
    const text = await page.evaluate(() => document.body.innerText.slice(0, 3000));
    console.log('Pengumuman text:\n', text);
  }

  // Check all sidebar menus and new sections
  const menuList = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('aside a, aside button, nav a, nav button')).map(el => ({
      text: el.innerText.trim(),
      href: el.href || ''
    })).filter(x => x.text.length > 0 && !x.text.includes('\n'));
  });
  console.log('Available navigation menus:\n', JSON.stringify(menuList, null, 2));

  // Check Kredit AI page
  console.log('Checking Kredit AI page...');
  await page.goto('https://belajarplus.com/admin/ai-credits', { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => { });
  await page.waitForTimeout(3000);
  const aiCreditsText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('AI Credits page text:\n', aiCreditsText);

  // Check face recognition / new features on Master Data Siswa
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  const studentsFeatureText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Students feature text:\n', studentsFeatureText);

  // Check notification bells or modal popups
  const popups = await page.evaluate(() => {
    const dialogs = Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"], .toast, .banner')).map(d => d.innerText.trim());
    return dialogs;
  });
  console.log('Active popups/banners:\n', popups);

  await browser.close();
})();

