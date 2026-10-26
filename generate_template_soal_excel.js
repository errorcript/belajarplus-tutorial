const XLSX = require('xlsx');
const path = require('path');

// 1. Data Sheet Petunjuk
const petunjukData = [
  ['PANDUAN & PETUNJUK RESMI TEMPLATE PEMBUATAN SOAL GURU - BELAJARPLUS CBT/LJD'],
  ['Platform Pembelajaran & Asesmen Digital Kurikulum Merdeka (Tahun Ajaran 2026/2027)'],
  [],
  ['KODE TIPE SOAL', 'NAMA TIPE SOAL', 'CARA PENULISAN KUNCI JAWABAN', 'MEKANISME PENILAIAN SISTEM'],
  ['MCQ', 'Pilihan Ganda Tunggal', 'Cukup ketik satu huruf kapital (A / B / C / D / E)', 'Koreksi otomatis instan (Auto-scoring 100%)'],
  ['MCMA', 'Pilihan Ganda Kompleks (Multi-Jawaban)', 'Daftar huruf dipisahkan koma tanpa spasi, contoh: A,C,D', 'Koreksi otomatis instan proporsional'],
  ['PGK', 'Kategori Benar / Salah (Matriks)', 'Status B atau S per baris pernyataan dipisahkan titik koma, contoh: B;S;S', 'Koreksi otomatis per baris pernyataan'],
  ['MATCH', 'Menjodohkan (Matching Pair)', 'Pasangan angka-huruf dipisahkan titik koma, contoh: 1-B;2-A;3-D;4-C', 'Koreksi otomatis sesuai pasangan premis-konsep'],
  ['ESSAY', 'Uraian Singkat / Esai Analisis', 'Ketikkan kalimat kunci jawaban acuan guru di kolom Kunci Jawaban', 'Dinilai otomatis oleh AI Grader berdasarkan kemiripan semantik rubrik'],
  ['UPLOAD', 'Unggah Berkas Tugas / LKPD Praktikum', 'Tuliskan [Manual Grading oleh Guru] di kolom Kunci Jawaban', 'Guru memeriksa berkas (PDF/Word/JPG <= 10MB) dan input nilai di /admin/submissions'],
  [],
  ['PANDUAN PENULISAN FORMULA MATEMATIKA / SAINS (LATEX)'],
  ['Bentuk Rumus', 'Contoh Sintaks Penulisan di Teks Soal / Opsi', 'Tampilan di Lembar Siswa'],
  ['Pecahan Aljabar', '$f(x) = \\frac{2x^2 + 5x}{x - 3}$', 'Pecahan vertikal rapi'],
  ['Akar & Pangkat', '$\\sqrt{x^2 + y^2} = r$', 'Akar matematika rapi'],
  ['Reaksi Kimia', '$\\text{2H}_2 + \\text{O}_2 \\rightarrow \\text{2H}_2\\text{O}$', 'Formula reaksi kimia standar'],
  ['Integral & Limit', '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$', 'Notasi kalkulus standar'],
  [],
  ['ATURAN PENTING & INTEGRITAS DATA'],
  ['1. Bobot Skor', 'Gunakan bilangan bulat integer (1, 2, 3, 5, 10). Hindari pecahan manual (seperti 0.33) agar tidak terjadi anomali pembulatan pada kartu metrik ringkasan.'],
  ['2. Rubrik Esai AI', 'Pada kolom rubrik_atau_pembahasan, pisahkan frasa konsep penting menggunakan garis tegak (|). Contoh: fotosintesis | klorofil | glukosa | oksigen'],
  ['3. Format Gambar', 'Jika soal menggunakan gambar, tuliskan nama filenya (misal: gambar_soal_1.png). Ukuran gambar maksimal 2 MB format PNG/JPG.'],
  ['4. Karakter Pemisah', 'Jangan menggunakan koma di dalam opsi pernyataan PGK atau MATCH; gunakan titik koma (;) sebagai pembatas antar entri.']
];

