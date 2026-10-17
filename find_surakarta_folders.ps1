$dirs = Get-ChildItem "H:\My Drive\Trainer\B+\AKUN" -Directory | Where-Object { $_.Name -match 'Budi Utomo|Surakarta' }
foreach ($d in $dirs) {
    Write-Host "Folder: $($d.FullName)"
    Get-ChildItem $d.FullName | ForEach-Object {
        Write-Host "  - $($_.Name) ($($_.Length) bytes)"
    }
}
