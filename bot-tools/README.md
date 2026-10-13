# BelajarPlus Automation Bot & Operations Suite

Suite otomatisasi, audit live data, batch assign rombel, dan generator laporan resmi untuk platform BelajarPlus (Jawa Tengah & Tasikmalaya).

> **Catatan Deployment (Vercel)**:
> Direktori `bot-tools/` ini secara otomatis **dikecualikan dari build dan deployment web produksi Vercel** melalui konfigurasi `.vercelignore` dan rule proteksi route di `vercel.json`. Folder ini murni untuk internal tool, bot runner, dan version control repository.

---

## 📁 Struktur Direktori

```text
bot-tools/
├── scripts/                          # Script otomasi, bot, auditor, & generator
│   ├── belajarplus_satset_bot.js     # Bot satset multi-trainer & multi-school
│   ├── run_assign_purwokerto_complete.js # Fast assign rombel TanStack RPC Purwokerto
│   ├── run_assign_jatilawang_complete.js # Fast assign rombel TanStack RPC Jatilawang
│   ├── run_assign_rawalo_perfect.js     # Fast assign rombel TanStack RPC Rawalo
│   ├── run_dukun_complete.js            # Fast assign rombel TanStack RPC Dukun
│   ├── setup_patikraja_rombels.js       # Fast setup & assign Patikraja
│   ├── audit_purwokerto_live.js         # Auditor real-time live data Purwokerto
│   ├── audit_all_status_realtime.js     # Auditor 17 sekolah Jawa Tengah
│   ├── audit_5_accounts_robust.js       # Auditor multi-trainer 5 akun
│   ├── save_absensi_purwokerto.js       # Setup geolokasi absensi Purwokerto (120m)
│   ├── save_absensi_alif_remaining.js   # Setup geolokasi absensi Jatilawang, Rawalo, Patikraja
│   ├── save_absensi_dukun.js            # Setup geolokasi absensi Dukun
│   ├── export_and_compare_pwk.js        # Ekspor & deep discrepancy checker
│   ├── fix_master_and_generate_clean_pwk.js # Data sanitization & Excel chunk generator
│   ├── report_generator_helper.js       # Template engine A4 PDF Berita Acara & Kredensial
│   ├── generate_all_5_reports_final.js  # Generator 5 Berita Acara PDF resmi
│   ├── generate_class_grouped_pdf_reports.js
│   ├── generate_master_comprehensive_pdf_report.js
│   └── generate_executive_summary.js
├── templates/
│   └── template_resmi_belajarplus.xlsx # Template resmi impor siswa ('Siswa' & 'Panduan')
├── docs/
│   ├── BELAJARPLUS_IMPORT_PLAYBOOK.md   # SOP & best practices impor BelajarPlus
│   ├── DAFTAR_SEKOLAH_5_AKUN_TRAINER.md # Directory mapping 5 trainer & subdomains
│   └── DAFTAR_SEKOLAH_5_AKUN_TRAINER.xlsx
└── README.md
```

---

## ⚡ Fitur Utama

1. **Multi-School Direct RPC Assignment**:
   Menggunakan endpoint serverFn internal TanStack (`/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd`) dengan header `x-school-override` untuk menempatkan ratusan siswa ke rombel dalam hitungan detik tanpa bottleneck rendering browser.

2. **Smart Import Chunking & Normalization**:
   - Memastikan file impor selalu memiliki 2 sheet wajib: `['Siswa', 'Panduan']`.
   - Ukuran chunk otomatis dioptimasi pada 40–60 siswa per file untuk menghindari timeout pada modal pratinjau browser.
   - Normalisasi email otomatis: mempertahankan email asli (gmail/belajar.id) dan memetakan email tanpa real ke `nama.lengkap@belajarplus.com` (Zero PesonaEdu).

3. **Geolocation Auto-Configurator**:
   Mengaktifkan absensi mobile berbasis radius geolokasi 120m di koordinat lintang/bujur resmi tiap satuan pendidikan.

4. **Official PDF Generator**:
   Menghasilkan Berita Acara Serah Terima Akun dan Lembar Distribusi Kredensial Login per Rombel dalam format PDF A4 siap cetak dengan logo resmi dan subdomain portal login masing-masing sekolah.

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js (>= 18)
- Playwright (`npm install playwright xlsx`)

### Contoh Eksekusi
```bash
# Menjalankan audit status real-time platform
node bot-tools/scripts/audit_purwokerto_live.js

# Menjalankan penempatan otomatis rombel
node bot-tools/scripts/run_assign_purwokerto_complete.js

# Menghasilkan seluruh laporan resmi PDF 5 sekolah
node bot-tools/scripts/generate_all_5_reports_final.js
```
