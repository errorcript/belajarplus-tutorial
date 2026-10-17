# 📘 Panduan Mendalam Fitur & Rekayasa Operasional Platform BelajarPlus v2.0
**Buku Manual Eksplorasi 6 Modul Utama Lengkap dengan Tangkapan Layar HD Real**

---

## 1. Ringkasan Eksekutif & Peta Modul Platform

Dokumen ini merupakan panduan operasional komprehensif hasil eksplorasi mendalam (*deep-dive*) terhadap seluruh modul fungsional pada ekosistem platform **BelajarPlus v2.0**. Panduan ini disusun untuk memberikan pemahaman menyeluruh bagi **Tim Trainer, Kepala Sekolah, Admin Sekolah, Guru, dan Siswa** mengenai alur kerja digital mulai dari transaksi e-commerce buku, interaksi sosial komunitas belajar, pengelolaan agenda & pengumuman, otomasi koreksi esai berbasis AI, tata kelola lisensi perpustakaan digital, hingga penegakan presensi geofencing satelit GPS.

```
                                  ┌─────────────────────────────────────────┐
                                  │       PORTAL BELAJARPLUS v2.0           │
                                  └────────────────────┬────────────────────┘
                                                       │
         ┌──────────────────┬──────────────────┬───────┴──────────┬──────────────────┬──────────────────┐
         │                  │                  │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼                  ▼                  ▼
    [ MODUL 1 ]        [ MODUL 2 ]        [ MODUL 3 ]        [ MODUL 4 ]        [ MODUL 5 ]        [ MODUL 6 ]
   Toko Digital &     Forum Komunitas    Agenda Akademik    Pusat Kredit AI    Tata Kelola E-Book   Geofencing GPS
  Transaksi Mandiri   & Kolaborasi Siswa  & Pengumuman      & Koreksi Esai     & Kuota Kursi DRM    & Presensi Kelas
```

---

## 2. Modul 1: Toko Buku Digital & Alur Transaksi Pembayaran Mandiri Siswa (E-Commerce B+)

### Latar Belakang & Tujuan
Modul Toko (`/shop`) dan Pesanan (`/orders`) memberikan fleksibilitas bagi siswa atau wali murid untuk memiliki buku cetak mandiri atau modul pengayaan persiapan SNBT/UTBK berlisensi pribadi (akses selamanya) di luar kuota yang disediakan oleh perpustakaan sekolah.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Jelajahi Katalog Toko Buku (`/shop`)
* **Tangkapan Layar**: [hunt_shop_page.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_shop_page.png)
* **Penjelasan Teknis**:
  * Pengguna membuka menu **Toko** pada bilah navigasi utama.
  * Katalog menampilkan ribuan buku resmi Kurikulum Merdeka dan buku pendamping ujian.
  * Fitur penyaring (*faceted filter*): Jenjang Kelas (Fase E/X, Fase F/XI, Fase F/XII), Rumpun Mata Pelajaran, dan Penerbit resmi.
  * Setiap kartu buku menampilkan harga reguler, harga kemitraan sekolah (diskon khusus), serta label format ketersediaan: **Buku Cetak Fisik** atau **E-Book Digital**.

#### 2. Spesifikasi Produk & Pemilihan Varian Buku
* **Tangkapan Layar**: [hunt_product_detail.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_product_detail.png)
* **Penjelasan Teknis**:
  * Mengklik sampul buku membuka lembar rincian produk: sinopsis resmi, nomor ISBN terdaftar, nama penulis, tebal halaman, dan dimensi bobot (untuk kalkulasi ongkir buku fisik).
  * Pembeli dapat memilih format: *E-Book (Akses Selamanya di Akun)* atau *Buku Cetak Fisik Softcover*.
  * Tersedia tombol aksi: **"Tambah ke Keranjang"** (untuk belanja beberapa judul sekaligus) atau **"Beli Sekarang"** (langsung menuju form checkout).

