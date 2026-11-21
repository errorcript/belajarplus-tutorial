const fs = require('fs');

const slots = JSON.parse(fs.readFileSync('clean_schedule_slots.json', 'utf8'));

// 1. Rombel Map
const rombelMap = {
  'X-1': 'Kelas 10-1',
  'X-2': 'Kelas 10-2',
  'X-3': 'Kelas 10-3',
  'X-4': 'Kelas 10-4',
  'X-5': 'Kelas 10-5',
  'Kelas 11-1': 'Kelas 11-1',
  'Kelas 11-2': 'Kelas 11-2',
  'Kelas 11-3': 'Kelas 11-3',
  'Kelas 11-4': 'Kelas 11-4',
  'Kelas 11-5': 'Kelas 11-5',
  'Kelas 12-1': 'Kelas 12-1',
  'Kelas 12-2': 'Kelas 12-2',
  'Kelas 12-3': 'Kelas 12-3',
  'Kelas 12-4': 'Kelas 12-4',
  'Kelas 12-5': 'Kelas 12-5'
};

// 2. Day map
const dayMap = {
  'Senin': 1,
  'Selasa': 2,
  'Rabu': 3,
  'Kamis': 4,
  'Jumat': 5,
  'Sabtu': 6,
  'Minggu': 7
};

// 3. Mapel Map
const mapelMap = {
  'Bahasa Indonesia': 'BAHASA INDONESIA',
  'Bahasa Inggris': 'BAHASA INGGRIS',
  'Bahasa Inggris Tingkat Lanjut': 'Bahasa Inggris Tingkat Lanjut',
  'Bahasa Jawa': 'BAHASA JAWA',
  'Biologi': 'BIOLOGI',
  'Ekonomi': 'EKONOMI',
  'Fisika': 'FISIKA',
  'Geografi': 'GEOGRAFI',
  'Informatika': 'INFORMATIKA',
  'Kimia': 'KIMIA',
  'Kimia / KKA': 'KIMIA',
  'KKA': 'KKA',
  'Matematika': 'MATEMATIKA',
  'Matematika Tingkat Lanjut': 'Matematika Tingkat Lanjut',
  'Pendidikan Agama Islam dan Budi Pekerti': 'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Agama Kristen dan Budi Pekerti': 'Pendidikan Agama Kristen dan Budi Pekerti',
  'Pendidikan Jasmani, Olahraga, dan Kesehatan': 'PJOK',
  'Pendidikan Pancasila': 'Pendidikan Pancasila',
  'Sejarah': 'SEJARAH',
  'Sejarah Tingkat Lanjut': 'Sejarah Tingkat Lanjut',
  'Seni Budaya': 'SENI BUDAYA',
  'Sosiologi': 'SOSIOLOGI'
};

// 4. Guru Map
const guruMap = {
  'Ery Eka Pratiwi, S.Pd.': 'ERY EKA PRATIWI',
  'Muh. Chotib, S.Pd.I.': 'kangmuh_',
  'Swastika Dinar Kasih, S.Pd.': 'SWASTIKA DINAR KASIH',
  'Sinung Irmanto, S.E.': 'SINUNG IRMANTO',
  'Ari Artanto, S.Kom.': 'ARI ARTANTO',
  'Wahyudi, S.Th. / Wahyudiarto, S.Pd.': 'WAHYUDI',
  'Watiyah, S.Si.': 'Watiyah',
  'Esti Indriani, S.Pd.': 'ESTI INDRIANI',
  'Dwi Cahya Triana, S.Pd.': 'DWI CAHYA TRIANA',
  'Titik Buroidah, S.Pd.': 'TITIK BUROIDAH',
  'Desi Kusnendari, S.Si.': 'DESI KUSNENDARI',
  'Lindarti, S.Pd., M.Pd.Si.': 'LINDARTI',
  'Riyanto, S.Si.': 'RIYANTO',
  'Sri Yanawati, S.E.': 'SRI YANAWATI',
  'Dwi Nuraeni, S.Pd.': 'DWI NURAENI',
  'Dian Saputri, S.Pd.': 'Dian Saputri',
  'Mardono, S.Pd.': 'MARDONO',
  'Yuli Ponco Mawarni, S.H.': 'YULI PONCO MAWARNI',
  'Tri Sulistiawan, S.Pd.': 'Tri Sulistiawan',
  'Arty S. Isworo, S.Pd.': 'ARTY SULISTYANINGSIH ISWORO',
  'Minto Wibowo, S.Pd.': 'MINTO WIBOWO',
  'Hidayat Fauzi / Rahmat Fauzi Ramadhan': 'HIDAYAT FAUZI',
  'Unik Wiji Astuti, S.Pd.': 'UNIK WIJI ASTUTI',
  'Penta Lavida, S.Pd.': 'PENTA LAVIDA',
  'Furika Tri Jayanti, S.Pd.': 'FURIKA TRI JAYANTI',
  'Sunaryo, S.Pd., MM.Pd.': 'SUNARYO',
  'Nala Millatal Haq, S.Pd.': 'NALA MILLATAL HAQ'
};

// Bangun baris final
const finalRows = [];
let skippedNonMapel = 0;

for (let i = 0; i < slots.length; i++) {
  const s = slots[i];
  
  // Lewati slot pembiasaan atau tanpa mapel
  if (!s.mapelStandar || s.mapelStandar.trim() === '' || s.guruNamaLengkap === 'PEMBIASAAN JUMAT PAGI') {
    skippedNonMapel++;
    continue;
  }

  const rombel = rombelMap[s.rombelPlatform] || s.rombelPlatform;
  const dayOfWeek = dayMap[s.hari];
  
  // Format jam "07.50 - 08.30" -> start: "07:50", end: "08:30"
  const [startRaw, endRaw] = s.waktu.split('-').map(t => t.trim().replace('.', ':'));
  
  // Mapel
  const subject = mapelMap[s.mapelStandar];
  if (!subject) {
    console.error(`Unknown subject at slot ${i}:`, s.mapelStandar);
  }

  // Khusus Pak Rahmat Fauzi Ramadhan:
  let teacher = guruMap[s.guruNamaLengkap];
  if (s.guruJadwal === 'Rahmat Fauzi' || (s.guruNamaLengkap.includes('Rahmat') && s.mapelStandar.includes('KKA'))) {
    teacher = 'RAHMAT FAUZI RAMADHAN';
  }

  if (!teacher) {
    console.error(`Unknown teacher at slot ${i}:`, s.guruNamaLengkap);
  }

  finalRows.push({
    row: finalRows.length + 2,
    rombel,
    dayOfWeek,
    start: startRaw,
    end: endRaw,
    subject,
    activity: '',
    teacher
  });
}

console.log(`Total slots processed: ${slots.length}`);
console.log(`Skipped non-mapel: ${skippedNonMapel}`);
console.log(`Final ready schedule rows: ${finalRows.length}`);

fs.writeFileSync('final_schedule_rows.json', JSON.stringify(finalRows, null, 2));
console.log('Saved final_schedule_rows.json');

