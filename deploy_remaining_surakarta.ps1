Add-Type -AssemblyName System.IO.Compression.FileSystem

$token = (Get-Content andrew_token.txt -Raw).Trim()

function Get-ExcelStudentMap($xlsxPath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)
    $s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
    $reader = New-Object System.IO.StreamReader($s1.Open())
    $content = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()

    $map = @{}
    $rows = [regex]::Matches($content, '<row[^>]*>(.*?)</row>')
    foreach ($row in $rows) {
        $cells = [regex]::Matches($row.Groups[1].Value, '<v>([^<]+)</v>')
        if ($cells.Count -ge 4) {
            $email = $cells[1].Groups[1].Value.Trim().ToLower()
            $rombel = $cells[3].Groups[1].Value.Trim()
            if ($email -ne 'email' -and $email -match '@') {
                $map[$email] = $rombel
            }
        }
    }
    return $map
}

function Create-SchoolRombel($schoolId, $yearId, $grade, $suffix) {
    $p = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id","yearId","levelCode","gradeCode","suffix","homeroomId","active"],"v":[{"t":2,"s":0},{"t":1,"s":"$yearId"},{"t":1,"s":"SMA"},{"t":1,"s":"$grade"},{"t":1,"s":"$suffix"},{"t":2,"s":0},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_create_r.json", $p, (New-Object System.Text.UTF8Encoding $false))
    $res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/1c49c2b9d560605ebafa91d06ae340ad60167fc050849fc66c2d729f799c583e" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $schoolId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_create_r.json"
    $m = [regex]::Match($res, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\}')
    if ($m.Success) {
        return $m.Groups['id'].Value
    }
    return $null
}

function Get-SchoolRombels($schoolId, $yearId) {
    $rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$yearId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
    $rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $schoolId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_r.json"
      
    $dict = @{}
    # Match pairs of id and displayName or suffix
    $matches = [regex]::Matches($rRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},.*?"suffix".*?\{"t":1,"s":"(?<suf>[^"]+)"\}.*?"displayName".*?\{"t":1,"s":"(?<name>[^"]+)"\}')
    foreach ($m in $matches) {
        $dict[$m.Groups['name'].Value] = $m.Groups['id'].Value
        $dict[$m.Groups['suf'].Value] = $m.Groups['id'].Value
    }
    return $dict
}

function Assign-Students($schoolName, $schoolId, $xlsxPath, $rombelMap) {
    Write-Host "`n  Assigning students for $schoolName..."
    $studentLookup = Get-ExcelStudentMap $xlsxPath
    $firstRombelId = ($rombelMap.Values | Select-Object -First 1)
    
    $loop = 0
    $totalAssigned = 0
    while ($loop -lt 25) {
        $loop++
        $candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_cand.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))
        $candRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $schoolId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_cand.json"
          
        $matches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>[^"]*)"\},\{"t":1,"s":"(?<email>[^"]*)"\}')
        if ($matches.Count -eq 0) {
            Write-Host "    All eligible candidates placed into rombels."
            break
        }
        
        $groups = @{}
        $matched = 0
        foreach ($m in $matches) {
            $cId = $m.Groups['id'].Value
            $cEmail = $m.Groups['email'].Value.Trim().ToLower()
            $targetCohort = $studentLookup[$cEmail]
            if (-not $targetCohort) { continue }
            
            $targetRombelId = $rombelMap[$targetCohort]
            if (-not $targetRombelId) { continue }
            
            if (-not $groups.ContainsKey($targetRombelId)) {
                $groups[$targetRombelId] = [System.Collections.Generic.List[string]]::new()
            }
            $groups[$targetRombelId].Add($cId)
            $matched++
        }
        
        if ($matched -eq 0) {
            Write-Host "    No remaining matching candidates in batch. Breaking loop."
            break
        }
        
        foreach ($rId in $groups.Keys) {
            $sList = $groups[$rId]
            $items = ($sList | ForEach-Object { '{"t":1,"s":"' + $_ + '"}' }) -join ','
            $assignPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","studentIds"],"v":[{"t":1,"s":"$rId"},{"t":9,"i":2,"a":[$items],"o":0}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
            [System.IO.File]::WriteAllText("$pwd\temp_assign.json", $assignPayload, (New-Object System.Text.UTF8Encoding $false))
            $assignRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd" `
              -H "Authorization: Bearer $token" `
              -H "x-school-override: $schoolId" `
              -H "x-tsr-serverfn: true" `
              -H "Content-Type: application/json" `
              --data-binary "@temp_assign.json"
              
            $placedMatch = [regex]::Matches($assignRes, 'placed')
            $totalAssigned += $placedMatch.Count
        }
    }
    Write-Host "    Total students placed in $schoolName : $totalAssigned"
}

# ==========================================================
# 1. SMA Budi Utomo Surakarta (ddae94fd-1d92-47e9-9da8-396dd91fc53a)
# ==========================================================
Write-Host "`n>>> Processing 1. SMA Budi Utomo Surakarta..."
$scBudiId = "ddae94fd-1d92-47e9-9da8-396dd91fc53a"
$yrBudi = "af469f1b-139b-4973-8df9-3855ac0469e6"
$budiRombels = @("XIIF1", "XIIF2", "XIIF3", "XIIF4", "XIIF5", "XIIF6")
$budiMap = @{}
foreach ($r in $budiRombels) {
    # Grade 12, Suffix = r
    $id = Create-SchoolRombel $scBudiId $yrBudi "12" $r
    $budiMap[$r] = $id
    Write-Host "  Rombel $r => $id"
}
Assign-Students "SMA Budi Utomo Surakarta" $scBudiId "H:\My Drive\Trainer\B+\AKUN\19. SMA Budi Utomo Surakarta\[CLEAN_IMPORT] SMA Budi Utomo Surakarta.xlsx" $budiMap

