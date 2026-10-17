Add-Type -AssemblyName System.IO.Compression.FileSystem

$schools = Import-Clixml "cat2_matched_live.xml"
$batchResults = Import-Clixml "batch_sanitize_results.xml"
$token = (Get-Content andrew_token.txt -Raw).Trim()

Write-Host "=========================================================="
Write-Host " AUDIT & PLAN FOR 29 SCHOOLS DEPLOYMENT"
Write-Host "=========================================================="

$plan = @()

foreach ($sc in $schools) {
    $sId = $sc.SchoolId
    $scName = $sc.Sekolah
    $matchedBatch = $batchResults | Where-Object { $_.Sekolah -eq $scName }
    $folderName = if ($matchedBatch) { $matchedBatch.Folder } else { "" }
    $excelCount = if ($matchedBatch) { $matchedBatch.TotalSiswa } else { 0 }
    
    # Check TA
    $taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$sId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_ta.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
    $taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_ta.json"
      
    $cleanTa = $taRes.Replace('\"', '"')
    $taName = "None"
    $taId = ""
    $m = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"(?<name>202[0-9]/202[0-9])\"\}')
    if ($m.Success) {
        $taId = $m.Groups['id'].Value
        $taName = $m.Groups['name'].Value
    }
    
    # Check live student count
    $cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$sId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
    $cntRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cnt.json"
      
    $cntMatch = [regex]::Match($cntRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
    $liveCount = if ($cntMatch.Success) { [int]$cntMatch.Groups['count'].Value } else { 0 }
    
    # Check clean Excel file path
    $cleanXlsxPath = ""
    if ($folderName) {
        $cleanFiles = Get-ChildItem -Path "H:\My Drive\Trainer\B+\AKUN\$folderName" -Filter "*CLEAN_IMPORT*.xlsx" -ErrorAction SilentlyContinue
        # Pick the master clean file (not Part)
        $masterFile = $cleanFiles | Where-Object { $_.Name -notlike "*Part*" -and $_.Name -notlike "*GURU*" } | Select-Object -First 1
        if ($masterFile) {
            $cleanXlsxPath = $masterFile.FullName
        } elseif ($cleanFiles) {
            $cleanXlsxPath = $cleanFiles[0].FullName
        }
    }
    
    # Task determination
    $actionNeeded = ""
    if ($liveCount -ge $excelCount -and $excelCount -gt 0) {
        $actionNeeded = "DONE (100% Live)"
    } elseif ($liveCount -eq 0 -or $liveCount -eq 1) {
        $actionNeeded = "FULL_IMPORT_NEEDED"
    } else {
        $actionNeeded = "PATCH_MISSING_STUDENTS"
    }
    
    Write-Host "$($scName.PadRight(25)) | TA: $($taName.PadRight(10)) | Live: $($liveCount.ToString().PadLeft(5)) / $($excelCount.ToString().PadLeft(5)) | Action: $actionNeeded"
    
    $plan += [PSCustomObject]@{
        Sekolah = $scName
        SchoolId = $sId
        Folder = $folderName
        TA = $taName
        TaId = $taId
        ExcelCount = $excelCount
        LiveCount = $liveCount
        CleanXlsx = $cleanXlsxPath
        Action = $actionNeeded
    }
}

$plan | Export-Clixml "deployment_plan_29_schools.xml"
