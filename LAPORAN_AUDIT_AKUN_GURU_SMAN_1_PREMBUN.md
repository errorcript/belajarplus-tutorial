# 📋 LAPORAN AUDIT & NORMALISASI AKUN GURU (PTK) SMAN 1 PREMBUN
**Satuan Pendidikan**: SMA NEGERI 1 PREMBUN  
**ID Institusi Platform**: `733ba17d-8d7d-43f6-8361-265927bf5912`  
**Waktu Eksekusi**: 17 Oktober 2026  
**Penanggung Jawab Eksekusi**: Antigravity AI Assistant  

---

## 🔍 1. Akar Masalah (Root Cause Analysis)

### Mengapa Guru Masih Menggunakan Email Pribadi & Mengapa Akun Menjadi Double?

1. **Kronologi Impor Berulang (Dual Batch Import)**:
   - **Gelombang 1 (12 Oktober 2026)**: Sekolah pertama kali diimpor menggunakan file master awal yang berisi alamat email pribadi guru (`@gmail.com`, `@yahoo.co.id`, `@guru.sma.belajar.id`). Akun-akun ini disetujui dan berstatus **"Aktif"**.
   - **Gelombang 2 (16 Oktober 2026)**: Diterbitkan file normalisasi `[CLEAN_IMPORT_GURU] SMAN 1 Prembun.xlsx` dengan format standar resmi `@belajarplus.com` (`sman1prem_guru1@belajarplus.com` s.d. `sman1prem_guru52@belajarplus.com`).
2. **Penyebab Akun Menjadi Ganda**:
   - Sistem BelajarPlus mengidentifikasi keunikan akun berbasis **Alamat Email**, bukan Nama Lengkap atau NIP/NUPTK.
   - Ketika file kedua diimpor, sistem tidak melakukan *overwrite* terhadap baris lama, melainkan mendaftarkan baris baru untuk setiap guru dengan email `@belajarplus.com`.
3. **Penyebab Akun Resmi Belum Aktif**:
   - Seluruh baris baru `@belajarplus.com` hasil impor 16 Oktober otomatis masuk ke status antrean **"Ditangguhkan" (Suspended)**.
   - Karena belum ada eksekusi aktivasi massal, bapak/ibu guru di platform tetap berstatus aktif hanya pada baris akun email pribadi lama mereka.

---

## ⚡ 2. Tindakan yang Telah Dilakukan (Action Executed)

Melalui integrasi langsung RPC API TanStack ServerFn (`338cb13c9aa10d5bf9bbbac6a7408ce8a833f425d9483d9693ddebf46a8c1efb`) menggunakan token trainer resmi (`khansania.medtra@gmail.com`), langkah-langkah berikut telah diselesaikan 100%:

1. **Aktivasi Akun Resmi (`@belajarplus.com`)**:
   - Sebanyak **50 akun guru resmi** (`sman1prem_guru1@belajarplus.com` s.d. `sman1prem_guru51@belajarplus.com`) yang sebelumnya berstatus *Ditangguhkan* kini telah **Diaktifkan Penuh (Status: Aktif)**.
2. **Penonaktifan (Suspend) Akun Personal Duplikat**:
   - Sebanyak **53 akun guru dengan email pribadi** (`@gmail.com`, `@yahoo.co.id`, `@guru.sma.belajar.id`) telah **Dinonaktifkan (Status: Ditangguhkan)** agar bapak/ibu guru beralih menggunakan kredensial resmi sekolah.
   - *Catatan*: Riwayat kelas, presensi, dan data pembelajaran yang terhubung ke sekolah tidak hilang, namun akses login mandiri via email pribadi telah dibatasi.
3. **Pemberian Hak Pengelola (Admin Sekolah)**:
   - Peran `admin_sekolah` diberikan secara resmi kepada:
     - **Alfiani Sejati** (`sman1prem_guru1@belajarplus.com`)
     - **Wahyu Agus Sulistiyowati** (`sman1prem_guru45@belajarplus.com`)
   - Hak admin pada akun pribadi lama (`sulis_aag@yahoo.co.id`, `amrye.mcp@gmail.com`, `dwi.wisnu341`, `hastuty07`) dinonaktifkan.
