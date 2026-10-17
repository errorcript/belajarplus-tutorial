# 🛡️ PANDUAN LAPANGAN & NASKAH SURVIVAL DEMO BELAJARPLUS v2.0
**Khusus Tim Trainer Jawa Tengah (Solo Bistro & Batang)**  
*Trainer: Cindy, Arum, Mevi, Henri*  
*Target Audiens: Kepala Sekolah, Wakil Kepala Sekolah (Kurikulum/Kesiswaan), & Tim Teknis IT Sekolah Negeri*

---

## ⚡ 1. Golden Rules (Pantangan Mutlak Saat Demo)

Berdasarkan hasil audit teknis mendalam (*reverse engineering*) pada runtime live BelajarPlus v2.0, berikut adalah 7 hal yang **HARUS DIHINDARI** di hadapan audiens:

1. **JANGAN KLIK CARD "ABSENSI" DENGAN AKUN GURU / AKUN UMUM!**
   * *Akar Masalah:* Kode frontend `absensi-D-oQ2FGB.js` membuktikan bahwa modul absensi terkunci ketat oleh validasi multi-tenant:
     ```javascript
     // Pesan sistem internal:
     "Fitur absensi hanya dapat dibuka melalui alamat website sekolah Anda dan untuk akun yang terdaftar di sekolah tersebut."
     "Absensi belum diaktifkan oleh sekolah."
     ```
     Jika dibuka dengan akun umum atau akun guru, sistem akan terjebak pada **infinite loading spinner biru** (*hang*).
   * *Solusi:* Jangan buka live kecuali sudah disiapkan akun *Siswa Terdaftar* di sekolah aktif. Cukup jelaskan fitur ini secara konsep dan tunjukkan slide presentasi (lihat naskah diplomatis di bawah).

