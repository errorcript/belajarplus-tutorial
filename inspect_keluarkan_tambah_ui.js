const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--dns-result-order=ipv4first'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://belajarplus.com/auth');
  await page.locator('input[type="email"]').first().fill('Henrisusilo00@gmail.com');
  await page.locator('input[type="password"]').first().fill('Henri9087!!');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(4000);

  // Switch to TAWANGSARI
  const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan"), button:has-text("SMA")').first();
  await switcher.click();
  await page.waitForTimeout(1500);
  const opt = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /TAWANGSARI/i }).first();
  await opt.click();
  await page.waitForTimeout(4000);

  await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Buka modal Kelas 11-10 (nth 19)
  console.log('Opening Kelas 11-10 dialog...');
  await page.getByRole('button', { name: 'Anggota' }).nth(19).click();
  await page.waitForTimeout(2500);

  // Cek struktur checkbox siswa di dalam dialog
  const studentRows = await page.evaluate(() => {
    const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
    if (!dialog) return [];
    
    // Cari elemen-elemen baris siswa yang punya checkbox
    const rows = Array.from(dialog.querySelectorAll('div.flex.items-center.justify-between, div.flex.items-center.gap-2, div.flex.items-center.space-x-2, div[role="listitem"]'));
    return rows.map(r => {
      const checkbox = r.querySelector('input[type="checkbox"], button[role="checkbox"]');
      const text = r.innerText.replace(/\n+/g, ' | ');
      return {
        text,
        hasCheckbox: !!checkbox,
        checkboxAttr: checkbox ? {
          type: checkbox.tagName,
          id: checkbox.id,
          name: checkbox.name,
          value: checkbox.value,
          ariaChecked: checkbox.getAttribute('aria-checked')
        } : null
      };
    });
  });

  console.log('Sample student rows with checkbox:');
  console.log(studentRows.filter(r => r.text.includes('Fadhil') || r.hasCheckbox).slice(0, 5));

  // Cek bagian "Tambah siswa"
  const addStudentSection = await page.evaluate(() => {
    const dialog = document.querySelector('.max-h-\\[90vh\\], [role="dialog"]');
    if (!dialog) return null;
    const addHeader = Array.from(dialog.querySelectorAll('*')).find(el => el.innerText && el.innerText.trim() === 'Tambah siswa');
    if (!addHeader) return 'No Tambah siswa text';
    const parent = addHeader.closest('div.border-t, div.p-4, div.space-y-4') || addHeader.parentElement;
    return {
      outerHTML: parent ? parent.outerHTML.substring(0, 1500) : ''
    };
  });

  console.log('\nAdd student section:');
  console.log(addStudentSection);

  await browser.close();
})();