4. **Proteksi Akun Dummy**:
   - Akun placeholder `Guru 53` s.d. `Guru 108` (`sman1prem_guru53` s.d. `sman1prem_guru108`) **TIDAK DIAKTIFKAN** (tetap tidak ada / tidak aktif di platform).

---

## 📊 3. Ringkasan Status Platform Terkini

| Kategori Akun | Jumlah Total | Status Aktif | Status Ditangguhkan | Keterangan |
| :--- | :---: | :---: | :---: | :--- |
| **Akun Resmi `@belajarplus.com`** | **50** | **50 (100%)** | 0 | **SIAP DIGUNAKAN** |
| **Akun Personal Duplikat** | 53 | 0 | **53 (100%)** | Dinonaktifkan (Wajib migrasi) |
| **Akun Personal Non-Duplikat** | 3 | **3** | 0 | Tetap aktif sementara |
| **TOTAL KESELURUHAN PTK** | **106** | **53** | **53** | Platform Bersih & Terpetakan |

---

## 📌 4. Catatan Khusus untuk 3 Guru Belum Memiliki Akun `@belajarplus.com`

Terdapat 3 orang pendidik yang saat ini **tetap dipertahankan status Aktif** menggunakan email pribadi mereka agar proses belajar mengajar tidak terputus, karena akun `@belajarplus.com` mereka belum terdaftar di sistem:

1. **Fajar Purnama Adji** (`fajarpurnamaadji@gmail.com`)
   - *Rencana Akun Resmi di Excel*: `sman1prem_guru11@belajarplus.com` (Pass: `JatengSchool2686`)
2. **Imron Arya Kamaludin** (`imron.arya1@gmail.com`)
   - *Rencana Akun Resmi di Excel*: `sman1prem_guru52@belajarplus.com` (Pass: `JatengSchool8192`)
3. **Teguh Arifianto** (`teguh190382@gmail.com`)
   - Bergabung mandiri pasca-impor (pengampu 10 kelas).

> **Rekomendasi Tindak Lanjut**: Daftarkan/impor kedua akun (`sman1prem_guru11` dan `sman1prem_guru52`) melalui menu *Undang PTK* atau impor susulan 2 akun, lalu suspend akun gmail keduanya setelah berhasil.

---

## 📑 5. Daftar 50 Akun Resmi Guru yang Telah Aktif

