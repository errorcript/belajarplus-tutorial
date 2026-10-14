const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const baseDir = 'G:\\My Drive\\Trainer\\B+\\AKUN';
const outputDir = path.join(__dirname, '..', '..', '..', 'output_clean_semarang');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function cleanEmail(rawEmail, username, schoolCode, emailCounts) {
  let email = (rawEmail || '').toString().trim().replace(/['"]/g, '').replace(/\s+/g, '');
  // Buang tanda @ di awal jika ada typo bawaan (@nama@gmail.com atau @nama@...)
  email = email.replace(/^@+/, '');

  const cleanU = (username || 'siswa').toString().trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

  // Cek apakah haram pesonaedu, dummy, kosong, strip, atau tidak lolos regex email standar
  if (!email || email === '-' || email.includes('pesonaedu.com') || email.includes('pesonaedu.id') || !EMAIL_REGEX.test(email)) {
    return `${cleanU}@belajarplus.com`;
  }
  // Cek duplikasi massal (> 3 akun pakai email persis sama)
  if (emailCounts && emailCounts[email] > 3) {
    return `${cleanU}@belajarplus.com`;
  }
  return email;
}

function createBelajarPlusWorkbook(students) {
  const wb = xlsx.utils.book_new();

  // Deduplikasi email jika masih ada bentrok
  const seenEmails = new Set();
  const cleanRows = students.map((s, idx) => {
    let email = s.Email;
    if (seenEmails.has(email.toLowerCase())) {
      const u = s._username || `siswa_${idx + 1}`;
      email = `${u}_${idx + 1}@belajarplus.com`;
    }
    seenEmails.add(email.toLowerCase());

    return {
      'Nama': s.Nama,
      'Email': email,
      'Password Awal': s['Password Awal'] || 'BelajarPlus#2026',
      'Rombel': s.Rombel
    };
  });

  const wsSiswa = xlsx.utils.json_to_sheet(cleanRows, {
    header: ['Nama', 'Email', 'Password Awal', 'Rombel']
  });

  const panduanData = [
    { 'Kolom': 'Nama', 'Keterangan': 'Wajib untuk akun baru' },
    { 'Kolom': 'Email', 'Keterangan': 'Wajib unik per pengguna (Domain @belajarplus.com atau email aktif siswa)' },
    { 'Kolom': 'Password Awal', 'Keterangan': 'Minimal 6 karakter' },
    { 'Kolom': 'Rombel', 'Keterangan': 'Nama rombel/kelas siswa' }
  ];
  const wsPanduan = xlsx.utils.json_to_sheet(panduanData, {
    header: ['Kolom', 'Keterangan']
  });

  xlsx.utils.book_append_sheet(wb, wsSiswa, 'Siswa');
  xlsx.utils.book_append_sheet(wb, wsPanduan, 'Panduan');
  return { wb, count: cleanRows.length };
}

// ==========================================
// 1. SMAN 10 SEMARANG
// ==========================================
function processSMAN10() {
  console.log('\n>>> Memproses SMAN 10 Semarang...');
  const filePath = path.join(baseDir, '83. SMAN 10 Semarang', 'SMA Negeri 10 Semarang.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  const shAsesmen = xlsx.utils.sheet_to_json(wb.Sheets['Asesmen']);

  // Hitung frekuensi email
  const emailCounts = {};
  [...shSiswa, ...shAsesmen].forEach(r => {
    const em = (r.email || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    if (em) emailCounts[em] = (emailCounts[em] || 0) + 1;
  });

  const students = [];

  // Proses Kelas 10 & 12 dari sheet Siswa
  // Pisahkan penumpukan 10.1 dan 12.1
  let count10_1 = 0;
  let count12_1 = 0;

  shSiswa.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    let rombel = rawRombel;

    if (rawRombel.includes('10.1') && !rawRombel.includes('10.11')) {
      count10_1++;
      if (count10_1 <= 36) {
        rombel = '10.1';
      } else {
        rombel = '10.10'; // 35 siswa kedua alfabetis adalah 10.10
      }
    } else if (rawRombel.includes('12.1')) {
      count12_1++;
      if (count12_1 <= 36) {
        rombel = '12.1';
      } else {
        rombel = '12.10'; // 34 siswa kedua alfabetis adalah 12.10
      }
    } else {
      // Normalisasi nama rombel: hapus prefix panjang "SMA Negeri 10 Semarang_"
      rombel = rawRombel.replace('SMA Negeri 10 Semarang_', '').trim();
    }

    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman10smg', emailCounts),
      'Password Awal': r.password || 'Jateng_10smg',
      Rombel: rombel,
      _username: r.username
    });
  });

  // Proses Kelas 11 dari sheet Asesmen (356 siswa)
  shAsesmen.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // sman10smg_11.1 -> 11.1
    let rombel = rawRombel.replace('sman10smg_', '').trim();
    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman10smg', emailCounts),
      'Password Awal': r.password || 'Jateng_10smg',
      Rombel: rombel,
      _username: r.username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 10 Semarang.xlsx');
  const outDrive = path.join(baseDir, '83. SMAN 10 Semarang', '[CLEAN_IMPORT] SMA Negeri 10 Semarang.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 10 Semarang selesai: ${count} siswa (Lengkap X, XI, XII tanpa penumpukan)`);
}

// ==========================================
// 2. SMAN 11 SEMARANG
// ==========================================
function processSMAN11() {
  console.log('\n>>> Memproses SMAN 11 Semarang...');
  const filePath = path.join(baseDir, '59. SMAN 11 Semarang', 'SMA Negeri 11 Semarang.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['SISWA']);
  const shAsesmen12 = xlsx.utils.sheet_to_json(wb.Sheets['Asesmen Kelas 12']);

  const emailCounts = {};
  [...shSiswa, ...shAsesmen12].forEach(r => {
    const em = (r.email || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    if (em) emailCounts[em] = (emailCounts[em] || 0) + 1;
  });

  const students = [];

  // Sheet SISWA (X & XI)
  shSiswa.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    let rombel = rawRombel.replace('sman11sem_', '').trim();
    if (rombel === '' || rombel === '_') rombel = 'Belum Ada Rombel';

    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman11sem', emailCounts),
      'Password Awal': r.password || 'Sman11sem_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  // Sheet Asesmen Kelas 12 (500 siswa)
  shAsesmen12.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'SMAN 11 SEM  XII-1 T' -> 'XII-1'
    let rombel = rawRombel.replace(/SMAN 11 SEM\s+/i, '').trim();
    if (!rombel) rombel = 'Belum Ada Rombel';

    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman11sem', emailCounts),
      'Password Awal': r.password || 'Sman11sem_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 11 Semarang.xlsx');
  const outDrive = path.join(baseDir, '59. SMAN 11 Semarang', '[CLEAN_IMPORT] SMA Negeri 11 Semarang.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 11 Semarang selesai: ${count} siswa (Email unik @belajarplus.com, Lengkap X, XI, XII)`);
}

// ==========================================
// 3. SMAN 1 TUNTANG
// ==========================================
function processSMAN1Tuntang() {
  console.log('\n>>> Memproses SMAN 1 Tuntang...');
  const filePath = path.join(baseDir, '81. SMAN 1 Tuntang', 'SMA Negeri 1 Tuntang.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  const shAsesmenX = xlsx.utils.sheet_to_json(wb.Sheets['Asesmen']);

  const emailCounts = {};
  [...shSiswa, ...shAsesmenX].forEach(r => {
    const em = (r.email || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    if (em) emailCounts[em] = (emailCounts[em] || 0) + 1;
  });

  const students = [];

  // Sheet Asesmen (Kelas X: 358 siswa)
  shAsesmenX.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'SMAN 1 Tuntang_X. 1' -> 'X.1'
    let rombel = rawRombel.replace('SMAN 1 Tuntang_', '').replace(/\s+/g, '').trim();
    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman1tun', emailCounts),
      'Password Awal': r.password || 'Sman1tun_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  // Sheet Siswa (XI & XII: 684 siswa)
  shSiswa.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'sman1tun_xi_xi.1' -> 'XI.1', 'sman1tun__' -> 'Belum Ada Rombel'
    let rombel = rawRombel;
    if (rawRombel === 'sman1tun__' || rawRombel === '') {
      rombel = 'Belum Ada Rombel';
    } else {
      rombel = rawRombel.replace('sman1tun_', '').replace('xi_xi.', 'XI.').replace('xii_xii.', 'XII.').trim();
    }

    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman1tun', emailCounts),
      'Password Awal': r.password || 'Sman1tun_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 1 Tuntang.xlsx');
  const outDrive = path.join(baseDir, '81. SMAN 1 Tuntang', '[CLEAN_IMPORT] SMA Negeri 1 Tuntang.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 1 Tuntang selesai: ${count} siswa (Gabung Kelas X dari Asesmen + XI + XII)`);
}

// ==========================================
// 4. SMA ISLAM SUDIRMAN AMBARAWA
// ==========================================
function processSudirmanAmbarawa() {
  console.log('\n>>> Memproses SMA Islam Sudirman Ambarawa...');
  const filePath = path.join(baseDir, '79. SMA Islam Sudirman Ambarawa', 'SMA Islam Sudirman Ambarawa.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);

  const students = [];

  // Hanya ambil baris yang punya nama riil dan kelas valid (buang 32 row dummy)
  shSiswa.forEach(r => {
    const nama = (r.Nama || '').toString().trim();
    const rombel = (r['Nama Kelas'] || '').toString().trim();
    const username = (r.username || '').toString().trim();

    // Skip jika nama kosong atau nama placeholder "Siswa 1157" dst
    if (!nama || nama.toLowerCase().startsWith('siswa ') || !rombel) {
      return;
    }

    students.push({
      Nama: nama,
      Email: `${username.toLowerCase()}@belajarplus.com`,
      'Password Awal': r.password || 'Issuda#2026',
      Rombel: rombel,
      _username: username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMA Islam Sudirman Ambarawa.xlsx');
  const outDrive = path.join(baseDir, '79. SMA Islam Sudirman Ambarawa', '[CLEAN_IMPORT] SMA Islam Sudirman Ambarawa.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMA Islam Sudirman Ambarawa selesai: ${count} siswa (100% siswa riil, 32 row dummy dibersihkan)`);
}

// ==========================================
// 5. SMAN 1 AMBARAWA
// ==========================================
function processSMAN1Ambarawa() {
  console.log('\n>>> Memproses SMAN 1 Ambarawa...');
  const filePath = path.join(baseDir, '78. SMAN 1 Ambarawa', 'SMA Negeri 1 Ambarawa.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['SISWA']);

  const emailCounts = {};
  shSiswa.forEach(r => {
    const em = (r.email || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    if (em) emailCounts[em] = (emailCounts[em] || 0) + 1;
  });

  const students = [];

  shSiswa.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'sman1amb_kelas10_x1' -> 'X.1', 'sman1amb__' -> 'Belum Ada Rombel'
    let rombel = rawRombel;
    if (rawRombel === 'sman1amb__' || rawRombel === '') {
      rombel = 'Belum Ada Rombel';
    } else {
      rombel = rawRombel
        .replace('sman1amb_kelas10_x', 'X.')
        .replace('sman1amb_kelas11_xi', 'XI.')
        .replace('sman1amb_kelas12_xii', 'XII.')
        .trim();
    }

    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman1amb', emailCounts),
      'Password Awal': r.password || 'Sman1amb_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 1 Ambarawa.xlsx');
  const outDrive = path.join(baseDir, '78. SMAN 1 Ambarawa', '[CLEAN_IMPORT] SMA Negeri 1 Ambarawa.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 1 Ambarawa selesai: ${count} siswa (36 Rombel X, XI, XII tertata rapi)`);
}

// ==========================================
// 6. SMAN 2 UNGARAN
// ==========================================
function processSMAN2Ungaran() {
  console.log('\n>>> Memproses SMAN 2 Ungaran...');
  const filePath = path.join(baseDir, '80. SMAN 2 Ungaran', 'SMA Negeri 2 Ungaran.xlsx');
  const wb = xlsx.readFile(filePath);
  const shSiswa = xlsx.utils.sheet_to_json(wb.Sheets['Siswa']);
  const shAsesmen12 = xlsx.utils.sheet_to_json(wb.Sheets['Asesmen']);

  const emailCounts = {};
  [...shSiswa, ...shAsesmen12].forEach(r => {
    const em = (r.email || '').toString().trim().toLowerCase().replace(/\s+/g, '');
    if (em) emailCounts[em] = (emailCounts[em] || 0) + 1;
  });

  const students = [];

  // Sheet Siswa (X & XI: 865 siswa)
  shSiswa.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'sman2ung_X 1' -> 'X.1', 'sman2ung_XI 1' -> 'XI.1'
    let rombel = rawRombel.replace('sman2ung_', '').replace(/\s+/g, '.').trim();
    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman2ung', emailCounts),
      'Password Awal': r.password || 'Sman2ung_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  // Sheet Asesmen (XII: 425 siswa)
  shAsesmen12.forEach(r => {
    let rawRombel = (r.lastname || '').trim();
    // 'SMAN2UNG_XII 1' -> 'XII.1'
    let rombel = rawRombel.replace(/SMAN2UNG_/i, '').replace(/\s+/g, '.').trim();
    students.push({
      Nama: (r.firstname || '').trim(),
      Email: cleanEmail(r.email, r.username, 'sman2ung', emailCounts),
      'Password Awal': r.password || 'Sman2ung_2026',
      Rombel: rombel,
      _username: r.username
    });
  });

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 2 Ungaran.xlsx');
  const outDrive = path.join(baseDir, '80. SMAN 2 Ungaran', '[CLEAN_IMPORT] SMA Negeri 2 Ungaran.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 2 Ungaran selesai: ${count} siswa (Gabung X + XI + XII dari Asesmen)`);
}

// ==========================================
// 7. SMAN 7 SEMARANG
// ==========================================
function processSMAN7Semarang() {
  console.log('\n>>> Memproses SMAN 7 Semarang...');
  const f1 = path.join(baseDir, '82. SMAN 7 Semarang', 'SMA Negeri 7 Semarang - bagian 1 dari 2.xlsx');
  const f2 = path.join(baseDir, '82. SMAN 7 Semarang', 'SMA Negeri 7 Semarang - bagian 2 dari 2.xlsx');

  const wb1 = xlsx.readFile(f1);
  const wb2 = xlsx.readFile(f2);

  const s1 = xlsx.utils.sheet_to_json(wb1.Sheets['Siswa']);
  const s2 = xlsx.utils.sheet_to_json(wb2.Sheets['Siswa']);

  const all = [...s1, ...s2];
  const students = all.map(r => ({
    Nama: r.Nama,
    Email: cleanEmail(r.Email, r.Nama, 'sman7sem', {}),
    'Password Awal': r['Password Awal'] || 'Sman7semar_2026',
    Rombel: r.Rombel,
    _username: r.Nama
  }));

  const { wb: cleanWb, count } = createBelajarPlusWorkbook(students);
  const outLocal = path.join(outputDir, '[CLEAN_IMPORT] SMAN 7 Semarang.xlsx');
  const outDrive = path.join(baseDir, '82. SMAN 7 Semarang', '[CLEAN_IMPORT] SMA Negeri 7 Semarang.xlsx');
  xlsx.writeFile(cleanWb, outLocal);
  xlsx.writeFile(cleanWb, outDrive);
  console.log(`✓ SMAN 7 Semarang selesai: ${count} siswa (Disatukan dari 2 bagian, email resmi sekolah @sman7semarang.sch.id)`);
}

// EXECUTE ALL
try {
  processSMAN10();
  processSMAN11();
  processSMAN1Tuntang();
  processSudirmanAmbarawa();
  processSMAN1Ambarawa();
  processSMAN2Ungaran();
  processSMAN7Semarang();
  console.log('\n🎉 SEMUA SEKOLAH BERHASIL DISANITASI DAN DISIMPAN KE GOOGLE DRIVE & LOCAL OUTPUT!');
} catch (err) {
  console.error('Error saat sanitasi:', err);
}
