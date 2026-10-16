# Quality Assurance (QA) & Matriks Uji Fitur-Fitur Baru Belajar Plus 2026
**Dokumen Uji Mutu Fungsional, Edge Cases & Verifikasi Lapangan untuk Kepala Sekolah & Admin Sekolah**

---

## 1. Ringkasan Eksekutif & Ruang Lingkup Pengujian

Dokumen Quality Assurance (QA) ini disusun untuk memvalidasi keandalan fungsional, integritas data, dan ketahanan logika operasional pada rilis fitur-fitur baru platform **Belajar Plus**. Pengujian mencakup seluruh ekosistem yang dikelola oleh **Kepala Sekolah** dan **Admin Sekolah**, dengan fokus utama pada alur kerja awal tahun ajaran hingga pelaporan hasil belajar akhir semester.

### Kesetaraan Otoritas & Pembagian Tanggung Jawab
* **Admin Sekolah**: Bertanggung jawab atas integritas konfigurasi teknis (Master Data, Geofencing Presensi, Impor Pengguna Massal, Penjadwalan Rombel).
* **Kepala Sekolah**: Bertanggung jawab atas supervisi mutu (Monitoring Jurnal Guru, Validasi Nilai & Kelengkapan Komponen Belajar, Kontrol Snapshot Rapor Rombel, Analitik Kemajuan Sekolah).

---

## 2. Matriks Pengujian Fitur-Fitur Baru