| No | Nama Lengkap Guru | Email Resmi Login BelajarPlus | Status Akun | Peran PTK |
| :-: | :--- | :--- | :---: | :---: |
| 1 | Alfiani Sejati | `sman1prem_guru1@belajarplus.com` | **Aktif** | Admin Sekolah, Guru |
| 2 | Bayu Fibri Pratama | `sman1prem_guru2@belajarplus.com` | **Aktif** | Guru |
| 3 | Budi Pramono | `sman1prem_guru3@belajarplus.com` | **Aktif** | Guru |
| 4 | Desy Aquina | `sman1prem_guru4@belajarplus.com` | **Aktif** | Guru |
| 5 | Dewanti Mustikarini | `sman1prem_guru5@belajarplus.com` | **Aktif** | Guru |
| 6 | Dwi Jayanti | `sman1prem_guru6@belajarplus.com` | **Aktif** | Guru |
| 7 | DWI SEPTIANI | `sman1prem_guru7@belajarplus.com` | **Aktif** | Guru |
| 8 | Dwi Wisnu Ari Nugrohowati | `sman1prem_guru8@belajarplus.com` | **Aktif** | Guru |
| 9 | Dyah Woro Rushanani | `sman1prem_guru9@belajarplus.com` | **Aktif** | Guru |
| 10 | Eko Ujianto | `sman1prem_guru10@belajarplus.com` | **Aktif** | Guru |
| 11 | Heni Sofiati | `sman1prem_guru12@belajarplus.com` | **Aktif** | Guru |
| 12 | Hikmah Agus Sulasih | `sman1prem_guru13@belajarplus.com` | **Aktif** | Guru |
| 13 | Ika Nuraisah | `sman1prem_guru14@belajarplus.com` | **Aktif** | Guru |
| 14 | Indri Aryanti | `sman1prem_guru15@belajarplus.com` | **Aktif** | Guru |
| 15 | Jamhari Fatturohman | `sman1prem_guru16@belajarplus.com` | **Aktif** | Guru |
| 16 | Khudlaarin Avinita Kurnia Muharatun | `sman1prem_guru17@belajarplus.com` | **Aktif** | Guru |
| 17 | Lina Nur Pujiasih | `sman1prem_guru18@belajarplus.com` | **Aktif** | Guru |
| 18 | Lindawati | `sman1prem_guru19@belajarplus.com` | **Aktif** | Guru |
| 19 | Muflikhah | `sman1prem_guru20@belajarplus.com` | **Aktif** | Guru |
| 20 | Muhammad Qodri Amri Nangim | `sman1prem_guru21@belajarplus.com` | **Aktif** | Guru |
| 21 | Mukhlisin | `sman1prem_guru22@belajarplus.com` | **Aktif** | Guru |
| 22 | Muna | `sman1prem_guru23@belajarplus.com` | **Aktif** | Guru |
| 23 | Muswakar Ismail | `sman1prem_guru24@belajarplus.com` | **Aktif** | Guru |
| 24 | Niken Prasetiati Tri Cahyaningsih | `sman1prem_guru25@belajarplus.com` | **Aktif** | Guru |
| 25 | Novanti Iswandhari | `sman1prem_guru26@belajarplus.com` | **Aktif** | Guru |
| 26 | Nurul Fitriani Dwi Ciptani | `sman1prem_guru27@belajarplus.com` | **Aktif** | Guru |
| 27 | Ophi Rahmahekha Wardhani | `sman1prem_guru28@belajarplus.com` | **Aktif** | Guru |
| 28 | PUJI HADIATI | `sman1prem_guru29@belajarplus.com` | **Aktif** | Guru |
| 29 | Puji Hartiningsih | `sman1prem_guru30@belajarplus.com` | **Aktif** | Guru |
| 30 | R Bagus Susapto Budi Jantoro | `sman1prem_guru31@belajarplus.com` | **Aktif** | Guru |
| 31 | Rani Nur Ritmawati | `sman1prem_guru32@belajarplus.com` | **Aktif** | Guru |
| 32 | Rr. Clementine Kristiani Dewi | `sman1prem_guru33@belajarplus.com` | **Aktif** | Guru |
| 33 | Sakinah | `sman1prem_guru34@belajarplus.com` | **Aktif** | Guru |
| 34 | SEPTINA KODARSIH | `sman1prem_guru35@belajarplus.com` | **Aktif** | Guru |
| 35 | Slamet | `sman1prem_guru36@belajarplus.com` | **Aktif** | Guru |
| 36 | Sri Hastuti | `sman1prem_guru37@belajarplus.com` | **Aktif** | Guru |
| 37 | Sri Rejeki | `sman1prem_guru38@belajarplus.com` | **Aktif** | Guru |
| 38 | Sri Saptoriyantini | `sman1prem_guru39@belajarplus.com` | **Aktif** | Guru |
| 39 | Susanti | `sman1prem_guru40@belajarplus.com` | **Aktif** | Guru |
| 40 | Suwarto | `sman1prem_guru41@belajarplus.com` | **Aktif** | Guru |
| 41 | Syukur Pujiono | `sman1prem_guru42@belajarplus.com` | **Aktif** | Guru |
| 42 | Tri Novita Sari | `sman1prem_guru43@belajarplus.com` | **Aktif** | Guru |
| 43 | Tunggul Adi Yuwono | `sman1prem_guru44@belajarplus.com` | **Aktif** | Guru |
| 44 | Wahyu Agus Sulistiyowati | `sman1prem_guru45@belajarplus.com` | **Aktif** | Admin Sekolah, Guru |
| 45 | Wahyuning Priastuti | `sman1prem_guru46@belajarplus.com` | **Aktif** | Guru |
| 46 | WAWAN AGUS SUPRIYONO | `sman1prem_guru47@belajarplus.com` | **Aktif** | Guru |
| 47 | Winti Lestari | `sman1prem_guru48@belajarplus.com` | **Aktif** | Guru |
| 48 | Yaenuri Rahman | `sman1prem_guru49@belajarplus.com` | **Aktif** | Guru |
| 49 | Nensi Ulfatun Khasanah | `sman1prem_guru50@belajarplus.com` | **Aktif** | Guru |
| 50 | Inggit Dewi Pangestuti | `sman1prem_guru51@belajarplus.com` | **Aktif** | Guru |

---
*Laporan ini disimpan dan disinkronkan otomatis pada database internal BelajarPlus.*
