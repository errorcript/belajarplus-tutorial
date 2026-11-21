const ExcelJS = require('exceljs');
const fs = require('fs');

async function compareJadwalWithPlatformMaster() {
  // 1. Baca Master Asli Guru & Kelas
  const wbMaster = new ExcelJS.Workbook();
  await wbMaster.xlsx.readFile('C:\\Users\\errorscript\\Downloads\\Data Akun\\37. SMA Negeri 11 Purworejo\\SMA Negeri 11 Purworejo.xlsx');

  const masterTeachers = [];
  const wsGuruMaster = wbMaster.getWorksheet('Guru');
  wsGuruMaster.eachRow((row, r) => {
    if (r >= 2) {
      const username = row.getCell(1).value;
      const nama = row.getCell(2).value;
      const role = row.getCell(3).value;
      const email = row.getCell(4).value;
      if (nama) {
        masterTeachers.push({
          username,
          nama: String(nama).trim(),
          role,
          email: String(email).trim()
        });
      }
    }
  });

  const masterClassesPhaseE = [];
  const wsKelasMaster = wbMaster.getWorksheet('Kelas');
  wsKelasMaster.eachRow((row, r) => {
    if (r >= 2) {
      const name = row.getCell(1).value;
      if (name) masterClassesPhaseE.push(String(name).trim());
    }
  });

  // 2. Baca Clean Import Kelas 11 dan 12 (Update Terbaru 4 Nov)
  const wbClean = new ExcelJS.Workbook();
  await wbClean.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\AKUN\\03. SMAN 11 Purworejo\\[CLEAN_IMPORT] SMAN 11 Purworejo_Kelas11_dan_12.xlsx');
  const wsCleanSiswa = wbClean.getWorksheet('Siswa');
  const cleanRombels = new Set();
  wsCleanSiswa.eachRow((row, r) => {
    if (r >= 2) {
      const rombel = row.getCell(4).value;
      if (rombel) cleanRombels.add(String(rombel).trim());
    }
  });

  // 3. Baca Jadwal SMAN 11 Purworejo Excel
  const wbJadwal = new ExcelJS.Workbook();
  await wbJadwal.xlsx.readFile('G:\\My Drive\\Trainer\\B+\\Jadwal\\jadwal sman 11 purworejo.xlsx');

  const wsJadwalGuru = wbJadwal.getWorksheet('Daftar Guru & Mapel');
  const jadwalTeachers = [];
  wsJadwalGuru.eachRow((row, r) => {
    if (r >= 4) {
      const kode = row.getCell(1).value;
      const nama = row.getCell(2).value;
      const mapel = row.getCell(3).value;
      const kelas = row.getCell(4).value;
      if (kode || nama) {
        jadwalTeachers.push({
          kode,
          namaLengkap: String(nama || '').trim(),
          mapel: String(mapel || '').trim(),
          kelas: String(kelas || '').trim()
        });
      }
    }
  });

  // Rombel di sheet Jadwal Pelajaran
  const wsJadwalPelajaran = wbJadwal.getWorksheet('Jadwal Pelajaran');
  const rowHeader = wsJadwalPelajaran.getRow(5);
  const jadwalRombels = [];
  for (let c = 4; c <= 18; c++) {
    const val = rowHeader.getCell(c).value;
    if (val) jadwalRombels.push(String(val).trim());
  }

  // 4. Analisis Match Guru
  // Nama di jadwal sering ada gelar (S.Pd., S.Si., M.Pd.Si., dll) atau singkatan
  function cleanName(n) {
    return n.toLowerCase()
      .replace(/,\s*[a-z.\s]+/gi, '') // hapus gelar di belakang koma
      .replace(/\./g, '')
      .replace(/s\.pd|s\.si|m\.pd|s\.h|s\.e|s\.th|s\.kom|s\.pd\.i/gi, '')
      .replace(/dr\.|drs\.|dra\./gi, '')
      .trim();
  }

  const teacherMatching = jadwalTeachers.map(jt => {
    const cleanedJt = cleanName(jt.namaLengkap);
    const matched = masterTeachers.find(mt => {
      const cleanedMt = cleanName(mt.nama);
      return cleanedMt.includes(cleanedJt) || cleanedJt.includes(cleanedMt);
    });

    return {
      kode: jt.kode,
      namaJadwal: jt.namaLengkap,
      mapelJadwal: jt.mapel,
      matchedInPlatform: !!matched,
      platformTeacher: matched || null
    };
  });

  const matchedTeachersCount = teacherMatching.filter(t => t.matchedInPlatform).length;
  const missingTeachersInPlatform = teacherMatching.filter(t => !t.matchedInPlatform);

  const report = {
    totalMasterTeachersInPlatform: masterTeachers.length,
    masterTeachersList: masterTeachers.map(t => `${t.nama} (${t.email})`),
    totalTeachersInJadwal: jadwalTeachers.length,
    matchedTeachersCount,
    missingTeachersInPlatformCount: missingTeachersInPlatform.length,
    missingTeachersInPlatform: missingTeachersInPlatform.map(t => ({
      kode: t.kode,
      nama: t.namaJadwal,
      mapel: t.mapelJadwal
    })),
    rombelsInJadwal: jadwalRombels,
    rombelsInPlatformMaster: {
      phaseE: masterClassesPhaseE,
      phaseF_CleanImport: [...cleanRombels]
    }
  };

  fs.writeFileSync('comparison_jadwal_vs_platform.json', JSON.stringify(report, null, 2));
  console.log('=== HASIL AUDIT KOMPARASI JADWAL VS PLATFORM MASTER ===');
  console.log(`1. Total Guru di Platform Master : ${masterTeachers.length}`);
  console.log(`2. Total Guru di Jadwal Excel     : ${jadwalTeachers.length}`);
  console.log(`3. Guru Cocok / Sudah Ada Akun   : ${matchedTeachersCount}`);
  console.log(`4. Guru Belum Ada di Master      : ${missingTeachersInPlatform.length}`);
  console.log('\nGuru yang belum ada di Platform:');
  missingTeachersInPlatform.forEach(t => console.log(`   - Kode ${t.kode}: ${t.nama} (${t.mapel})`));

  console.log('\n5. Rombel di Jadwal vs Platform:');
  console.log('   Jadwal  :', jadwalRombels.join(', '));
  console.log('   Platform:', [...masterClassesPhaseE, ...cleanRombels].join(', '));
}

compareJadwalWithPlatformMaster().catch(console.error);

