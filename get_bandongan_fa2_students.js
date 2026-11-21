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

  // Switch to Bandongan
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const bandonganOpt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /BANDONGAN/i }).first();
  await bandonganOpt.click();
  await page.waitForTimeout(4000);

  // Navigate to /master-data/rombel
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Find the exact link for Anggota on XI FA 2
  const fa2AnggotaUrl = await page.evaluate(() => {
    // Look for all links on page
    const links = Array.from(document.querySelectorAll('a'));
    for (const a of links) {
      if (a.innerText.trim().includes('Anggota')) {
        // Check closest card
        const card = a.closest('div.border, div.card, div[class*="rounded"]');
        if (card && card.innerText.includes('XI FA 2')) {
          return a.href;
        }
      }
    }
    return null;
  });

  console.log('fa2AnggotaUrl:', fa2AnggotaUrl);

  if (fa2AnggotaUrl) {
    await page.goto(fa2AnggotaUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    const members = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => {
        return tr.innerText.replace(/\s+/g, ' ').trim();
      });
    });

    console.log(`Berhasil ambil ${members.length} siswa XI FA 2 dari platform:`);
    members.forEach((m, idx) => console.log(`  ${idx+1}. ${m}`));
    fs.writeFileSync('bandongan_xi_fa2_students_live.txt', members.join('\n'));
  }

  await browser.close();
})();

