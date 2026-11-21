const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to Gemolong
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const gemolongOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /GEMOLONG/i }).first();
  await gemolongOpt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/admin/teachers', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Let's loop pagination to collect all teachers
  const allTeachers = [];
  while (true) {
    const rows = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => {
        const text = tr.innerText.replace(/\s+/g, ' ').trim();
        return text;
      });
    });
    allTeachers.push(...rows);

    // Check next page button
    const nextBtn = page.locator('button:has-text("Berikutnya"), button[aria-label="Next page"], button:has-text("Next")').first();
    const isVisible = await nextBtn.isVisible().catch(() => false);
    const isDisabled = await nextBtn.isDisabled().catch(() => true);
    if (isVisible && !isDisabled) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
    } else {
      break;
    }
  }

  console.log(`Collected ${allTeachers.length} teachers.`);
  fs.writeFileSync('all_gemolong_teachers.txt', allTeachers.join('\n'));

  // Search for anisca
  const found = allTeachers.filter(t => t.toLowerCase().includes('anisca') || t.toLowerCase().includes('anisc') || t.toLowerCase().includes('anis'));
  console.log('Teachers matching anis/anisca:', found);

  await browser.close();
})();

