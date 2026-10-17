$data = Import-Clixml "audit_final_all_schools.xml"
$liveInsts = Import-Clixml "all_trainer_institutions.xml"
$cat2 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN LENGKAP (SIAP IMPOR LIVE)' -and $_.Sekolah -notmatch 'Sudirman' }

Write-Host "Matching $($cat2.Count) schools from Kategori 2 against live institutions..."

$matchReport = @()

foreach ($s in $cat2) {
    # Normalize name: SMAN -> SMA NEGERI, strip numbering
    $searchName = $s.Sekolah -replace '^\d+\.\s*', ''
    $norm1 = ($searchName -replace '^SMAN\s+', 'SMA NEGERI ').Trim().ToUpper()
    $norm2 = ($searchName -replace '^SMAN\s+', 'SMA N ').Trim().ToUpper()
    $regexPattern = ($searchName -replace '^SMAN\s+', 'SMA.*').Trim()
    
    $matched = $liveInsts | Where-Object { 
        $_.SchoolName.ToUpper() -eq $norm1 -or
        $_.SchoolName.ToUpper() -eq $norm2 -or
        $_.SchoolName -match $regexPattern -or
        $_.SchoolName.ToUpper() -like "*$searchName*"
    } | Select-Object -First 1
    
    # Special fallbacks
    if (-not $matched) {
        if ($s.Sekolah -eq "TASIKMALAYA") {
            $matched = $liveInsts | Where-Object { $_.SchoolName -match "TASIKMALAYA" } | Select-Object -First 1
        }
    }
    
    $matchReport += [PSCustomObject]@{
        Sekolah = $s.Sekolah
        Klaster = $s.Klaster
        PIC = $s.PIC
        MatchedLiveName = if ($matched) { $matched.SchoolName } else { "BELUM TERDAFTAR DI PLATFORM" }
        MatchedTrainer = if ($matched) { $matched.Trainer } else { "-" }
        SchoolId = if ($matched) { $matched.SchoolId } else { "" }
    }
}

$matchReport | Format-Table -AutoSize Sekolah, MatchedTrainer, MatchedLiveName, SchoolId
$matchReport | Export-Clixml "cat2_matched_live.xml"
