param(
    [string]$SchoolName = "SMAN 1 Batang",
    [string]$Folder = "73. SMAN 1 Batang",
    [string]$SchoolId = "74601a04-a991-41ac-8b8a-b4afa1403be5",
    [string]$CleanFileName = "[CLEAN_IMPORT] SMAN 1 Batang.xlsx"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$token = (Get-Content andrew_token.txt -Raw).Trim()
$filePath = "H:\My Drive\Trainer\B+\AKUN\$Folder\$CleanFileName"

Write-Host "=========================================================="
Write-Host " DEPLOY ENGINE: $SchoolName"
Write-Host " File: $filePath"
Write-Host " SchoolId: $SchoolId"
Write-Host "=========================================================="

# 1. Parse Excel
$zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
$s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
$reader = New-Object System.IO.StreamReader($s1.Open())
$sheetContent = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$rows = [regex]::Matches($sheetContent, '<row[^>]*>(.*?)</row>')
$students = @()
foreach ($row in $rows | Select-Object -Skip 1) {
    $cells = [regex]::Matches($row.Groups[1].Value, '<v>(.*?)</v>')
    if ($cells.Count -ge 4) {
        $nama = ($cells[0].Groups[1].Value -replace "[\r\n\t]+", " " -replace '"', '').Trim()
        $email = $cells[1].Groups[1].Value.Trim().ToLower()
        $pass = ($cells[2].Groups[1].Value -replace "[\r\n\t]+", "" -replace '"', '').Trim()
        $rombel = ($cells[3].Groups[1].Value -replace "[\r\n\t]+", " " -replace '"', '').Trim()
        
        # Derive Grade
        $grade = "10"
        if ($rombel -match '^XII' -or $rombel -match '^12') {
            $grade = "12"
        } elseif ($rombel -match '^XI' -or $rombel -match '^11') {
            $grade = "11"
        } elseif ($rombel -match '^X' -or $rombel -match '^10') {
            $grade = "10"
        }
        
        $students += [PSCustomObject]@{
            FullName = $nama
            Email = $email
            Password = $pass
            Rombel = $rombel
            Grade = $grade
        }
    }
}

Write-Host "Parsed $($students.Count) students from Excel."

# 2. Get active TA and YearId
$taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$SchoolId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_ta.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
$taRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_ta.json"
  
$cleanTa = $taRes.Replace('\"', '"')
$yearId = ""
$m = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"2026/2027\"\}')
if ($m.Success) {
    $yearId = $m.Groups['id'].Value
    Write-Host "Active YearId (2026/2027): $yearId"
} else {
    Write-Host "ERROR: TA 2026/2027 not found for $SchoolName"
    return
}

# 3. Query existing rombels
$rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$yearId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
$rRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r.json"
  
$rombelMap = @{}
$cleanRRes = if ([string]::IsNullOrEmpty($rRes)) { "" } else { $rRes.Replace('\"', '"') }
$records = [regex]::Matches($cleanRRes, '\{\"t\":10,\"i\":[0-9]+,\"p\":\{\"k\":\[\"id\",\"active\",\"suffix\".*?\"v\":\[(?<values>.*?)\]\},\"o\":0\}')
foreach ($rec in $records) {
    $strMatches = [regex]::Matches($rec.Groups['values'].Value, '\{\"t\":1,\"s\":\"(?<str>[^\"]*)\"\}')
    if ($strMatches.Count -ge 4) {
        $rId = $strMatches[0].Groups['str'].Value
        $rSuf = $strMatches[1].Groups['str'].Value.Trim()
        $rGrd = $strMatches[3].Groups['str'].Value.Trim()
        $dispName = if ($strMatches.Count -ge 7) { $strMatches[6].Groups['str'].Value.Trim() } else { "" }
        
        $rombelMap[$rSuf] = $rId
        if ($dispName) { $rombelMap[$dispName] = $rId }
        $rombelMap["$rGrd.$rSuf"] = $rId
        $rombelMap["$rGrd $rSuf"] = $rId
        $rombelMap["$rGrd-$rSuf"] = $rId
        if ($rGrd -eq "10") {
            $rombelMap["X.$rSuf"] = $rId
            $rombelMap["X $rSuf"] = $rId
            $rombelMap["X-$rSuf"] = $rId
            $rombelMap["X$rSuf"] = $rId
        } elseif ($rGrd -eq "11") {
            $rombelMap["XI.$rSuf"] = $rId
            $rombelMap["XI $rSuf"] = $rId
            $rombelMap["XI-$rSuf"] = $rId
            $rombelMap["XI$rSuf"] = $rId
        } elseif ($rGrd -eq "12") {
            $rombelMap["XII.$rSuf"] = $rId
            $rombelMap["XII $rSuf"] = $rId
            $rombelMap["XII-$rSuf"] = $rId
            $rombelMap["XII$rSuf"] = $rId
        }
    }
}
Write-Host "Found $($records.Count) existing rombels in platform (Mapped $($rombelMap.Count) aliases)."

# 4. Create missing rombels
$neededRombels = $students | Select-Object -ExpandProperty Rombel -Unique
foreach ($rName in $neededRombels) {
    if (-not $rombelMap.ContainsKey($rName)) {
        # Determine grade and suffix
        $grade = "10"
        $suffix = $rName
        if ($rName -match '^(XII|12)[\s\.\-_]*(.*)$') {
            $grade = "12"
            $suffix = if ($Matches[2].Trim()) { $Matches[2].Trim() } else { $rName }
        } elseif ($rName -match '^(XI|11)[\s\.\-_]*(.*)$') {
            $grade = "11"
            $suffix = if ($Matches[2].Trim()) { $Matches[2].Trim() } else { $rName }
        } elseif ($rName -match '^(X|10)[\s\.\-_]*(.*)$') {
            $grade = "10"
            $suffix = if ($Matches[2].Trim()) { $Matches[2].Trim() } else { $rName }
        }
        $suffix = $suffix.Trim()
        
        Write-Host "  -> Creating Rombel '$rName' (Grade: $grade, Suffix: $suffix)..."
        $crPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id","yearId","levelCode","gradeCode","suffix","homeroomId","active"],"v":[{"t":2,"s":0},{"t":1,"s":"$yearId"},{"t":1,"s":"SMA"},{"t":1,"s":"$grade"},{"t":1,"s":"$suffix"},{"t":2,"s":0},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_create_r.json", $crPayload, (New-Object System.Text.UTF8Encoding $false))
        $crRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/1c49c2b9d560605ebafa91d06ae340ad60167fc050849fc66c2d729f799c583e" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $SchoolId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_create_r.json"
          
        if (-not [string]::IsNullOrEmpty($crRes)) {
            $crMatch = [regex]::Match($crRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\}')
            if ($crMatch.Success) {
                $rId = $crMatch.Groups['id'].Value
                $rombelMap[$rName] = $rId
                $rombelMap[$suffix] = $rId
                Write-Host "     Success: $rId"
            }
        } else {
            Write-Host "     [Warning] Rombel creation response was empty for '$rName'"
        }
    }
}

