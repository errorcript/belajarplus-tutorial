# BelajarPlus Bulk Import & Rombel Automation Playbook

Dokumentasi & SOP otomatisasi impor akun siswa dan penempatan rombel di platform **Belajar Plus** (`https://belajarplus.id`).

---

## 1. Arsitektur & Aturan Platform Belajar Plus

1. **Akses Tenant (Sekolah):**
   * URL internal `/admin/students`, `/master-data/rombel`, atau `/master-data/tahun-ajaran` **tidak bisa dibuka langsung dari luar**.
   * Wajib login (`https://belajarplus.id/auth`), masuk `/dashboard`, lalu pilih/masuk ke tenant sekolah target (misal: `SMA NEGERI 1 SRAGEN`, `SEKOLAH DUMMY TRAINER 3`, dll).

2. **Aturan Krusial: Tahun Ajaran & Semester (Wajib Step 0):**
   * Lokasi: `MASTER DATA SEKOLAH` -> `Tahun Ajaran` (`https://belajarplus.id/master-data/tahun-ajaran`).
   * **Rule Platform:** *"Hanya satu tahun ajaran dan satu semester yang aktif. Menjadi dasar Rombel, Jadwal, dan Rapor."*
   * **Wajib diperiksa sebelum buat Rombel atau Impor Siswa:**
     * Jika belum ada: Klik `+ Tambah` -> isi Nama (contoh: `2026/2027`), Tanggal Mulai & Selesai -> klik `Simpan`.
     * Jika status masih **`Akan Datang`**: Wajib klik tombol **`Aktifkan`** pada kartu Tahun Ajaran hingga badge berubah hijau **`Aktif`**.
     * Atur periode **`Semester 1`** dan **`Semester 2`** via tombol `Atur`.

3. **Format File Excel Impor Siswa:**
   * Nama Sheet Utama: `Siswa`
   * Kolom (Header baris 1):
     * `Nama` : Wajib untuk akun baru.
     * `Email` : Wajib (format unik, misal `siswaXXX@...`).
     * `Password Awal` : Opsional (8–72 karakter). **Rekomendasi diisi** (misal: `Siswa2026!`) agar akun langsung aktif instan tanpa butuh verifikasi email manual.
     * `Rombel` : Opsional. Jika nama rombel sudah ada di sistem dan tahun ajaran aktif, otomatis ditempatkan saat pertama kali impor. Jika belum, siswa tetap dibuat dan berstatus "Belum ditempatkan".
   * Sheet Tambahan: `Panduan` (opsional untuk dokumentasi template).

4. **Batasan Sistem (Kapasitas Impor per File):**
   * Platform Belajar Plus mendukung impor hingga **500 baris data akun siswa sekaligus** per file Excel.
   * Jika data siswa di atas 500, data dipecah dengan batas **500 baris per batch** (misal: Batch 1: 1-500, Batch 2: 501-1000, dst).
   * Untuk sekolah dengan kapasitas 300–500 siswa, seluruh data bisa selesai dalam **1 kali upload**.

5. **SOP Pembuatan & Penempatan Rombel:**
   * **Bikin Rombel:** Buka `/master-data/rombel` -> klik `+ Tambah Rombel` -> pilih Jenjang (`SMA/MA`), Kelas (`Kelas 10`), Suffix (`A`). Format resmi yang dihasilkan: `Kelas 10-A`. Rombel otomatis mengikat ke Tahun Ajaran yang sedang **Aktif**.
   * **Penempatan Anggota:**
     * Buka `/master-data/rombel` -> klik tombol `Anggota` pada kartu rombel target.
     * Centang siswa dari daftar -> tombol `Tambahkan X siswa` akan aktif -> klik untuk submit ke database.

---

## 2. Tool Skrip Otomasi yang Sudah Tersedia

Di direktori `C:\Users\errorscript\.gemini\antigravity-ide\scratch\`:

| Nama Skrip | Fungsi |
|---|---|
| `inspect_and_setup_ta.js` | Memeriksa dan otomatis mengaktifkan Tahun Ajaran & mengatur Semester. |
| `generate_dummy_students.js` | Generator data siswa realistis Indonesia, auto-chunking (mendukung hingga 500 baris per file). |
| `auto_create_rombels.js` | Otomatis membuat 12 Rombel standar (Kelas 10 A-D, 11 A-D, 12 A-D). |
| `import_all_batches.js` | Mengunggah batch file Excel secara berurutan, menangani retry timeout otomatis. |
| `populate_all_12_rombels.js` | Otomatis membuka modal tiap rombel, memilih siswa yang belum ditempatkan, dan men-submit ke rombel. |

---

## 3. Alur SOP Standar Setiap Dapat Sekolah Baru:

1. **Step 0 - Cek & Set Tahun Ajaran:** Buka `/master-data/tahun-ajaran`, pastikan Tahun Ajaran sudah ada dan berstatus **`Aktif`** (bukan *Akan Datang*).
2. **Step 1 - Buat Rombel Target:** Buka `/master-data/rombel`, buat rombel yang dibutuhkan (`Kelas 10-A`, dst) agar strukturnya siap di Tahun Ajaran aktif.
3. **Step 2 - Persiapkan Data Siswa:** Susun file Excel (maks 500 baris per file). Sertakan `Nama`, `Email`, `Password Awal`, dan `Rombel`.
4. **Step 3 - Eksekusi Impor Siswa:** Upload via modal impor di `/admin/students`.
5. **Step 4 - Verifikasi Akhir:** Cek dashboard `/admin/students` -> pastikan counter *Sudah di Rombel* = 100% dan *Belum di Rombel* = 0.
