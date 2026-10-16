const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const baseDir = 'G:/My Drive/Trainer/B+/AKUN';
const tmplPath = 'C:/Users/errorscript/.gemini/antigravity-ide/scratch/template_resmi_belajarplus.xlsx';

const schools = [
  // Surakarta
  { name: 'SMAN 3 Surakarta', folder: '22. SMAN 3 Surakarta', files: ['SMA Negeri 3 Surakarta.xlsx'], prefix: 'sman3solo' },
  { name: 'SMAN 1 Surakarta', folder: '20. SMAN 1 Surakarta', files: ['SMA Negeri 1 Surakarta.xlsx'], prefix: 'sman1solo' },
  { name: 'SMAN 6 Surakarta', folder: '25. SMAN 6 Surakarta', files: ['SMA Negeri 6 Surakarta - bagian 1 dari 2.xlsx', 'SMA Negeri 6 Surakarta - bagian 2 dari 2.xlsx'], prefix: 'sman6solo' },
  { name: 'SMAN 7 Surakarta', folder: '25b. SMAN 7 Surakarta', files: ['SMA Negeri 7 Surakarta.xlsx'], prefix: 'sman7solo', isDummy: true },
  { name: 'SMAN 5 Surakarta', folder: '24. SMAN 5 Surakarta', files: ['SMA Negeri 5 Surakarta.xlsx'], prefix: 'sman5solo' },
  { name: 'SMAN 8 Surakarta', folder: '26. SMAN 8 Surakarta', files: ['SMAN 8 Surakarta - bagian 1 dari 2.xlsx', 'SMAN 8 Surakarta - bagian 2 dari 2.xlsx'], prefix: 'sman8solo' },
  { name: 'SMAN 4 Surakarta', folder: '23. SMAN 4 Surakarta', files: ['SMA Negeri 4 Surakarta - bagian 1 dari 2.xlsx', 'SMA Negeri 4 Surakarta - bagian 2 dari 2.xlsx'], prefix: 'sman4solo' },
  { name: 'SMAN 9 Surakarta', folder: '27. SMAN 9 Surakarta', files: ['SMA Negeri 9 Surakarta.xlsx'], prefix: 'sman9solo' },
  { name: 'SMAN 2 Surakarta', folder: '21. SMAN 2 Surakarta', files: ['SMA Negeri 2 Surakarta.xlsx'], prefix: 'sman2solo' },
  { name: 'SMA Budi Utomo Surakarta', folder: '19. SMA Budi Utomo Surakarta', files: ['SMA Budi Utomo Surakarta.xlsx'], prefix: 'smabudisolo' },
  // Sragen
  { name: 'SMAN 3 Sragen', folder: '34. SMAN 3 Sragen', files: ['SMA Negeri 3 Sragen.xlsx'], prefix: 'sman3sra' },
  { name: 'SMAN 1 Tangen', folder: '38. SMAN 1 Tangen', files: ['SMA NEGERI 1 TANGEN.xlsx'], prefix: 'sman1tan' },
  { name: 'SMAN 2 Sragen', folder: '33. SMAN 2 Sragen', files: ['SMA Negeri 2 Sragen.xlsx'], prefix: 'sman2sra', isDummy: true },
  { name: 'SMAN 1 Sukodono', folder: '37. SMAN 1 Sukodono', files: ['SMA Negeri 1 Sukodono.xlsx'], prefix: 'sman1suk' },
  { name: 'SMAN 1 Gemolong', folder: '35. SMAN 1 Gemolong', files: ['SMA Negeri 1 Gemolong.xlsx'], prefix: 'sman1gem' },
  { name: 'SMAN 1 Sragen', folder: '32. SMAN 1 Sragen', files: ['SMA Negeri 1 Sragen.xlsx'], prefix: 'sman1sra' },
  { name: 'SMAN 1 Gondang', folder: '36. SMAN 1 Gondang', files: ['SMA Negeri 1 Gondang.xlsx'], prefix: 'sman1gon', hasGuru: true }
];

console.log('=== MEMULAI GENERASI MASTER CLEAN IMPORT 17 SEKOLAH ===\n');

const tmplWb = xlsx.readFile(tmplPath);
const panduanSheet = tmplWb.Sheets['Panduan'];

const sanitizationReport = [];