# 5. Query existing live students to avoid duplicates
$existingEmails = @{}
$hasMore = $true
$afterName = ""
$afterId = ""
$pageLimit = 200

# Quick count check
$cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$SchoolId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
$cntRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_cnt.json"
  
$cntMatch = [regex]::Match($cntRes, '\"v\":\[\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
if (-not $cntMatch.Success) {
    $cntMatch = [regex]::Match($cntRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
}
$curLiveCount = if ($cntMatch.Success) { [int]$cntMatch.Groups['count'].Value } else { 0 }
Write-Host "Current live student count in platform: $curLiveCount"

if ($curLiveCount -gt 0) {
    # Fetch existing students to get their emails
    $fetchPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade","limit"],"v":[{"t":1,"s":"$SchoolId"},{"t":1,"s":""},{"t":1,"s":""},{"t":0,"s":500}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_page.json", $fetchPayload, (New-Object System.Text.UTF8Encoding $false))
    $pRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/48555baf421f908efc1f77c5a31187bf65c3e314f204a3cb4d38ecbb0477728b" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $SchoolId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_page.json"
      
    if (-not [string]::IsNullOrEmpty($pRes)) {
        $emailMatches = [regex]::Matches($pRes, '\{\"t\":1,\"s\":\"(?<email>[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9\.-]+)\"\}')
        foreach ($em in $emailMatches) {
            $existingEmails[$em.Groups['email'].Value.ToLower()] = $true
        }
        Write-Host "Indexed $($existingEmails.Count) existing student emails."
    }
}

# 6. Filter missing students
$missingStudents = $students | Where-Object { -not $existingEmails.ContainsKey($_.Email) }
Write-Host "Missing students to import: $($missingStudents.Count)"

# 7. Bulk import in batches of 50
$batchSize = 50
for ($i = 0; $i -lt $missingStudents.Count; $i += $batchSize) {
    $batch = $missingStudents[$i..([Math]::Min($i + $batchSize - 1, $missingStudents.Count - 1))]
    $batchNum = [Math]::Floor($i / $batchSize) + 1
    $totalBatches = [Math]::Ceiling($missingStudents.Count / $batchSize)
    Write-Host "  -> Uploading Batch $batchNum of $totalBatches ($($batch.Count) students)..."
    
    $rowSerovals = @()
    $idx = 3
    foreach ($s in $batch) {
        $opId = [System.Guid]::NewGuid().ToString()
        $cName = ($s.FullName -replace "[\r\n\t]+", " " -replace '"', '\"').Trim()
        $cPass = ($s.Password -replace "[\r\n\t]+", "" -replace '"', '\"').Trim()
        $cEmail = ($s.Email -replace "[\r\n\t]+", "").Trim()
        $cRombel = ($s.Rombel -replace "[\r\n\t]+", " " -replace '"', '\"').Trim()
        $rowSerovals += @"
{"t":10,"i":$idx,"p":{"k":["operationId","email","password","fullName","whatsapp","grade","className"],"v":[{"t":1,"s":"$opId"},{"t":1,"s":"$cEmail"},{"t":1,"s":"$cPass"},{"t":1,"s":"$cName"},{"t":1,"s":""},{"t":1,"s":"$($s.Grade)"},{"t":1,"s":"$cRombel"}]},"o":0}
"@
        $idx++
    }
    
    $rowsJoined = $rowSerovals -join ','
    $bulkPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","role","rows"],"v":[{"t":1,"s":"$SchoolId"},{"t":1,"s":"student"},{"t":9,"i":2,"a":[$rowsJoined],"o":0}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_bulk.json", $bulkPayload, (New-Object System.Text.UTF8Encoding $false))
    $retry = 0
    $succMatch = $null
    while ($retry -lt 3) {
        $retry++
        $bulkRes = curl.exe -4 -s -m 30 -X POST "https://belajarplus.com/_serverFn/77decbcfbd7ea32873f74d5dbb8aff93b0aacd3bf9e3a187a2ed9cb4215261b4" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $SchoolId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_bulk.json"
          
        if (-not [string]::IsNullOrEmpty($bulkRes)) {
            $succMatch = [regex]::Match($bulkRes, '\{\"t\":0,\"s\":(?<succ>[0-9]+)\},\{\"t\":0,\"s\":[0-9]+\}')
            if ($succMatch.Success) {
                Write-Host "     Batch $batchNum result: $($succMatch.Groups['succ'].Value) created successfully."
                break
            } elseif ($bulkRes.Contains("MAINTENANCE_ACTIVE")) {
                Write-Host "     Batch $batchNum got MAINTENANCE_ACTIVE, waiting 3s and retrying (attempt $retry)..."
                Start-Sleep -Seconds 3
            } else {
                Write-Host "     Batch $batchNum response: $($bulkRes.Substring(0, [Math]::Min(150, $bulkRes.Length)))"
                break
            }
        } else {
            Start-Sleep -Seconds 1
        }
    }
}

