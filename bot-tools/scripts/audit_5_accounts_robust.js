const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');

const accounts = [
  { id: 1, email: 'And.aliffiansyah@gmail.com', pass: 'kerja98' },
  { id: 2, email: 'Henrisusilo00@gmail.com', pass: 'Henri9087!!' },
  { id: 3, email: 'Fitrinoveiraa@gmail.com', pass: 'Mevi2026^' },
  { id: 4, email: 'rumaysch@gmail.com', pass: 'A410Arum' },
  { id: 5, email: 'khansania.medtra@gmail.com', pass: 'Khansa04' }
];

(async () => {
  console.log('=== MEMULAI AUDIT 5 AKUN BELAJARPLUS ROBUST ===');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });

  const finalReport = {};

  for (const acc of accounts) {
    console.log(`\n========================================`);
    console.log(`AUDIT [${acc.id}] ${acc.email}`);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    try {
      await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded' });
      await page.locator('input[type="email"]').first().fill(acc.email);
      await page.locator('input[type="password"]').first().fill(acc.pass);
      await page.locator('button[type="submit"]:has-text("Masuk")').click();

      // Tunggu sampai token tersimpan di localStorage (artinya login sukses)
      console.log('Menunggu token auth...');
      await page.waitForFunction(() => {
        const val = localStorage.getItem('sb-jpmfsldnzptdgfhvdqpb-auth-token');
        return val && val.length > 50;
      }, { timeout: 15000 }).catch(e => console.log('Timeout menunggu token auth:', e.message));

      await page.waitForTimeout(2000);

      // Buka dashboard
      console.log('Buka dashboard...');
      await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(6000);

      // Tunggu hingga tombol "Masuk" sekolah muncul di dashboard
      const btns = page.getByRole('button', { name: 'Masuk' });
      const hasButtons = await btns.first().waitFor({ timeout: 10000 }).then(() => true).catch(() => false);

      const count = await btns.count();
      console.log(`Jumlah tombol Masuk ditemukan: ${count}`);

      const schools = [];
      for (let i = 0; i < count; i++) {
        const rawText = await btns.nth(i).evaluate(el => {
          const card = el.closest('li') || el.closest('.border') || el.closest('.rounded-lg') || el.closest('div');
          return card ? card.innerText : '';
        });
        const clean = rawText.trim().replace(/\n+/g, ' | ');
        if (clean && !schools.includes(clean)) {
          schools.push(clean);
        }
      }

      // Ambil screenshot
      const shotPath = `C:/Users/errorscript/.gemini/antigravity-ide/scratch/audit_robust_acc_${acc.id}.png`;
      await page.screenshot({ path: shotPath, fullPage: true });

      console.log(`Hasil untuk ${acc.email}:`);
      schools.forEach((s, idx) => console.log(`  ${idx + 1}. ${s}`));

      finalReport[acc.email] = schools;

    } catch (err) {
      console.error(`Error pada ${acc.email}:`, err.message);
      finalReport[acc.email] = { error: err.message };
    } finally {
      await context.close();
    }
  }

  await browser.close();

  fs.writeFileSync('C:/Users/errorscript/.gemini/antigravity-ide/scratch/report_5_accounts.json', JSON.stringify(finalReport, null, 2));
  console.log('\n=== AUDIT 5 AKUN SELESAI LENGKAP ===');
})();
