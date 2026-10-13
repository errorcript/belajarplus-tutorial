const xlsx = require('C:/Users/errorscript/.gemini/antigravity-ide/scratch/node_modules/xlsx');
const fs = require('fs');

const masterPath = 'G:/My Drive/Trainer/B+/AKUN/55. SMAN 1 Purwokerto/SMA Negeri 1 Purwokerto.xlsx';
const masterWb = xlsx.readFile(masterPath);
const masterSheetName = masterWb.SheetNames[0];
const masterRows = xlsx.utils.sheet_to_json(masterWb.Sheets[masterSheetName]);

console.log('Original rows in Master:', masterRows.length);

// 1. Bersihkan baris dummy "Siswa" / "tjarakakarsadi99@admin.sma.belajar.id"
const filteredRows = masterRows.filter(r => {
  const name = (r.firstname || r.Nama || '').trim();
  const email = (r.email || r.Email || '').trim();
  if (name.toLowerCase() === 'siswa' && email.includes('tjarakakarsadi99')) {
    console.log('Menghapus baris dummy:', name, email);
    return false;
  }
  return true;
});

// 2. Koreksi email pergeseran di Kelas 11-6
filteredRows.forEach(r => {
  const name = (r.firstname || r.Nama || '').trim();
  if (name === 'APIKKA NUR SALAZA') {
    r.email = 'apikka.nur.salaza@belajarplus.com';
  } else if (name === 'CINTA ANNISA MAKAYLA KUSUMA') {
    r.email = 'cintakd2@gmail.com';
  } else if (name === 'DAIVA ARKA CARINDRA') {
    r.email = 'daivacarindra@gmail.com';
  } else if (name === 'EKLESIA SHALLOM KEZIA HERMAWAN') {
    r.email = 'eklesiahermawan@gmail.com';
  } else if (name === 'Elizabeth Aurelia Kurnia Dewi') {
    r.email = 'elizabethsmansa@gmail.com';
  } else if (name === 'EVAN RASYID ARYA ABIMANYU') {
    r.email = 'evanrasyid118@gmail.com';
  } else if (name === 'KEISHA INDAH LARASATI') {
    r.email = 'keisha.indah.larasati@belajarplus.com';
  }

  // Bersihkan dari pesonaedu atau belajarplus.id
  if (r.email) {
    r.email = r.email.replace(/@pesonaedu\.com/gi, '@belajarplus.com').replace(/@belajarplus\.id/gi, '@belajarplus.com').trim();
  }
});

// Simpan kembali Master Excel Purwokerto yang bersih
const newMasterSheet = xlsx.utils.json_to_sheet(filteredRows);
masterWb.Sheets[masterSheetName] = newMasterSheet;
xlsx.writeFile(masterWb, masterPath);
console.log(`Master Excel Purwokerto updated: ${filteredRows.length} siswa`);

// 3. Sekarang baca export live terakhir untuk melihat 46 siswa yang belum masuk
const liveWb = xlsx.readFile('C:/Users/errorscript/.gemini/antigravity-ide/scratch/export_purwokerto_live_now.xlsx');
const liveRows = xlsx.utils.sheet_to_json(liveWb.Sheets[liveWb.SheetNames[0]]);
const liveEmails = new Set(liveRows.map(r => (r.Email || r.email || '').trim().toLowerCase()));
const liveNames = new Set(liveRows.map(r => (r.Nama || r.nama || r['Nama Lengkap'] || '').trim().toLowerCase()));

const missingList = [];
filteredRows.forEach(s => {
  const ln = (s.lastname || s.cohort1 || '').trim();
  let rName = 'Kelas Cadangan';
  const m10 = ln.match(/sman1pwk_X-0?(\d+)/i);
  const m11 = ln.match(/sman1pwk_XI-0?(\d+)/i);
  if (m10) rName = `Kelas 10-${parseInt(m10[1], 10)}`;
  else if (m11) rName = `Kelas 11-${parseInt(m11[1], 10)}`;

  const rawName = (s.firstname || s.Nama || '').trim();
  let email = (s.email || s.Email || '').trim().toLowerCase();

  const nameKey = rawName.toLowerCase();
  const emailKey = email.toLowerCase();

  if (!liveEmails.has(emailKey) && !liveNames.has(nameKey)) {
    missingList.push({
      'Nama': rawName,
      'Email': email,
      'Password Awal': s.password || s['Password Awal'] || 'sman1pwk_1234',
      'Rombel': rName
    });
  }
});

console.log(`\nTotal Siswa missing final yang akan diimpor: ${missingList.length} siswa`);
missingList.forEach((m, idx) => {
  console.log(`${idx + 1}. [${m.Rombel}] ${m.Nama} | ${m.Email}`);
});

// Buat template resmi BelajarPlus
const tplWb = xlsx.readFile('C:/Users/errorscript/.gemini/antigravity-ide/scratch/template_resmi_belajarplus.xlsx');
const panduanSheet = tplWb.Sheets['Panduan'];

const importWb = xlsx.utils.book_new();
const importSheet = xlsx.utils.json_to_sheet(missingList);
xlsx.utils.book_append_sheet(importWb, importSheet, 'Siswa');
xlsx.utils.book_append_sheet(importWb, panduanSheet, 'Panduan');

const cleanImportPath = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/pwk_clean_final_46.xlsx';
xlsx.writeFile(importWb, cleanImportPath);
console.log(`\nFile impor resmi siap: ${cleanImportPath}`);

fs.writeFileSync('C:/Users/errorscript/.gemini/antigravity-ide/scratch/pwk_clean_final_46.json', JSON.stringify(missingList, null, 2));
