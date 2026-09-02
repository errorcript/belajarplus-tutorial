# 📚 Tutorial BelajarPlus — Panduan Lengkap Perpustakaan Digital

> Website tutorial interaktif resmi untuk platform **BelajarPlus** — perpustakaan digital e-library untuk siswa SMA/MA Indonesia. Panduan ini mencakup panduan penggunaan lengkap untuk **Siswa**, **Guru**, dan **Kepala Sekolah / Admin**.

🌐 **Live:** [belajarplus-tutorial.vercel.app](https://belajarplus-tutorial.vercel.app) &nbsp;|&nbsp; 🏠 **App:** [belajarplus.id/library](https://belajarplus.id/library)

---

## ✨ Fitur Halaman Tutorial

| Fitur | Deskripsi |
|-------|-----------|
| 🔀 **Role Switcher** | Panduan terpisah & terstruktur untuk 3 peran: Siswa (12 langkah), Guru (6 langkah), Kepsek/Admin (6 langkah) |
| 📖 **Interactive Book Reader Demo** | Simulasi e-reader BelajarPlus langsung di browser — lengkap dengan Daftar Isi, navigasi halaman, zoom teks, dan mode fullscreen |
| 🎬 **Video Tutorial + Voiceover AI** | Slideshow tutorial per peran dilengkapi narasi Bahasa Indonesia via ResponsiveVoice API dan subtitle teks berjalan |
| 📥 **Download Modul PDF Resmi (A4)** | Generate & unduh modul panduan berformat A4 resmi menggunakan html2pdf.js — dengan kop surat, screenshot, dan footer |
| 🎥 **Download Video MP4** | Rekam slideshow tutorial sebagai file video MP4 menggunakan MediaRecorder + Canvas API |
| 🖼️ **Lightbox Gambar** | Klik gambar mana pun untuk zoom fullscreen dengan modal overlay |
| ✅ **Progress Checklist** | Centang langkah-langkah yang sudah diselesaikan, lengkap dengan progress bar real-time |
| 🌙 **Dark / Light Mode** | Toggle tema gelap/terang dengan preferensi tersimpan di localStorage |
| 📱 **Responsive** | Layout responsif untuk desktop, tablet, dan smartphone |
| 🎯 **Smooth Scroll + Animasi** | Scroll animasi masuk menggunakan IntersectionObserver pada setiap step & card |
| 📌 **FAQ Accordion** | Daftar pertanyaan umum dengan toggle accordion interaktif |

---

## 🗂️ Struktur Proyek

```
belajarplus-tutorial/
├── index.html          # Halaman utama tutorial (single-page)
├── video.html          # Halaman pemutar video tutorial terpisah
├── app.js              # Seluruh logika JavaScript (reader, PDF, video, theme, dll)
├── style.css           # Stylesheet utama (dark mode, animasi, komponen)
├── vercel.json         # Konfigurasi deployment Vercel (cache headers)
├── package.json        # Dependencies Node (ws, playwright, vercel)
└── assets/             # Folder gambar screenshot aplikasi BelajarPlus
    ├── belajar-plus-logo.png
    ├── library.png
    ├── register_siswa.png
    ├── register_guru.png
    ├── login.png
    ├── dashboard_siswa.png
    ├── library_search.png
    ├── book_reader.png
    ├── book_detail.png
    ├── my_books.png
    ├── my_books_list.png
    ├── assignment_list.png
    ├── assignment_result.png
    ├── class_assignment.png
    ├── admin_dashboard.png
    ├── admin_kelas.png
    ├── admin_koleksi.png
    ├── admin_toko.png
    ├── orders.png
    ├── orders_history.png
    ├── shop.png
    ├── store_page.png
    ├── profile.png
    ├── user_profile.png
    ├── search_filter.png
    ├── ss_tugas.png
    ├── ss_kelas.png
    ├── ss_latihan.png
    ├── ss_hasil.png
    └── verifikasi_email.png
```

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+
- npm

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/errorcript/belajarplus-tutorial.git
cd belajarplus-tutorial

# 2. Install dependencies
npm install

# 3. Jalankan local server
npx serve . -p 3000

# 4. Buka di browser
# http://localhost:3000
```

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **HTML5** | Struktur halaman (semantic, SEO-friendly) |
| **Vanilla CSS** | Styling lengkap — dark mode, glassmorphism, animasi, responsive |
| **Vanilla JavaScript** | Seluruh logika interaktif (tanpa framework) |
| **[Inter Font](https://fonts.google.com/specimen/Inter)** | Tipografi modern via Google Fonts |
| **[ResponsiveVoice](https://responsivevoice.org/)** | Text-to-speech Bahasa Indonesia untuk voiceover video tutorial |
| **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)** | Generate PDF A4 dari konten HTML secara client-side |
| **MediaRecorder API** | Record slideshow tutorial menjadi file video MP4 |
| **IntersectionObserver API** | Scroll-triggered animasi masuk pada setiap elemen step & card |
| **[Vercel](https://vercel.com)** | Hosting & deployment (konfigurasi di `vercel.json`) |

---

## 📋 Panduan Per Role

### 👨‍🎓 Akun Siswa (12 Langkah)
1. Pendaftaran & Aktivasi Akun Siswa
2. Login ke Akun Siswa
3. Mengenal Dashboard Siswa Secara Detail
4. Tugas dari Guru & Manajemen Waktu
5. Manajemen "Kelas Saya" (Bergabung ke Rombel)
6. Latihan Mandiri Tersedia & Analisa Hasil Terbaru
7. Mencari Buku di Ekosistem Perpustakaan Digital
8. Menavigasi E-Reader Interaktif
9. Manajemen "Buku Saya" (Pinjaman & Antrean)
10. Kelas & Aturan Ketat Lembar Jawab Digital (LJD)
11. Eksplorasi Toko & Riwayat Pesanan Mandiri
12. Pengaturan Akun & Profil Saya

### 👨‍🏫 Akun Guru (6 Langkah)
1. Pendaftaran & Verifikasi Akun Guru
2. Login & Akses Dashboard Guru
3. Buat & Kelola Ruang Kelas
4. Hubungkan Buku Acuan Pembelajaran
5. Buat Penugasan & Lembar Jawab Digital (LJD)
6. Pantau Transkrip Nilai & Hasil Belajar Real-time

### 🏫 Kepala Sekolah / Admin (6 Langkah)
1. Registrasi Instansi & Pengajuan Kode Sekolah Mitra
2. Monitoring Dashboard Analitik Sekolah
3. Manajemen Lisensi & Koleksi Sekolah
4. Pengelolaan Data Pengguna & Pembagian Rombel
5. Pengadaan Buku via Portal Toko / Penerbit
6. Audit Keamanan & Laporan Evaluasi Periodik

---

## 🚢 Deploy ke Vercel

Project ini sudah dikonfigurasi untuk Vercel. Cukup connect repo ke Vercel dashboard atau gunakan CLI:

```bash
npx vercel --prod
```

Konfigurasi `vercel.json` sudah mengatur:
- `cleanUrls: true` — URL tanpa ekstensi `.html`
- `Cache-Control: no-cache` — Pastikan user selalu dapat versi terbaru

---

## 🐛 Known Issues (Dokumentasi Bug Aplikasi BelajarPlus)

Bug-bug berikut adalah **bug pada aplikasi BelajarPlus** (bukan pada website tutorial ini), yang didokumentasikan di halaman tutorial sebagai panduan workaround untuk pengguna:

| Bug | Dampak | Workaround |
|-----|--------|------------|
| Search bar reset saat klik "Jelajahi & filter" dari dropdown | Keyword pencarian hilang | Gunakan Sidebar Filter di kiri halaman |
| Angka notifikasi tab "Buku Saya" delay sinkronisasi | Tampilan jumlah buku tidak akurat | Klik F5 / refresh halaman |
| Infinite loading jika guru publish tugas dengan 0 soal | Layar macet, tidak ada tombol back | Tutup tab browser, laporkan ke admin IT |
| Redirection loop saat akses `/orders` via address bar | Terus redirect ke login | Selalu gunakan tombol sidebar, bukan ketik URL manual |

---

## 📁 Konten Sections

| Section | ID | Deskripsi |
|---------|----|-----------|
| Hero | — | Judul, statistik, mockup browser |
| Pengenalan | `#pengenalan` | Apa itu BelajarPlus + 4 fitur utama |
| Navigasi App | — | Tabel 6 menu utama aplikasi |
| Panduan Penggunaan | `#cara-pakai` | Role switcher + step-by-step per role |
| Book Reader Demo | `#reader-demo` | Simulasi interaktif e-reader |
| Checklist Progress | — | 14 item checklist progres pengguna |
| Fitur Unggulan | `#fitur` | 6 feature card |
| Panduan Per Halaman | `#halaman-lain` | 6 halaman app dengan direct link |
| Tips & Trik | `#tips` | 6 tip pro penggunaan BelajarPlus |
| FAQ | `#faq` | Accordion pertanyaan umum |
| Footer | — | Link & copyright |

---

## 📄 Lisensi

© 2024 **BelajarPlus.id** — Hak Cipta Dilindungi.  
Website tutorial ini dibuat sebagai dokumentasi resmi operasional Perpustakaan Digital Sekolah BelajarPlus.
