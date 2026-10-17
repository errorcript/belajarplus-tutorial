$data = Import-Clixml "audit_final_all_schools.xml"
$cat3 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }

Write-Host "Total Kategori 3 schools: $($cat3.Count)"

foreach ($s in $cat3) {
    Write-Host "`n--- [$($s.Klaster)] $($s.Sekolah) (PIC: $($s.PIC)) ---"
    $folder = Join-Path "H:\My Drive\Trainer\B+\AKUN" $s.Folder
    if (Test-Path $folder) {
        $excels = Get-ChildItem $folder -Filter "*.xlsx"
        foreach ($e in $excels) {
            Write-Host "  File: $($e.Name) ($($e.Length) bytes)"
        }
    } else {
        Write-Host "  Folder NOT found: $folder"
    }
}
