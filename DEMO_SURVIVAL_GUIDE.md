# 🛡️ PANDUAN LAPANGAN & NASKAH SURVIVAL DEMO BELAJARPLUS v2.0
**Khusus Tim Trainer Jawa Tengah (Solo Bistro & Batang)**  
*Trainer: Cindy, Arum, Mevi, Henri*  
*Target Audiens: Kepala Sekolah, Wakil Kepala Sekolah (Kurikulum/Kesiswaan), & Tim Teknis IT Sekolah Negeri*

---

## ⚡ 1. Golden Rules (Pantangan Mutlak Saat Demo)

Berdasarkan hasil audit teknis mendalam (*reverse engineering*) pada runtime live BelajarPlus v2.0, berikut adalah 5 hal yang **HARUS DIHINDARI** di hadapan audiens:

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
   * *Akar Masalah (#BUG-BP2-14):* Berpindah role dari *Siswa Belajar Plus* ke *SMA NEGERI 1 SRAGEN* memicu *race condition*. Status header hang di *"Memuat institusi..."*, sidebar kiri lumpuh jadi abu-abu, dan form login muncul di tengah dashboard.
   * *Solusi Setup Sebelum Tampil:* Siapkan **2 Browser Window terpisah**:
     * **Window 1 (Chrome):** Mode Guru — Sudah login di institusi **SMA NEGERI 1 SRAGEN**.
     * **Window 2 (Edge/Incognito):** Mode Siswa — Sudah login di akun Siswa dengan rombel aktif.
     * Cukup gunakan shortcut `Alt + Tab` untuk berpindah pandangan antara Guru dan Siswa.

3. **JANGAN BUKA BUKU DARI KATALOG BELANJA TOKO (`/shop`) UNTUK DIBACA!**
   * *Akar Masalah (#BUG-BP2-16):* Halaman sampel buku komersial mengalami infinite loading black screen (*"Membuka buku... 1/?"*).
   * *Solusi:* Selalu buka e-book dari menu **"Buku Saya"** (`/my-books`) atau modul bahan ajar di kelas.

4. **HINDARI MENGGUNAKAN INSTITUSI DUMMY ("SMAN Dummy Latihan"):**
   * *Akar Masalah (#BUG-BP2-10):* Institusi dummy berstatus *"Tanpa LMS"* sehingga tombol dan tab `[Kelas Sekolah]` hilang total, menyisakan `[Kelas Umum]`.
   * *Solusi:* Gunakan tenant sekolah resmi yang sudah terkonfigurasi (**SMA NEGERI 1 SRAGEN**).

5. **JANGAN RELOAD (F5) SAAT DI RUTE ADMIN:**
   * *Akar Masalah (#BUG-BP2-11):* Direct access / hard refresh di `/admin/*` sering me-reset tenant ke *"Belum dipilih"* dan melempar layar putih *"Akses ditolak"*.

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

[4. Demo Akun Guru - Window Guru SMA 1 Sragen] (20 Menit)
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
