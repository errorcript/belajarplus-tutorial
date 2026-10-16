# 📌 Catatan Rencana Pengembangan Berikutnya (Next Sprint)

## 1. Pembaruan Screenshot & Fitur Akun Siswa v2.0 (Selesai Dilaksanakan)
- [x] **Layar / Popup "Lupa Kata Sandi" (Langkah 02)**: Tangkapan layar formulir input email reset password (`assets/lupa_password.png`).
- [x] **Layar Ujian LJD Sedang Berjalan (Langkah 10)**: Tampilan asli pengerjaan soal (stimulus & lembar pilihan), navigator nomor, tombol tandai, halaman tinjau jawaban, serta skor hasil & analisis kompetensi (`assets/ljd_*.png` & `assets/assignment_result.png`).
- [x] **Layar Pemilihan Institusi / Multi-Tenant Selector (Langkah 03)**: Tampilan switcher institusi pasca-login (`assets/pilih_institusi.png`).
- [x] **Dashboard Siswa Baru & Sidebar V2 (Langkah 03 & 04)**: Tampilan menu Komunitas, Agenda, Pengumuman, 4 kartu ringkasan aktivitas, dan tugas aktif (`assets/dashboard_siswa.png` & `assets/ss_tugas.png`).
- [x] **Aksi Cepat & Pindai QR Scanner (Langkah 06)**: Tangkapan layar scanner kamera QR lembar kuis / presensi absensi (`assets/scan_page.png` & `assets/ss_latihan.png`).
- [x] **Manajemen Kelas Saya & Fitur Keluar Mandiri (Langkah 05)**: Opsi keluar kelas jika salah rombel (`assets/ss_kelas.png`).
- [x] **Laporan Audit Teknis Bug v2.0**: Dokumentasi audit teknis 6 temuan di halaman `/bug2` (`bug2.html`).
- [x] **Revamp Menyeluruh Copywriting Tutorial Siswa v2.0**: Pembaruan total teks instruksi langkah 01–12, pengenalan platform, 16 item checklist progresif, 8 kartu fitur unggulan, panduan per halaman, pro tips, dan FAQ troubleshooting.

---

## 2. Roadmap Panduan Akun Guru / Pengajar (Selesai Dilaksanakan)
Bedah tuntas antarmuka live pendidik dari portal admin sekolah (SMA Negeri 1 Sragen):
- [x] **Verifikasi & Registrasi Guru (Langkah 01)**: Registrasi satu pintu terpadu dan aktivasi instansi pasca-login.
- [x] **Dashboard Pengajar & Aksi Cepat (Langkah 02)**: Tangkapan layar live `/admin` (`assets/guru_dashboard.png`) dengan metrik pengerjaan, ratusan modul latihan, dan pintasan aksi cepat.
- [x] **Manajemen & Pembuatan Ruang Kelas (Langkah 03)**: Tangkapan layar live `/admin/classes` (`assets/guru_kelola_kelas.png`), cara generate Kode Kelas unik (`BLJ-XXXXXX`), dan manajemen anggota rombel.
- [x] **Menghubungkan Sumber Belajar / Buku Acuan (Langkah 04)**: Cara menyematkan e-book dari perpustakaan digital sekolah ke tab kelas.
- [x] **Pembuatan Paket Soal & Ujian LJD (Langkah 05)**: Tangkapan layar live `/admin/assignments` (`assets/guru_penugasan.png`), konfigurasi batas waktu pengerjaan, dan pengawas anti-cheat.
- [x] **Penilaian & Ekspor Nilai Siswa (Langkah 06)**: Tangkapan layar live `/admin/submissions` (`assets/guru_hasil_siswa.png`), transkrip nilai, dan analisis kompetensi dasar.
- [x] **Penyelarasan Naskah Video & PDF Guru**: Sinkronisasi data voiceover `videoTutorialData.guru` di `app.js` dan visual modul di `index.html`.

---

## 3. Eksekusi Akun & Laporan Resmi 17 Sekolah Surakarta & Sragen (Selesai Dilaksanakan)
- [x] **Sanitasi Master Data 17 Sekolah**: Penyelamatan berkas SMAN 7 Surakarta, normalisasi email unik bebas spasi (`[CLEAN_IMPORT] ...`), dan aktivasi tombol impor live (`disabled: false`).
- [x] **Eksekusi Live Impor BelajarPlus**:
  - Wilayah Sragen: SMAN 1 Sragen, SMAN 3 Sragen, SMAN 1 Gemolong, SMAN 1 Sukodono, SMAN 1 Tangen, SMAN 2 Sragen, SMAN 1 Gondang (total >1.600 siswa aktif via akun Henri Susilo).
  - Wilayah Surakarta: SMAN 5 Surakarta (187 siswa aktif via akun Andrew Aliffiansyah).
- [x] **Penetapan Subdomain Resmi Tiap Sekolah**: Integrasi subdomain resmi `https://{slug}.belajarplus.id` dan direct link `/s/{slug}` ke seluruh laporan kedinasan.
- [x] **Generasi Dokumen Resmi Berita Acara PDF (17 Sekolah)**:
  - Dilengkapi Nomor Surat Resmi, Tanggal, Portal Subdomain Sekolah, Ringkasan Rombel, Tanda Tangan Kepala Sekolah & Trainer.
  - Pemecahan halaman per kelas (*page-break*) memuat: No, Nama Lengkap, Email Login, Password Awal (amber highlight), Status Aktif, dan Kotak Paraf Siswa.
  - Lampiran Kredensial Dewan Guru & PTK untuk sekolah yang memiliki data guru (SMAN 1 Gondang & SMAN 2 Sragen).
  - Seluruh 17 PDF resmi tersimpan langsung di Google Drive `G:\My Drive\Trainer\B+\AKUN\`.
- [x] **Dokumentasi Lengkap & Otomasi Skrip**: Pencatatan master report di `LAPORAN_REKAP_17_SEKOLAH_SURAKARTA_SRAGEN.md` dan skrip otomasi di `bot-tools/scripts/`.