#### 3. Keranjang Belanja & Review Pembelian
* **Tangkapan Layar**: [keranjang_belanja.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/keranjang_belanja.png)
* **Penjelasan Teknis**:
  * Ikon troli belanja di header menampilkan ringkasan daftar item yang telah dipilih.
  * Pengguna dapat mengubah kuantitas eksemplar, menghapus item, atau memasukkan kode voucher kemitraan sekolah jika tersedia.
  * Subtotal transaksi dikalkulasikan secara otomatis dan siap diteruskan ke gateway checkout.

#### 4. Checkout & Instruksi Transfer Bank Manual
* **Tangkapan Layar**: [detail_pesanan_transfer.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/detail_pesanan_transfer.png)
* **Penjelasan Teknis**:
  * Sistem membuat invoice unik dengan format `#ORD-YYYY-XXXX`.
  * Untuk memudahkan pencocokan transaksi mutasi bank, sistem menambahkan **Kode Unik 3 Digit Terakhir** pada nominal tagihan (contoh: tagihan buku Rp 95.000 menjadi Rp 95.342).
  * Menampilkan informasi rekening bank resmi pengelola BelajarPlus (BCA, Mandiri, BRI) lengkap dengan tombol salin nomor rekening dan salin nominal transfer.
  * Batas waktu pembayaran ditetapkan 24 jam sebelum invoice kedaluwarsa secara otomatis.

#### 5. Pelacakan Status & Aktivasi di Halaman Pesanan (`/orders`)
* **Tangkapan Layar**: [hunt_pesanan_page_hd.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_pesanan_page_hd.png)
* **Penjelasan Teknis**:
  * Pengguna dapat memantau status pesanan pada tab **Pesanan**: *Menunggu Pembayaran* ➔ *Sedang Diverifikasi* ➔ *Pesanan Selesai*.
  * Disediakan tombol untuk mengunggah foto struk transfer / bukti m-banking jika verifikasi otomatis membutuhkan konfirmasi manual.
  * Begitu status dinyatakan selesai, e-book yang dibeli langsung aktif di rak digital **"Buku Saya"** siswa selamanya.

#### 6. Supervisi Penjualan & Laporan Omset Sekolah (`/admin/sales`)
* **Tangkapan Layar**: [audit__admin_sales.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_sales.png)
* **Penjelasan Teknis**:
  * Kepala Sekolah dan Admin Sekolah memantau rekap transaksi belanja buku mandiri oleh siswa.
  * Menampilkan grafik omset penjualan berkala, daftar buku terlaris (*best seller*), dan pembagian margin bagi hasil royalti sekolah.

> [!TIP]
> **Simulator Interaktif Live**: Anda dapat mencoba simulasi transaksi invoice 3-digit kode unik, verifikasi mutasi bank otomatis, dan aktivasi e-book instan di Workbench QA: [qa-fitur-baru.html (Uji 9: QA-TOKO-01)](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/qa-fitur-baru.html).

---

## 3. Modul 2: Forum Komunitas Sekolah & Kolaborasi Antar-Siswa (Social Learning Hub)

### Latar Belakang & Tujuan
Menyediakan ruang interaksi akademik yang terlindung (*walled garden*) khusus untuk warga sekolah, mencegah gangguan dari media sosial luar, dan mendorong budaya tutor sebaya antar-siswa.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Eksplorasi Feed Linimasa Komunitas (`/informasi/komunitas`)
* **Tangkapan Layar**: [hunt_komunitas_detail_view.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_komunitas_detail_view.png)
* **Penjelasan Teknis**:
  * Linimasa komunitas menampilkan aliran diskusi yang dibuat oleh siswa dan guru di sekolah aktif (multi-tenant terisolasi).
  * Dilengkapi filter rumpun mata pelajaran (Matematika, Fisika, Biologi, Sejarah, Bahasa) serta bilah pencarian pertanyaan.

#### 2. Menulis Pertanyaan Baru & Melampirkan Latihan Soal
* **Tangkapan Layar**: [dummy3_komunitas_typing.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_komunitas_typing.png)
* **Penjelasan Teknis**:
  * Siswa mengklik kotak input penulisan diskusi.
  * Menuliskan topik kendala materi yang dihadapi, memilih tag mata pelajaran yang sesuai, dan menyematkan lampiran gambar latihan soal dari buku pelajaran.

