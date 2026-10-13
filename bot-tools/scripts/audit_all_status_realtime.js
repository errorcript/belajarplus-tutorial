const { chromium } = require('./belajarplus-tutorial/node_modules/playwright');
const fs = require('fs');

const accounts = [
  { name: 'Henri Susilo', email: 'Henrisusilo00@gmail.com', pass: 'Henri9087!!' },
  { name: 'Ameviana Fitri Noveira', email: 'Fitrinoveiraa@gmail.com', pass: 'Mevi2026^' },
  { name: 'Rumaisha Al Mawaddah', email: 'rumaysch@gmail.com', pass: 'A410Arum' },
  { name: 'Andrew Aliffiansyah', email: 'And.aliffiansyah@gmail.com', pass: 'kerja98' },
  { name: 'Khansania', email: 'khansania.medtra@gmail.com', pass: 'Khansa04' }
];

(async () => {
  console.log('=== AUDIT REAL-TIME STATUS SISWA DI BELAJARPLUS ===\n');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });

  const auditReport = [];

  for (const acc of accounts) {
    console.log(`\n======================================================`);
    console.log(`AUDIT AKUN: ${acc.name} (${acc.email})`);
    console.log(`======================================================`);

    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    try {
      await page.goto('https://belajarplus.id/auth', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.locator('input[type="email"]').first().fill(acc.email);
      await page.locator('input[type="password"]').first().fill(acc.pass);
      await page.locator('button[type="submit"]:has-text("Masuk")').click();
      await page.waitForTimeout(5000);

      await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);

      const institutions = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('li, div.border'));
        return cards.map(c => {
          const firstLine = c.innerText.split('\n')[0].trim();
          return { title: firstLine };
        }).filter(item => {
          const t = item.title.toUpperCase();
          return (t.startsWith('SMA') || t.startsWith('SMK')) &&
                 !t.includes('DUMMY') &&
                 !t.includes('EGIS') &&
                 !t.includes('TASIKMALAYA') &&
                 !t.includes('LATIHAN');
        });
      });

      for (const inst of institutions) {
        if (/gringsing/i.test(inst.title)) continue;

        try {
          await page.evaluate(() => {
            Object.keys(localStorage).filter(k => k.startsWith('bp:institution:')).forEach(k => localStorage.removeItem(k));
          });
          await page.goto('https://belajarplus.id/dashboard', { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(2000);

          const card = page.locator('li, div.border').filter({ hasText: inst.title }).first();
          if (await card.count() === 0) continue;

          await card.locator('button:has-text("Masuk")').first().click();
          await page.waitForTimeout(3000);

          await page.goto('https://belajarplus.id/admin/students', { waitUntil: 'domcontentloaded', timeout: 20000 });
          await page.waitForTimeout(2500);

          const info = await page.evaluate(() => {
            const body = document.body.innerText;
            const matchPagination = body.match(/dari\s+([\d.,]+)\s+data/i);
            const totalRows = document.querySelectorAll('tbody tr').length;
            let total = 0;
            if (matchPagination) {
              total = parseInt(matchPagination[1].replace(/[^0-9]/g, ''), 10);
            } else if (totalRows > 0) {
              const mTotal = body.match(/Total Siswa[\s\S]*?(\d+)/i);
              total = mTotal ? parseInt(mTotal[1], 10) : totalRows;
            }
            return { total, totalRows };
          });

          console.log(`[${acc.name}] ${inst.title} -> ${info.total} siswa (rows: ${info.totalRows})`);
          auditReport.push({
            trainer: acc.name,
            school: inst.title,
            students: info.total,
            rows: info.totalRows,
            hasStudents: info.total > 0 || info.totalRows > 0
          });

        } catch (e) {
          console.error(`  Error pada ${inst.title}:`, e.message);
        }
      }

    } catch (accErr) {
      console.error(`Error akun ${acc.name}:`, accErr.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();

  fs.writeFileSync('audit_all_status_realtime.json', JSON.stringify(auditReport, null, 2));

  console.log('\n======================================================');
  console.log('AUDIT REAL-TIME SELESAI!');
  const withStudents = auditReport.filter(s => s.hasStudents);
  const withoutStudents = auditReport.filter(s => !s.hasStudents);
  console.log(`Total Sekolah Terdata Memiliki Siswa: ${withStudents.length}`);
  console.log(`Total Sekolah Belum Memiliki Siswa: ${withoutStudents.length}`);
  console.log('======================================================');
})();