| ID Pengujian | Modul Sistem | Fitur / Komponen Baru | Kondisi Input & Skenario | Hasil yang Diharapkan (Acceptance Criteria) | Status QA |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **QA-ATT-01** | Presensi Digital | Toggle "Verifikasi Ulang" DIMATIKAN | Siswa melakukan absensi mandiri via gawai di dalam radius GPS toleransi (misal 50–120m). | Sistem otomatis menetapkan status **Hadir** (atau **Terlambat**) secara instan tanpa perlu tindakan manual petugas piket. | **PASSED** |
| **QA-ATT-02** | Presensi Digital | Toggle "Verifikasi Ulang" DIAKTIFKAN | Siswa melakukan absensi mandiri via gawai di dalam radius GPS. | Data presensi ditampung pada antrean **Menunggu** dan mewajibkan persetujuan verifikasi oleh petugas piket/admin. | **PASSED** |
| **QA-ATT-03** | Presensi Digital | Deteksi Anomali Jarak (Anti-Fake GPS) | Siswa mencoba presensi dari luar radius toleransi (misal 400m dari gerbang sekolah). | Sekalipun toggle verifikasi ulang dimatikan, sistem **wajib memaksa data masuk antrean verifikasi mencurigakan** untuk diverifikasi manual. | **PASSED** |
| **QA-ATT-04** | Presensi Digital | Batch Approval 500+ Siswa | Petugas menekan tombol verifikasi massal pada antrean berisi 500+ entri siswa. | Seluruh 500+ catatan presensi terproses dalam &lt; 150 ms tanpa menimbulkan freeze / unresponsiveness pada browser. | **PASSED** |
| **QA-ATT-05** | Presensi Digital | Izin & Sakit dengan Lampiran | Admin/Guru mencatat permohonan izin/sakit disertai unggahan berkas surat dokter format PDF/JPG. | Dokumen tersimpan di riwayat absensi dan status kehadiran tidak dihitung sebagai alpa/mangkir pada rekap bulanan. | **PASSED** |
| **QA-SCH-01** | Master Data Jadwal | Kelas Gabungan Lintas Rombel | 1 guru ditugaskan mengajar siswa dari 2 rombel berbeda (misal 11-1 dan 11-2) pada slot hari dan jam yang sama untuk mapel yang sama. | Sistem mengenali relasi *Cross-Rombel Joint Class* dan **tidak memunculkan peringatan salah bentrok (false conflict)**. | **PASSED** |
| **QA-ASM-01** | Asesmen & Ujian | 6 Variasi Tipe Soal | Guru/Admin menyusun bank soal berisi: MCQ, MCMA, PGK Kategori, Menjodohkan (Matching), Esai, dan Berkas Tugas. | Seluruh 6 tipe soal tersimpan dengan kunci jawaban valid dan tampil proporsional pada Lembar Jawab Digital (LJD) siswa. | **PASSED** |
| **QA-ASM-02** | Asesmen & Tugas | Unggah Berkas Tugas (Max 10 MB) | Siswa mengunggah berkas format PDF/Word/JPG berukuran 9.5 MB vs 11.5 MB. | Berkas &le; 10 MB berhasil diunggah; berkas &gt; 10 MB ditolak seketika di sisi klien dengan notifikasi ukuran melebihi batas. | **PASSED** |
| **QA-ASM-03** | Asesmen & Ujian | Fitur "Pratinjau Asesmen" | Kepsek/Admin/Guru menekan tombol "Pratinjau" sebelum asesmen dirilis resmi. | Pengguna dapat mencoba mengerjakan soal seperti siswa, namun **tidak ada record sesi ujian palsu atau jejak nilai kotor di database**. | **PASSED** |
| **QA-GRD-01** | Hasil Belajar | Pembedaan Kritis `NULL` vs `0` | Siswa A memiliki nilai 85, Siswa B nilai 95, Siswa C kosong (`NULL` / belum dinilai), Siswa D nilai `0` resmi. | Rata-rata kelas dihitung: `(85 + 95 + 0) / 3 = 60.00`. Siswa C diabaikan dari pembagi dan ditandai *Belum Lengkap*, bukan dipukul rata menjadi 0. | **PASSED** |
| **QA-GRD-02** | Hasil Belajar | Bobot Aktivitas Wajib 100% | Pengaturan bobot manual antara Aktivitas Soal dan Aktivitas Non-Tes diinput total 90% atau 105%. | Sistem memblokir penyimpanan dan mewajibkan akumulasi bobot tepat 100% (atau mengaktifkan opsi Bobot Sama). | **PASSED** |
| **QA-GRD-03** | Hasil Belajar | Validasi Kirim ke Rapor Rombel | Guru/Admin menekan tombol "Kirim ke Rapor" saat masih terdapat komponen wajib siswa yang belum dinilai. | Sistem menampilkan status *Perlu Dilengkapi* dan menandai siswa yang belum tuntas, mencegah pengiriman data nilai prematur. | **PASSED** |
| **QA-GRD-04** | Hasil Belajar | Penguncian Snapshot Rapor Resmi | Nilai yang telah tuntas dikonfirmasi kirim ke buku nilai Wali Kelas. | Sistem mengunci nilai menjadi **snapshot resmi (immutable)**; nilai tidak dapat diubah sepihak tanpa mekanisme revisi resmi. | **PASSED** |
| **QA-LIB-01** | Perpustakaan | Deep-Link Tugas Membaca | Guru menugaskan Bab 3 Halaman 42 buku Antropologi 11; siswa mengklik tautan tugas di akun mereka. | E-reader otomatis memuat dan membuka langsung halaman 42 Bab 3 tanpa siswa harus membalik halaman secara manual. | **PASSED** |
| **QA-LIB-02** | Perpustakaan | Sirkulasi Kuota Lisensi (Seats) | Sekolah memiliki kuota 50 kursi buku; siswa ke-51 meminjam buku. | Siswa ke-51 masuk antrean tunggu (*waiting list*); eksemplar otomatis dialokasikan saat siswa lain mengembalikan atau masa aktif habis. | **PASSED** |
| **QA-LIB-03** | Perpustakaan | Keamanan DRM Forensik | Pengguna mencoba mengambil screenshot atau merekam layar e-reader. | Modul forensik mendeteksi aktivitas, menampilkan layar hitam anti-capture, dan mencatat log kejadian di `/admin/library/security`. | **PASSED** |
| **QA-LKPD-01** | LKPD Interaktif | Pengerjaan LJD Stimulus &amp; 6 Tipe Respon | Siswa mengerjakan LKPD berisi stimulus observasi + MCQ, MCMA, Benar/Salah, Menjodohkan, Esai AI, dan Berkas &le; 10MB. | Sistem merespon interaksi seketika, auto-scoring kalkulasi instan, dan menerbitkan radar penguasaan kompetensi dasar. | **PASSED** |
| **QA-LKPD-02** | Aktivitas Belajar | Penyematan Modul Web / HTML5 (PhET/GeoGebra) | Guru menyematkan modul simulasi sains interaktif di tab Aktivitas Belajar via sandboxed container. | Simulasi fisika/matematika berjalan 60 FPS di dalam aplikasi tanpa reload browser atau memicu false anti-cheat flag. | **PASSED** |
| **QA-LKPD-03** | Penilaian Non-Tes | Rubrik Praktikum &amp; Dokumen Tugas &le; 10MB | Guru menginput penilaian kinerja eksperimen (Kesiapan, Prosedur, Analisis, Laporan) skala 0–100. | Nilai otomatis terakumulasi; siswa absen dipertahankan `NULL` (tidak merusak rata-rata rombel), siap kunci ke e-Rapor. | **PASSED** |

