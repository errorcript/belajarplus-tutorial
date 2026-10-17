$plan = Import-Clixml "deployment_plan_29_schools.xml"

Write-Host "=========================================================="
Write-Host " MASTER RUNNER: DEPLOY ALL REMAINING KATEGORI 2 SCHOOLS"
Write-Host " Total Schools in Scope: $($plan.Count)"
Write-Host "=========================================================="

# Schools already at 100%
$skipList = @(
    "13. SMAN 1 Muntilan",
    "SMAN 2 Purworejo",
    "SMAN 1 Klaten",
    "SMAN 2 Klaten",
    "SMAN 1 Kartasura",
    "SMAN 1 Bulu",
    "SMAN 1 Batang",
    "SMAN 1 Prembun"
)

$results = @()
$counter = 0

foreach ($sc in $plan) {
    $scName = $sc.Sekolah
    if ($skipList -contains $scName) {
        Write-Host "`n>>> [SKIP] $scName is already 100% complete and live."
        $results += [PSCustomObject]@{
            Sekolah = $scName
            SchoolId = $sc.SchoolId
            LiveStudents = $sc.LiveCount
            ExcelStudents = $sc.ExcelCount
            Status = "SUCCESS_ALREADY_100%"
        }
        continue
    }
    
    $counter++
    # Refresh token every 3 schools
    if ($counter % 3 -eq 1) {
        Write-Host "`n[AUTH] Refreshing Andrew auth token..."
        & .\auth_andrew.ps1 | Out-Null
    }
    
    $folder = $sc.Folder
    $scId = $sc.SchoolId
    $cleanFileName = [System.IO.Path]::GetFileName($sc.CleanXlsx)
    
    Write-Host "`n----------------------------------------------------------"
    Write-Host ">>> [$counter] PROCESSING $scName..."
    Write-Host "    Folder: $folder"
    Write-Host "    File  : $cleanFileName"
    Write-Host "    School: $scId"
    Write-Host "----------------------------------------------------------"
    
    try {
        & .\deploy_school_engine.ps1 -SchoolName $scName -Folder $folder -SchoolId $scId -CleanFileName $cleanFileName
        
        # Verify final count
        $cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$scId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        $token = (Get-Content andrew_token.txt -Raw).Trim()
        [System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
        $finalCntRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $scId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_cnt.json"
          
        $finalCntMatch = [regex]::Match($finalCntRes, '\"v\":\[\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
        if (-not $finalCntMatch.Success) {
            $finalCntMatch = [regex]::Match($finalCntRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
        }
        $finalCount = if ($finalCntMatch.Success) { [int]$finalCntMatch.Groups['count'].Value } else { 0 }
        
        $results += [PSCustomObject]@{
            Sekolah = $scName
            SchoolId = $scId
            LiveStudents = $finalCount
            ExcelStudents = $sc.ExcelCount
            Status = if ($finalCount -ge $sc.ExcelCount -and $sc.ExcelCount -gt 0) { "SUCCESS_100%" } else { "PARTIAL_SYNC ($finalCount/$($sc.ExcelCount))" }
        }
    } catch {
        Write-Host "ERROR processing $($scName): $_"
        $results += [PSCustomObject]@{
            Sekolah = $scName
            SchoolId = $scId
            LiveStudents = 0
            ExcelStudents = $sc.ExcelCount
            Status = "ERROR: $_"
        }
    }
    
    $results | Export-Clixml "kategori2_deployment_results.xml"
}

Write-Host "`n=========================================================="
Write-Host " ALL SCHOOLS DEPLOYMENT RUN COMPLETED!"
Write-Host "=========================================================="
$results | Format-Table -AutoSize
