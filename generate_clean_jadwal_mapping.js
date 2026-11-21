const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function generateCleanJadwal() {
  console.log('=== MEMPROSES PEMETAAN BERSIH JADWAL SMAN 11 PURWOREJO ===');

  // 1. Data mapping rombel
  const rombelMap = {
    'X.1': 'X-1',
    'X.2': 'X-2',
    'X.3': 'X-3',
    'X.4': 'X-4',
    'X.5': 'X-5',
    'XI.1': 'Kelas 11-1',
    'XI.2': 'Kelas 11-2',
    'XI.3': 'Kelas 11-3',
    'XI.4': 'Kelas 11-4',
    'XI.5': 'Kelas 11-5',
    'XII.1': 'Kelas 12-1',
    'XII.2': 'Kelas 12-2',
    'XII.3': 'Kelas 12-3',
    'XII.4': 'Kelas 12-4',
    'XII.5': 'Kelas 12-5'
  };

  // 2. Data mapping mapel resmi
  const mapelStandardMap = {
    'B. Indonesia': 'Bahasa Indonesia',
    'B. Inggris': 'Bahasa Inggris',
    'B. Inggris TL': 'Bahasa Inggris Tingkat Lanjut',
    'B. Jawa': 'Bahasa Jawa',
    'Biologi': 'Biologi',
    'Ekonomi': 'Ekonomi',
    'Fisika': 'Fisika',
    'Geografi': 'Geografi',
    'Informatika': 'Informatika',
    'Kimia': 'Kimia',
    'KKA / Kimia': 'Kimia / KKA',
    'Matematika': 'Matematika',
    'Matematika TL': 'Matematika Tingkat Lanjut',
    'PAIBP': 'Pendidikan Agama Islam dan Budi Pekerti',
    'PAKBP': 'Pendidikan Agama Kristen dan Budi Pekerti',
    'P. Pancasila': 'Pendidikan Pancasila',
    'Pendidikan Pancasila': 'Pendidikan Pancasila',
    'Penjasorkes': 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
    'Sejarah': 'Sejarah',
    'Sejarah TL': 'Sejarah Tingkat Lanjut',
    'Seni Budaya': 'Seni Budaya',
    'Sosiologi': 'Sosiologi'
  };

  // 3. Baca guru
  const teachers = JSON.parse(fs.readFileSync('all_29_teachers_purworejo11.json', 'utf8'));

  function findTeacher(namaString) {
    if (!namaString) return null;
    const cleanStr = namaString.toLowerCase().replace(/[^a-z]/g, '');
    for (const t of teachers) {
      const cleanT = t.nama.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanStr.includes(cleanT) || cleanT.includes(cleanStr)) {
        return t;
      }
    }
    // Coba match first word / last word
    const words = namaString.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    for (const w of words) {
      const found = teachers.find(t => t.nama.toLowerCase().includes(w));
      if (found) return found;
    }
    return null;
  }

  // 4. Baca file Jadwal SMAN 11 Purworejo
  const wbJadwal = new ExcelJS.Workbook();
  await wbJadwal.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');

  const ws = wbJadwal.getWorksheet('Jadwal Pelajaran');
  const headerRow = ws.getRow(5);
  const colClasses = [];
  for (let c = 4; c <= 18; c++) {
    const rawClass = headerRow.getCell(c).value;
    if (rawClass && rombelMap[rawClass]) {
      colClasses.push({ col: c, rawName: rawClass, platformName: rombelMap[rawClass] });
    }
  }

  const cleanScheduleList = [];
  let currentHari = '';

  for (let r = 6; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const hariCell = row.getCell(1).value;
    if (hariCell && typeof hariCell === 'string' && hariCell.trim() !== '') {
      currentHari = hariCell.trim();
    }
    const jamKe = row.getCell(2).value;
    const waktu = row.getCell(3).value;

    if (!jamKe || jamKe === 'Istirahat' || typeof jamKe !== 'number') continue;

    colClasses.forEach(cls => {
      const cellVal = row.getCell(cls.col).value;
      if (cellVal && typeof cellVal === 'string' && cellVal.trim() !== '' && cellVal !== 'UPACARA') {
        const lines = cellVal.split('\n').map(s => s.trim()).filter(Boolean);
        const guruRaw = lines[0] || '';
        let mapelRaw = lines[1] || '';
        if (mapelRaw.startsWith('(') && mapelRaw.endsWith(')')) {
          mapelRaw = mapelRaw.slice(1, -1);
        }

        const teacherInfo = findTeacher(guruRaw);
        const standardMapel = mapelStandardMap[mapelRaw] || mapelRaw;

        cleanScheduleList.push({
          hari: currentHari,
          jamKe: jamKe,
          waktu: String(waktu).trim(),
          rombelPlatform: cls.platformName,
          rombelAsli: cls.rawName,
          mapelAsli: mapelRaw,
          mapelStandar: standardMapel,
          guruJadwal: guruRaw,
          guruNamaLengkap: teacherInfo ? teacherInfo.nama : guruRaw,
          guruEmail: teacherInfo ? teacherInfo.email : 'belum_terdaftar@belajarplus.com',
          statusAkunGuru: teacherInfo ? teacherInfo.statusAkun : 'Belum Terdaftar'
        });
      }
    });
  }

  console.log(`Berhasil memetakan total ${cleanScheduleList.length} slot pembelajaran.`);

  // 5. Tulis ke file Excel Bersih
  const wbClean = new ExcelJS.Workbook();
  wbClean.creator = 'BelajarPlus Automation';
  wbClean.created = new Date();

  // Sheet 1: Master Jadwal Terstruktur
  const ws1 = wbClean.addWorksheet('Jadwal Terstruktur');
  ws1.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Hari', key: 'hari', width: 12 },
    { header: 'Jam Ke', key: 'jamKe', width: 10 },
    { header: 'Waktu KBM', key: 'waktu', width: 16 },
    { header: 'Rombel Platform', key: 'rombelPlatform', width: 18 },
    { header: 'Mata Pelajaran (Standar)', key: 'mapelStandar', width: 35 },
    { header: 'Nama Guru Pengampu', key: 'guruNama', width: 35 },
    { header: 'Email Akun Guru', key: 'guruEmail', width: 35 },
    { header: 'Status Akun Platform', key: 'statusAkun', width: 22 }
  ];

  ws1.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws1.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };

  cleanScheduleList.forEach((s, idx) => {
    ws1.addRow({
      no: idx + 1,
      hari: s.hari,
      jamKe: s.jamKe,
      waktu: s.waktu,
      rombelPlatform: s.rombelPlatform,
      mapelStandar: s.mapelStandar,
      guruNama: s.guruNamaLengkap,
      guruEmail: s.guruEmail,
      statusAkun: s.statusAkunGuru
    });
  });

  // Sheet 2: Daftar Rombel & Wali Kelas
  const ws2 = wbClean.addWorksheet('Daftar Rombel');
  ws2.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Nama Rombel di Platform', key: 'plat', width: 25 },
    { header: 'Nama di Jadwal Sekolah', key: 'jadwal', width: 25 },
    { header: 'Tingkat / Fase', key: 'tingkat', width: 18 }
  ];
  ws2.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws2.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D9488' } };

  Object.entries(rombelMap).forEach(([raw, plat], i) => {
    ws2.addRow({
      no: i + 1,
      plat: plat,
      jadwal: raw,
      tingkat: raw.startsWith('X.') ? 'Fase E (Kelas 10)' : (raw.startsWith('XI.') ? 'Fase F (Kelas 11)' : 'Fase F (Kelas 12)')
    });
  });

  // Sheet 3: Master Mata Pelajaran (22 Mapel)
  const ws3 = wbClean.addWorksheet('Master Mata Pelajaran');
  ws3.columns = [
    { header: 'No', key: 'no', width: 6 },
    { header: 'Nama Mata Pelajaran (Resmi)', key: 'nama', width: 40 },
    { header: 'Singkatan / Kode di Jadwal', key: 'kode', width: 30 }
  ];
  ws3.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws3.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7C3AED' } };

  Object.entries(mapelStandardMap).forEach(([kode, nama], i) => {
    ws3.addRow({ no: i + 1, nama, kode });
  });

  const outPathGDrive = 'G:\\My Drive\\Trainer\\B+\\Jadwal\\JADWAL_TERSTRUKTUR_SMAN_11_PURWOREJO_PLATFORM.xlsx';
  const outPathLocal = path.join(__dirname, 'JADWAL_TERSTRUKTUR_SMAN_11_PURWOREJO_PLATFORM.xlsx');

  await wbClean.xlsx.writeFile(outPathLocal);
  console.log('✔ File jadwal terstruktur lokal dibuat:', outPathLocal);

  await wbClean.xlsx.writeFile(outPathGDrive);
  console.log('✔ File jadwal terstruktur tersimpan di GDrive:', outPathGDrive);

  fs.writeFileSync('clean_schedule_slots.json', JSON.stringify(cleanScheduleList, null, 2));
}

generateCleanJadwal().catch(console.error);

