# CATATAN AUDIT PIC HENRI SUSILO: KLASTER 2 & UPDATE PO SIPLAH

**Tanggal Audit:** 23 Oktober 2026  
**PIC Trainer:** Henri Susilo (`Henrisusilo00@gmail.com`)  
**Wilayah:** Klaster 2 (Jawa Tengah - Sukoharjo, Sragen, Blora) + Pembaruan Banyumas  

---

## 1. Pembaruan Pesanan Penjualan (PO Siplah) & Status Lapangan

Berdasarkan pembaruan data pesanan penjualan resmi terbaru:

| Tanggal | No. PO Pesanan | Pelanggan / Satuan Pendidikan | Kode # | Nama Barang | PO Setelah PPN | Pembayaran Siplah | No. Referensi Siplah | Status Berkas Drive | Status Live Platform | PIC Trainer |
|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **29 Jun 2026** | `PE-BYM-01` | **SMA NEGERI 1 PURWOKERTO** | `100149` | PE/LCMS 0056 | Rp55.962.315 | Rp50.154.418 | `P06A9803A140B6C` | Lengkap (791 Akun, Laporan PDF 2.2MB, Bukti Impor) | **786 Siswa** (784 di Rombel, 2 Unplaced)<br>**68 PTK**, TA 2026/2027 (22 Rombel) | **Henri** *(Catatan: Akses platform saat ini masih di switcher Mevi)* |
| **22 Jul 2026** | `PE-SKH-03` | **SMA NEGERI 1 NGUTER** | `100143` | PELCMS /0050 | Rp40.699.815 | Rp36.473.168 | `P06A9550DD32AF7` | Lengkap (Klaster 2, Folder Siswa & Guru Terpisah) | **845 Siswa (100% di Rombel, 0 Unplaced)**<br>**46 PTK**, TA 2026/2027 (24 Rombel) | **Henri** *(Akses Aktif Penuh)* |
| **25 Jul 2026** | `PE-SRG-02` | **SMA NEGERI 1 TANGEN** | `100134` | PE/LCMS 0041 | Rp17.806.065 | Rp15.951.293 | `PO6A8B9B662` | Lengkap (Klaster 2, Folder Siswa & Guru Terpisah) | **227 Siswa (100% di Rombel, 0 Unplaced)**<br>**25 PTK**, TA 2026/2027 (28 Rombel) | **Henri** *(Akses Aktif Penuh)* |

---

## 2. Struktur Berkas Google Drive Klaster 2 (Jawa Tengah)

Direktori Khusus Klaster 2 telah ditata secara standar dan terpisah antara akun siswa dan akun guru:  
📍 **Path:** `G:\My Drive\Trainer\B+\KLASTER 2 - JAWA TENGAH (BERKAS RESMI)`

Setiap sekolah memiliki struktur:
```text
[Nomor]. [Nama Sekolah]/
├── 1. Akun Siswa/
│   ├── Master_Data_Siswa_[Sekolah].xlsx
│   ├── Laporan_Resmi_Akun_[Sekolah].pdf
│   └── Per_Rombel/
│       └── [Spreadsheet per masing-masing kelas/rombel]
├── 2. Akun Guru/
│   ├── Master_Data_Guru_[Sekolah].xlsx
│   └── 1_Daftar_Akun_Guru_[Sekolah].pdf
└── PANDUAN_DISTRIBUSI_AKUN.txt
```

### Rekapitulasi 15 Sekolah Klaster 2:
1. **01. SMAN 1 Sukoharjo**: 1.281 Siswa di rombel (36 Rombel), 80 PTK.
2. **02. SMAN 2 Sukoharjo**: 965 Siswa di rombel (35 Rombel), 58 PTK.
3. **03. SMAN 3 Sukoharjo**: 1.069 Siswa di rombel (30 Rombel), 47 PTK.
4. **04. SMAN 1 Nguter**: 845 Siswa di rombel (24 Rombel), 46 PTK.
5. **05. SMAN 1 Tawangsari**: 1.039 Siswa di rombel (30 Rombel), 41 PTK.
6. **06. SMAN 1 Polokarto**: 830 Siswa di rombel (30 Rombel), 41 PTK.
7. **07. SMAN 1 Bulu**: 540 Siswa di rombel (32 Rombel), 65 PTK.
8. **08. SMAN 1 Sragen**: 1.172 Siswa di rombel (33 Rombel), 64 PTK.
9. **09. SMAN 2 Sragen**: 1.077 Siswa di rombel (30 Rombel), 38 PTK. (98 akun dummy dihapus bersih).
10. **10. SMAN 3 Sragen**: 359 Siswa di rombel (10 Rombel), 35 PTK.
11. **11. SMAN 1 Tangen**: 227 Siswa di rombel (28 Rombel), 25 PTK.
12. **12. SMAN 1 Gemolong**: 188 Siswa di rombel (12 Rombel), 51 PTK.
13. **13. SMAN 1 Sukodono**: 199 Siswa di rombel (16 Rombel), 21 PTK.
14. **14. SMAN 1 Gondang**: 201 Siswa di rombel (12 Rombel), 35 PTK.
15. **15. SMAN 1 Blora**: 0 Siswa (2 Rombel persiapan), 3 PTK (Standby menunggu Dapodik sekolah).

---

## 3. Catatan Operasional & Rekomendasi Selanjutnya

1. **SMAN 1 Purwokerto:**
   - Karena sebelumnya terdaftar di Klaster 6 (Banyumas) di bawah trainer Fitri Noveira (Mevi), akses institusi di platform saat ini masih aktif di akun Mevi (`Fitrinoveiraa@gmail.com`).
   - Disarankan admin pusat/superadmin menambahkan role trainer untuk Henri Susilo (`Henrisusilo00@gmail.com`) pada institusi SMAN 1 Purwokerto agar sinkron dengan penugasan PO Siplah `PE-BYM-01`.
2. **SMAN 1 Nguter & SMAN 1 Tangen:**
   - 100% siswa resmi telah masuk rombel (0 unplaced).
   - Seluruh berkas siap serah terima ke pihak sekolah/wali kelas.