#### 3. Interaksi Feed, Komentar Solusi & Pin Jawaban Terverifikasi Guru
* **Tangkapan Layar**: [dummy3_komunitas_posted.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_komunitas_posted.png)
* **Penjelasan Teknis**:
  * Postingan terbit langsung di dinding komunitas dengan identitas pengunggah dan penanda waktu (*timestamp*).
  * Siswa lain dapat memberikan tanda suka (*like*) dan menuliskan pembahasan di kolom komentar.
  * Guru pengampu mapel dapat memoderasi diskusi, memberikan tanda centang solusi benar, dan menyematkan (*pin to top*) jawaban terbaik agar mudah dilihat siswa lain.

---

## 4. Modul 3: Kalender Akademik Terpadu & Siaran Warta Pengumuman Sekolah

### Latar Belakang & Tujuan
Mengintegrasikan seluruh jadwal kegiatan belajar-mengajar, ujian sekolah, dan batas waktu pengumpulan tugas dengan papan siaran warta resmi pimpinan sekolah.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Kalender Agenda Akademik Interaktif Siswa (`/informasi/agenda`)
* **Tangkapan Layar**: [hunt_agenda_calendar_detail.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_agenda_calendar_detail.png)
* **Penjelasan Teknis**:
  * Tampilan kalender bulanan interaktif yang mengagregasikan seluruh kegiatan akademik.
  * Sistem penandaan visual berbasis warna:
    * 🔵 **Biru**: Penilaian Sumatif / Ujian Sekolah / PTS / PAS.
    * 🟢 **Hijau**: Batas Waktu Pengumpulan Tugas Lembar Jawab Digital (LJD).
    * 🟠 **Oranye**: Kegiatan Upacara, Ekstrakurikuler, dan Rapat Sekolah.
    * 🔴 **Merah**: Hari Libur Nasional & Cuti Bersama.

#### 2. Form Pembuatan Agenda Baru oleh Guru & Admin
* **Tangkapan Layar**: [dummy3_agenda_modal_open.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_agenda_modal_open.png) & [dummy3_agenda_form_filled.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_agenda_form_filled.png)
* **Penjelasan Teknis**:
  * Guru atau Admin menekan tombol `+ Tambah Agenda`.
  * Mengisi rincian nama kegiatan, kategori warna, rentang tanggal (mulai s.d. selesai), jam pelaksanaan, dan target audiens (Seluruh Sekolah atau Rombel Tertentu).

#### 3. Penyusunan Warta Pengumuman Resmi & Publikasi Live (`/informasi/pengumuman`)
* **Tangkapan Layar**: [dummy3_pengumuman_form_ready.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_pengumuman_form_ready.png) & [dummy3_pengumuman_after_publish.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/dummy3_pengumuman_after_publish.png)
* **Penjelasan Teknis**:
  * Admin/Kepsek menyusun warta melalui rich-text editor (heading, list, bold, link).
  * Mendukung pengunggahan dokumen lampiran surat edaran resmi berformat PDF/Word (maksimal 10 MB).
  * Pengumuman langsung tersiar dan memicu kartu warta pada dashboard beranda seluruh siswa dan tenaga pendidik.

---

## 5. Modul 4: Pusat Pengawasan Saldo Kredit AI & Koreksi Esai Cerdas (AI Token Hub)

### Latar Belakang & Tujuan
Mengatasi beban koreksi manual ratusan lembar jawaban esai guru melalui pemanfaatan model bahasa AI yang mengevaluasi esai siswa secara objektif berdasarkan rubrik capaian pembelajaran.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Monitoring Saldo & Kuota Kredit AI Sekolah (`/admin/ai-credits`)
* **Tangkapan Layar**: [audit__admin_ai_credits.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_ai_credits.png) & [kepsek_ai-credits.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/kepsek_ai-credits.png)
* **Penjelasan Teknis**:
  * Kepala Sekolah dan Tim Kurikulum memantau sisa saldo kredit AI sekolah (misal saldo 850 dari total 1.000 kredit).
  * Grafik analitik penggunaan token per bulan, log audit debet per guru/mata pelajaran, dan tombol resmi pengajuan isi ulang kuota ke BelajarPlus.

