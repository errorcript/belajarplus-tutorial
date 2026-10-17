$token = (Get-Content andrew_token.txt -Raw).Trim()
$schools = Import-Clixml "cat2_matched_live.xml"

Write-Host "=========================================================="
Write-Host " CHECKING LIVE PLATFORM STATUS FOR 29 READY SCHOOLS"
Write-Host "=========================================================="

$liveStatus = @()

foreach ($sc in $schools) {
    $sId = $sc.SchoolId
    if (-not $sId) { continue }
    
    # 1. TA
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
    $taActive = $false
    
    $m = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"(?<name>202[0-9]/202[0-9])\"\}')
    if ($m.Success) {
        $taId = $m.Groups['id'].Value
        $taName = $m.Groups['name'].Value
        if ($cleanTa.Contains('active') -or $cleanTa.Contains('Aktif')) {
            $taActive = $true
        }
    }

    # 2. Siswa Count
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
    $siswaCount = if ($cntMatch.Success) { [int]$cntMatch.Groups['count'].Value } else { 0 }

    # 3. Rombel Count
    $rombelCount = 0
    if ($taId) {
        $rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$taId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
        $rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_r.json"
          
        $rMatches = [regex]::Matches($rRes, 'displayName')
        $rombelCount = $rMatches.Count
    }
    
    Write-Host "$($sc.MatchedLiveName.PadRight(26)) | TA: $($taName.PadRight(10)) | Siswa Live: $($siswaCount.ToString().PadLeft(5)) | Rombel Live: $($rombelCount.ToString().PadLeft(3))"
    
    $liveStatus += [PSCustomObject]@{
        Sekolah = $sc.Sekolah
        MatchedLiveName = $sc.MatchedLiveName
        SchoolId = $sId
        TahunAjaran = $taName
        TaId = $taId
        SiswaLive = $siswaCount
        RombelLive = $rombelCount
    }
}

$liveStatus | Export-Clixml "cat2_live_audit_detail.xml"