// 2. Data Sheet Template Soal
const templateSoalData = [
  [
    'nomor_soal',
    'tipe_soal',
    'capaian_pembelajaran',
    'stimulus_teks',
    'stimulus_media',
    'pertanyaan',
    'opsi_a',
    'opsi_b',
    'opsi_c',
    'opsi_d',
    'opsi_e',
    'kunci_jawaban',
    'bobot_skor',
    'rubrik_atau_pembahasan'
  ],
  [
    1,
    'MCQ',
    'Biologi Sel',
    '',
    '',
    'Organel sel yang berperan sebagai tempat berlangsungnya respirasi seluler untuk menghasilkan energi (ATP) adalah...',
    'Ribosom',
    'Mitokondria',
    'Badan Golgi',
    'Retikulum Endoplasma',
    'Lisosom',
    'B',
    1,
    'Mitokondria merupakan the powerhouse of cell yang memproduksi ATP melalui respirasi seluler aerob.'
  ],
  [
    2,
    'MCQ',
    'Literasi Bahasa Indonesia',
    'Kementerian Lingkungan Hidup mencatat timbulan sampah plastik nasional mencapai 19% dari total timbulan sampah. Inisiatif ekonomi sirkular dan substitusi kemasan ramah lingkungan mulai digalakkan di 15 kota percontohan.',
    '',
    'Gagasan pokok wacana di atas adalah...',
    'Kenaikan produksi plastik di pabrik kemasan',
    'Peningkatan jumlah sampah plastik dan upaya penanggulangannya',
    'Kegagalan proyek kota percontohan nasional',
    'Larangan total penggunaan botol plastik air mineral',
    'Penurunan konsumsi kemasan plastik di pasar tradisional',
    'B',
    1,
    'Gagasan utama mencakup data timbulan 19% dan upaya solutif ekonomi sirkular.'
  ],
  [
    3,
    'MCMA',
    'Perubahan Materi Fisika-Kimia',
    '',
    '',
    'Manakah di antara peristiwa berikut yang merupakan perubahan fisika? (Pilih semua jawaban yang benar)',
    'Es batu mencair di suhu ruang',
    'Besi pagar rumah mengalami perkaratan',
    'Pelarutan sendok gula ke dalam air teh hangat',
    'Kertas buku terbakar menjadi abu hitam',
    'Lilin batang meleleh saat sumbu dinyalakan',
    'A,C,E',
    3,
    'Perubahan fisika tidak menghasilkan zat baru: mencair (A), melarut (C), meleleh (E).'
  ],
  [
    4,
    'MCMA',
    'Pancasila & Kewarganegaraan',
    'Sila Persatuan Indonesia mengamanatkan persatuan di tengah keanekaragaman suku, agama, dan budaya nusantara.',
    '',
    'Sikap yang mencerminkan pengamalan sila ketiga Pancasila dalam kehidupan sekolah adalah...',
    'Mengutamakan kepentingan kelompok kedaerahan saat memilih ketua OSIS',
    'Rela bergotong royong membersihkan taman sekolah tanpa membedakan latar belakang',
    'Menghargai keberagaman adat istiadat teman sekelas',
    'Menggunakan produk-produk hasil karya anak bangsa dengan bangga',
    'Menolak bergaul dengan teman yang berbeda bahasa daerah',
    'B,C,D',
    3,
    'Gotong royong (B), toleransi keragaman (C), dan cinta produk dalam negeri (D) adalah nilai sila ke-3.'
  ],
  [
    5,
    'PGK',
    'Energi Terbarukan',
    'Pemerintah menargetkan bauran Energi Baru Terbarukan (EBT) nasional mencapai 23% pada tahun 2025. Pembangkit Listrik Tenaga Surya (PLTS) Atap dan Biofuel diposisikan sebagai pilar akselerasi utama dekarbonisasi.',
    '',
    'Tentukan status kebenaran dari setiap pernyataan berikut berdasarkan stimulus wacana di atas:',
    'Target bauran EBT sebesar 23% ditargetkan tercapai pada tahun 2025; Biofuel tidak termasuk dalam pilar akselerasi dekarbonisasi nasional; PLTS Atap merupakan salah satu tumpuan utama peningkatan EBT',
    '',
    '',
    '',
    '',
    'B;S;B',
    3,
    'Pernyataan 1: Benar (sesuai teks). Pernyataan 2: Salah (biofuel adalah pilar). Pernyataan 3: Benar (PLTS Atap pilar utama).'
  ],
  [
    6,
    'MATCH',
    'Termodinamika Fisika',
    '',
    '',
    'Pasangkan proses termodinamika gas ideal berikut dengan ciri kondisi fisis yang bersesuaian:',
    '1. Proses Isokhorik; 2. Proses Isobarik; 3. Proses Isotermik; 4. Proses Adiabatik',
    'A. Berlangsung pada tekanan tetap; B. Berlangsung pada volume tetap (W=0); C. Berlangsung tanpa perpindahan kalor (Q=0); D. Berlangsung pada suhu tetap (Delta U=0)',
    '',
    '',
    '',
    '1-B;2-A;3-D;4-C',
    4,
    'Isokhorik = V konstan (B); Isobarik = P konstan (A); Isotermik = T konstan (D); Adiabatik = Q=0 (C).'
  ],
  [
    7,
    'MATCH',
    'Geografi Litosfer',
    '',
    '',
    'Jodohkan bentang alam bentukan tenaga eksogen berikut dengan proses geomorfologi utamanya:',
    '1. Stalaktit dan Stalagmit; 2. Sand Dunes (Bukit Pasir); 3. Meander Sungai; 4. Tebing Cliff Pantai',
    'A. Sedimentasi aeolin oleh tenaga angin; B. Abrasi gelombang air laut; C. Pelarutan kars kimiawi air tanah; D. Erosi dan sedimentasi fluviatil aliran sungai',
    '',
    '',
    '',
    '1-C;2-A;3-D;4-B',
    4,
    'Stalaktit = kars (C); Sand dunes = angin (A); Meander = fluviatil (D); Cliff = abrasi laut (B).'
  ],
  [
    8,
    'ESSAY',
    'Ekologi & Siklus Hidrologi',
    'Alih fungsi hutan lindung di kawasan hulu DAS menjadi lahan perkebunan monokultur meningkat drastis dalam 5 tahun terakhir.',
    '',
    'Jelaskan dampak kerusakan vegetasi hutan di hulu tersebut terhadap siklus hidrologi dan risiko bencana di kawasan hilir!',
    '',
    '',
    '',
    '',
    '',
    'Infiltrasi air berkurang sehingga limpasan permukaan meningkat drastis, memicu banjir bandang saat musim hujan dan kekeringan air sumur saat kemarau.',
    5,
    'infiltrasi berkurang | penyerapan air tanah turun | limpasan permukaan tinggi | banjir bandang hilir | erosi sedimentasi sungai | kekeringan kemarau'
  ],
  [
    9,
    'ESSAY',
    'Sosiologi & Integrasi Sosial',
    'Fenomena akulturasi budaya Islam dan budaya lokal terlihat jelas pada bentuk arsitektur Menara Masjid Kudus.',
    '',
    'Analisislah bagaimana akulturasi tersebut dapat menjaga harmoni dan kohesi sosial masyarakat!',
    '',
    '',
    '',
    '',
    '',
    'Akulturasi memadukan unsur budaya tanpa menghilangkan kepribadian asli, menciptakan rasa saling menghargai dan memperkuat kohesi sosial lintas kelompok.',
    5,
    'percampuran dua budaya | tanpa menghilangkan identitas asli | harmoni sosial | toleransi beragama | kearifan lokal | kohesi sosial'
  ],
  [
    10,
    'UPLOAD',
    'Praktikum Kimia Asam Basa',
    'Siswa telah melakukan percobaan titrasi larutan asam asetat dengan titran larutan natrium hidroksida (NaOH) standar.',
    '',
    'Unggah laporan akhir praktikum titrasi asam-basa lengkap dengan tabel volume titrasi, kurva pH, dan dokumentasi foto lembar kerja bertanda tangan! (Format PDF / Word, maksimal 10 MB)',
    '',
    '',
    '',
    '',
    '',
    '[Manual Grading oleh Guru]',
    10,
    'Rubrik Penilaian Berkas: Kelengkapan Prosedur (20%), Akurasi Perhitungan Konsentrasi (30%), Analisis Titik Ekuivalen (30%), Kerapian & Tanda Tangan (20%).'
  ]
];

