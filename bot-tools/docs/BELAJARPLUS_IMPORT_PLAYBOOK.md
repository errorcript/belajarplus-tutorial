# BelajarPlus Bulk Import & Rombel Automation Playbook (Update 2026)

Dokumentasi & SOP otomatisasi impor akun siswa, guru/PTK, dan manajemen rombel di platform **Belajar Plus** (`https://belajarplus.com`).

---

## 1. Pembaruan Protokol & Arsitektur Platform Belajar Plus

1. **Domain Resmi:**
   * Wajib menggunakan **`https://belajarplus.com`** (bukan `.id`).

2. **Daftar URL Rute Resmi Sistem:**
   * **Dashboard Tenant:** `https://belajarplus.com/dashboard`
   * **Tahun Ajaran:** `https://belajarplus.com/master-data/tahun-ajaran` *(Update: bukan /admin/academic-years)*
   * **Manajemen Rombel:** `https://belajarplus.com/master-data/rombel` *(Update: bukan /admin/rombels)*
   * **Akun Siswa:** `https://belajarplus.com/admin/students`
   * **Akun PTK / Guru:** `https://belajarplus.com/admin/teachers`

3. **Aturan Tahun Ajaran (Step 0):**
   * Lokasi: `MASTER DATA SEKOLAH` -> `Tahun Ajaran` (`/master-data/tahun-ajaran`).
   * Hanya satu tahun ajaran dan satu semester yang aktif.
   * Rombel mengikat secara otomatis ke Tahun Ajaran yang sedang **Aktif** (`2026/2027`).

---

## 2. Spesifikasi Berkas Impor Resmi

### A. Impor Siswa (`/admin/students` -> "Impor Siswa")
* **Nama Sheet Wajib:** `Siswa` dan `Panduan`.
* **Struktur Kolom Sheet `Siswa`:**
  1. `Nama` : Wajib untuk akun baru.
  2. `Email` : Wajib (mendukung email dinas `@guru.sma.belajar.id`, `@gmail.com`, atau domain sekolah).
  3. `Password Awal` : Opsional (8–72 karakter). **Sangat disarankan diisi** (misal: `Siswa2026!`) agar akun langsung aktif instan tanpa butuh verifikasi email.
  4. `Rombel` : Opsional. **ATURAN PENTING:** Jika nama rombel sudah dibuat di Tahun Ajaran aktif (mis. `Kelas 10-1`, `X A`), siswa otomatis **LANGSUNG DITEMPATKAN KE ROMBEL** saat diimpor!
* **Batas Kapasitas:** Maksimal **500 baris per file**. Bot membatasi pada **400–450 baris per chunk** agar aman dari timeout upload browser.

### B. Impor PTK / Guru (`/admin/teachers` -> "Impor PTK") *(Fitur Terbaru)*
* **Nama Sheet Wajib:** `PTK`
* **Struktur Kolom Sheet `PTK`:**
  1. `Nama` : Nama lengkap PTK beserta gelar (contoh: `Abidin, S.Pd.`).
  2. `Email` : Alamat email PTK.
  3. `Password (opsional, min. 8)` : Password awal (contoh: `Guru2026!`). **Wajib diisi min. 8 karakter** agar akun langsung aktif sebagai Dewan Guru dan bisa langsung dipakai login.
  4. `Jadikan Guru (Ya/Tidak)` : Isi **`Ya`** agar akun langsung mendapatkan hak akses Guru mata pelajaran / wali kelas.

---

## 3. Alur Pembuatan & Penempatan Rombel

1. **Pembuatan Rombel (`/master-data/rombel` -> "Tambah Rombel"):**
   * Field Modal:
     - `Jenjang` : Pilih jenjang satuan pendidikan (`SMA/MA`, `SMK`, dll).
     - `Kelas` : Pilih tingkat (`Kelas 10`, `Kelas 11`, `Kelas 12`).
     - `Nama/Suffix` : Masukkan identitas kelas (contoh: `1`, `2`, `A`, `B`, `IPA 1`).
     - `Wali Kelas` : Pilih nama guru dari dropdown (bisa `— belum ditentukan —`).
2. **Auto-Placement via Impor Siswa:**
   * Jika Rombel sudah dibuat di Langkah 1, saat file Excel siswa diunggah dengan kolom `Rombel` yang sesuai, counter *Sudah di Rombel* akan langsung 100%!
3. **Manual / Batch Assignment Anggota Rombel:**
   * Buka kartu Rombel di `/master-data/rombel` -> klik tombol **`Anggota`**.
   * Pilih siswa yang berstatus *Belum ditempatkan*, lalu klik **`Tambahkan X siswa`**.

---

## 4. Script Bot Otomasi (`bot-tools/scripts/`)

* **`belajarplus_master_bot_v4.js`** : Master modul bot resmi dengan seluruh helper otomatisasi (impor siswa, impor guru, buat rombel, dan verifikasi tahun ajaran).