# 8. Assign Candidates to Rombels
Write-Host "`n8. Assigning unassigned candidates to rombels..."
$lookup = @{}
foreach ($s in $students) {
    $lookup[$s.Email] = $s.Rombel
}

$firstRombelId = ($rombelMap.Values | Select-Object -First 1)
$loop = 0
$totalAssigned = 0
$assignedSet = @{}
while ($loop -lt 15) {
    $loop++
    $candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cand.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))
    $candRes = curl.exe -4 -s -m 20 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $SchoolId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cand.json"
      
    if ([string]::IsNullOrEmpty($candRes)) {
        Write-Host "  [Warning] Candidate RPC returned empty or timed out, retrying in 2s..."
        Start-Sleep -Seconds 2
        continue
    }
    
    $matches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>[^"]*)"\},\{"t":1,"s":"(?<email>[^"]*)"\}')
    if ($matches.Count -eq 0) {
        Write-Host "  All candidates assigned."
        break
    }
    
    $groups = @{}
    $matched = 0
    foreach ($m in $matches) {
        $cId = $m.Groups['id'].Value
        if ($assignedSet.ContainsKey($cId)) { continue }
        
        $cEmail = $m.Groups['email'].Value.Trim().ToLower()
        $targetCohort = $lookup[$cEmail]
        if (-not $targetCohort) { continue }
        
        $targetRombelId = $rombelMap[$targetCohort]
        if (-not $targetRombelId) {
            # Try matching suffix
            foreach ($k in $rombelMap.Keys) {
                if ($targetCohort -like "*$k*") {
                    $targetRombelId = $rombelMap[$k]
                    break
                }
            }
        }
        if (-not $targetRombelId) { continue }
        
        $assignedSet[$cId] = $true
        if (-not $groups.ContainsKey($targetRombelId)) {
            $groups[$targetRombelId] = [System.Collections.Generic.List[string]]::new()
        }
        $groups[$targetRombelId].Add($cId)
        $matched++
    }
    
    if ($matched -eq 0) {
        Write-Host "  No more new matching candidates in batch ($totalAssigned placed so far). Done."
        break
    }
    
    foreach ($rId in $groups.Keys) {
        $sList = $groups[$rId]
        $cChunkSize = 40
        for ($ci = 0; $ci -lt $sList.Count; $ci += $cChunkSize) {
            $chunk = $sList[$ci..([Math]::Min($ci + $cChunkSize - 1, $sList.Count - 1))]
            $items = ($chunk | ForEach-Object { '{"t":1,"s":"' + $_ + '"}' }) -join ','
            $assignPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","studentIds"],"v":[{"t":1,"s":"$rId"},{"t":9,"i":2,"a":[$items],"o":0}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
            [System.IO.File]::WriteAllText("$pwd\temp_assign.json", $assignPayload, (New-Object System.Text.UTF8Encoding $false))
            $assignRes = curl.exe -4 -s -m 30 -X POST "https://belajarplus.com/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd" `
              -H "Authorization: Bearer $token" `
              -H "x-school-override: $SchoolId" `
              -H "x-tsr-serverfn: true" `
              -H "Content-Type: application/json" `
              --data-binary "@temp_assign.json"
              
            if (-not [string]::IsNullOrEmpty($assignRes)) {
                $placedMatch = [regex]::Matches($assignRes, 'placed')
                $totalAssigned += $placedMatch.Count
            }
        }
    }
}
Write-Host "  Total students placed into rombels: $totalAssigned"

# 9. Final Count Verification
[System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
$finalCntRes = curl.exe -4 -s -m 10 -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_cnt.json"
  
$cleanFinalRes = if ([string]::IsNullOrEmpty($finalCntRes)) { "" } else { $finalCntRes }
$finalCntMatch = [regex]::Match($cleanFinalRes, '\"v\":\[\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
if (-not $finalCntMatch.Success) {
    $finalCntMatch = [regex]::Match($cleanFinalRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
}
$finalCount = if ($finalCntMatch.Success) { [int]$finalCntMatch.Groups['count'].Value } else { 0 }

Write-Host "`n=========================================================="
Write-Host " DEPLOY ENGINE COMPLETED: $SchoolName"
Write-Host " Final Live Student Count: $finalCount / $($students.Count)"
Write-Host "=========================================================="
