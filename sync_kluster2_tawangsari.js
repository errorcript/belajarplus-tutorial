const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

async function syncKluster2() {
  const targetBaseDir = 'G:\\My Drive\\Trainer\\B+\\KLASTER 2 - JAWA TENGAH (BERKAS RESMI)\\05. SMAN 1 Tawangsari';
  const targetSiswaDir = path.join(targetBaseDir, '1. Akun Siswa');
  const targetPerRombelDir = path.join(targetSiswaDir, 'Per_Rombel');

  console.log('1. Checking target folders...');
  if (!fs.existsSync(targetBaseDir)) {
    throw new Error(`Target base directory does not exist: ${targetBaseDir}`);
  }
  if (!fs.existsSync(targetSiswaDir)) {
    fs.mkdirSync(targetSiswaDir, { recursive: true });
  }
  if (!fs.existsSync(targetPerRombelDir)) {
    fs.mkdirSync(targetPerRombelDir, { recursive: true });
  }

  // A. Copy PDF Distribution Files
  console.log('\n2. Copying updated PDF distribution files...');
  const pdfs = [
    '2_Daftar_Akun_Siswa_Per_Rombel_SMAN_1_Tawangsari.pdf',
    'Daftar_Akun_Siswa_Kelas_X_SMAN_1_Tawangsari.pdf',
    'Daftar_Akun_Siswa_Kelas_XI_SMAN_1_Tawangsari.pdf',
    'Daftar_Akun_Siswa_Kelas_XII_SMAN_1_Tawangsari.pdf'
  ];

  for (const pdf of pdfs) {
    if (fs.existsSync(pdf)) {
      const dest = path.join(targetSiswaDir, pdf);
      fs.copyFileSync(pdf, dest);
      const stat = fs.statSync(dest);
      console.log(`- Copied ${pdf} (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.warn(`- Warning: ${pdf} not found in workspace`);
    }
  }

  // B. Copy Dashboard HTML
  console.log('\n3. Copying interactive Dashboard HTML...');
  if (fs.existsSync('tws.html')) {
    const destHtml = path.join(targetBaseDir, 'Dashboard_Rekapitulasi_Rombel_SMAN_1_Tawangsari.html');
    fs.copyFileSync('tws.html', destHtml);
    console.log(`- Copied tws.html to ${destHtml}`);
  }

  // C. Generate Updated Per-Rombel Excel files & Master Excel
  console.log('\n4. Generating clean Per-Rombel Excel files...');
  const driveRows = JSON.parse(fs.readFileSync('tws_latest_students_parsed.json', 'utf8')).slice(1);
  
  // Terapkan revisi data resmi:
  const revisedStudents = [];
  for (const s of driveRows) {
    const email = (s.B || '').trim();
    if (email === 'sman1taw_siswa621@belajarplus.com') continue; // duplikat Herdha
    if (email === 'sman1taw_asesmen348@belajarplus.com') continue; // duplikat Dika
    if (email === 'fadilfadjrul22@gmail.com') continue; // Fadhil Muhammad Mahardika (merah di 11-10)

    if (email === 'fadhildzuljalilathasaputro@belajarplus.com') s.D = 'Kelas 12-6';
    if (email === 'rayyaalvaearlynurfaizah@belajarplus.com') s.D = 'Kelas 12-6';
    if (email === 'vanesyaanandaanastasia@belajarplus.com') s.D = 'Kelas 12-6';

    revisedStudents.push({
      nama: (s.A || '').trim(),
      email: (s.B || '').trim(),
      password: (s.C || '').trim(),
      rombel: (s.D || '').trim(),
      status: 'Aktif'
    });
  }

  // Kelompokkan per rombel
  const rombels = {};
  revisedStudents.forEach(st => {
    if (!rombels[st.rombel]) rombels[st.rombel] = [];
    rombels[st.rombel].push(st);
  });

  // Urutkan siswa per rombel alfabetis
  for (const r of Object.keys(rombels)) {
    rombels[r].sort((a, b) => a.nama.localeCompare(b.nama));
  }

  // Generate masing-masing file Excel di Per_Rombel
  for (const [rombelName, list] of Object.entries(rombels)) {
    const safeName = rombelName.replace(/\s+/g, '_');
    const fileName = `Akun_Siswa_${safeName}.xlsx`;
    const fullPath = path.join(targetPerRombelDir, fileName);

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(safeName);

    // Header styling
    ws.columns = [
      { header: 'No', key: 'no', width: 6 },
      { header: 'Nama', key: 'nama', width: 35 },
      { header: 'Email', key: 'email', width: 38 },
      { header: 'Password Awal', key: 'password', width: 18 },
      { header: 'Rombel', key: 'rombel', width: 15 },
      { header: 'Status', key: 'status', width: 12 }
    ];

    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }
    };
    ws.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    list.forEach((st, idx) => {
      const row = ws.addRow({
        no: idx + 1,
        nama: st.nama,
        email: st.email,
        password: st.password,
        rombel: st.rombel,
        status: st.status
      });
      row.alignment = { vertical: 'middle' };
      row.getCell('no').alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell('status').alignment = { vertical: 'middle', horizontal: 'center' };
    });

    await wb.xlsx.writeFile(fullPath);
    console.log(`- Created ${fileName}: ${list.length} siswa`);
  }

  // D. Generate Master Excel Bersih
  console.log('\n5. Creating Master Data Siswa Excel...');
  const masterWb = new ExcelJS.Workbook();
  const masterWs = masterWb.addWorksheet('Siswa');
  masterWs.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Nama', key: 'nama', width: 35 },
    { header: 'Email', key: 'email', width: 38 },
    { header: 'Password Awal', key: 'password', width: 18 },
    { header: 'Rombel', key: 'rombel', width: 15 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  masterWs.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  masterWs.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' }
  };

  revisedStudents.forEach((st, idx) => {
    masterWs.addRow({
      no: idx + 1,
      nama: st.nama,
      email: st.email,
      password: st.password,
      rombel: st.rombel,
      status: st.status
    });
  });

  const masterDest = path.join(targetSiswaDir, 'Master_Data_Siswa_SMAN_1_Tawangsari_REVISI_TERBARU.xlsx');
  await masterWb.xlsx.writeFile(masterDest);
  console.log(`- Master Data created at ${masterDest} (${revisedStudents.length} siswa)`);

  console.log('\n=== ALL KLUSTER 2 FILES SUCCESSFULLY UPDATED ===');
}

syncKluster2().catch(console.error);