---

## 3. Analisis Kasus Batas (Edge Cases) & Penanganan Kegagalan

### 3.1. Penanganan Nilai NULL (Belum Dinilai) vs Nilai 0 Resmi
* **Risiko Potensial**: Apabila input kosong dari guru langsung dikonversi menjadi integer `0`, siswa yang sakit atau belum mengikuti penilaian susulan akan menjatuhkan rata-rata rombel secara drastis, serta merugikan siswa saat penentuan peringkat paralel.
* **Solusi & Verifikasi**:
  1. Di level database, kolom `score` wajib bertipe nullable (`DECIMAL(5,2) NULL`).
  2. Fungsi agregasi rata-rata menggunakan formula:
     $$\text{Rata-rata} = \frac{\sum_{i \in \text{Graded}} \text{Nilai}_i}{|\text{Graded}|}$$
     di mana siswa dengan status `NULL` dikeluarkan dari himpunan $|\text{Graded}|$.
  3. Indikator UI membedakan warna secara visual: `NULL` = Label Kuning *"Belum Dinilai"*, `0` = Label Merah *"Skor 0 (Remedial)"*.

### 3.2. Geofencing Loncatan Koordinat (GPS Spoofing / Mock Location)
* **Risiko Potensial**: Penggunaan aplikasi fake GPS oleh siswa di luar lingkungan sekolah untuk check-in otomatis.
* **Solusi & Verifikasi**:
  1. Validasi geofencing dilakukan di dua lapis (Client GPS API + Reverse Geocoding ISP IP Check).
  2. Kecepatan perpindahan antar-presensi (Speed Delta) dimonitor; jika perpindahan melebihi ambang fisik realistis (&gt; 80 km/jam dalam selang 2 menit), presensi ditandai sebagai anomali koordinat.
  3. Setiap presensi dengan akurasi rendah (&gt; 50 meter) otomatis dialihkan ke antrean verifikasi manual.

