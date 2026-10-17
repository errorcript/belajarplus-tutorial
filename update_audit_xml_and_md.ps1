$data = Import-Clixml "audit_final_all_schools.xml"

foreach ($s in $data) {
    if ($s.Sekolah -eq "SMAN 1 Surakarta") {
        $s.StatusKategori = "LENGKAP & LIVE 100%"
        $s.SiswaLive = 110
        $s.RombelLive = 3
        $s.TahunAjaran = "AKTIF 2026/2027"
        $s.Keterangan = "Laporan PDF resmi terbit, 110 siswa live aktif di platform, 3 rombel terbentuk, TA 2026/2027 aktif."
        Write-Host "Updated SMAN 1 Surakarta to LENGKAP & LIVE 100%"
    }
    elseif ($s.Sekolah -eq "SMAN 2 Surakarta") {
        $s.StatusKategori = "LENGKAP & LIVE 100%"
        $s.SiswaLive = 158
        $s.RombelLive = 5
        $s.TahunAjaran = "AKTIF 2026/2027"
        $s.Keterangan = "Laporan PDF resmi terbit, 158 siswa live aktif di platform, 5 rombel terbentuk, TA 2026/2027 aktif."
        Write-Host "Updated SMAN 2 Surakarta to LENGKAP & LIVE 100%"
    }
    elseif ($s.Sekolah -in @("SMAN 3 Surakarta", "SMAN 4 Surakarta", "SMAN 8 Surakarta", "SMAN 9 Surakarta", "SMA Budi Utomo Surakarta")) {
        $s.TahunAjaran = "AKTIF 2026/2027"
        Write-Host "Updated $($s.Sekolah) TA to AKTIF 2026/2027"
    }
}

$data | Export-Clixml -Path "audit_final_all_schools.xml" -Force
Write-Host "Saved updated audit_final_all_schools.xml"

# Now run markdown report generator
& .\generate_markdown_audit_report.ps1
