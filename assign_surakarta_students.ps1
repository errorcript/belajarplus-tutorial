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

function Assign-SchoolStudents($schoolName, $schoolId, $xlsxPath, $rombelMap) {
    Write-Host "`n=========================================================="
    Write-Host " ASSIGNING STUDENTS FOR $schoolName"
    Write-Host "=========================================================="
    
    $studentLookup = Get-ExcelStudentMap $xlsxPath
    Write-Host "Loaded $($studentLookup.Count) students from Excel map."
    
    # Target rombel ID to test unassigned
    $firstRombelId = ($rombelMap.Values | Select-Object -First 1)
    
    $loop = 0
    $totalAssigned = 0
    
    while ($loop -lt 10) {
        $loop++
        Write-Host "`n--- Batch Iteration $loop ---"
        
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
        Write-Host "Candidates found in batch: $($matches.Count)"
        
        if ($matches.Count -eq 0) {
            Write-Host "No more unassigned candidates found! Assignment complete."
            break
        }
        
        # Group student IDs by target rombel ID
        $groups = @{}
        $matched = 0
        $unmatched = 0
        
        foreach ($m in $matches) {
            $cId = $m.Groups['id'].Value
            $cEmail = $m.Groups['email'].Value.Trim().ToLower()
            
            $targetCohort = $studentLookup[$cEmail]
            if (-not $targetCohort) {
                # Try name fallback if needed
                $unmatched++
                continue
            }
            
            $targetRombelId = $rombelMap[$targetCohort]
            if (-not $targetRombelId) {
                $unmatched++
                continue
            }
            
            if (-not $groups.ContainsKey($targetRombelId)) {
                $groups[$targetRombelId] = [System.Collections.Generic.List[string]]::new()
            }
            $groups[$targetRombelId].Add($cId)
            $matched++
        }
        
        Write-Host "Batch statistics -> Matched: $matched, Unmatched: $unmatched"
        if ($matched -eq 0) {
            Write-Host "No candidates could be matched to rombels. Stopping to prevent loop."
            break
        }
        
        # Execute placement per rombel
        foreach ($rId in $groups.Keys) {
            $sList = $groups[$rId]
            Write-Host "Placing $($sList.Count) students into rombel $rId..."
            
            # Construct seroval array of student IDs
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
            Write-Host "Result: $($placedMatch.Count) placed. ($assignRes)"
            $totalAssigned += $placedMatch.Count
        }
    }
    Write-Host "=== Total Students Assigned to Rombels in $schoolName : $totalAssigned ==="
}

# 1. Execute SMAN 1 Surakarta
$s1Map = @{
    "X.1" = "e9d26eaa-95a2-494a-bf17-45f55d7b305f"
    "XI.1" = "1ac49d1c-7eef-4b21-9cd1-688dc0d03a27"
    "XII.1" = "63a03c10-2678-4ac8-b1cc-17ca736a9b16"
}
Assign-SchoolStudents "SMAN 1 Surakarta" "a6725011-a00a-4964-a49b-e839b041bd13" "H:\My Drive\Trainer\B+\AKUN\20. SMAN 1 Surakarta\[CLEAN_IMPORT] SMAN 1 Surakarta.xlsx" $s1Map

# 2. Execute SMAN 2 Surakarta
$s2Map = @{
    "XII - F. 1" = "4d38357d-4fe5-4657-a34e-c595d000ec89"
    "XII - F. 2" = "b9f124ac-0b41-4969-aef6-2af669dd6c1f"
    "XII - F. 3" = "a41ac7fa-ac95-4104-b14f-4f6276890303"
    "XII - F. 4" = "689c4c52-7b28-40f4-9650-e0074d6f3faa"
    "XII - F. 5" = "49b3e163-00cb-45fd-acd3-9ed904999fbe"
}
Assign-SchoolStudents "SMAN 2 Surakarta" "0154e5a7-e55b-4b69-9bbf-6637aa58c38f" "H:\My Drive\Trainer\B+\AKUN\21. SMAN 2 Surakarta\[CLEAN_IMPORT] SMAN 2 Surakarta.xlsx" $s2Map
