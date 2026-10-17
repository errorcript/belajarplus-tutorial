$data = Import-Clixml "audit_final_all_schools.xml"
$batchResults = Import-Clixml "batch_sanitize_results.xml"

Write-Host "Updating audit_final_all_schools.xml..."

# 1. Update Surakarta completed schools (Item 2)
$surakartaCompleted = @{
    "SMA Budi Utomo Surakarta" = @{ Siswa = 197; Rombel = 6 }
    "SMAN 9 Surakarta"         = @{ Siswa = 162; Rombel = 5 }
    "SMAN 3 Surakarta"         = @{ Siswa = 423; Rombel = 12 }
    "SMAN 4 Surakarta"         = @{ Siswa = 582; Rombel = 22 }
    "SMAN 8 Surakarta"         = @{ Siswa = 585; Rombel = 22 }
}

foreach ($s in $data) {
    if ($surakartaCompleted.ContainsKey($s.Sekolah)) {
        $info = $surakartaCompleted[$s.Sekolah]
        $s.StatusKategori = "LENGKAP & LIVE 100%"
        $s.SiswaLive = $info.Siswa
        $s.RombelLive = $info.Rombel
        $s.TahunAjaran = "AKTIF 2026/2027"
        $s.Keterangan = "Laporan PDF resmi terbit, $($info.Siswa) siswa live aktif di platform, $($info.Rombel) rombel terbentuk, TA 2026/2027 aktif."
        Write-Host "  -> Updated $($s.Sekolah) to LENGKAP & LIVE 100% ($($info.Siswa) Siswa, $($info.Rombel) Rombel)"
    }
}

# 2. Update Kategori 3 schools with newly created CleanXlsx files (Item 1)
foreach ($res in $batchResults) {
    $matched = $data | Where-Object { $_.Sekolah -eq $res.Sekolah }
    if ($matched) {
        $cleanList = $res.CleanFiles -split '; '
        $matched.CleanXlsxCount = $cleanList.Count
        $matched.CleanXlsxFiles = $res.CleanFiles
        $matched.StatusKategori = "LAPORAN LENGKAP (SIAP IMPOR LIVE)"
        $matched.Keterangan = "File master clean import tuntas disanitasi ($($res.TotalSiswa) siswa, $($res.TotalRombel) rombel). Siap impor massal live ke platform."
        Write-Host "  -> Updated $($matched.Sekolah) to LAPORAN LENGKAP (SIAP IMPOR LIVE) ($($res.TotalSiswa) Siswa)"
    }
}

# 3. Update SMA Islam Sudirman Ambarawa notes (Item 3)
$isud = $data | Where-Object { $_.Sekolah -match "Sudirman" }
if ($isud) {
    $isud.StatusKategori = "LAPORAN LENGKAP (SIAP IMPOR LIVE)"
    $isud.Keterangan = "PDF Laporan Resmi Guru (50 PTK) & Siswa (1.156 Siswa X, XI, XII) siap di folder. Status ON HOLD (Menunggu data susulan hari Senin sesuai arahan user)."
    Write-Host "  -> Updated $($isud.Sekolah) notes: ON HOLD (Menunggu Hari Senin)"
}

$data | Export-Clixml "audit_final_all_schools.xml" -Force
Write-Host "`nSaved updated audit_final_all_schools.xml"

# Summary counts
$k1 = ($data | Where-Object { $_.StatusKategori -eq 'LENGKAP & LIVE 100%' }).Count
$k2 = ($data | Where-Object { $_.StatusKategori -eq 'LAPORAN LENGKAP (SIAP IMPOR LIVE)' }).Count
$k3 = ($data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }).Count
$k4 = ($data | Where-Object { $_.StatusKategori -eq 'BELUM LENGKAP (TANPA PDF)' }).Count

$totalSiswaLive = ($data | Where-Object { $_.StatusKategori -eq 'LENGKAP & LIVE 100%' } | Measure-Object -Property SiswaLive -Sum).Sum
$totalRombelLive = ($data | Where-Object { $_.StatusKategori -eq 'LENGKAP & LIVE 100%' } | Measure-Object -Property RombelLive -Sum).Sum

Write-Host "=========================================================="
Write-Host " STATUS AKHIR AUDIT 87 SEKOLAH BELAJARPLUS"
Write-Host "=========================================================="
Write-Host " - Kategori 1 (Lengkap & Live 100%): $k1 Sekolah ($([math]::Round($k1/$data.Count*100, 1))%)"
Write-Host "   Total Siswa Live: $totalSiswaLive Siswa"
Write-Host "   Total Rombel Live: $totalRombelLive Rombel"
Write-Host " - Kategori 2 (Siap Impor / On Hold): $k2 Sekolah ($([math]::Round($k2/$data.Count*100, 1))%)"
Write-Host " - Kategori 3 (PDF Ada / Belum Sanitasi): $k3 Sekolah"
Write-Host " - Kategori 4 (Tanpa PDF Resmi): $k4 Sekolah"
Write-Host "=========================================================="