// Buat Workbook
const wb = XLSX.utils.book_new();

// Sheet 1: Petunjuk
const wsPetunjuk = XLSX.utils.aoa_to_sheet(petunjukData);
wsPetunjuk['!cols'] = [
  { wch: 25 },
  { wch: 40 },
  { wch: 45 },
  { wch: 55 }
];
XLSX.utils.book_append_sheet(wb, wsPetunjuk, 'PETUNJUK_FORMAT');

// Sheet 2: Template Soal
const wsTemplate = XLSX.utils.aoa_to_sheet(templateSoalData);
wsTemplate['!cols'] = [
  { wch: 12 }, // nomor_soal
  { wch: 12 }, // tipe_soal
  { wch: 22 }, // capaian_pembelajaran
  { wch: 35 }, // stimulus_teks
  { wch: 20 }, // stimulus_media
  { wch: 40 }, // pertanyaan
  { wch: 25 }, // opsi_a
  { wch: 25 }, // opsi_b
  { wch: 25 }, // opsi_c
  { wch: 25 }, // opsi_d
  { wch: 25 }, // opsi_e
  { wch: 18 }, // kunci_jawaban
  { wch: 12 }, // bobot_skor
  { wch: 45 }  // rubrik_atau_pembahasan
];
XLSX.utils.book_append_sheet(wb, wsTemplate, 'BANK_SOAL_TEMPLATE');

// Simpan file
const outputPath = path.resolve('template_pembuatan_soal_guru_belajarplus.xlsx');
XLSX.writeFile(wb, outputPath);
console.log('Template sukses dibuat di:', outputPath);