### 3.3. Batas Ukuran Berkas Tugas 10 MB
* **Risiko Potensial**: Pengunggahan berkas video besar atau script berbahaya (.php/.exe) yang membebani kapasitas server sekolah.
* **Solusi & Verifikasi**:
  1. **Validasi Klien**: File reader langsung memeriksa `file.size <= 10485760` bytes sebelum stream unggah dimulai.
  2. **Validasi Ekstensi & MIME**: Hanya mengizinkan `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, `application/msword`, `image/jpeg`, `image/png`.
  3. **Penamaan Acak Terenkripsi**: Berkas disimpan dengan penamaan hash UUID untuk mencegah path traversal attack.

### 3.4. Penguncian Immutability Snapshot Nilai Rapor
* **Risiko Potensial**: Perubahan nilai susulan yang tidak terdokumentasi setelah buku rapor dicetak dan diserahkan ke wali murid.
* **Solusi & Verifikasi**:
  1. Saat tombol *Kirim ke Rapor* dikonfirmasi, sistem membuat salinan snapshot terpisah dengan timestamp presisi dan identitas admin/guru penandatangan.
  2. Dihasilkan string hash verifikasi (SHA-256) pada berkas nilai. Jika ada perubahan pada tabel kelas asal, tabel snapshot rapor tetap tidak berubah.

### 3.5. Arsitektur LKPD Interaktif & Modul Web/HTML Sandbox
* **Risiko Potensial**: Script eksternal pada modul HTML5 atau PhET simulation mengganggu sesi browser siswa atau memicu false anti-cheat trigger saat siswa berinteraksi dengan canvas simulasi.
* **Solusi & Verifikasi**:
  1. **Sandboxed Iframe**: Modul web interaktif disematkan dengan atribut `sandbox="allow-scripts allow-same-origin allow-forms"`, mengisolasi modul dari akses ke token sesi atau cookie induk Belajar Plus.
  2. **Focus State Whitelisting**: Interaksi pointer/mouse di dalam area simulasi dinyatakan sah (*valid in-app engagement*) dan tidak memicu penambahan counter pelanggaran anti-cheat.
  3. **Multi-Model Flexibility**: Mendukung 3 model sekaligus: Native LJD (auto-scoring 6 tipe soal), Interactive Web Simulation (PhET/GeoGebra/H5P di Tab Aktivitas Belajar), dan Practical Worksheet Upload (&le; 10 MB) dengan rubrik non-tes.

---

## 4. Panduan Uji Lapangan untuk Tim Trainer & Sosialisasi

1. **Uji Simulasi Langsung di Lapangan**:
   Akses portal simulasi interaktif Belajar Plus di:
   `https://[subdomain].belajarplus.id/qa-fitur-baru.html`
2. **Langkah Demonstrasi di Depan Kepala Sekolah & Dewan Guru**:
   * Tunjukkan **Pembedaan Nilai NULL vs 0** di kalkulator simulator untuk meyakinkan guru bahwa sistem tidak merugikan nilai siswa.
   * Tunjukkan **Toggle Opsi Verifikasi Presensi** dan buktikan bagaimana siswa di luar radius GPS 120m otomatis tertahan di antrean petugas.
   * Buka **Mode Pratinjau Asesmen** untuk mendemonstrasikan bahwa pimpinan dapat meninjau mutu soal ujian tanpa merusak database sekolah.
   * Tampilkan **Dukungan Kelas Gabungan** untuk menyelesaikan kendala pembagian jam mengajar guru agama lintas rombel.

---

## 5. Lembar Persetujuan & Tanda Tangan UAT (Sign-off)

Dokumen Quality Assurance ini telah diuji dan diverifikasi kesesuaiannya dengan spesifikasi operasional kurikulum sekolah:

| Peran Verifikator | Nama Pejabat / Petugas | Tanggal Verifikasi | Status Persetujuan |
| :--- | :--- | :---: | :---: |
| **Kepala Sekolah** | _______________________ | 16 Oktober 2026 | [  ] DISETUJUI / SIAP DIGUNAKAN |
| **Admin Sekolah / Kurikulum** | _______________________ | 16 Oktober 2026 | [  ] DISETUJUI / SIAP DIGUNAKAN |
| **Lead QA & Trainer Belajar Plus** | Tim Trainer Solo & Batang | 16 Oktober 2026 | [x] TERVERIFIKASI LIVE RUNTIME |

---
*Dokumen ini merupakan bagian resmi dari Repositori Panduan & Tutorial Belajar Plus 2026.*
