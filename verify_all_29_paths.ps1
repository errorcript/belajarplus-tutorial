$plan = Import-Clixml "deployment_plan_29_schools.xml"

Write-Host "=========================================================="
Write-Host " VERIFYING FILE PATHS FOR 29 SCHOOLS"
Write-Host "=========================================================="

$allOk = $true
foreach ($sc in $plan) {
    if ($sc.Sekolah -eq "SMAN 1 Prembun") {
        # Prembun already has 1269 students live
        Write-Host "$($sc.Sekolah.PadRight(25)) | Already 1269 live | SKIP"
        continue
    }
    
    $folder = $sc.Folder
    if (-not $folder -and $sc.Sekolah -eq "TASIKMALAYA") { $folder = "TASIKMALAYA"; $sc.Folder = "TASIKMALAYA" }
    $folderPath = "H:\My Drive\Trainer\B+\AKUN\$folder"
    $cleanFiles = Get-ChildItem -LiteralPath $folderPath -Filter "*CLEAN_IMPORT*.xlsx" -ErrorAction SilentlyContinue
    $masterFile = $cleanFiles | Where-Object { $_.Name -notlike "*Part*" -and $_.Name -notlike "*GURU*" } | Select-Object -First 1
    if (-not $masterFile -and $cleanFiles) { $masterFile = $cleanFiles[0] }
    
    if ($masterFile) {
        $sc.CleanXlsx = $masterFile.FullName
        Write-Host "$($sc.Sekolah.PadRight(25)) | OK: $($masterFile.Name)"
    } else {
        Write-Host "$($sc.Sekolah.PadRight(25)) | ERROR: NO CLEAN FILE FOUND in $folderPath"
        $allOk = $false
    }
}

$plan | Export-Clixml "deployment_plan_29_schools.xml"
Write-Host "`nAll paths verified: $allOk"
