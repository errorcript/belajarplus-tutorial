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

  // Directly navigate to the created class workspace
  console.log('2. Navigating to created class workspace...');
  await page.goto('https://belajarplus.com/admin/classes/b0af7119-15a1-434d-bac5-17ebf77f0459?tab=ringkasan');
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 1500));
  console.log('Class workspace body snippet:\n', bodyText);

  // List all tabs or links
  const tabs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[role="tab"], button, a'))
      .map(el => ({ text: el.innerText.trim(), href: el.getAttribute('href') }))
      .filter(t => t.text.length > 2 && t.text.length < 40);
  });
  console.log('Tabs / actions:', tabs.slice(0, 30));

  await page.screenshot({ path: 'class_workspace_detail.png' });

  // Click tab Tugas / Asesmen if exists
  const tugasTab = page.locator('button:has-text("Tugas"), a:has-text("Tugas"), [role="tab"]:has-text("Tugas"), button:has-text("Asesmen"), [role="tab"]:has-text("Asesmen")').first();
  if (await tugasTab.isVisible()) {
    console.log('3. Clicking Tugas/Asesmen tab...');
    await tugasTab.click();
    await page.waitForTimeout(3000);
    console.log('Tugas tab URL:', page.url());
    const tugasBody = await page.evaluate(() => document.body.innerText.slice(0, 1000));
    console.log('Tugas tab body:\n', tugasBody);
    await page.screenshot({ path: 'tugas_tab.png' });
  }

  await browser.close();
})();

