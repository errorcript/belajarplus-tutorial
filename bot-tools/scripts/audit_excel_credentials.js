const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const baseDir = 'G:/My Drive/Trainer/B+/AKUN';

const schools = [
  { folder: '19. SMA Budi Utomo Surakarta', file: '[CLEAN_IMPORT] SMA Budi Utomo Surakarta.xlsx' },
  { folder: '20. SMAN 1 Surakarta', file: '[CLEAN_IMPORT] SMAN 1 Surakarta.xlsx' },
  { folder: '21. SMAN 2 Surakarta', file: '[CLEAN_IMPORT] SMAN 2 Surakarta.xlsx' },
  { folder: '22. SMAN 3 Surakarta', file: '[CLEAN_IMPORT] SMAN 3 Surakarta.xlsx' },
  { folder: '23. SMAN 4 Surakarta', file: '[CLEAN_IMPORT] SMAN 4 Surakarta.xlsx' },
  { folder: '24. SMAN 5 Surakarta', file: '[CLEAN_IMPORT] SMAN 5 Surakarta.xlsx' },
  { folder: '25. SMAN 6 Surakarta', file: '[CLEAN_IMPORT] SMAN 6 Surakarta.xlsx' },
  { folder: '25b. SMAN 7 Surakarta', file: '[CLEAN_IMPORT] SMAN 7 Surakarta.xlsx' },
  { folder: '26. SMAN 8 Surakarta', file: '[CLEAN_IMPORT] SMAN 8 Surakarta.xlsx' },
  { folder: '27. SMAN 9 Surakarta', file: '[CLEAN_IMPORT] SMAN 9 Surakarta.xlsx' },
  { folder: '32. SMAN 1 Sragen', file: '[CLEAN_IMPORT] SMAN 1 Sragen.xlsx' },
  { folder: '33. SMAN 2 Sragen', file: '[CLEAN_IMPORT] SMAN 2 Sragen.xlsx' },
  { folder: '34. SMAN 3 Sragen', file: '[CLEAN_IMPORT] SMAN 3 Sragen.xlsx' },
  { folder: '35. SMAN 1 Gemolong', file: '[CLEAN_IMPORT] SMAN 1 Gemolong.xlsx' },
  { folder: '36. SMAN 1 Gondang', file: '[CLEAN_IMPORT] SMAN 1 Gondang.xlsx' },
  { folder: '37. SMAN 1 Sukodono', file: '[CLEAN_IMPORT] SMAN 1 Sukodono.xlsx' },
  { folder: '38. SMAN 1 Tangen', file: '[CLEAN_IMPORT] SMAN 1 Tangen.xlsx' }
];

console.log('AUDIT KREDENSIAL EXCEL 17 SEKOLAH:\n');
const results = [];

for (const sc of schools) {
  const filePath = path.join(baseDir, sc.folder, sc.file);
  if (!fs.existsSync(filePath)) {
    results.push({ folder: sc.folder, exists: false, total: 0, missingPwd: 0, missingEmail: 0, missingName: 0 });
    continue;
  }
  const wb = xlsx.readFile(filePath);
  const sheet = wb.Sheets['Siswa'] || wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  let missingName = 0;
  let missingEmail = 0;
  let missingPwd = 0;
  let samplePwd = '';

  rows.forEach((r, idx) => {
    const nama = r['Nama'] || r['nama'];
    const email = r['Email'] || r['email'];
    const pwd = r['Password Awal'] || r['password'] || r['Password'];
    if (!nama) missingName++;
    if (!email) missingEmail++;
    if (!pwd) missingPwd++;
    if (idx === 0) samplePwd = pwd;
  });

  results.push({
    folder: sc.folder,
    exists: true,
    total: rows.length,
    missingName,
    missingEmail,
    missingPwd,
    samplePwd
  });
}

console.table(results);
