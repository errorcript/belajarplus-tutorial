# Panduan Operasional & Otomasi 7 SMA Negeri Purbalingga (BelajarPlus)

Dokumen ini mendokumentasikan seluruh alur troubleshooting teknis, arsitektur bot, dan solusi otomatisasi yang dikembangkan selama proses sinkronisasi 7 SMA Negeri di Purbalingga:
1. **SMAN 1 Kutasari** (500 Siswa / 14 Rombel)
2. **SMAN 1 Rembang** (576 Siswa / 16 Rombel)
3. **SMAN 2 Purbalingga** (716 Siswa / 20 Rombel)
4. **SMAN 1 Bobotsari** (720 Siswa / 20 Rombel)
5. **SMAN 1 Karangreja** (648 Siswa / 18 Rombel)
6. **SMAN 1 Bukateja** (360 Siswa / 10 Rombel)
7. **SMAN 1 Kemangkon** (100 Siswa / 3 Rombel)

---

## 🎯 1. Ringkasan Masalah Lapangan & Root Cause

### A. Masalah Gap Jumlah Siswa (PDF/Excel vs Platform)
* **Gejala**: Di Excel/PDF resmi ada 716 siswa (SMAN 2 Purbalingga), 648 (Karangreja), 360 (Bukateja), tapi di platform BelajarPlus jumlahnya jauh lebih sedikit (~590 di Purbalingga 2, ~547 di Karangreja, ~234 di Bukateja).
* **Root Cause Teknis**:
  1. Modal impor BelajarPlus menganut prinsip **All-or-Nothing validation**.
  2. Apabila dalam satu file Excel chunk terdapat **1 baris saja** yang statusnya `Gagal` (misalnya karena email ganda sekolah seperti `smansaka.pbg@gmail.com` atau `sman1kmk@yahoo.com`) atau `Konflik` (operasi pembuatan akun tertahan di backend), maka tombol **"Impor" otomatis DISABLED**.
  3. Akibatnya, puluhan sampai ratusan siswa yang sebenarnya berstatus `Siap` di dalam chunk tersebut **ikut gagal terimpor ke database**, sehingga terjadi selisih jumlah siswa.
* **Solusi**:
  1. Ekstrak data siswa yang belum terdaftar di platform (`find_missing_bukateja.js`).
  2. Sanitasi email konflik/ganda agar setiap baris memiliki email unik yang valid.
  3. Upload file bersih tersebut (`Siap: 100%`, `Konflik: 0`, `Gagal: 0`) -> Tombol "Impor" aktif -> Seluruh siswa langsung masuk dan jumlah di platform genap 100% cocok dengan Excel/PDF master.

### B. Masalah Siswa "Salah Kamar" (Includes vs Exact Match)
* **Gejala**: 130 siswa Kelas 11 (seperti `Kelas 11-XIA`, `XIB`, dll) salah masuk ke rombel `Kelas 10-XI`.
* **Root Cause Teknis**:
  * Penggunaan matcher substring `.includes()`. Ketika mengecek target `xia`, pencocokan `.includes('xi')` mengembalikan `true` untuk rombel kelas 10 bertitel `XI`.
* **Solusi & Aturan Wajib**:
  * **Wajib menggunakan EXACT MATCH** pada suffix rombel:
    ```javascript
    const targetRombel = rombels.find(r => {
      const rSufClean = (r.suffix || '').replace(/[^0-9a-z]/gi, '').toLowerCase();
      const tClean = targetRombelName.replace(/[^0-9a-z]/gi, '').toLowerCase();
      return rSufClean === tClean;
    });
    ```
  * Untuk membersihkan siswa yang salah kamar, ambil member rombel melalui endpoint TanStack ServerFn `/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d`, filter yang salah kamar, lalu keluarkan via endpoint `/_serverFn/853e20cd5cfe0f8fb6d0e40816ee7a27d414247af74e7978a9be05157e8f8f9e`.

