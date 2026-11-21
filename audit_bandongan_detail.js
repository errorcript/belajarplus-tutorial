const { chromium } = require('playwright');
const ExcelJS = require('exceljs');
const fs = require('fs');

(async () => {
  console.log('=== DETAIL AUDIT SISWA KELAS 11-XI FA 2 SMAN 1 BANDONGAN ===');

  // 1. Baca data dari Excel di Google Drive
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('G:/My Drive/Trainer/B+/AKUN/06. SMAN 1 Bandongan/SMA Negeri 1 Bandongan.xlsx');
  const sheet = wb.getWorksheet('Siswa');
  
  const driveStudents = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      const vals = row.values;
      // Kolom: No, Nama, Email, Password, NIS, Rombel
      driveStudents.push({
        row: rowNumber,
        nama: vals[2],
        email: vals[3],
        password: vals[4],
        nis: vals[5],
        rombel: vals[6]
      });
    }
  });

  console.log(`Total siswa di Drive Bandongan: ${driveStudents.length}`);
  const fa2InDrive = driveStudents.filter(s => s.rombel && s.rombel.toString().includes('FA 2'));
  console.log(`Siswa rombel XI FA 2 di Drive: ${fa2InDrive.length}`);
  if (fa2InDrive.length > 0) {
    console.log('Contoh siswa FA 2 di Drive:', fa2InDrive.slice(0, 5));
  } else {
    // Tampilkan semua rombel unik di drive
    const rombels = [...new Set(driveStudents.map(s => s.rombel))];
    console.log('Daftar Rombel di Drive:', rombels);
  }

  // 2. Sekarang ambil siswa live di platform untuk rombel XI FA 2
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

  // Buka /master-data/rombel dan klik "Anggota" pada Kelas 11-XI FA 2
  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Cari link / button "Anggota" pada blok Kelas 11-XI FA 2
  const anggotaLinks = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.border, div.card, div[class*="rounded"]'));
    const fa2Card = cards.find(c => c.innerText.includes('XI FA 2'));
    if (!fa2Card) return { error: 'Card XI FA 2 not found' };
    const a = fa2Card.querySelector('a:has-text("Anggota"), button:has-text("Anggota")');
    return {
      cardText: fa2Card.innerText,
      link: a ? a.getAttribute('href') : null
    };
  });
  console.log('Anggota link XI FA 2:', anggotaLinks);

  // Ambil list siswa dari /admin/students (atau dari link anggota)
  if (anggotaLinks.link) {
    await page.goto('https://belajarplus.com' + anggotaLinks.link, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const members = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('tbody tr, div[role="row"]'))
        .map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
    });
    console.log(`Jumlah anggota rombel XI FA 2 di platform: ${members.length}`);
    console.log('Sample anggota rombel XI FA 2:', members.slice(0, 10));
    fs.writeFileSync('bandongan_xi_fa2_members.txt', members.join('\n'));
  }

  // Cek juga seluruh siswa di /admin/students
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Ambil seluruh siswa (108 siswa)
  const allStudents = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('tbody tr')).map(tr => tr.innerText.replace(/\s+/g, ' ').trim());
  });
  console.log(`Total siswa ter-render di /admin/students page 1: ${allStudents.length}`);
  fs.writeFileSync('bandongan_all_students_page1.txt', allStudents.join('\n'));

  await browser.close();
})();