#### 2. Pemicu Koreksi Esai Otomatis Berbasis Rubrik Indikator
* **Tangkapan Layar**: [feature_hasil_detail.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/feature_hasil_detail.png)
* **Penjelasan Teknis**:
  * Pada lembar koreksi LJD siswa, guru menekan tombol **"Koreksi AI (Debet 1 Kredit)"**.
  * Model AI membaca teks jawaban esai siswa dan membandingkannya dengan kata kunci serta rubrik indikator kompetensi yang diinput guru saat merakit bank soal.
  * Evaluasi selesai dalam waktu singkat (&lt; 3 detik per lembar jawaban).

#### 3. Evaluasi Semantik Objektif & Hak Veto Guru (*Human-in-the-Loop*)
* **Tangkapan Layar**: [assignment_result.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/assignment_result.png)
* **Penjelasan Teknis**:
  * AI menerbitkan skor usulan (0–100) disertai uraian poin kekuatan dan kelemahan argumen siswa.
  * Guru memiliki hak prerogatif penuh untuk menyetujui atau mengubah skor sebelum nilai dikunci ke buku nilai rapor rombel.

> [!TIP]
> **Simulator Interaktif Live**: Anda dapat menguji inferensi AI Grader langsung, analisis kecocokan semantik rubrik kata kunci, dan konsumsi saldo token di Workbench QA: [qa-fitur-baru.html (Uji 8: QA-AI-01)](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/qa-fitur-baru.html).

---

## 6. Modul 5: Tata Kelola Koleksi Perpustakaan Digital, Kuota Kursi Lisensi (Seats) & DRM Forensik

### Latar Belakang & Tujuan
Menjamin ketersediaan buku kurikulum ber-ISBN, kepatuhan lisensi penerbit mitra, dan pencegahan pembajakan digital.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Manajemen Master Koleksi Buku Perpustakaan Sekolah (`/admin/library/collection`)
* **Tangkapan Layar**: [audit__admin_library_collection.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_library_collection.png)
* **Penjelasan Teknis**:
  * Admin perpustakaan menambahkan judul buku teks kurikulum dari katalog penerbit mitra BelajarPlus ke perpustakaan sekolah.
  * Menetapkan status aktif (dapat dipinjam siswa) atau nonaktif (arsip).

#### 2. Sirkulasi Kuota Kursi Baca / Seats & Antrean Otomatis (`/admin/library/seats`)
* **Tangkapan Layar**: [audit__admin_library_seats.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_library_seats.png)
* **Penjelasan Teknis**:
  * Model lisensi *Concurrent User Seats* (misal 50 kursi per judul).
  * Memantau daftar siswa aktif yang sedang meminjam buku dan sisa masa pinjam.
  * Siswa yang meminjam melebihi kuota dialihkan ke antrean tunggu (*waiting list*) dan otomatis mendapatkan kursi saat buku dikembalikan.

#### 3. Pengaturan Kebijakan Durasi Peminjaman (`/admin/library/settings`)
* **Tangkapan Layar**: [audit__admin_library_settings.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_library_settings.png)
* **Penjelasan Teknis**:
  * Menetapkan durasi masa aktif pinjam standar (7 hari atau 14 hari).
  * Batas maksimal peminjaman simultan per siswa (misal 3 buku paralel) dan toleransi perpanjangan mandiri.

#### 4. Pengawasan Forensik DRM & Aktivitas Mencurigakan (`/admin/library/security`)
* **Tangkapan Layar**: [audit__admin_library_security.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__admin_library_security.png)
* **Penjelasan Teknis**:
  * Log telemetri pencegahan pembajakan: pencegatan tombol PrintScreen / Snipping Tool dengan tirai hitam (*blackout veil*).
  * Watermark forensik mikro yang mengunci NISN gawai pembaca.
  * Deteksi akun anomali yang melakukan login bersamaan dari gawai berbeda.

