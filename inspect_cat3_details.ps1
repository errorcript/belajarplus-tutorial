$data = Import-Clixml "audit_final_all_schools.xml"
$cat3 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }

Write-Host "Total Kategori 3 schools: $($cat3.Count)"

$results = @()
foreach ($s in $cat3) {
    $folder = Join-Path "H:\My Drive\Trainer\B+\AKUN" $s.Folder
    $excels = @()
    if (Test-Path $folder) {
        $excels = Get-ChildItem $folder -Filter "*.xlsx" | Where-Object { $_.Name -notmatch '^\[CLEAN_IMPORT\]' }
    }
    $results += [PSCustomObject]@{
        Sekolah = $s.Sekolah
        Folder = $s.Folder
        Klaster = $s.Klaster
        PIC = $s.PIC
        RawFiles = ($excels | ForEach-Object { "$($_.Name) ($([Math]::Round($_.Length/1KB, 1)) KB)" }) -join "; "
        RawCount = $excels.Count
    }
}

$results | Format-Table -AutoSize Sekolah, Klaster, PIC, RawCount, RawFiles
