$cleanFiles = Get-ChildItem 'H:\My Drive\Trainer\B+\AKUN' -Recurse -Filter '[CLEAN_IMPORT]*.xlsx'
Write-Host "Total existing [CLEAN_IMPORT] files: $($cleanFiles.Count)"
foreach ($cf in $cleanFiles | Select-Object -First 20) {
    Write-Host " - $($cf.Directory.Name) \ $($cf.Name)"
}
