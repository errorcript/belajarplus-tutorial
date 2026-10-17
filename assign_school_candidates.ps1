param(
    [string]$SchoolId,
    [string]$ExcelPath
)

$token = (Get-Content andrew_token.txt -Raw).Trim()

Write-Host "=========================================================="
Write-Host " ASSIGN CANDIDATES ENGINE"
Write-Host " SchoolId : $SchoolId"
Write-Host " Excel    : $ExcelPath"
Write-Host "=========================================================="

# 1. Parse Excel
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($ExcelPath)
$sheetEntry = $zip.GetEntry("xl/worksheets/sheet1.xml")
$reader = New-Object System.IO.StreamReader($sheetEntry.Open())
$sheetContent = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$lookup = @{}
$rows = [regex]::Matches($sheetContent, '<row[^>]*>(.*?)</row>')
foreach ($row in $rows | Select-Object -Skip 1) {
    $cells = [regex]::Matches($row.Groups[1].Value, '<v>(.*?)</v>')
    if ($cells.Count -ge 4) {
        $email = $cells[1].Groups[1].Value.Trim().ToLower()
        $rombel = $cells[3].Groups[1].Value.Trim()
        if ($email.Contains('@')) {
            $lookup[$email] = $rombel
        }
    }
}
Write-Host "Loaded $($lookup.Count) student mappings from Excel."

# 2. Get active TA
$taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$SchoolId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_ta_assign.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
$taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_ta_assign.json"

$cleanTa = if ([string]::IsNullOrEmpty($taRes)) { "" } else { $taRes.Replace('\"', '"') }
$taMatch = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"(?<name>202[0-9]/202[0-9])\"\}')
if (-not $taMatch.Success) {
    Write-Host "ERROR: No active TA found!"
    exit 1
}
$taId = $taMatch.Groups['id'].Value
Write-Host "Active YearId: $taId"

# 3. Get existing rombels
$rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$taId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_r_assign.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
$rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r_assign.json"

$rombelMap = @{}
$cleanRRes = if ([string]::IsNullOrEmpty($rRes)) { "" } else { $rRes.Replace('\"', '"') }
$rMatches = [regex]::Matches($cleanRRes, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},.*?"suffix".*?\{\"t\":1,\"s\":\"(?<suf>[^\"]+)\"\}.*?"displayName".*?\{\"t\":1,\"s\":\"(?<name>[^\"]+)\"\}')
foreach ($rm in $rMatches) {
    $rombelMap[$rm.Groups['name'].Value] = $rm.Groups['id'].Value
    $rombelMap[$rm.Groups['suf'].Value] = $rm.Groups['id'].Value
    $rombelMap[$rm.Groups['name'].Value.Replace(' ', '')] = $rm.Groups['id'].Value
    $rombelMap[$rm.Groups['suf'].Value.Replace(' ', '')] = $rm.Groups['id'].Value
}
Write-Host "Found $($rMatches.Count) rombels on platform."

$firstRombelId = ($rombelMap.Values | Select-Object -First 1)
if (-not $firstRombelId) {
    Write-Host "ERROR: No rombel IDs available!"
    exit 1
}

# 4. Assign Candidates
$assignedSet = @{}
$totalPlaced = 0
$loop = 0

while ($loop -lt 15) {
    $loop++
    $candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cand_assign.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))
    $candRes = curl.exe -4 -s -m 30 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $SchoolId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cand_assign.json"

    if ([string]::IsNullOrEmpty($candRes)) {
        Write-Host "  Candidate query returned empty or timed out, retrying in 2s..."
        Start-Sleep -Seconds 2
        continue
    }

    $cMatches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>[^"]*)"\},\{"t":1,"s":"(?<email>[^"]*)"\}')
    if ($cMatches.Count -eq 0) {
        Write-Host "  No more unassigned candidates found. Assignment complete!"
        break
    }

    $groups = @{}
    $matched = 0
    foreach ($m in $cMatches) {
        $cId = $m.Groups['id'].Value
        if ($assignedSet.ContainsKey($cId)) { continue }

        $cEmail = $m.Groups['email'].Value.Trim().ToLower()
        $targetRombel = $lookup[$cEmail]
        if (-not $targetRombel) {
            continue
        }

        $rId = $rombelMap[$targetRombel]
        if (-not $rId) {
            $rId = $rombelMap[$targetRombel.Replace(' ', '')]
        }
        if (-not $rId) {
            foreach ($k in $rombelMap.Keys) {
                if ($targetRombel.EndsWith($k) -or $k.EndsWith($targetRombel)) {
                    $rId = $rombelMap[$k]
                    break
                }
            }
        }

        if ($rId) {
            if (-not $groups.ContainsKey($rId)) {
                $groups[$rId] = @()
            }
            $groups[$rId] += $cId
            $assignedSet[$cId] = $true
            $matched++
        }
    }

    Write-Host "  Iteration $($loop): $($cMatches.Count) candidates fetched, $matched mapped to rombels."
    if ($matched -eq 0) {
        Write-Host "  No more candidates can be mapped. Done."
        break
    }

    foreach ($rId in $groups.Keys) {
        $sList = $groups[$rId]
        $items = ($sList | ForEach-Object { '{"t":1,"s":"' + $_ + '"}' }) -join ','
        $assignPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","studentIds"],"v":[{"t":1,"s":"$rId"},{"t":9,"i":2,"a":[$items],"o":0}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_assign_action.json", $assignPayload, (New-Object System.Text.UTF8Encoding $false))
        $assignRes = curl.exe -4 -s -m 60 -X POST "https://belajarplus.com/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $SchoolId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_assign_action.json"

        if (-not [string]::IsNullOrEmpty($assignRes)) {
            $placedMatch = [regex]::Matches($assignRes, 'placed')
            $totalPlaced += $placedMatch.Count
        }
    }
}

Write-Host "Total candidates assigned into rombels: $totalPlaced"