for (const sc of schools) {
  const folderPath = path.join(baseDir, sc.folder);
  if (!fs.existsSync(folderPath)) {
    console.log(`Folder tidak ditemukan: ${folderPath}`);
    continue;
  }

  const allRawRows = [];
  let rawGuruRows = [];

  for (const f of sc.files) {
    const p = path.join(folderPath, f);
    if (!fs.existsSync(p)) continue;
    const wb = xlsx.readFile(p);
    
    // Ambil sheet Siswa
    const sName = wb.SheetNames.find(s => /siswa|student/i.test(s)) || wb.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[sName]);
    allRawRows.push(...rows);

    // Ambil sheet Guru jika ada
    const gName = wb.SheetNames.find(s => /guru|ptk|teacher/i.test(s));
    if (gName) {
      const gRows = xlsx.utils.sheet_to_json(wb.Sheets[gName]);
      rawGuruRows.push(...gRows);
    }
  }

  // Sanitasi Siswa
  const cleanStudents = allRawRows.map((r, idx) => {
    const rawName = (r.Nama || r.nama || r.firstname || `Siswa ${idx + 1}`).toString().trim().toUpperCase();
    let email = (r.Email || r.email || '').toString().trim().toLowerCase();
    let pass = (r['Password Awal'] || r.Password || r.password || `${sc.prefix}_1234`).toString().trim();
    let rombel = (r.Rombel || r.rombel || r.Kelas || r.kelas || r.lastname || 'Kelas Umum').toString().trim();

    // Normalisasi email jika kosong, dummy pesonaedu, atau ada spasi
    if (!email || email.includes(' ') || email.includes('pesonaedu.com') || sc.isDummy) {
      email = `${sc.prefix}_siswa${idx + 1}@belajarplus.com`;
    }

    // Bersihkan rombel dummy seperti sman7sura__ atau sman2sragen__
    if (rombel.endsWith('__')) {
      rombel = 'Kelas Umum';
    }

    return {
      Nama: rawName,
      Email: email,
      'Password Awal': pass,
      Rombel: rombel
    };
  });

  // Tulis berkas Clean Siswa
  const outWb = xlsx.utils.book_new();
  const siswaSheet = xlsx.utils.json_to_sheet(cleanStudents, {
    header: ['Nama', 'Email', 'Password Awal', 'Rombel']
  });
  xlsx.utils.book_append_sheet(outWb, siswaSheet, 'Siswa');
  if (panduanSheet) {
    xlsx.utils.book_append_sheet(outWb, panduanSheet, 'Panduan');
  }

  const outFileName = `[CLEAN_IMPORT] ${sc.name}.xlsx`;
  const outPath = path.join(folderPath, outFileName);
  xlsx.writeFile(outWb, outPath);

  // Jika ada Guru riil (seperti di SMAN 1 Gondang)
  let cleanGuruCount = 0;
  if (sc.hasGuru && rawGuruRows.length > 0) {
    const cleanTeachers = rawGuruRows.map((g, idx) => {
      const rawName = (g.Nama || g.nama || g.firstname || `Guru ${idx + 1}`).toString().trim();
      let email = (g.Email || g.email || '').toString().trim().toLowerCase();
      let pass = (g['Password Awal'] || g.Password || g.password || `${sc.prefix}_guru123`).toString().trim();
      let mapel = (g['Mata Pelajaran'] || g.mapel || '').toString().trim();

      if (!email || email.includes(' ') || email.includes('pesonaedu.com')) {
        email = `${sc.prefix}_guru${idx + 1}@belajarplus.com`;
      }

      return {
        Nama: rawName,
        Email: email,
        'Password Awal': pass,
        'Mata Pelajaran': mapel
      };
    });

    const outGuruWb = xlsx.utils.book_new();
    const guruSheet = xlsx.utils.json_to_sheet(cleanTeachers);
    xlsx.utils.book_append_sheet(outGuruWb, guruSheet, 'Guru');
    if (panduanSheet) {
      xlsx.utils.book_append_sheet(outGuruWb, panduanSheet, 'Panduan');
    }
    const outGuruPath = path.join(folderPath, `[CLEAN_IMPORT_GURU] ${sc.name}.xlsx`);
    xlsx.writeFile(outGuruWb, outGuruPath);
    cleanGuruCount = cleanTeachers.length;
  }

  const rombels = Array.from(new Set(cleanStudents.map(s => s.Rombel)));
  console.log(`✓ ${sc.name}: ${cleanStudents.length} Siswa, ${rombels.length} Rombel, ${cleanGuruCount} Guru => ${outFileName}`);

  sanitizationReport.push({
    name: sc.name,
    totalSiswa: cleanStudents.length,
    totalRombel: rombels.length,
    totalGuru: cleanGuruCount,
    isDummy: !!sc.isDummy,
    file: outFileName
  });
}

console.log('\n======================================================');
console.log('REKAPITULASI MASTER CLEAN IMPORT 17 SEKOLAH:');
console.table(sanitizationReport);
console.log('======================================================');
