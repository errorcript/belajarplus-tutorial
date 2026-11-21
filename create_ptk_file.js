const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function createPtkImportFile() {
  console.log('=== MEMBUAT BERKAS IMPOR PTK 10 GURU SMAN 11 PURWOREJO ===');

  const teachers = [
    { nama: 'Minto Wibowo, S.Pd.', email: 'sman11pwr_guru19@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Sejarah / Sejarah TL' },
    { nama: 'Riyanto, S.Si.', email: 'sman11pwr_guru20@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Matematika Wajib' },
    { nama: 'Sri Yanawati, S.E.', email: 'sman11pwr_guru21@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Ekonomi / IPS Ekonomi' },
    { nama: 'Sunaryo, S.Pd., MM.Pd.', email: 'sman11pwr_guru22@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Bahasa Inggris Wajib' },
    { nama: 'Desi Kusnendari, S.Si.', email: 'sman11pwr_guru23@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Matematika Wajib / Mat TL' },
    { nama: 'Unik Wiji Astuti, S.Pd.', email: 'sman11pwr_guru24@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Matematika Tingkat Lanjut' },
    { nama: 'Wahyudi, S.Th. / Wahyudiarto, S.Pd.', email: 'sman11pwr_guru25@belajarplus.com', pass: 'Purworejo2026!', mapel: 'PAKBP / Agama Kristen' },
    { nama: 'Esti Indriani, S.Pd.', email: 'sman11pwr_guru26@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Ekonomi' },
    { nama: 'Furika Tri Jayanti, S.Pd.', email: 'sman11pwr_guru27@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Bahasa Indonesia' },
    { nama: 'Dwi Cahya Triana, S.Pd.', email: 'sman11pwr_guru28@belajarplus.com', pass: 'Purworejo2026!', mapel: 'Bahasa Inggris Wajib' }
  ];

  const wb = new ExcelJS.Workbook();
  wb.creator = 'BelajarPlus Automation System';
  wb.created = new Date();

  // Sheet 1: PTK
  const wsPtk = wb.addWorksheet('PTK');
  wsPtk.columns = [
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 35 },
    { header: 'Password (opsional, min. 8)', key: 'pass', width: 25 },
    { header: 'Jadikan Guru (Ya/Tidak)', key: 'guru', width: 25 }
  ];

  // Header style
  wsPtk.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  wsPtk.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E40AF' } // Blue BelajarPlus
  };
  wsPtk.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  teachers.forEach(t => {
    const row = wsPtk.addRow({
      nama: t.nama,
      email: t.email,
      pass: t.pass,
      guru: 'Ya'
    });
    row.alignment = { vertical: 'middle' };
  });

  // Sheet 2: Panduan
  const wsPanduan = wb.addWorksheet('Panduan');
  wsPanduan.columns = [
    { header: 'Kolom', key: 'kolom', width: 30 },
    { header: 'Keterangan', key: 'ket', width: 60 }
  ];
  wsPanduan.getRow(1).font = { bold: true };
  wsPanduan.addRow({ kolom: 'Nama', ket: 'Nama lengkap PTK beserta gelar akademik' });
  wsPanduan.addRow({ kolom: 'Email', ket: 'Wajib unik. Akun baru dengan domain @belajarplus.com' });
  wsPanduan.addRow({ kolom: 'Password (opsional, min. 8)', ket: 'Password awal (min. 8 karakter) agar akun langsung aktif' });
  wsPanduan.addRow({ kolom: 'Jadikan Guru (Ya/Tidak)', ket: 'Wajib diisi "Ya" agar langsung terdaftar sebagai Dewan Guru' });

  // Simpan file
  const localPath = path.join(__dirname, '[IMPOR_PTK]_SMAN_11_Purworejo_10_Guru.xlsx');
  const gDriveDir = 'G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo';
  const gDrivePath = path.join(gDriveDir, '[IMPOR_PTK]_SMAN_11_Purworejo_10_Guru.xlsx');

  await wb.xlsx.writeFile(localPath);
  console.log('✔ File lokal berhasil dibuat:', localPath);

  if (fs.existsSync(gDriveDir)) {
    await wb.xlsx.writeFile(gDrivePath);
    console.log('✔ File Google Drive berhasil disimpan:', gDrivePath);
  }

  // Simpan juga JSON data lengkap 29 guru (19 lama + 10 baru)
  const all29Teachers = [
    { kode: 1, nama: 'Minto Wibowo, S.Pd.', email: 'sman11pwr_guru19@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 3, nama: 'Lindarti, S.Pd., M.Pd.Si.', email: 'lindarti56@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 4, nama: 'Riyanto, S.Si.', email: 'sman11pwr_guru20@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 5, nama: 'Yuli Ponco Mawarni, S.H.', email: 'yulimawarni15@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 7, nama: 'Mardono, S.Pd.', email: 'mardono22@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 8, nama: 'Sinung Irmanto, S.E.', email: 'sinungirmanto27@guru.smk.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 9, nama: 'Sri Yanawati, S.E.', email: 'sman11pwr_guru21@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 10, nama: 'Sunaryo, S.Pd., MM.Pd.', email: 'sman11pwr_guru22@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 11, nama: 'Desi Kusnendari, S.Si.', email: 'sman11pwr_guru23@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 12, nama: 'Unik Wiji Astuti, S.Pd.', email: 'sman11pwr_guru24@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 13, nama: 'Tri Sulistiawan, S.Pd.', email: 'tri7017@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 14, nama: 'Wahyudi, S.Th. / Wahyudiarto, S.Pd.', email: 'sman11pwr_guru25@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 15, nama: 'Hidayat Fauzi / Rahmat Fauzi Ramadhan', email: 'hidayatfauzi40@gmail.com', statusAkun: 'Sudah Ada' },
    { kode: 16, nama: 'Esti Indriani, S.Pd.', email: 'sman11pwr_guru26@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 17, nama: 'Furika Tri Jayanti, S.Pd.', email: 'sman11pwr_guru27@belajarplus.com', statusAkun: 'Baru Didaftarkan' },
    { kode: 18, nama: 'Ery Eka Pratiwi, S.Pd.', email: 'erypratiwi47@guru.smk.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 19, nama: 'Dwi Nuraeni, S.Pd.', email: 'dwinuraeni72@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 20, nama: 'Swastika Dinar Kasih, S.Pd.', email: 'swastikakasih10@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 21, nama: 'Dian Saputri, S.Pd.', email: 'diansaputri95@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 22, nama: 'Arty S. Isworo, S.Pd.', email: 'artyisworo09@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 23, nama: 'Muh. Chotib, S.Pd.I.', email: 'muhchotib51@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 24, nama: 'Dian Saputri, S.Pd. / Eri Eka', email: 'diansaputri95@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 25, nama: 'Titik Buroidah, S.Pd.', email: 'titik.buroidah8@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 26, nama: 'Watiyah, S.Si.', email: 'watiyah.156@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 27, nama: 'Penta Lavida, S.Pd.', email: 'penta.lavida17@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 28, nama: 'Nala Millatal Haq, S.Pd.', email: 'nalamillatalhaq@gmail.com', statusAkun: 'Sudah Ada' },
    { kode: 29, nama: 'Ari Artanto, S.Kom.', email: 'ariartanto35@guru.sma.belajar.id', statusAkun: 'Sudah Ada' },
    { kode: 30, nama: 'Hidayat Fauzi, S.Pd.', email: 'hidayatfauzi40@gmail.com', statusAkun: 'Sudah Ada' },
    { kode: 31, nama: 'Dwi Cahya Triana, S.Pd.', email: 'sman11pwr_guru28@belajarplus.com', statusAkun: 'Baru Didaftarkan' }
  ];

  fs.writeFileSync('all_29_teachers_purworejo11.json', JSON.stringify(all29Teachers, null, 2));
  console.log('✔ Mapping lengkap 29 Guru tersimpan di all_29_teachers_purworejo11.json');
}

createPtkImportFile().catch(console.error);

