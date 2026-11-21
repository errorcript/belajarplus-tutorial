const { chromium } = require('playwright');

(async () => {
  console.log('--- INSPEKSI DETAIL ROMBEL RENATA DWI ANGGITA SARI ---');

  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--window-size=1440,900'] });
  const page = await browser.newPage();

  try {
    // 1. Login Arum
    await page.goto('https://belajarplus.com/auth', { waitUntil: 'load', timeout: 30000 });
    await page.fill('input[type="email"]', 'rumaysch@gmail.com');
    await page.fill('input[type="password"]', 'A410Arum');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    // 2. Switcher ke Sukodono
    const switcher = page.locator('button:has-text("Semua institusi saya"), button:has-text("Rekap gabungan")').first();
    await switcher.click();
    await page.waitForTimeout(1500);

    const sukodonoItem = page.locator('[role="menuitem"], [role="option"], li, div[data-radix-collection-item], button').filter({ hasText: /SUKODONO/i }).first();
    await sukodonoItem.click();
    await page.waitForTimeout(4000);

    // 3. Cek tabel Siswa
    console.log('Membuka /admin/students...');
    await page.goto('https://belajarplus.com/admin/students', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    const searchInput = page.locator('input[placeholder*="Cari"], input[type="search"]').first();
    await searchInput.fill('RENATA DWI');
    await page.waitForTimeout(2500);

    const rowDetails = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('tbody tr, table tr'));
      for (const tr of trs) {
        if (tr.innerText.includes('RENATA DWI')) {
          const cells = Array.from(tr.querySelectorAll('td, th')).map(c => c.innerText.trim());
          return { fullText: tr.innerText.replace(/\n+/g, ' | '), cells };
        }
      }
      return null;
    });
    console.log('Detail baris Renata di /admin/students:', rowDetails);

    // 4. Buka /master-data/rombel
    console.log('\nMembuka /master-data/rombel...');
    await page.goto('https://belajarplus.com/master-data/rombel', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Cari kartu spesifik Kelas 12-F
    // Di halaman rombel ada banyak div. Cari div container kartu yang memiliki teks "Kelas 12-F"
    const card12F = page.locator('div').filter({ hasText: /^Kelas 12-F/ }).or(
      page.locator('div.border, li, div.rounded-lg, div.p-4').filter({ hasText: /Kelas\s+12-F/ })
    ).first();

    console.log('Mencari tombol Anggota untuk Kelas 12-F...');
    // Alternatif: cari semua tombol Anggota dan filter parent-nya
    const anggotaBtns = await page.locator('button:has-text("Anggota")').all();
    console.log(`Ditemukan ${anggotaBtns.length} tombol Anggota.`);

    let targetAnggotaBtn = null;
    for (const btn of anggotaBtns) {
      const parentText = await btn.evaluate(el => el.closest('div.border, li, div.rounded-lg, div.p-4, div.card')?.innerText || '');
      if (parentText.includes('Kelas 12-F') || parentText.includes('12-F')) {
        console.log('Tombol Anggota Kelas 12-F ditemukan! Parent:', parentText.replace(/\n+/g, ' '));
        targetAnggotaBtn = btn;
        break;
      }
    }

    if (targetAnggotaBtn) {
      await targetAnggotaBtn.click();
      await page.waitForTimeout(3000);

      const modal = page.locator('[role="dialog"]');
      const titleModal = await modal.locator('h2, h3, div.text-lg, [role="heading"]').first().innerText().catch(() => '');
      console.log('Judul Modal:', titleModal);

      const modalText = await modal.innerText();
      console.log('Isi modal (500 chars):', modalText.slice(0, 500).replace(/\n+/g, ' '));

      const isRenataInside = modalText.includes('RENATA DWI');
      console.log('Apakah Renata ada di daftar anggota aktif 12-F?', isRenataInside);

      // Cek apakah ada tab "Belum ditempatkan" atau tab "Tambah Anggota"
      const tabs = await modal.locator('button, [role="tab"]').all();
      for (const t of tabs) {
        const txt = await t.innerText();
        console.log('Tab/Tombol di modal:', txt.trim());
      }

      // Ambil screenshot modal
      await page.screenshot({ path: 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/sukodono_batches/modal_12f_detail.png' });
      console.log('Screenshot modal 12-F tersimpan.');

      // Jika belum ada, coba cari tombol Tambah Anggota / Siswa
      const tambahSiswaBtn = modal.locator('button:has-text("Tambah Siswa"), button:has-text("Tambah"), button:has-text("Belum ditempatkan")').first();
      if (await tambahSiswaBtn.isVisible().catch(() => false)) {
        console.log('Mengklik:', await tambahSiswaBtn.innerText());
        await tambahSiswaBtn.click();
        await page.waitForTimeout(2000);
        console.log('Isi modal setelah klik:', (await modal.innerText()).slice(0, 500).replace(/\n+/g, ' '));
        await page.screenshot({ path: 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/sukodono_batches/modal_12f_tambah.png' });
      }

    } else {
      console.log('Tombol Anggota Kelas 12-F tidak ketemu langsung lewat parent, mari cek semua kartu.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();

