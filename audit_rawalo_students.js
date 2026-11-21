const { chromium } = require('playwright');
const fs = require('fs');

const queries = [
  // Pindah / Keluar
  { category: 'Pindah/Keluar', query: 'Afra', target: 'Afra (X-1 pindah SNT)' },
  { category: 'Pindah/Keluar', query: 'Dian', target: 'Dian (X-7 pindah)' },
  { category: 'Pindah/Keluar', query: 'Rahma ramadona', target: 'Rahma ramadona (X-8 pindah)' },
  { category: 'Pindah/Keluar', query: 'Rafa ferdiansyah', target: 'Rafa ferdiansyah (X-8 keluar)' },
  
  // Double
  { category: 'Double', query: 'Aini Nurzahrah', target: 'Aini Nurzahrah (X-2 double)' },
  { category: 'Double', query: 'Ratriningtias', target: 'Ratriningtias (X-2 double)' },
  { category: 'Double', query: 'Verlin Raisya', target: 'Verlin Raisya Putri (X-6 double)' },
  { category: 'Double', query: 'NASYIFA AKHIR', target: 'NASYIFA AKHIR FAJARRINA (X-6 double)' },
  
  // Salah Rombel
  { category: 'Salah Rombel', query: 'farendy', target: 'farendy hozinatul Asror (X-6 -> XI 3)' },

  // Belum ada akun
  { category: 'Belum Ada Akun', query: 'Zahira Nur Salsabila', target: 'Zahira Nur Salsabila (X-2)' },
  { category: 'Belum Ada Akun', query: 'Livia Nur', target: 'Livia Nur azizah (XI 8)' },
  { category: 'Belum Ada Akun', query: 'Uzlifatul', target: 'Uzlifatul Azifah (XI 7)' },
  { category: 'Belum Ada Akun', query: 'Emyl Agustian', target: 'Emyl Agustian Fifananda (XII 7)' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-ipv6'] });
  const page = await browser.newPage();

  console.log('1. Logging in Henri...');
  await page.goto('https://belajarplus.com/auth', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2000);

  if (await page.locator('input[type="email"]').isVisible().catch(()=>false)) {
    await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
    await page.locator('input[type="password"]').first().fill('Henri9087!!');
    await page.locator('button[type="submit"]').first().click();
    await page.waitForTimeout(5000);
  }

  // Switch to SMA NEGERI 1 RAWALO
  console.log('2. Switching institution to SMA NEGERI 1 RAWALO...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SMA NEGERI"), button:has-text("SEKOLAH DUMMY")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  await searchInput.fill('rawalo');
  await page.waitForTimeout(1000);
  await page.locator('[role="menuitem"]:has-text("RAWALO"), div:has-text("RAWALO")').last().click();
  await page.waitForTimeout(5000);

  console.log('3. Navigating to Master Data Siswa (/admin/students)...');
  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const auditReport = [];

  for (const q of queries) {
    console.log(`Checking [${q.category}] for query: ${q.query}...`);
    const searchField = page.locator('input[placeholder*="Cari nama atau email"], input[type="search"]').first();
    await searchField.fill('');
    await page.waitForTimeout(200);
    await searchField.fill(q.query);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2500);

    const rows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('tbody tr, [role="row"]'));
      return trs.map(tr => {
        const cells = Array.from(tr.querySelectorAll('td, [role="cell"]')).map(td => td.innerText.trim());
        return cells;
      }).filter(c => c.length > 0);
    });

    console.log(`  Found ${rows.length} rows for ${q.query}`);
    auditReport.push({
      ...q,
      count: rows.length,
      rows: rows
    });
  }

  fs.writeFileSync('rawalo_audit_report.json', JSON.stringify(auditReport, null, 2));
  console.log('Audit complete.');

  await browser.close();
})();

