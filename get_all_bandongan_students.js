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

  // Pergi ke /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Klik tombol "Ekspor" jika ada, atau loop pagination
  const allRows = [];
  while (true) {
    const rows = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr')).map(tr => {
        const text = tr.innerText.replace(/\s+/g, ' ').trim();
        return text;
      });
    });
    allRows.push(...rows);

    const nextBtn = page.locator('button:has-text("Berikutnya"), button[aria-label="Next page"], button:has-text("Next")').first();
    const isVis = await nextBtn.isVisible().catch(() => false);
    const isDis = await nextBtn.isDisabled().catch(() => true);
    if (isVis && !isDis) {
      await nextBtn.click();
      await page.waitForTimeout(2000);
    } else {
      break;
    }
  }

  console.log(`Berhasil mengambil ${allRows.length} siswa dari /admin/students.`);
  fs.writeFileSync('bandongan_all_108_students.txt', allRows.join('\n'));

  // Mari kita analisa siswa yang tidak ada di Excel trainer!
  const ExcelJS = require('exceljs');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/SMA Negeri 1 Bandongan.xlsx');
  const sheet = wb.getWorksheet('Siswa');
  const trainerEmails = new Set();
  sheet.eachRow((r, idx) => {
    if (idx > 1) {
      const email = r.values[2]; // email
      if (email) trainerEmails.add(email.toString().toLowerCase().trim());
    }
  });

  console.log(`Trainer Excel memiliki ${trainerEmails.size} email unik.`);

  const nonTrainerStudents = [];
  allRows.forEach(rowStr => {
    // ekstrak email dari rowStr
    const emailMatch = rowStr.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].toLowerCase() : null;
    if (email && !trainerEmails.has(email)) {
      nonTrainerStudents.push({ email, fullText: rowStr });
    }
  });

  console.log(`\nSiswa yang ADA di platform tapi TIDAK ADA di berkas trainer: ${nonTrainerStudents.length}`);
  nonTrainerStudents.forEach((s, idx) => {
    console.log(`  ${idx+1}. ${s.fullText}`);
  });
  fs.writeFileSync('bandongan_manual_students.json', JSON.stringify(nonTrainerStudents, null, 2));

  await browser.close();
})();