### C. Masalah PDF Kosong / Nama Siswa & Rombel Strip (`-`)
* **Gejala**: Pada PDF lama SMAN 1 Rembang, nama siswa strip (`-`), rombel tertulis `Belum Ditentukan`, dan email login tertulis email dummy sekolah.
* **Root Cause**:
  * File Excel sumber di Google Drive menggunakan format kolom lama (Moodle style): `firstname`, `cohort`, `username`. Script generator PDF mencari kolom `Nama` dan `Rombel`. Karena kolom tidak ditemukan, nilainya menjadi undefined dan tercetak `-`.
* **Solusi**:
  * Normalisasi data ke format standar BelajarPlus: `Nama`, `Email`, `Password Awal`, `Rombel`.
  * Regenerate PDF resmi menggunakan Playwright headless browser dengan layout A4 Berita Acara resmi + lampiran kredensial per rombel (`fix_rembang_pdf.js`).

---

## ⚡ 2. TanStack ServerFn RPC Reference

Platform BelajarPlus menggunakan TanStack Start RPC endpoints. Berikut referensi pemanggilan langsung dari script bot:

| Fungsi | Method | Endpoint ServerFn | Payload Ringkas |
|---|---|---|---|
| **Daftar Rombel** | POST | `/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87` | `{ yearId }` |
| **Kandidat Unassigned** | POST | `/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5` | `{ rombelId, q: '' }` |
| **Assign ke Rombel** | POST | `/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd` | `{ rombelId, studentIds: [...] }` |
| **Ambil Anggota Rombel** | POST | `/_serverFn/ddb25d03d56501b10734f908f4b7c19e66fc5c223c6627114c020066492cc67d` | `{ rombelId }` |
| **Keluarkan dari Rombel**| POST | `/_serverFn/853e20cd5cfe0f8fb6d0e40816ee7a27d414247af74e7978a9be05157e8f8f9e` | `{ memberId }` |

> **Header Wajib**:
> ```javascript
> headers: {
>   'Content-Type': 'application/json',
>   'Authorization': `Bearer ${accessToken}`,
>   'x-school-override': schoolId,
>   'x-tsr-serverfn': 'true',
>   'accept': 'application/x-tss-framed, application/x-ndjson, application/json'
> }
> ```

---

## 🛠️ 3. Daftar Script Baru di `bot-tools/scripts/`

1. `run_remaining_4_schools_master.js`:
   * Runner master otomatis multi-sekolah untuk SMAN 1 Bobotsari, Karangreja, Kemangkon, dan Bukateja.
   * Alur: setup/aktifkan TA -> buat rombel otomatis -> impor chunk -> assign siswa via EXACT MATCH -> screenshot bukti.
2. `run_pbg2_final_clean.js`:
   * Script pembersihan massal siswa salah kamar di SMAN 2 Purbalingga dan re-assign 589+ siswa ke 20 rombel resmi.
3. `fix_rembang_pdf.js`:
   * Generator PDF Berita Acara & Lampiran 16 Rombel (33 halaman) SMAN 1 Rembang dengan data nama, kelas, email, dan password lengkap.
4. `fix_kemangkon_perfect.js`:
   * Setup instan SMAN 1 Kemangkon (Tahun Ajaran baru, 3 rombel `XI A-C`, impor, dan assign 86 siswa).
5. `find_missing_bukateja.js` & `test_clean_import_bukateja.js`:
   * Auditor selisih siswa antara Excel master vs platform dan generator payload bersih tanpa error validasi.

---

## 🚀 4. Cara Menjalankan Bot untuk Trainer Lain

1. **Persiapan Dependensi**:
   ```bash
   cd bot-tools
   npm install playwright xlsx
   ```
2. **Jalankan Bot Master**:
   ```bash
   node scripts/run_remaining_4_schools_master.js
   ```
3. **Regenerate PDF Laporan Resmi**:
   ```bash
   node scripts/fix_rembang_pdf.js
   ```
Semua screenshot bukti visual akan tersimpan otomatis di direktori bukti dan dapat diaudit sewaktu-waktu.
