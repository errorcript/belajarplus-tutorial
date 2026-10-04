const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createCleanPresentation() {
  const pptx = new pptxgen();

  // 16:9 widescreen modern: Width = 13.333 inches, Height = 7.5 inches
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'BelajarPlus Indonesia';
  pptx.company = 'BelajarPlus ID';
  pptx.title = 'Sosialisasi Ekosistem BelajarPlus untuk Kepala Sekolah';
  pptx.subject = 'Transformasi Perpustakaan Digital & Manajemen Pembelajaran Sekolah';

  const logoPath = path.join(__dirname, 'assets', 'belajar-plus-logo.png');
  const hasLogo = fs.existsSync(logoPath);

  // Palet Warna BelajarPlus
  const C = {
    bg: 'F8FAFC',
    darkBg: '0A0F1D',
    cardBg: 'FFFFFF',
    border: 'E2E8F0',
    primary: '2563EB',
    primaryDark: '1E3A8A',
    primaryLight: '60A5FA',
    textDark: '0F172A',
    textMuted: '64748B',
    accentGold: 'D97706',
    accentGreen: '059669',
    accentPurple: '7C3AED',
    accentRed: 'DC2626'
  };

  // Helper Header Terstandarisasi & Aman Batas Bawah
  function addSlideHeader(slide, title, category, slideNum, totalSlides = 12) {
    slide.background = { color: C.bg };

    // Top Brand Accent Stripe
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0, y: 0, w: 13.333, h: 0.08,
      fill: { color: C.primary }, line: { color: C.primary }
    });

    // Logo BelajarPlus di Setiap Slide (Kiri Atas)
    if (hasLogo) {
      slide.addImage({
        path: logoPath,
        x: 0.6, y: 0.22, w: 1.8, h: 0.45
      });
    }

    // Category / Tag Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 2.6, y: 0.25, w: 3.2, h: 0.38,
      fill: { color: 'EFF6FF' }, line: { color: 'BFDBFE', width: 1 }
    });
    slide.addText(category.toUpperCase(), {
      x: 2.6, y: 0.25, w: 3.2, h: 0.38,
      align: 'center', valign: 'middle',
      fontSize: 9, bold: true, color: C.primary, fontFace: 'Arial'
    });

    // Role Indicator Badge (Kanan Atas)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.8, y: 0.25, w: 2.9, h: 0.38,
      fill: { color: 'FEF3C7' }, line: { color: 'FDE68A', width: 1 }
    });
    slide.addText('👑 Sesi Khusus Kepala Sekolah', {
      x: 9.8, y: 0.25, w: 2.9, h: 0.38,
      align: 'center', valign: 'middle',
      fontSize: 9, bold: true, color: 'B45309', fontFace: 'Arial'
    });

    // Title (Compact & Elegant - Max 1-2 baris, y=0.8, h=0.6)
    slide.addText(title, {
      x: 0.6, y: 0.78, w: 12.1, h: 0.58,
      fontSize: 20, bold: true, color: C.textDark, fontFace: 'Arial',
      valign: 'middle'
    });

    // Thin separator line
    slide.addShape(pptx.shapes.LINE, {
      x: 0.6, y: 1.45, w: 12.133, h: 0,
      line: { color: 'E2E8F0', width: 1 }
    });

    // Footer (y=7.05, h=0.35)
    slide.addText('BelajarPlus.id — Sosialisasi Ekosistem Literasi & Perpustakaan Digital Resmi Sekolah', {
      x: 0.6, y: 7.08, w: 9.5, h: 0.32,
      fontSize: 8.5, color: '94A3B8', fontFace: 'Arial'
    });

    slide.addText(`${slideNum} / ${totalSlides}`, {
      x: 11.2, y: 7.08, w: 1.5, h: 0.32,
      align: 'right', fontSize: 9, bold: true, color: '64748B', fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 01: COVER
  // ==========================================
  const s1 = pptx.addSlide();
  s1.background = { color: '0A0F1D' }; // Premium Dark Navy

  // Decorative Shapes
  s1.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.12,
    fill: { color: C.primary }, line: { color: C.primary }
  });

  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 8.8, y: 0.8, w: 4.8, h: 5.8,
    fill: { color: '131E3A' }, line: { color: '1E3A8A', width: 1.5 }
  });

  // Preview screenshot on cover
  const imgDash = path.join(__dirname, 'assets', 'kepsek_dashboard.png');
  if (fs.existsSync(imgDash)) {
    s1.addImage({
      path: imgDash,
      x: 8.4, y: 1.3, w: 4.3, h: 4.8,
      sizing: { type: 'contain', w: 4.3, h: 4.8 }
    });
  }

  if (hasLogo) {
    s1.addImage({ path: logoPath, x: 0.8, y: 0.8, w: 2.8, h: 0.7 });
  }

  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.75, w: 5.2, h: 0.36,
    fill: { color: '1E293B' }, line: { color: '3B82F6', width: 1 }
  });
  s1.addText('✨ PROGRAM KEMITRAAN RESMI PERPUSTAKAAN DIGITAL SEKOLAH', {
    x: 0.8, y: 1.75, w: 5.2, h: 0.36,
    align: 'center', valign: 'middle',
    fontSize: 9, bold: true, color: '93C5FD', fontFace: 'Arial'
  });

  s1.addText('Transformasi Ekosistem Literasi &\nPembelajaran Digital Sekolah v2.0', {
    x: 0.8, y: 2.3, w: 7.2, h: 1.5,
    fontSize: 28, bold: true, color: 'FFFFFF', fontFace: 'Arial',
    lineSpacing: 34
  });

  s1.addText('Solusi Terpadu Efisiensi Anggaran BOS Buku, Ujian LJD Anti-Cheat,\nOtomasi Koreksi Esai AI, dan Peningkatan Poin Akreditasi BAN-S/M', {
    x: 0.8, y: 3.95, w: 7.2, h: 0.8,
    fontSize: 13, color: '94A3B8', fontFace: 'Arial',
    lineSpacing: 18
  });

  // Meta box bottom
  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 5.0, w: 7.2, h: 1.5,
    fill: { color: '131E3A' }, line: { color: '2563EB', width: 1.2 }
  });

  s1.addText([
    { text: 'Sasaran Khusus: ', options: { bold: true, color: 'F59E0B', fontSize: 11 } },
    { text: 'Dewan Kepala Sekolah, Wakil Kepala Sekolah & Tim Kurikulum IT\n', options: { color: 'F8FAFC', fontSize: 11 } },
    { text: 'Penyelenggara: ', options: { bold: true, color: '60A5FA', fontSize: 11 } },
    { text: 'Tim Kemitraan Strategis BelajarPlus.id\n', options: { color: 'CBD5E1', fontSize: 11 } },
    { text: 'Tujuan Utama: ', options: { bold: true, color: '34D399', fontSize: 11 } },
    { text: 'Efisiensi Anggaran, Mutu Akademik Unggul, & Kesiapan Audit Dinas', options: { color: 'CBD5E1', fontSize: 11 } }
  ], {
    x: 1.1, y: 5.15, w: 6.6, h: 1.2,
    fontFace: 'Arial', lineSpacing: 18
  });

  // ==========================================
  // SLIDE 02: TANTANGAN RIIL (GRID 2x2 YANG AMAN)
  // ==========================================
  const s2 = pptx.addSlide();
  addSlideHeader(s2, 'Tantangan Pengelolaan Literasi & Ujian Sekolah Saat Ini', 'Identifikasi Masalah', 2);

  const challenges = [
    {
      title: 'Beban Anggaran Buku Fisik',
      desc: 'Buku cetak mudah robek, hilang, dan cepat usang setiap kali ada revisi kurikulum. Anggaran BOS terserap besar untuk pengadaan fisik yang berulang tiap tahun.',
      color: C.accentRed, icon: '💸'
    },
    {
      title: 'Minat Baca Siswa Rendah',
      desc: 'Generasi digital lebih lekat dengan gawai. Mengandalkan perpustakaan fisik dengan jam buka terbatas membuat minat baca buku pelajaran menurun drastis.',
      color: C.accentGold, icon: '📉'
    },
    {
      title: 'Data Akreditasi Sulit Divalidasi',
      desc: 'Pencatatan sirkulasi manual sering hilang dan tidak akuntabel saat visitasi asesor akreditasi BAN-S/M atau inspeksi berkala Pengawas Pembina Dinas.',
      color: C.accentPurple, icon: '📋'
    },
    {
      title: 'Beban Administrasi Guru Sangat Tinggi',
      desc: 'Waktu mengajar guru tersita berjam-jam hanya untuk mengoreksi tumpukan kertas ujian isian dan menyusun rekap nilai secara konvensional.',
      color: C.primary, icon: '⏳'
    }
  ];

  // Grid aman: Max Y = 6.6 (masih 0.5 inch di atas footer 7.08)
  challenges.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.75 + row * 2.5;

    s2.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 5.9, h: 2.25,
      fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
    });

    s2.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 0.15, h: 2.25,
      fill: { color: c.color }, line: { color: c.color }
    });

    s2.addText(`${c.icon}  ${c.title}`, {
      x: x + 0.35, y: y + 0.2, w: 5.3, h: 0.35,
      fontSize: 14, bold: true, color: C.textDark, fontFace: 'Arial'
    });

    s2.addText(c.desc, {
      x: x + 0.35, y: y + 0.65, w: 5.3, h: 1.45,
      fontSize: 10.5, color: C.textMuted, fontFace: 'Arial',
      lineSpacing: 15
    });
  });

  // ==========================================
  // SLIDE 03: ARSITEKTUR SOLUSI 3 PILAR
  // ==========================================
  const s3 = pptx.addSlide();
  addSlideHeader(s3, 'Solusi Ekosistem Menyeluruh BelajarPlus v2.0', 'Arsitektur Platform', 3);

  const pillars = [
    {
      title: '1. Perpustakaan Digital',
      color: C.primary,
      icon: '📚',
      points: [
        'Ribuan judul buku Kurikulum Merdeka & K13 resmi.',
        'Sistem lisensi eksemplar digital sekolah terukur.',
        'E-Reader interaktif + kuis bab & proteksi DRM.',
        'Peminjaman online 24/7 di HP atau laptop siswa.'
      ]
    },
    {
      title: '2. Smart E-Learning & LJD',
      color: C.accentGreen,
      icon: '📝',
      points: [
        'Lembar Jawab Digital (LJD) terkoreksi otomatis.',
        'Pengawas fokus tab anti-cheat anti-contekan.',
        'Koreksi otomatis esai didukung Kredit AI Sekolah.',
        'Presensi digital berbasis scan QR code instan.'
      ]
    },
    {
      title: '3. Executive Analytics',
      color: C.accentGold,
      icon: '👑',
      points: [
        'Dashboard Kepala Sekolah real-time tanpa delay.',
        'Branding sekolah mandiri (logo & domain kustom).',
        'Manajemen master data siswa, rombel, & PTK.',
        'Ekspor berkas akreditasi BAN-S/M sekali klik.'
      ]
    }
  ];

  pillars.forEach((p, idx) => {
    const x = 0.6 + idx * 4.1;
    const y = 1.75;
    const w = 3.9;
    const h = 4.9;

    s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: 'FFFFFF' }, line: { color: p.color, width: 2 }
    });

    s3.addShape(pptx.shapes.RECTANGLE, {
      x, y, w, h: 0.7,
      fill: { color: p.color }, line: { color: p.color }
    });

    s3.addText(`${p.icon}  ${p.title}`, {
      x: x + 0.15, y: y + 0.12, w: w - 0.3, h: 0.45,
      fontSize: 12.5, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });

    let bodyStr = '';
    p.points.forEach(pt => { bodyStr += `• ${pt}\n\n`; });

    s3.addText(bodyStr.trim(), {
      x: x + 0.3, y: y + 1.0, w: w - 0.6, h: 3.6,
      fontSize: 11, color: '334155', fontFace: 'Arial',
      lineSpacing: 17
    });
  });

  // ==========================================
  // SLIDE 04: EXECUTIVE DASHBOARD (SPLIT LAYOUT AMAN)
  // ==========================================
  const s4 = pptx.addSlide();
  addSlideHeader(s4, 'Executive Dashboard: Monitoring Kinerja Sekolah Real-Time', 'Panel Kepala Sekolah', 4);

  // Kiri: Teks Poin
  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.75, w: 5.8, h: 5.0,
    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
  });

  s4.addText('Keunggulan Panel Pimpinan (/admin):', {
    x: 0.9, y: 1.95, w: 5.2, h: 0.35,
    fontSize: 14, bold: true, color: C.primaryDark, fontFace: 'Arial'
  });

  s4.addText([
    { text: '1. Header Resmi & Multi-Tenant Terpadu\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Menampilkan identitas sekolah resmi (SMA N 1 Sragen). Pengawas dapat beralih antar-sekolah dari satu akun tanpa perlu logout.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '2. Akumulasi Hasil Siswa & Bank Soal Aktif\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Memantau jumlah pengerjaan tugas siswa live tiap menit dan ketersediaan ratusan modul bank soal latihan siap pakai.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '3. Baris 5 Aksi Cepat Eksekutif\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Pintasan instan satu klik menuju: Kelola Kelas, Penugasan, Hasil Siswa, Perpustakaan, dan Presensi.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '4. Ringkasan Tugas Sekolah Transparan\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Monitoring hasil penilaian siswa siap tinjau guru, total koleksi e-book, dan keaktifan komunitas sekolah.', options: { color: C.textMuted, fontSize: 10 } }
  ], {
    x: 0.9, y: 2.35, w: 5.2, h: 4.2,
    fontFace: 'Arial', lineSpacing: 14
  });

  // Kanan: Gambar Screenshot HD
  if (fs.existsSync(imgDash)) {
    s4.addImage({
      path: imgDash,
      x: 6.6, y: 1.75, w: 6.1, h: 5.0,
      sizing: { type: 'contain', w: 6.1, h: 5.0 }
    });
  }

  // ==========================================
  // SLIDE 05: BRANDING SEKOLAH & DOMAIN KUSTOM
  // ==========================================
  const s5 = pptx.addSlide();
  addSlideHeader(s5, 'Identitas Mandiri: Branding Sekolah, Subdomain & Custom Domain', 'Personalisasi Portal', 5);

  s5.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.75, w: 5.8, h: 5.0,
    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
  });

  s5.addText('Fitur Modul Tampilan Sekolah (/admin/library/settings):', {
    x: 0.9, y: 1.95, w: 5.2, h: 0.35,
    fontSize: 14, bold: true, color: C.primaryDark, fontFace: 'Arial'
  });

  s5.addText([
    { text: '1. Unggah Logo Resmi Sekolah\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Logo sekolah Anda otomatis menggantikan logo BelajarPlus pada landing page perpustakaan siswa dan kartu login institusi.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '2. Subdomain Khusus Sekolah\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Alamat akses web resmi yang profesional, contoh: smanegeri1sragen.belajarplus.id atau /s/smanegeri1sragen.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '3. Integrasi Domain Kustom Sekolah (DNS)\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Sekolah dapat memakai domain web sendiri (misal: perpustakaan.sekolah.sch.id) via DNS A-Record atau Cloudflare.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '4. Progressive Web App (PWA) di HP Siswa\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Siswa dapat menginstal portal perpustakaan sebagai aplikasi mandiri di ponsel Android/iOS mereka.', options: { color: C.textMuted, fontSize: 10 } }
  ], {
    x: 0.9, y: 2.35, w: 5.2, h: 4.2,
    fontFace: 'Arial', lineSpacing: 14
  });

  const imgBranding = path.join(__dirname, 'assets', 'kepsek_tampilan_sekolah.png');
  if (fs.existsSync(imgBranding)) {
    s5.addImage({
      path: imgBranding,
      x: 6.6, y: 1.75, w: 6.1, h: 5.0,
      sizing: { type: 'contain', w: 6.1, h: 5.0 }
    });
  }

  // ==========================================
  // SLIDE 06: SIRKULASI & KUOTA LISENSI BUKU
  // ==========================================
  const s6 = pptx.addSlide();
  addSlideHeader(s6, 'Efisiensi Anggaran BOS: Manajemen Lisensi & Sirkulasi Buku', 'Inventaris Perpustakaan', 6);

  s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.75, w: 5.8, h: 5.0,
    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
  });

  s6.addText('Sistem Sirkulasi Modern (/admin/library):', {
    x: 0.9, y: 1.95, w: 5.2, h: 0.35,
    fontSize: 14, bold: true, color: C.primaryDark, fontFace: 'Arial'
  });

  s6.addText([
    { text: '1. 4 Metrik Inventaris Transparan\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Pantau total Judul Buku (61 judul), Kuota Lisensi Eksemplar (452 lisensi), Buku Sedang Dipinjam, dan Kuota Tersedia secara live.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '2. Zero Risk Buku Fisik Hilang/Rusak\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: '1 Lisensi digital dapat dipinjam ratusan siswa bergantian secara otomatis (masa aktif 7-14 hari) dan kembali otomatis ke rak tanpa robek.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '3. Antrean Peminjaman Cerdas (Waiting List)\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Ketahui judul mana yang paling diminati siswa saat kuota habis untuk dasar pengadaan buku tahun ajaran baru.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '4. Tabel "Penggunaan Lisensi Tertinggi"\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Statistik rasio buku terpakai per mata pelajaran sebagai landasan alokasi dana BOS yang tepat sasaran.', options: { color: C.textMuted, fontSize: 10 } }
  ], {
    x: 0.9, y: 2.35, w: 5.2, h: 4.2,
    fontFace: 'Arial', lineSpacing: 14
  });

  const imgKoleksi = path.join(__dirname, 'assets', 'kepsek_koleksi_buku.png');
  if (fs.existsSync(imgKoleksi)) {
    s6.addImage({
      path: imgKoleksi,
      x: 6.6, y: 1.75, w: 6.1, h: 5.0,
      sizing: { type: 'contain', w: 6.1, h: 5.0 }
    });
  }

  // ==========================================
  // SLIDE 07: MASTER DATA SISWA & PTK
  // ==========================================
  const s7 = pptx.addSlide();
  addSlideHeader(s7, 'Master Data Civitas: Siswa, Pendaftaran & PTK Dapodik', 'Manajemen Pengguna', 7);

  s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.75, w: 5.8, h: 5.0,
    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
  });

  s7.addText('Tata Kelola Pengguna Terpadu:', {
    x: 0.9, y: 1.95, w: 5.2, h: 0.35,
    fontSize: 14, bold: true, color: C.primaryDark, fontFace: 'Arial'
  });

  s7.addText([
    { text: '1. Modul Siswa Sekolah (/admin/students)\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: '• 4 Tab Status: Total Aktif, Sudah di Rombel, Belum di Rombel, dan Nonaktif.\n• Fitur Impor Siswa Massal: Unggah ratusan data via spreadsheet/CSV instan.\n• Menu Kode & Pendaftaran: Verifikasi pengajuan akun siswa baru.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '2. Modul Guru & Tenaga Kependidikan (/admin/teachers)\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: '• Kelola akun Guru Pengajar dan Staf Tenaga Kependidikan.\n• Sinkronisasi nomor NUPTK / NIP resmi dinas.\n• Fitur Undang PTK dan Ekspor data kepegawaian siap pakai.', options: { color: C.textMuted, fontSize: 10 } }
  ], {
    x: 0.9, y: 2.35, w: 5.2, h: 4.2,
    fontFace: 'Arial', lineSpacing: 14
  });

  const imgSiswa = path.join(__dirname, 'assets', 'kepsek_siswa.png');
  if (fs.existsSync(imgSiswa)) {
    s7.addImage({
      path: imgSiswa,
      x: 6.6, y: 1.75, w: 6.1, h: 5.0,
      sizing: { type: 'contain', w: 6.1, h: 5.0 }
    });
  }

  // ==========================================
  // SLIDE 08: KURIKULUM & KOREKSI OTOMATIS AI
  // ==========================================
  const s8 = pptx.addSlide();
  addSlideHeader(s8, 'Kurikulum Merdeka & Inovasi Koreksi Esai Berbasis AI', 'Efisiensi Guru & Mutu', 8);

  s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.75, w: 5.8, h: 5.0,
    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1.2 }
  });

  s8.addText('Integrasi AI Cerdas Sekolah (/admin/ai-credits):', {
    x: 0.9, y: 1.95, w: 5.2, h: 0.35,
    fontSize: 14, bold: true, color: C.primaryDark, fontFace: 'Arial'
  });

  s8.addText([
    { text: '1. Pemetaan Kurikulum Merdeka & K13 Dinamis\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Pengaturan mata pelajaran per tingkat kelas dan alokasi rombel belajar secara dinamis di modul Kurikulum.\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '2. Inovasi Kredit AI Sekolah\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Aturan baku: 1 Kredit = 1 Jawaban Isian/Esai dinilai otomatis oleh AI sesuai kunci & rubrik guru. Soal pilihan ganda 100% bebas kredit!\n\n', options: { color: C.textMuted, fontSize: 10 } },
    { text: '3. Efisiensi Waktu Guru Hingga 75%\n', options: { bold: true, color: C.primary, fontSize: 11 } },
    { text: 'Guru tidak lagi begadang mengoreksi ratusan esai siswa. Fokus guru beralih pada pendampingan karakter siswa dan pengayaan materi.', options: { color: C.textMuted, fontSize: 10 } }
  ], {
    x: 0.9, y: 2.35, w: 5.2, h: 4.2,
    fontFace: 'Arial', lineSpacing: 14
  });

  const imgAi = path.join(__dirname, 'assets', 'kepsek_ai-credits.png');
  if (fs.existsSync(imgAi)) {
    s8.addImage({
      path: imgAi,
      x: 6.6, y: 1.75, w: 6.1, h: 5.0,
      sizing: { type: 'contain', w: 6.1, h: 5.0 }
    });
  }

  // ==========================================
  // SLIDE 09: NILAI TAMBAH AKREDITASI BAN-S/M (DIBENERIN TOTAL & TIDAK AKAN KEPOTONG!)
  // ==========================================
  const s9 = pptx.addSlide();
  addSlideHeader(s9, 'Meningkatkan Poin Akreditasi BAN-S/M & Kesiapan Audit Dinas', 'Nilai Strategis', 9);

  const akreditasiPoints = [
    {
      title: 'Standar Sarana & Prasarana (Perpustakaan)',
      desc: 'Memenuhi indikator penyediaan sarana literasi berbasis teknologi informasi. Sekolah memiliki koleksi ribuan judul e-library tanpa perlu menambah bangunan fisik baru.',
      color: C.primary, icon: '🏢'
    },
    {
      title: 'Standar Pengelolaan & Evaluasi',
      desc: 'Tersedianya rekam jejak digital pembelajaran, pemantauan frekuensi membaca buku per siswa, dan transparansi distribusi tugas formatif maupun sumatif.',
      color: C.accentGreen, icon: '📊'
    },
    {
      title: 'Ekspor Berkas Akreditasi Sekali Klik',
      desc: 'Laporan sirkulasi buku, statistik peminjam teraktif, dan transkrip ketercapaian nilai dapat diunduh instan dalam format spreadsheet/PDF siap cetak untuk asesor.',
      color: C.accentGold, icon: '🖨️'
    },
    {
      title: 'Validitas Data untuk Dinas Pendidikan',
      desc: 'Mempermudah pelaporan implementasi Kurikulum Merdeka kepada Pengawas Pembina dan Dinas Pendidikan setempat secara terukur, valid, dan akuntabel.',
      color: C.accentPurple, icon: '🏛️'
    }
  ];

  // Grid aman vertikal:
  // Row 0: y = 1.75, h = 2.25 -> batas bawah y = 4.0
  // Row 1: y = 4.30, h = 2.25 -> batas bawah y = 6.55 (Aman 0.53 inch sebelum footer 7.08!)
  akreditasiPoints.forEach((a, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.6 + col * 6.2;
    const y = 1.75 + row * 2.55;

    s9.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 5.9, h: 2.3,
      fill: { color: 'FFFFFF' }, line: { color: a.color, width: 1.5 }
    });

    s9.addText(`${a.icon}  ${a.title}`, {
      x: x + 0.35, y: y + 0.18, w: 5.3, h: 0.35,
      fontSize: 13, bold: true, color: C.textDark, fontFace: 'Arial'
    });

    s9.addText(a.desc, {
      x: x + 0.35, y: y + 0.6, w: 5.3, h: 1.5,
      fontSize: 10.5, color: C.textMuted, fontFace: 'Arial',
      lineSpacing: 15
    });
  });

  // ==========================================
  // SLIDE 10: UJIAN LJD ANTI-CHEAT & PRESENSI QR
  // ==========================================
  const s10 = pptx.addSlide();
  addSlideHeader(s10, 'Integritas Akademik: Ujian LJD Anti-Cheat & Presensi QR Code', 'Keamanan & Disiplin', 10);

  const secBoxes = [
    {
      title: 'Sistem Pengawas Ujian Anti-Cheat (Tab Focus)',
      points: [
        'Sistem otomatis mendeteksi dan mencatat setiap kali siswa membuka tab browser lain atau aplikasi contekan saat ujian berlangsung.',
        'Header ujian menampilkan counter pelanggaran secara transparan kepada siswa.',
        'Guru dan Kepala Sekolah dapat melihat riwayat integritas pengerjaan siswa secara objektif.'
      ],
      color: C.accentRed,
      icon: '🛡️'
    },
    {
      title: 'Presensi Digital QR Code & Manual Code',
      points: [
        'Siswa memindai kode QR kelas dalam hitungan detik untuk absensi instan tanpa antre.',
        'Dilengkapi fitur "Masukkan Kode Manual" bila perangkat kamera bermasalah.',
        'Rekapitulasi kehadiran terhubung otomatis ke rekap bulanan sekolah untuk evaluasi wali kelas.'
      ],
      color: C.accentGreen,
      icon: '📷'
    }
  ];

  secBoxes.forEach((b, idx) => {
    const x = 0.6 + idx * 6.2;
    const y = 1.75;
    const w = 5.9;
    const h = 4.9;

    s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: 'FFFFFF' }, line: { color: b.color, width: 2 }
    });

    s10.addShape(pptx.shapes.RECTANGLE, {
      x, y, w, h: 0.7,
      fill: { color: b.color }, line: { color: b.color }
    });

    s10.addText(`${b.icon}  ${b.title}`, {
      x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.45,
      fontSize: 12.5, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });

    let bText = '';
    b.points.forEach(pt => { bText += `• ${pt}\n\n`; });

    s10.addText(bText.trim(), {
      x: x + 0.35, y: y + 1.0, w: w - 0.7, h: 3.6,
      fontSize: 11, color: '334155', fontFace: 'Arial',
      lineSpacing: 18
    });
  });

  // ==========================================
  // SLIDE 11: ALUR IMPLEMENTASI 4 LANGKAH
  // ==========================================
  const s11 = pptx.addSlide();
  addSlideHeader(s11, '4 Langkah Implementasi Cepat & Pendampingan Penuh', 'Alur Kemitraan', 11);

  const steps = [
    { num: '01', title: 'Kode Sekolah Mitra', desc: 'Penerbitan Kode Sekolah resmi (SKL-XXXXX) & aktivasi akun Administrator Utama oleh tim BelajarPlus.' },
    { num: '02', title: 'Impor Pengguna & Portal', desc: 'Unggah data siswa & guru via Excel, setting logo resmi, subdomain sekolah, dan kurikulum mapel.' },
    { num: '03', title: 'Bimtek / Workshop Guru', desc: 'Pelatihan teknis praktis 90 menit cara membuat kelas, penugasan LJD, dan penilaian otomatis.' },
    { num: '04', title: 'Go-Live & Pendampingan', desc: 'Sekolah resmi beroperasi digital didampingi Helpdesk khusus BelajarPlus untuk penanganan kendala.' }
  ];

  steps.forEach((st, idx) => {
    const x = 0.6 + idx * 3.1;
    const y = 1.75;
    const w = 2.85;
    const h = 4.9;

    s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: 'FFFFFF' }, line: { color: C.primary, width: 1.5 }
    });

    // Badge Circle Step
    s11.addShape(pptx.shapes.OVAL, {
      x: x + 0.95, y: y + 0.4, w: 0.95, h: 0.95,
      fill: { color: C.primary }, line: { color: C.primary }
    });
    s11.addText(st.num, {
      x: x + 0.95, y: y + 0.4, w: 0.95, h: 0.95,
      align: 'center', valign: 'middle',
      fontSize: 16, bold: true, color: 'FFFFFF', fontFace: 'Arial'
    });

    s11.addText(st.title, {
      x: x + 0.2, y: y + 1.6, w: w - 0.4, h: 0.6,
      align: 'center', fontSize: 13, bold: true, color: C.textDark, fontFace: 'Arial'
    });

    s11.addText(st.desc, {
      x: x + 0.2, y: y + 2.3, w: w - 0.4, h: 2.3,
      align: 'center', fontSize: 10.5, color: C.textMuted, fontFace: 'Arial',
      lineSpacing: 15
    });
  });

  // ==========================================
  // SLIDE 12: KESIMPULAN & PENUTUP
  // ==========================================
  const s12 = pptx.addSlide();
  s12.background = { color: '0A0F1D' };

  if (hasLogo) {
    s12.addImage({ path: logoPath, x: 0.8, y: 0.6, w: 2.8, h: 0.7 });
  }

  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.5, w: 4.5, h: 0.35,
    fill: { color: '1E293B' }, line: { color: '3B82F6', width: 1 }
  });
  s12.addText('🤝 KESIMPULAN & KOMITMEN KEMITRAAN', {
    x: 0.8, y: 1.5, w: 4.5, h: 0.35,
    align: 'center', valign: 'middle',
    fontSize: 9, bold: true, color: '93C5FD', fontFace: 'Arial'
  });

  s12.addText('Wujudkan Sekolah Digital Unggul & Siap Akreditasi\nBersama BelajarPlus.id', {
    x: 0.8, y: 2.05, w: 11.5, h: 1.2,
    fontSize: 26, bold: true, color: 'FFFFFF', fontFace: 'Arial',
    lineSpacing: 30
  });

  s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 3.4, w: 11.7, h: 2.6,
    fill: { color: '131E3A' }, line: { color: '2563EB', width: 1.5 }
  });

  s12.addText([
    { text: '✓ Efisiensi Anggaran BOS: ', options: { bold: true, color: '34D399', fontSize: 11.5 } },
    { text: 'Penghematan belanja buku fisik BOS dan nol persen risiko buku hilang atau rusak.\n\n', options: { color: 'F8FAFC', fontSize: 11 } },
    { text: '✓ Peningkatan Poin Akreditasi: ', options: { bold: true, color: '34D399', fontSize: 11.5 } },
    { text: 'Bukti fisik literasi digital terdata rapi dan siap diekspor sekali klik untuk visitasi BAN-S/M.\n\n', options: { color: 'F8FAFC', fontSize: 11 } },
    { text: '✓ Peringanan Beban Guru: ', options: { bold: true, color: '34D399', fontSize: 11.5 } },
    { text: 'Koreksi esai otomatis dengan Kredit AI, ujian LJD anti-cheat, dan presensi QR instan.\n\n', options: { color: 'F8FAFC', fontSize: 11 } },
    { text: '✓ Branding Mandiri Sekolah: ', options: { bold: true, color: '34D399', fontSize: 11.5 } },
    { text: 'Nama domain mandiri, logo sekolah resmi, serta instalasi mode aplikasi PWA di ponsel siswa.', options: { color: 'F8FAFC', fontSize: 11 } }
  ], {
    x: 1.1, y: 3.6, w: 11.1, h: 2.2,
    fontFace: 'Arial', lineSpacing: 18
  });

  s12.addText('Hubungi Tim Kemitraan: kemitraan@belajarplus.id | WhatsApp Support: +62 812-XXXX-XXXX | Website: https://belajarplus.id', {
    x: 0.8, y: 6.25, w: 11.7, h: 0.4,
    align: 'center', fontSize: 11, bold: true, color: '93C5FD', fontFace: 'Arial'
  });

  // Write file
  const outPath = path.join(__dirname, 'Sosialisasi_BelajarPlus_Kepala_Sekolah.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log('✅ Clean PowerPoint regenerated successfully at:', outPath);
}

createCleanPresentation().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
