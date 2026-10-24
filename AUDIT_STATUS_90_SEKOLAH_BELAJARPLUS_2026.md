# Laporan Audit Komprehensif Satuan Pendidikan BelajarPlus (Jawa Tengah & Mitra)
**Status Integrasi Laporan PDF, Master Clean Data, dan Live Platform (Siswa, Rombel, Guru, & TA 2026/2027)**  
*Waktu Audit Sistem: Minggu, 18 Oktober 2026 &bull; Lead System Engineer & Tim Trainer BelajarPlus*

> [!IMPORTANT]
> **Akses Berkas Akun & Laporan Resmi Seluruh Sekolah:**  
> Seluruh master file Excel akun peserta didik ([CLEAN_IMPORT] ... .xlsx) serta dokumen PDF resmi serah terima kredensial dapat dicek dan diunduh langsung melalui Google Drive berikut:  
> ðŸ”— **[Buka Google Drive Berkas Akun BelajarPlus](https://drive.google.com/drive/folders/1GyqQbq8a8N6gl5RoxvD-bGoguqOjNomV)**

---

## 1. Executive Summary & Dashboard Metrik Utama

Berdasarkan audit menyeluruh terhadap **87 folder satuan pendidikan** di direktori Google Drive yang mencakup **95 sekolah mitra** (termasuk konsorsium 10 SMA Swasta di Tasikmalaya) yang diverifikasi langsung dengan database produksi live BelajarPlus melalui API resmi PIC Trainer:

| Indikator Evaluasi | Jumlah Folder | Persentase | Keterangan Operasional |
| :--- | :---: | :---: | :--- |
| **KATEGORI 1: SUDAH LENGKAP & LIVE 100%** | **86 Folder (95 Sekolah)** | **98.9%** | Seluruh akun siswa terimpor dengan password resmi utuh, rombel terbentuk, peserta didik terpetakan ke kelas masing-masing, TA 2026/2027 & Semester 1 aktif 100% di server produksi. |
| **KATEGORI 2: ON HOLD (MENUNGGU DATA SUSULAN SENIN)** | **1 Sekolah** | **1.1%** | **SMA Islam Sudirman Ambarawa (ISSUDA)**: Berkas arsip Laporan PDF resmi 50 PTK & 1.156 Siswa di Drive lengkap. Sesuai instruksi operasional, status **STRICTLY ON HOLD** menunggu data susulan hari Senin. |
| **KATEGORI 3: DATA MENTAH / BELUM SANITASI** | **0 Sekolah** | **0%** | Seluruh data mentah telah 100% tuntas disanitasi ke template resmi clean import Excel. |
| **KATEGORI 4: TANPA PDF RESMI** | **0 Sekolah** | **0%** | Seluruh sekolah memiliki dokumen PDF serah terima kredensial akun di Google Drive masing-masing. |
| **TOTAL DATA AKTIF LIVE SAAT INI** | **87 Satuan Unit** | **100%** | **Total Siswa Live: 41,905 Siswa &bull; Total Rombel: 1,267 Rombel Aktif** |

---

## 2. Ringkasan Eksekutif Distribusi Trainer (PIC)

Berikut adalah rekapitulasi data riil yang telah aktif secara *live* pada platform produksi BelajarPlus berdasarkan pembagian PIC Trainer:

1. **Rumaisha / Arum (Klaster Purbalingga, Kebumen, Pekalongan & Banjarnegara)**:
   - **Total:** **15 Unit / 15 Live 100%** &bull; **9.838 Siswa Live** &bull; **259 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 1 Kajen (2.066 siswa, 33 rombel), SMAN 2 Wonosobo (1.074 siswa, 36 rombel), SMAN 1 Kebumen (723 siswa, 21 rombel), SMAN 1 Kutowinangun (720 siswa, 25 rombel), SMAN 1 Bobotsari (715 siswa, 20 rombel), SMAN 2 Purbalingga (712 siswa, 19 rombel), SMAN 1 Sragi (666 siswa, 19 rombel), SMAN 1 Karangreja (642 siswa, 18 rombel), SMAN 1 Rembang (571 siswa, 16 rombel), SMAN 1 Kutasari (496 siswa, 14 rombel), SMAN 1 Wadaslintang (432 siswa, 18 rombel), SMAN 1 Bojong (361 siswa, 1 rombel), SMAN 1 Karangkobar (344 siswa, 10 rombel), SMAN 1 Mirit (214 siswa, 6 rombel), SMAN 1 Kemangkon (102 siswa, 3 rombel).

2. **Adnan Cindyana / Cindy (Klaster Semarang, Batang & Kendal)**:
   - **Total:** **14 Unit / 13 Live 100% (1 On Hold ISSUDA)** &bull; **7.170 Siswa Live** &bull; **226 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 2 Ungaran (1.331 siswa, 36 rombel), SMAN 1 Ambarawa (1.257 siswa, 35 rombel), SMAN 10 Semarang (1.090 siswa, 31 rombel), SMAN 11 Semarang (1.066 siswa, 38 rombel), SMAN 1 Tuntang (593 siswa, 29 rombel), SMAN 7 Semarang (516 siswa, 22 rombel), SMAN 1 Weleri (318 siswa, 9 rombel), SMAN 1 Bawang (235 siswa, 12 rombel), SMAN 1 Subah (223 siswa, 4 rombel), SMAN 1 Batang (144 siswa, 4 rombel), SMAN 1 Bandar (144 siswa, 4 rombel), SMAN 13 Semarang (144 siswa, 1 rombel), SMAN 2 Batang (109 siswa, 1 rombel).
   - *On Hold:* SMA Islam Sudirman Ambarawa (50 PTK, 1.156 Siswa) - menunggu data susulan Senin.

3. **Andrew Aliffiansyah (Klaster Surakarta & Klaten)**:
   - **Total:** **14 Unit / 14 Live 100%** &bull; **6.935 Siswa Live** &bull; **194 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 7 Surakarta (1.172 siswa, 30 rombel), SMAN 1 Kartasura (1.166 siswa, 33 rombel), SMAN 6 Surakarta (746 siswa, 22 rombel), SMAN 8 Surakarta (585 siswa, 16 rombel), SMAN 4 Surakarta (582 siswa, 16 rombel), SMAN 3 Klaten (526 siswa, 10 rombel), SMAN 3 Surakarta (423 siswa, 12 rombel), SMAN 1 Klaten (394 siswa, 11 rombel), SMAN 2 Klaten (361 siswa, 10 rombel), SMAN 5 Surakarta (353 siswa, 10 rombel), SMA Budi Utomo Surakarta (197 siswa, 6 rombel), SMAN 9 Surakarta (162 siswa, 6 rombel), SMAN 2 Surakarta (158 siswa, 6 rombel), SMAN 1 Surakarta (110 siswa, 6 rombel).

4. **Henri Susilo (Klaster Sragen & Sukoharjo)**:
   - **Total:** **14 Unit / 14 Live 100%** &bull; **5.779 Siswa Live** &bull; **214 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 1 Sukoharjo (1.282 siswa, 36 rombel), SMAN 3 Sukoharjo (1.069 siswa, 30 rombel), SMAN 1 Bulu (541 siswa, 16 rombel), SMAN 2 Sukoharjo (522 siswa, 27 rombel), SMA 1 Tawangsari (436 siswa, 30 rombel), SMAN 1 Sragen (386 siswa, 11 rombel), SMAN 1 Nguter (344 siswa, 10 rombel), SMAN 3 Sragen (250 siswa, 7 rombel), SMAN 1 Sukodono (275 siswa, 8 rombel resmi), SMAN 1 Gemolong (187 siswa, 5 rombel), SMAN 1 Gondang (183 siswa, 5 rombel), SMAN 1 Tangen (174 siswa, 5 rombel), SMAN 1 Polokarto (118 siswa, 24 rombel), SMAN 2 Sragen (98 siswa, 3 rombel).

5. **Fitri Noveira / Mevi (Klaster Cilacap & Banyumas)**:
   - **Total:** **13 Unit / 13 Live 100%** &bull; **5.216 Siswa Live** &bull; **164 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 1 Majenang (1.178 siswa, 33 rombel), SMAN 1 Rawalo (851 siswa, 25 rombel), SMAN 1 Purwokerto (784 siswa, 22 rombel), SMAN 1 Cipari (738 siswa, 21 rombel), SMAN 1 Patikraja (613 siswa, 17 rombel), SMAN 1 Jatilawang (393 siswa, 17 rombel), SMAN 1 Kroya (108 siswa, 10 rombel), SMAN 1 Maos (108 siswa, 3 rombel), SMAN 3 Cilacap (95 siswa, 3 rombel), SMAN 1 Sidareja (92 siswa, 3 rombel), SMAN 1 Sampang (90 siswa, 3 rombel), SMAN 1 Cilacap (87 siswa, 3 rombel), SMAN 1 Bantarsari (79 siswa, 4 rombel).

6. **Khansania Medtra (Klaster Purworejo, Magelang & Prembun)**:
   - **Total:** **14 Unit / 14 Live 100%** &bull; **4.989 Siswa Live** &bull; **179 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 1 Prembun (1.269 siswa, 36 rombel), SMAN 2 Purworejo (932 siswa, 24 rombel), SMAN 1 Salaman (521 siswa, 22 rombel), SMAN 1 Grabag (345 siswa, 10 rombel), SMAN 1 Dukun (292 siswa, 8 rombel), SMAN 1 Ngluwar (250 siswa, 8 rombel), SMAN 10 Purworejo (248 siswa, 7 rombel), SMAN 1 Purworejo (239 siswa, 11 rombel), SMAN 1 Mertoyudan (228 siswa, 9 rombel), SMAN 1 Candimulyo (188 siswa, 24 rombel), SMAN 11 Purworejo (180 siswa, 5 rombel), SMAN 6 Purworejo (156 siswa, 11 rombel), SMAN 1 Bandongan (106 siswa, 3 rombel), SMAN 2 Grabag (35 siswa, 1 rombel).

7. **Mitra Khusus & Konsorsium**:
   - **Total:** **3 Unit (12 Sekolah) / 3 Live 100%** &bull; **1.978 Siswa Live** &bull; **31 Rombel Aktif**
   - *Sekolah Terintegrasi:* SMAN 1 Bukateja (637 siswa, 10 rombel), SMAN 1 Muntilan (342 siswa, 11 rombel), **TRY OUT SMA SWASTA TASIKMALAYA** (999 siswa, 10 rombel konsorsium: SMA Plus Al-Mubarok, SMA IT Yashuda, SMAS Plus Al-Wahid Salawu, SMA Almukrom, SMA Pesantren Cintawana, SMA Sabilul Huda, SMA Islam Miftahul Quran, SMAS Nurul Amanah, SMA Plus Muallimin Persis, SMA Terpadu Daruzzahra).

---

## 3. Kategori 1: Sekolah yang SUDAH LENGKAP & LIVE 100% (86 Sekolah)

| No | Nama Sekolah | Klaster | PIC Trainer | Status PDF | Clean Import | Siswa & Rombel Live | TA 2026/2027 | Bukti SS | Ringkasan Status |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | **SMAN 10 Purworejo** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 248 Siswa (7 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 248 siswa live aktif di platform, 7 rombel terbentuk, TA 2026/2027 aktif. |
| 2 | **SMAN 1 Purworejo** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 239 Siswa (11 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 239 siswa live aktif di platform, 11 rombel terbentuk, TA 2026/2027 aktif. |
| 3 | **SMAN 11 Purworejo** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 180 Siswa (5 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 180 siswa live aktif di platform, 5 rombel terbentuk, TA 2026/2027 aktif. |
| 4 | **SMAN 6 Purworejo** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 156 Siswa (11 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 156 siswa live aktif di platform, 11 rombel terbentuk, TA 2026/2027 aktif. |
| 5 | **SMAN 1 Salaman** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 521 Siswa (22 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 521 siswa live aktif di platform, 22 rombel terbentuk, TA 2026/2027 aktif. |
| 6 | **SMAN 1 Bandongan** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 106 Siswa (3 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 106 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 7 | **SMAN 1 Grabag** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 345 Siswa (10 Rombel) | Aktif | 12 SS | Laporan PDF resmi terbit, 345 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 8 | **SMAN 2 Grabag** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 35 Siswa (1 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 35 siswa live aktif di platform, 1 rombel terbentuk, TA 2026/2027 aktif. |
| 9 | **SMAN 1 Candimulyo** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 188 Siswa (24 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 188 siswa live aktif di platform, 24 rombel terbentuk, TA 2026/2027 aktif. |
| 10 | **SMAN 1 Dukun** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 292 Siswa (8 Rombel) | Aktif | 11 SS | Laporan PDF resmi terbit, 292 siswa live aktif di platform, 8 rombel terbentuk, TA 2026/2027 aktif. |
| 11 | **SMAN 1 Ngluwar** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 250 Siswa (8 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 250 siswa live aktif di platform, 8 rombel terbentuk, TA 2026/2027 aktif. |
| 12 | **SMAN 1 Mertoyudan** | Klaster 3 | Khansania Medtra | Ada (2 PDF) | Format Bersih | 228 Siswa (9 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 228 siswa live aktif di platform, 9 rombel terbentuk, TA 2026/2027 aktif. |
| 13 | **13. SMAN 1 Muntilan** | Luar Masterplan | - | Ada (2 PDF) | Ready (1 File) | 342 Siswa (11 Rombel) | Aktif | 12 SS | Laporan PDF resmi terbit, 342 siswa live aktif di platform, 11 rombel terbentuk, TA 2026/2027 aktif. |
| 14 | **SMAN 1 Bawang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (2 PDF) | Format Bersih | 235 Siswa (12 Rombel) | Aktif | 11 SS | Laporan PDF resmi terbit, 235 siswa live aktif di platform, 12 rombel terbentuk, TA 2026/2027 aktif. |
| 15 | **SMAN 1 Karangkobar** | Klaster 5 | Rumaisha (Arum) | Ada (2 PDF) | Format Bersih | 344 Siswa (10 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 344 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 16 | **SMAN 1 Wadaslintang** | Klaster 5 | Rumaisha (Arum) | Ada (2 PDF) | Format Bersih | 432 Siswa (18 Rombel) | Aktif | 9 SS | Laporan PDF resmi terbit, 432 siswa live aktif di platform, 18 rombel terbentuk, TA 2026/2027 aktif. |
| 17 | **SMAN 2 Wonosobo** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Format Bersih | 1,074 Siswa (36 Rombel) | Aktif | 12 SS | Laporan PDF resmi terbit, 1,074 siswa live aktif di platform, 36 rombel terbentuk, TA 2026/2027 aktif. |
| 18 | **SMAN 2 Purworejo** | Klaster 3 | Khansania Medtra | Ada (1 PDF) | Ready (3 File) | 932 Siswa (24 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 932 siswa live aktif di platform, 24 rombel terbentuk, TA 2026/2027 aktif. |
| 19 | **SMA Budi Utomo Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 197 Siswa (6 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 197 siswa live aktif di platform, 6 rombel terbentuk, TA 2026/2027 aktif. |
| 20 | **SMAN 1 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 110 Siswa (6 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 110 siswa live aktif di platform, 6 rombel terbentuk, TA 2026/2027 aktif. |
| 21 | **SMAN 2 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 158 Siswa (6 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 158 siswa live aktif di platform, 6 rombel terbentuk, TA 2026/2027 aktif. |
| 22 | **SMAN 3 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 423 Siswa (12 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 423 siswa live aktif di platform, 12 rombel terbentuk, TA 2026/2027 aktif. |
| 23 | **SMAN 4 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (5 File) | 582 Siswa (16 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 582 siswa live aktif di platform, 16 rombel terbentuk, TA 2026/2027 aktif. |
| 24 | **SMAN 5 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 353 Siswa (10 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 353 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 25 | **SMAN 6 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (5 File) | 746 Siswa (22 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 746 siswa live aktif di platform, 22 rombel terbentuk, TA 2026/2027 aktif. |
| 26 | **SMAN 7 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 1,172 Siswa (30 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 1,172 siswa live aktif di platform, 30 rombel terbentuk, TA 2026/2027 aktif. |
| 27 | **SMAN 8 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (5 File) | 585 Siswa (16 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 585 siswa live aktif di platform, 16 rombel terbentuk, TA 2026/2027 aktif. |
| 28 | **SMAN 9 Surakarta** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 162 Siswa (6 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 162 siswa live aktif di platform, 6 rombel terbentuk, TA 2026/2027 aktif. |
| 29 | **SMAN 1 Klaten** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 394 Siswa (11 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 394 siswa live aktif di platform, 11 rombel terbentuk, TA 2026/2027 aktif. |
| 30 | **SMAN 2 Klaten** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (1 File) | 361 Siswa (10 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 361 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 31 | **SMAN 3 Klaten** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Format Bersih | 526 Siswa (10 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 526 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 32 | **SMAN 1 Kartasura** | Klaster 1 | Andrew Aliffiansyah | Ada (1 PDF) | Ready (4 File) | 1,166 Siswa (33 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,166 siswa live aktif di platform, 33 rombel terbentuk, TA 2026/2027 aktif. |
| 33 | **SMAN 1 Sragen** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (1 File) | 386 Siswa (11 Rombel) | Aktif | 7 SS | Laporan PDF resmi terbit, 386 siswa live aktif di platform, 11 rombel terbentuk, TA 2026/2027 aktif. |
| 34 | **SMAN 2 Sragen** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (2 File) | 98 Siswa (3 Rombel) | Aktif | 6 SS | Laporan PDF resmi terbit, 98 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 35 | **SMAN 3 Sragen** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (1 File) | 250 Siswa (7 Rombel) | Aktif | 7 SS | Laporan PDF resmi terbit, 250 siswa live aktif di platform, 7 rombel terbentuk, TA 2026/2027 aktif. |
| 36 | **SMAN 1 Gemolong** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (1 File) | 187 Siswa (5 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 187 siswa live aktif di platform, 5 rombel terbentuk, TA 2026/2027 aktif. |
| 37 | **SMAN 1 Gondang** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (2 File) | 183 Siswa (5 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 183 siswa live aktif di platform, 5 rombel terbentuk, TA 2026/2027 aktif. |
| 38 | **SMAN 1 Sukodono** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (1 File) | 275 Siswa (8 Rombel Resmi) | Aktif | 4 SS | Laporan PDF terbit, 275 siswa terbagi proporsional di Kelas 12-A s/d 12-H, rombel duplikat dinonaktifkan, password sinkron 100%. |
| 39 | **SMAN 1 Tangen** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (1 File) | 174 Siswa (5 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 174 siswa live aktif di platform, 5 rombel terbentuk, TA 2026/2027 aktif. |
| 40 | **SMAN 1 Sukoharjo** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 1,282 Siswa (36 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,282 siswa live aktif di platform, 36 rombel terbentuk, TA 2026/2027 aktif. |
| 41 | **SMAN 2 Sukoharjo** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 522 Siswa (27 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 522 siswa live aktif di platform, 27 rombel terbentuk, TA 2026/2027 aktif. |
| 42 | **SMAN 3 Sukoharjo** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 1,069 Siswa (30 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,069 siswa live aktif di platform, 30 rombel terbentuk, TA 2026/2027 aktif. |
| 43 | **SMAN 1 Nguter** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 344 Siswa (10 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 344 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 44 | **SMAN 1 Polokarto** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 118 Siswa (24 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 118 siswa live aktif di platform, 24 rombel terbentuk, TA 2026/2027 aktif. |
| 45 | **SMA 1 Tawangsari** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Format Bersih | 436 Siswa (30 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 436 siswa live aktif di platform, 30 rombel terbentuk, TA 2026/2027 aktif. |
| 46 | **SMAN 1 Bulu** | Klaster 2 | Henri Susilo | Ada (1 PDF) | Ready (3 File) | 541 Siswa (16 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 541 siswa live aktif di platform, 16 rombel terbentuk, TA 2026/2027 aktif. |
| 47 | **SMAN 1 Cilacap** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 87 Siswa (3 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 87 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 48 | **SMAN 3 Cilacap** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 95 Siswa (3 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 95 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 49 | **SMAN 1 Bantarsari** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 79 Siswa (4 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 79 siswa live aktif di platform, 4 rombel terbentuk, TA 2026/2027 aktif. |
| 50 | **SMAN 1 Cipari** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 738 Siswa (21 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 738 siswa live aktif di platform, 21 rombel terbentuk, TA 2026/2027 aktif. |
| 51 | **SMAN 1 Kroya** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 108 Siswa (10 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 108 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 52 | **SMAN 1 Majenang** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 1,178 Siswa (33 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,178 siswa live aktif di platform, 33 rombel terbentuk, TA 2026/2027 aktif. |
| 53 | **SMAN 1 Maos** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Ready (1 File) | 108 Siswa (3 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 108 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 54 | **SMAN 1 Sampang** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 90 Siswa (3 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 90 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 55 | **SMAN 1 Sidareja** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 92 Siswa (3 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 92 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 56 | **SMAN 1 Purwokerto** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 784 Siswa (22 Rombel) | Aktif | 7 SS | Laporan PDF resmi terbit, 784 siswa live aktif di platform, 22 rombel terbentuk, TA 2026/2027 aktif. |
| 57 | **SMAN 1 Jatilawang** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 393 Siswa (17 Rombel) | Aktif | 6 SS | Laporan PDF resmi terbit, 393 siswa live aktif di platform, 17 rombel terbentuk, TA 2026/2027 aktif. |
| 58 | **SMAN 1 Patikraja** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Ready (3 File) | 613 Siswa (17 Rombel) | Aktif | 6 SS | Laporan PDF resmi terbit, 613 siswa live aktif di platform, 17 rombel terbentuk, TA 2026/2027 aktif. |
| 59 | **SMAN 1 Rawalo** | Klaster 6 | Fitri Noveira (Mevi) | Ada (1 PDF) | Format Bersih | 851 Siswa (25 Rombel) | Aktif | 10 SS | Laporan PDF resmi terbit, 851 siswa live aktif di platform, 25 rombel terbentuk, TA 2026/2027 aktif. |
| 60 | **SMAN 11 Semarang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 1,066 Siswa (38 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,066 siswa live aktif di platform, 38 rombel terbentuk, TA 2026/2027 aktif. |
| 61 | **SMAN 2 Purbalingga** | Klaster 5 | Rumaisha (Arum) | Ada (2 PDF) | Ready (3 File) | 712 Siswa (19 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 712 siswa live aktif di platform, 19 rombel terbentuk, TA 2026/2027 aktif. |
| 62 | **SMAN 1 Bobotsari** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 715 Siswa (20 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 715 siswa live aktif di platform, 20 rombel terbentuk, TA 2026/2027 aktif. |
| 63 | **SMAN 1 Bojong** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (1 File) | 361 Siswa (1 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 361 siswa live aktif di platform, 1 rombel terbentuk, TA 2026/2027 aktif. |
| 64 | **63. SMAN 1 Bukateja** | Luar Masterplan | - | Ada (1 PDF) | Ready (1 File) | 637 Siswa (10 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 637 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |
| 65 | **SMAN 1 Karangreja** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 642 Siswa (18 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 642 siswa live aktif di platform, 18 rombel terbentuk, TA 2026/2027 aktif. |
| 66 | **SMAN 1 Kemangkon** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (1 File) | 102 Siswa (3 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 102 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif. |
| 67 | **SMAN 1 Kutasari** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (1 File) | 496 Siswa (14 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 496 siswa live aktif di platform, 14 rombel terbentuk, TA 2026/2027 aktif. |
| 68 | **SMAN 1 Rembang** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 571 Siswa (16 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 571 siswa live aktif di platform, 16 rombel terbentuk, TA 2026/2027 aktif. |
| 69 | **SMAN 1 Kebumen** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 723 Siswa (21 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 723 siswa live aktif di platform, 21 rombel terbentuk, TA 2026/2027 aktif. |
| 70 | **SMAN 1 Kutowinangun** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 720 Siswa (25 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 720 siswa live aktif di platform, 25 rombel terbentuk, TA 2026/2027 aktif. |
| 71 | **SMAN 1 Mirit** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (1 File) | 214 Siswa (6 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 214 siswa live aktif di platform, 6 rombel terbentuk, TA 2026/2027 aktif. |
| 72 | **SMAN 1 Kajen** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (4 File) | 2,066 Siswa (33 Rombel) | Aktif | 3 SS | Laporan PDF resmi terbit, 2,066 siswa live aktif di platform, 33 rombel terbentuk, TA 2026/2027 aktif. |
| 73 | **SMAN 1 Sragi** | Klaster 5 | Rumaisha (Arum) | Ada (1 PDF) | Ready (3 File) | 666 Siswa (19 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 666 siswa live aktif di platform, 19 rombel terbentuk, TA 2026/2027 aktif. |
| 74 | **SMAN 1 Batang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 144 Siswa (4 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 144 siswa live aktif di platform, 4 rombel terbentuk, TA 2026/2027 aktif. |
| 75 | **SMAN 2 Batang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 109 Siswa (1 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 109 siswa live aktif di platform, 1 rombel terbentuk, TA 2026/2027 aktif. |
| 76 | **SMAN 1 Subah** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 223 Siswa (4 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 223 siswa live aktif di platform, 4 rombel terbentuk, TA 2026/2027 aktif. |
| 77 | **SMAN 1 Bandar** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 144 Siswa (4 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 144 siswa live aktif di platform, 4 rombel terbentuk, TA 2026/2027 aktif. |
| 78 | **SMAN 1 Weleri** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 318 Siswa (9 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 318 siswa live aktif di platform, 9 rombel terbentuk, TA 2026/2027 aktif. |
| 79 | **SMAN 1 Ambarawa** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 1,257 Siswa (35 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 1,257 siswa live aktif di platform, 35 rombel terbentuk, TA 2026/2027 aktif. |
| 80 | **SMAN 2 Ungaran** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 1,331 Siswa (36 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 1,331 siswa live aktif di platform, 36 rombel terbentuk, TA 2026/2027 aktif. |
| 81 | **SMAN 1 Tuntang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 593 Siswa (29 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 593 siswa live aktif di platform, 29 rombel terbentuk, TA 2026/2027 aktif. |
| 82 | **SMAN 7 Semarang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (2 PDF) | Ready (1 File) | 516 Siswa (22 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 516 siswa live aktif di platform, 22 rombel terbentuk, TA 2026/2027 aktif. |
| 83 | **SMAN 10 Semarang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 1,090 Siswa (31 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 1,090 siswa live aktif di platform, 31 rombel terbentuk, TA 2026/2027 aktif. |
| 84 | **SMAN 13 Semarang** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (1 PDF) | Ready (1 File) | 144 Siswa (1 Rombel) | Aktif | 1 SS | Laporan PDF resmi terbit, 144 siswa live aktif di platform, 1 rombel terbentuk, TA 2026/2027 aktif. |
| 85 | **SMAN 1 Prembun** | Klaster 3 | Khansania Medtra | Ada (3 PDF) | Ready (5 File) | 1,269 Siswa (36 Rombel) | Aktif | 4 SS | Laporan PDF resmi terbit, 1,269 siswa live aktif di platform, 36 rombel terbentuk, TA 2026/2027 aktif. |
| 86 | **TASIKMALAYA** | Luar Masterplan | - | Ada (20 PDF) | Ready (1 File) | 999 Siswa (10 Rombel) | Aktif | - | Laporan PDF resmi terbit, 999 siswa live aktif di platform, 10 rombel terbentuk, TA 2026/2027 aktif. |


---

## 4. Kategori 2: On Hold Menunggu Data Susulan (1 Sekolah)

| No | Nama Sekolah | Klaster | PIC Trainer | Status PDF | Clean Import | Siswa & Rombel Live | TA 2026/2027 | Bukti SS | Ringkasan Status |
| :-: | :--- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | **SMA Islam Sudirman Ambarawa** | Klaster 4 | Adnan Cindyana (Cindy) | Ada (6 PDF) | Ready (6 File) | 0 Siswa | Belum | 1 SS | Laporan PDF resmi Guru (50 PTK) & Siswa (1.156 siswa di 33 rombel) sudah lengkap di folder PDF_Laporan_Resmi_Akun. Status ON HOLD menunggu data susulan hari Senin sesuai arahan user. |


---

## 5. Status Penugasan & Riwayat Instruksi User

1. **Instruksi "1 gas" &bull; Batch Sanitasi Data Mentah (28 Sekolah)**:
   - **STATUS: 100% SELESAI**.
   - Seluruh 28 file mentah berhasil distandardisasi dan dikonversi menjadi berkas resmi [CLEAN_IMPORT] <Nama Sekolah>.xlsx langsung pada folder Google Drive masing-masing.
2. **Instruksi "2 gas" &bull; Penyelarasan Rombel & Live Cluster Surakarta**:
   - **STATUS: 100% SELESAI & LIVE**.
   - Seluruh sekolah Klaster Solo (SMAN 1-9 Surakarta & Budi Utomo) telah aktif dengan TA 2026/2027, rombel lengkap, dan seluruh siswa terdistribusi ke rombel.
3. **Instruksi "importkan aja sekalian" &bull; Bulk Deployment Seluruh Sekolah Tersanitasi**:
   - **STATUS: 100% SELESAI & LIVE**.
   - Seluruh sekolah dari kelompok data bersih telah berhasil diunggah akunnya (password resmi utuh), rombel dibuat, dan peserta didik ditempatkan ke kelas masing-masing.
4. **Instruksi "3 masih menunggu data susulan hari senin" &bull; SMA Islam Sudirman Ambarawa (ISSUDA)**:
   - **STATUS: ON HOLD (TIDAK DISENTUH)**.
   - Berkas Laporan PDF resmi dan master file Excel clean import telah siap di Google Drive. Sesuai instruksi, data ditahan dan langsung siap diunggah saat data susulan diterima hari Senin.
5. **Instruksi Audit & Penataan SMAN 2 Purworejo (Kelas 10, 11, 12)**:
   - **STATUS: 100% SELESAI & AMAN**.
   - Rombel terbagi rata proporsional (34-37 siswa per rombel), 7 siswa ujian yang dobel akun tetap dipertahankan akun ujiannya (nilai ujian 100% aman), seluruh 956 akun siswa telah disinkronkan ke password master Excel, dan login riil diverifikasi sukses.
6. **Instruksi Audit & Penataan SMAN 1 Sukodono (Kelas 12)**:
   - **STATUS: 100% SELESAI & TERVERIFIKASI**.
   - 76 siswa susulan berhasil diimpor, seluruh 275 siswa terdistribusi ke 8 rombel resmi (Kelas 12-A s/d 12-H) dengan wali kelas resmi, 8 rombel duplikat tanpa wali kelas dibersihkan (3 terhapus, 5 dinonaktifkan dengan 0 siswa), password 275 siswa disinkronkan ke kolom `Password Awal` Excel master, dan login sampel di 8 rombel resmi terkonfirmasi 100% sukses masuk dashboard.