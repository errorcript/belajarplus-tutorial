const { chromium } = require('playwright');
const fs = require('fs');

const students = [
  { no: 1, name: 'AISYAH TASLIMAH NUR SAFARA', query: 'AISYAH TASLIMAH', email: 'sman1gon_siswa108@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 2, name: 'ALFIRA RENATA JULIYANI', query: 'ALFIRA RENATA', email: 'sman1gon_siswa109@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 3, name: 'ALISA ROHMA PAMILIH', query: 'ALISA ROHMA', email: 'sman1gon_siswa110@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 4, name: 'ANGGA PRASETYO', query: 'ANGGA PRASETYO', email: 'sman1gon_siswa111@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 5, name: 'ANNISA NUR HIDAYAH', query: 'ANNISA NUR', email: 'sman1gon_siswa112@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 6, name: 'ANNISA SEKAR INDAH FEBYANA', query: 'ANNISA SEKAR', email: 'sman1gon_siswa113@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 7, name: 'ARIESKA NAVA SAPOETRY', query: 'ARIESKA NAVA', email: 'sman1gon_siswa114@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 8, name: 'BAGAS DWI PRASETYO', query: 'BAGAS DWI', email: 'sman1gon_siswa115@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 9, name: 'CESIKA ANATASYA NATALIA', query: 'CESIKA ANATASYA', email: 'sman1gon_siswa117@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 10, name: 'CHARISTA DESTYA PRAFAMA', query: 'CHARISTA DESTYA', email: 'sman1gon_siswa118@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 11, name: 'CHIKA ADIANA AGUSTIN', query: 'CHIKA ADIANA', email: 'sman1gon_siswa119@belajarplus.com', rombel: 'Kelas 12-D' },
  { no: 12, name: 'DIVAY SOFIA AGUSTIN', query: 'DIVAY SOFIA', email: 'sman1gon_siswa120@belajarplus.com', rombel: 'Kelas 12-D' }
];

const TARGET_PASSWORD = 'sman1gon';

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

  // Switch to SMAN 1 GONDANG
  console.log('2. Switching institution to SMAN 1 GONDANG...');
  await page.click('button:has-text("Rekap gabungan"), button:has-text("Semua institusi"), button:has-text("SEKOLAH DUMMY"), button:has-text("SMA NEGERI")').catch(()=>{});
  await page.waitForTimeout(1500);
  const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
  if (await searchInput.isVisible().catch(()=>false)) {
    await searchInput.fill('gondang');
    await page.waitForTimeout(1000);
    await page.locator('[role="menuitem"]:has-text("GONDANG"), div:has-text("GONDANG")').last().click();
    await page.waitForTimeout(5000);
  }

  await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const resetResults = [];

  for (const s of students) {
    console.log(`Resetting password for [${s.no}/12]: ${s.name}...`);
    try {
      const searchBox = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
      await searchBox.fill('');
      await page.waitForTimeout(300);
      await searchBox.fill(s.query);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      const lihatBtn = page.locator('button:has-text("Lihat")').first();
      if (!(await lihatBtn.isVisible().catch(()=>false))) {
        console.log(`  Button Lihat not visible for ${s.name}`);
        resetResults.push({ ...s, resetSuccess: false, note: 'Lihat button not found' });
        continue;
      }

      await lihatBtn.click();
      await page.waitForTimeout(1500);

      const resetBtn = page.locator('button:has-text("Atur ulang kata sandi")').first();
      await resetBtn.click();
      await page.waitForTimeout(1200);

      // Find the password input in the modal
      const passInput = page.locator('input[placeholder*="Kata sandi baru"], input[type="password"], input[type="text"]').last();
      await passInput.fill(TARGET_PASSWORD);
      await page.waitForTimeout(500);

      // Click "Simpan kata sandi"
      const savePassBtn = page.locator('button:has-text("Simpan kata sandi")').first();
      await savePassBtn.click();
      await page.waitForTimeout(2000);

      // Close modal
      const closeBtn = page.locator('button:has-text("Close"), button[aria-label="Close"]').first();
      if (await closeBtn.isVisible().catch(()=>false)) {
        await closeBtn.click();
      } else {
        await page.keyboard.press('Escape');
      }
      await page.waitForTimeout(1000);

      console.log(`  Successfully reset password to ${TARGET_PASSWORD} for ${s.name}`);
      resetResults.push({ ...s, resetSuccess: true, password: TARGET_PASSWORD });
    } catch (e) {
      console.error(`  Error resetting password for ${s.name}:`, e.message);
      resetResults.push({ ...s, resetSuccess: false, note: e.message });
      await page.keyboard.press('Escape').catch(()=>{});
      await page.waitForTimeout(1000);
    }
  }

  fs.writeFileSync('reset_passwords_summary.json', JSON.stringify(resetResults, null, 2));
  console.log('Finished resetting passwords for all students.');

  await browser.close();
})();