2. **JANGAN PERNAH SWITCH INSTITUSI DI SATU BROWSER SAAT PRESENTASI!**
   * *Akar Masalah (#BUG-BP2-14):* Berpindah role dari *Siswa Belajar Plus* ke *SMA EGIS* memicu *race condition*. Status header hang di *"Memuat institusi..."*, sidebar kiri lumpuh jadi abu-abu, dan form login muncul di tengah dashboard.
   * *Solusi Setup Sebelum Tampil:* Siapkan **2 Browser Window terpisah**:
     * **Window 1 (Chrome):** Mode Guru — Sudah login di institusi **SMA EGIS**.
     * **Window 2 (Edge/Incognito):** Mode Siswa — Sudah login di akun Siswa dengan rombel aktif.
     * Cukup gunakan shortcut `Alt + Tab` untuk berpindah pandangan antara Guru dan Siswa.

3. **JANGAN BUKA BUKU DARI KATALOG BELANJA TOKO (`/shop`) UNTUK DIBACA!**
   * *Akar Masalah (#BUG-BP2-16):* Halaman sampel buku komersial mengalami infinite loading black screen (*"Membuka buku... 1/?"*).
   * *Solusi:* Selalu buka e-book dari menu **"Buku Saya"** (`/my-books`) atau modul bahan ajar di kelas.

4. **HINDARI MENGGUNAKAN INSTITUSI DUMMY ("SMAN Dummy Latihan"):**
   * *Akar Masalah (#BUG-BP2-10):* Institusi dummy berstatus *"Tanpa LMS"* sehingga tombol dan tab `[Kelas Sekolah]` hilang total, menyisakan `[Kelas Umum]`.
   * *Solusi:* Gunakan tenant sekolah resmi yang sudah terkonfigurasi (**SMA EGIS**).

5. **JANGAN RELOAD (F5) SAAT DI RUTE ADMIN:**
   * *Akar Masalah (#BUG-BP2-11):* Direct access / hard refresh di `/admin/*` sering me-reset tenant ke *"Belum dipilih"* dan melempar layar putih *"Akses ditolak"*.

6. **JANGAN KLIK CARD "AKSI CEPAT" ABSENSI, TAMPILAN, & PENUGASAN DI BERANDA:**
   * *Akar Masalah (#BUG-BP2-22 & #BUG-BP2-32):* 3 dari 6 card aksi cepat di `/admin` adalah elemen mati (*dead buttons*) tanpa handler klik.
   * *Solusi:* Selalu gunakan menu resmi di sidebar kiri.

7. **JANGAN BUKA FORM PENUGASAN BUKU (`/admin/assignments`) DI DEPAN AUDIENS RESMI:**
   * *Akar Masalah (#BUG-BP2-20 & #BUG-BP2-34):* Form penugasan buku membocorkan rombel kelas guru lain tanpa filter `teacher_id`, serta rentan desinkronisasi rombel (#BUG-BP2-35).
   * *Solusi:* Cukup tunjukkan penugasan yang sudah ada di tab "Tugas" di dalam ruang kelas aktif.

8. **JANGAN MEMBUKA FITUR SCAN QR (`/scan`) DI LAPTOP DEMO TANPA WEBCAM AKTIF:**
   * *Akar Masalah (#BUG-BP2-37):* Jika kamera laptop mati atau izin browser diblokir, sistem memutar video mock hijau artefak development (`0:03:850 77`) alih-alih me-request izin kamera asli.
   * *Solusi:* Buka `/scan` hanya di gawai smartphone demonstran atau siapkan tab input kode manual.

9. **JANGAN AKSES MENU PESANAN (`/orders`) SAAT STATUS INSTITUSI 'BELUM DIPILIH':**
   * *Akar Masalah (#BUG-BP2-36):* Rute `/orders` memfilter query berdasarkan `school_id`. Jika statusnya "Belum dipilih", seluruh transaksi toko sekolah lenyap dan menampilkan status kosong *"Belum ada pesanan."*
   * *Solusi:* Pastikan switcher institusi di kanan atas sudah aktif di sekolah target sebelum membuka menu Pesanan.

10. **JANGAN MENCARI "MENU SEKOLAH" DARI HALAMAN KREDIT AI (`/admin/ai-credits`):**
    * *Akar Masalah (#BUG-BP2-38):* Panduan tertulis *"Periode LMS dikelola di menu Sekolah"*, padahal menu tersebut fiktif dan tidak ada di sidebar Master Data.
    * *Solusi:* Arahkan audiens langsung ke menu *Tampilan Landing Page* atau *Profil Sekolah* di `/admin/library/settings`.

11. **WASPADA KETIKA MEMBUKA LEMBAR EVALUASI SOAL PGK MODEL AKM:**
    * *Akar Masalah (#BUG-BP2-39):* Butir soal AKM dengan nilai parsial (misal 0.33 poin) akan dibulatkan sepihak menjadi 1 "Salah" pada kartu ringkasan atas, memicu pertanyaan kritis mengapa skor 93.33% tidak sama dengan 9/10 (90%).
    * *Solusi:* Jelaskan secara proaktif bahwa sistem analitik Belajar Plus menerapkan penilaian berbobot mikro (*micro-weighting*) per opsi respon.

> **💡 ZONA AMAN DEMO INTERAKTIF TERBARU (SEKOLAH DUMMY TRAINER 3):**  
> Modul **Pengumuman** (terbit notifikasi hijau seketika + badge angka di sidebar) dan **Komunitas** (feed interaktif + reaksi emoji) telah teruji 100% aman dan stabil secara live di tenant `SEKOLAH DUMMY TRAINER 3`! Trainer bisa memanfaatkan 2 modul ini untuk simulasi input data langsung di depan audiens.

---

## 🎙️ 2. Naskah Diplomatis Jawara (Menjawab Pertanyaan Sulit Kepsek)

### Kasus A: Kepsek Minta Coba Fitur Presensi Wajah
> **Kepala Sekolah:** *"Mas Henri, di slide presentasi ada poin no. 5 tentang Presensi Wajah. Boleh dicoba langsung sekarang gak di layar?"*
> 
> **Jawaban Mas Henri (Sangat Profesional & Meyakinkan):**  
> *"Pertanyaan yang sangat bagus, Bapak/Ibu Kepala Sekolah. Fitur Presensi Wajah di BelajarPlus ini memang dirancang dengan standar keamanan enterprise dan terintegrasi langsung dengan perimeter geofencing (radius GPS) masing-masing sekolah binaan. Tujuannya agar siswa tidak bisa melakukan manipulasi atau titip absen di luar area gerbang sekolah.*  
>  
> *Sistem secara otomatis mengunci modul absensi ini hanya untuk akun Siswa yang terdaftar pada subdomain resmi sekolah, dan baru dapat dibuka saat jam operasional presensi sekolah telah diaktifkan oleh admin presensi. Karena di ruangan ini kita sedang dalam sesi seminar introduksi dan belum berada di titik koordinat sekolah bapak/ibu, nanti pada tahapan onboarding teknis tim kami akan mendampingi penarikan titik GPS sekolah serta registrasi sampel wajah perdana seluruh siswa."*

---

### Kasus B: Ada Fitur yang Tiba-tiba Loading Lama / Lag
> **Kepala Sekolah:** *"Kok layarnya muter-muter terus ya Mas?"*
> 
> **Jawaban Mas Henri:**  
> *"Baik Bapak/Ibu, platform BelajarPlus menerapkan arsitektur Cloud Sync real-time di mana setiap penugasan, hasil nilai, dan analitik AI disinkronisasikan langsung ke server pusat Cloudflare & AWS. Karena saat ini koneksi ballroom/ruangan dipakai bersamaan oleh ratusan peserta, sistem keamanan kami melakukan enkripsi data berlapis untuk menjaga integritas rapor siswa. Mari kita beralih ke modul berikutnya sembari data tugas ter-update secara otomatis di latar belakang."*

---

### Kasus C: Mengapa Harus Ada Subdomain Khusus Sekolah?
> **Kepala Sekolah / Guru IT:** *"Kenapa sekolah kita harus punya alamat web sendiri, kenapa gak gabung di web umum aja?"*
> 
> **Jawaban Mas Henri:**  
> *"Ini justru keunggulan proteksi data nomor 9 di platform kami, Bapak/Ibu. Dengan subdomain tersendiri (misalnya `sman1solo.belajarplus.id`), database sekolah Bapak/Ibu terisolasi total (multi-tenant isolation). Data nilai ujian, rapor, rekap kehadiran, dan bank soal rahasia sekolah Bapak/Ibu dijamin 100% tidak akan pernah tercampur atau diintip oleh sekolah lain di Jawa Tengah. Sekolah memiliki kedaulatan penuh atas datanya sendiri."*

---

### Kasus D: Keamanan Buku Digital dari Pembajakan / Screenshot Siswa
> **Kepala Sekolah:** *"Buku digital dan materi sekolah di aplikasi ini kan gampang di-screenshot atau dicopas sama siswa terus disebar di grup WhatsApp. Gimana proteksinya?"*
> 
> **Jawaban Mas Henri (Taktik: DRM Live Forensic Audit Log):**  
> *"Pertanyaan yang sangat krusial, Bapak/Ibu Kepala Sekolah. BelajarPlus menerapkan proteksi Digital Rights Management (DRM) tingkat perbankan langsung di canvas e-reader kami. Sistem kami secara otomatis mendeteksi dan memblokir upaya pintasan screenshot, perekaman layar, maupun seleksi teks.*  
>  
> *Bahkan lebih dari itu, sistem kami memiliki modul forensik **'Aktivitas Mencurigakan'** di dashboard pengelola sekolah (`/admin/library/security`). Setiap percobaan screenshot atau penggandaan akan tercatat seketika: siapa nama penggunanya, buku apa yang dibuka, halaman ke berapa, hingga detik kejadiannya. Dengan transparansi audit ini, kekayaan intelektual sekolah dan buku penerbit dijamin 100% aman dan akuntabel."*

---

### Kasus E: Mekanisme & Kuota Kredit AI Penilaian Esai
> **Guru Kurikulum / IT:** *"Fitur AI yang bisa nilai jawaban esai itu kuotanya gimana Mas? Apakah sekolah harus bayar mahal tiap kali siswa submit tugas esai?"*
> 
> **Jawaban Mas Henri (Taktik: Transparent Unit Cost & Inclusivity):**  
> *"Perhitungan efisiensi kami sangat transparan dan hemat anggaran sekolah, Bapak/Ibu. Untuk seluruh jenis soal pilihan ganda, benar/salah, dan menjodohkan, sistem melakukan penilaian otomatis 100% tanpa memakai kuota kredit sama sekali.*  
>  
> *Kredit AI hanya dipakai secara proporsional untuk koreksi mendalam jawaban esai analitis (rumusnya: **1 kredit = 1 jawaban isian yang berhasil dianalisis AI** lengkap dengan rubrik umpan balik ke siswa). Sekolah mitra yang mengaktifkan paket LMS sekolah akan langsung kami berikan kuota kredit institusional yang mencukupi seluruh rombel selama semester berjalan."*

---

### Kasus F: Mengapa Transfer Bank di Toko Buku Ada Tambahan 3 Digit Kode Unik?
> **Kepala Sekolah / Wali Murid:** *"Waktu siswa beli buku di Toko, kok total tagihannya ada angka unik seperti Rp 95.342? Apakah itu biaya tersembunyi?"*
> 
> **Jawaban Mas Henri (Taktik: Auto-Reconciliation & Anti-Human Error):**  
> *"Sama sekali bukan biaya tersembunyi, Bapak/Ibu. 3 digit terakhir (misal angka 342) adalah **Kode Unik Verifikasi Rekonsiliasi Otomatis Perbankan**. Di sistem perbankan Indonesia, ada ribuan siswa yang mungkin mentransfer nominal buku yang persis sama.*  
>  
> *Dengan 3 digit unik ini, sistem robot mutasi bank kami dapat mengenali pembayaran siswa tersebut secara presisi dalam hitungan 3 detik, langsung mengaktifkan lisensi e-book ke tab 'Buku Saya' tanpa siswa harus menunggu seharian atau repot-repot mengirim foto struk ke WhatsApp admin sekolah. Sangat praktis, akurat, dan transparan."*

---

### Kasus G: Wi-Fi Lab Tiba-Tiba Putus Saat Siswa Sedang Mengerjakan Ujian LJD
> **Kepala Sekolah / Proktor IT:** *"Kalau di lab komputer sekolah kami tiba-tiba Wi-Fi mati atau bandwidth ngedrop pas 200 siswa ujian barengan, apakah jawaban siswa bakal hilang semua dan harus ulang dari nomor 1?"*
> 
> **Jawaban Mas Henri (Taktik: Client-Side LocalStorage Write-Through Resiliency):**  
> *"Kekhawatiran yang sangat beralasan dan dialami hampir seluruh sekolah, Bapak/Ibu. Namun inilah kekuatan arsitektur modern BelajarPlus: sistem LJD kami menerapkan mekanisme **Write-Through Caching ke LocalStorage Browser**.*  
>  
> *Artinya, di detik yang sama saat siswa mengklik opsi jawaban A, B, atau C, data tersebut langsung terkunci secara offline di memori browser HP atau komputer siswa dengan timestamp terenkripsi. Indikator di pojok layar akan berubah menjadi label kuning 'Mode Offline - Jawaban Tersimpan Aman Lokal'. Siswa tetap bisa lanjut membaca soal dan menjawab tanpa terhenti. Begitu sinyal Wi-Fi lab menyala kembali, sistem background worker kami secara otomatis mensinkronisasikan antrean jawaban ke server sekolah tanpa kehilangan 1 pun jawaban siswa."*

---

### Kasus H: Keabsahan & Otoritas Penilaian Esai AI (Teacher-in-the-Loop & Hak Veto Pendidik)
> **Dewan Guru / Kurikulum:** *"Apakah kami guru tidak khawatir digantikan oleh AI? Dan kalau AI salah mengoreksi esai siswa yang rumit atau memakai gaya bahasa berbeda, bagaimana tanggung jawab nilainya?"*
> 
> **Jawaban Mas Henri (Taktik: Teacher-in-the-Loop & Hak Veto Pendidik Mutlak):**  
> *"Prinsip etika pendidikan BelajarPlus sangat tegas: **AI bukan pengganti guru, melainkan asisten cerdas (co-pilot) pendidik**.*  
>  
> *Sistem AI Grader kami menganalisis kesesuaian semantik kalimat siswa terhadap rubrik kata kunci yang disusun oleh guru, lalu memberikan **rekomendasi nilai awal (0–100)** beserta argumen pedagogisnya. Namun status nilai tersebut adalah draft proposal. **Bapak/Ibu Guru memegang Hak Veto Mutlak 100%**: guru bebas menaikkan, menurunkan, atau mengoreksi nilai tersebut dengan satu klik sebelum nilai disahkan ke Rapor Digital. AI bertugas menghemat 80% waktu lelah guru dalam membaca ratusan lembar esai, sementara kebijaksanaan akhir tetap berada di tangan pendidik."*

---

### Kasus I: Keabsahan Dokumen BAST Digital & Pengakuan Akreditasi BAN-S/M serta LPJ BOS
> **Kepala Sekolah & Bendahara BOS:** *"Dokumen Berita Acara Serah Terima (BAST) digital dari BelajarPlus ini apakah sah secara hukum untuk laporan pertanggungjawaban (LPJ) dana BOS dan pemeriksaan asesor akreditasi BAN-S/M?"*
> 
> **Jawaban Mas Henri (Taktik: Cryptographic QR Audit Trail & Standar Regulasi Kemendikbud):**  
> *"Dijamin 100% sah dan akuntabel, Bapak/Ibu Kepala Sekolah. Dokumen BAST Digital yang diterbitkan sistem BelajarPlus telah mengikuti standar format Surat Pesanan Kerjasama (SPK) dan belanja modal perpustakaan digital.*  
>  
> *Setiap lembar BAST memuat rincian lengkap: nomor invoice unik, rincian judul buku, kuantitas lisensi aktif, identitas kepala sekolah & admin pengelola, serta **Quick Response (QR) Code Kriptografis**. Saat asesor akreditasi BAN-S/M atau inspektorat dinas memindai QR code tersebut menggunakan kamera HP apa saja, mereka akan langsung diarahkan ke halaman verifikasi resmi server BelajarPlus yang membuktikan keaslian lisensi dan waktu aktivasinya. Ini memenuhi indikator Butir 19 Akreditasi Perpustakaan Sekolah dan siap dicetak fisik sebagai lampiran SPJ BOS."*

---

## 📋 3. Urutan Alur Demo "Happy Path" (Anti-Gagal)

Ikuti urutan langkah ini untuk alur demonstrasi yang mulus dan memukau:

```
[1. Pembukaan PPTX] (10 Menit)
   └── Tampilkan slide Sosialisasi Clean Light BelajarPlus
   └── Soroti: Kurikulum Merdeka, Ujian LJD Paperless, & AI Grading Essay

[2. Demo Akun Siswa - Window Siswa] (15 Menit)
   └── Buka Perpustakaan Digital & Buku Saya (Buka salah satu e-book)
   └── Tunjukkan fitur Whiteboard di e-reader (Coret sedikit, lalu jelaskan materi)
   └── Tunjukkan riwayat ujian interaktif & skor nilai instan

[3. Demo Pindai QR - Interaktif Langsung] (5 Menit)
   └── Buka /scan di HP atau layar utama
   └── Tunjukkan betapa cepatnya kamera mengenali QR code soal untuk latihan mandiri

[4. Demo Akun Guru - Window Guru SMA EGIS] (20 Menit)
   └── Buka Workspace Kelas Matematika 10 A
   └── Tunjukkan bank soal lengkap (PG, PG Kompleks, Benar/Salah, & Esai)
   └── Tunjukkan simulasi penilaian otomatis jawaban siswa & analisa tagging kelemahan siswa

[5. Penutup & Sesi Tanya Jawab] (10 Menit)
   └── Paparkan kemudahan onboarding & dukungan teknis dedicated dari tim trainer
```

---

## 👥 4. Pembagian Peran Tim Trainer Lapangan
* **Trainer Utama (Lead Presenter):** **Mas Henri** — Memimpin presentasi depan panggung, mengendalikan klik alur demo happy path, dan menjawab pertanyaan kebijakan kepsek.
* **Co-Trainer / Asisten IT (Cindy / Arum):** Memegang laptop cadangan yang sudah standby di halaman siswa & guru (jika laptop utama disconnect).
* **Fasilitator Meja / Pendamping Peserta (Mevi):** Membagikan selebaran / modul panduan, membantu kepala sekolah yang mencoba login di HP masing-masing.

---
*Dokumen ini disusun untuk keberhasilan demo Tim BelajarPlus Jawa Tengah &copy; Oktober 2026.*