# ==========================================================
# 2. SMAN 9 Surakarta (c12012d5-9aeb-4511-8d2d-f2d3c157bc74)
# ==========================================================
Write-Host "`n>>> Processing 2. SMAN 9 Surakarta..."
$sc9Id = "c12012d5-9aeb-4511-8d2d-f2d3c157bc74"
$yr9 = "9ce768c0-1a39-40e1-bd10-924cb1da6669"
$sman9Rombels = @("XI F-1", "XI F-2", "XI F-3", "XI F-4", "XI F-5")
$sman9Map = @{}
foreach ($r in $sman9Rombels) {
    # Grade 11, Suffix = r
    $id = Create-SchoolRombel $sc9Id $yr9 "11" $r
    $sman9Map[$r] = $id
    Write-Host "  Rombel $r => $id"
}
Assign-Students "SMAN 9 Surakarta" $sc9Id "H:\My Drive\Trainer\B+\AKUN\27. SMAN 9 Surakarta\[CLEAN_IMPORT] SMAN 9 Surakarta.xlsx" $sman9Map

# ==========================================================
# 3. SMAN 3 Surakarta (8176d900-86ac-474a-9ef7-0b7bfc26e23e)
# ==========================================================
Write-Host "`n>>> Processing 3. SMAN 3 Surakarta..."
$sc3Id = "8176d900-86ac-474a-9ef7-0b7bfc26e23e"
$yr3 = "195a0093-2cb4-4105-a24f-f75126ddb4e4"
$sman3Rombels = @("XI F-01", "XI F-02", "XI F-03", "XI F-04", "XI F-05", "XI F-06", "XI F-07", "XI F-08", "XI F-09", "XI F-10", "XI F-11", "XI F-12")
$sman3Map = @{}
foreach ($r in $sman3Rombels) {
    $id = Create-SchoolRombel $sc3Id $yr3 "11" $r
    $sman3Map[$r] = $id
    Write-Host "  Rombel $r => $id"
}
Assign-Students "SMAN 3 Surakarta" $sc3Id "H:\My Drive\Trainer\B+\AKUN\22. SMAN 3 Surakarta\[CLEAN_IMPORT] SMAN 3 Surakarta.xlsx" $sman3Map

# ==========================================================
# 4. SMAN 4 Surakarta (671770c6-8f7c-414a-9d4c-45a9e23876e6)
# ==========================================================
Write-Host "`n>>> Processing 4. SMAN 4 Surakarta..."
$sc4Id = "671770c6-8f7c-414a-9d4c-45a9e23876e6"
$yr4 = "7127aa2a-f820-40b2-b841-fe9ee57f1146"
$sman4Map = @{}
1..11 | ForEach-Object {
    $rName = "XIFASEF$_"
    $id = Create-SchoolRombel $sc4Id $yr4 "11" "F$_"
    $sman4Map[$rName] = $id
    Write-Host "  Rombel $rName => $id"
}
1..11 | ForEach-Object {
    $pad = $_.ToString().PadLeft(2, '0')
    $rName = "XIIFASEF-$pad"
    $id = Create-SchoolRombel $sc4Id $yr4 "12" "F-$pad"
    $sman4Map[$rName] = $id
    Write-Host "  Rombel $rName => $id"
}
Assign-Students "SMAN 4 Surakarta" $sc4Id "H:\My Drive\Trainer\B+\AKUN\23. SMAN 4 Surakarta\[CLEAN_IMPORT] SMAN 4 Surakarta.xlsx" $sman4Map

# ==========================================================
# 5. SMAN 8 Surakarta (4c112d86-c3a1-4910-a0be-8af7e82a83e3)
# ==========================================================
Write-Host "`n>>> Processing 5. SMAN 8 Surakarta..."
$sc8Id = "4c112d86-c3a1-4910-a0be-8af7e82a83e3"
$yr8 = "2eaeb325-e057-4f87-9396-5d5e6c409c51"
$sman8Map = @{}
1..11 | ForEach-Object {
    $rName = "X-$_"
    $id = Create-SchoolRombel $sc8Id $yr8 "10" "$_"
    $sman8Map[$rName] = $id
    Write-Host "  Rombel $rName => $id"
}
1..11 | ForEach-Object {
    $rName = "XI-$_"
    $id = Create-SchoolRombel $sc8Id $yr8 "11" "$_"
    $sman8Map[$rName] = $id
    Write-Host "  Rombel $rName => $id"
}
Assign-Students "SMAN 8 Surakarta" $sc8Id "H:\My Drive\Trainer\B+\AKUN\26. SMAN 8 Surakarta\[CLEAN_IMPORT] SMAN 8 Surakarta.xlsx" $sman8Map

Write-Host "`n=========================================================="
Write-Host " ALL 5 SURAKARTA SCHOOLS FULLY DEPLOYED & STUDENTS ASSIGNED!"
Write-Host "=========================================================="