---

## 7. Modul 6: Geofencing Presensi Satelit GPS 120m & Monitoring Kehadiran Kelas

### Latar Belakang & Tujuan
Menegakkan kedisiplinan kehadiran siswa dan guru melalui pembatasan radius geografis satelit berbasis trigonometri Haversine, pengenalan wajah selfie, dan pencatatan jurnal KBM harian.

### Alur Langkah Demi Langkah & Dokumentasi Visual

#### 1. Pengaturan Titik Koordinat GPS Sekolah (`/admin/absensi/pengaturan`)
* **Tangkapan Layar**: [audit__absensi_pengaturan.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__absensi_pengaturan.png)
* **Penjelasan Teknis**:
  * Menentukan titik koordinat lintang & bujur gerbang sekolah dan batas radius toleransi (50m, 100m, atau 120m).
  * Menetapkan jam buka kedatangan, batas jam keterlambatan, dan jam absensi kepulangan.
  * Mengatur toggle verifikasi manual (langsung hadir vs antrean verifikasi petugas piket).

#### 2. Presensi Selfie Wajah Mandiri Siswa (`/scan` & `/absensi`)
* **Tangkapan Layar**: [hunt_absensi_siswa_face_page.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_absensi_siswa_face_page.png)
* **Penjelasan Teknis**:
  * Siswa membuka menu presensi pada gawai saat tiba di sekolah.
  * Algoritma Haversine memvalidasi jarak ke titik sekolah; kamera depan mencocokkan wajah selfie (*face verification*).
  * Anomali fake GPS (&gt; 120m) otomatis ditolak atau dialihkan ke antrean verifikasi mencurigakan.

#### 3. Supervisi Presensi Kelas Real-Time Guru & Jurnal KBM
* **Tangkapan Layar**: [hunt_guru_sragen_absensi_live.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/hunt_guru_sragen_absensi_live.png) & [audit__absensi_pembelajaran.png](file:///c:/Users/user/.gemini/antigravity-ide/scratch/belajarplus-tutorial/assets/audit__absensi_pembelajaran.png)
* **Penjelasan Teknis**:
  * Guru di ruang kelas memantau daftar kehadiran rombel secara live (Hadir, Terlambat, Izin, Sakit, Alpa).
  * Menerima dokumen surat dokter untuk izin sakit dan mengunci data presensi ke lembar **Jurnal Mengajar Guru**.

---

## 8. Matriks Hak Akses & Pembagian Wewenang 6 Modul

| Modul Operasional | Siswa | Guru Pengajar | Staf / Admin Sekolah | Kepala Sekolah |
| :--- | :---: | :---: | :---: | :---: |
| **1. Toko Buku & Transaksi** | Beli Mandiri, Transfer, Cek Pesanan | Rekomendasi Buku ke Siswa | Verifikasi Mutasi, Rekap Toko | Pantau Laporan Omset |
| **2. Forum Komunitas** | Buat Diskusi, Tanya Soal, Like, Komentar | Moderasi, Jawab, Pin Solusi Terbaik | Monitoring Konten Sekolah | Supervisi Interaksi Siswa |
| **3. Agenda & Pengumuman** | Baca Jadwal, Reminder Tugas | Input Agenda Ujian / Tenggat | Buat Agenda & Warta Resmi | Otorisasi & Siaran Warta |
| **4. Kredit AI & Koreksi** | Menerima Feedback Koreksi | Koreksi Esai LJD dengan AI | Pantau Saldo & Kuota Kredit | Otorisasi Top-up Kuota AI |
| **5. Koleksi Perpustakaan** | Pinjam Buku, Membaca Digital | Deep-link Tugas Membaca | Kelola Koleksi, Lisensi & DRM | Kebijakan Perpustakaan |
| **6. Presensi GPS & Kelas** | Presensi Wajah di Radius GPS | Presensi Pembelajaran di Kelas | Set Koordinat GPS & Jam Absen | Analitik Kehadiran Siswa |

---

*Dokumen ini merupakan standar operasional prosedur resmi Repositori Panduan BelajarPlus 2026.*
