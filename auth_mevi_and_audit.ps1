# 1. Login Mevi
$body = '{"email":"Fitrinoveiraa@gmail.com","password":"Mevi2026^"}'
[System.IO.File]::WriteAllText("$pwd\mevi_body.json", $body, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -X POST "https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password" `
  -H "apikey: sb_publishable_2Dp2ndaxCq-sDK-96n7HbA_M_kcQdTt" `
  -H "Content-Type: application/json" `
  --data-binary "@mevi_body.json"

$json = $res | ConvertFrom-Json
$token = $json.access_token
$token | Out-File -Encoding ascii mevi_token.txt
Write-Host "Mevi Login Success! User ID: $($json.user.id)"

# Fetch schools
$instRes = curl.exe -4 -s "https://belajarplus.com/_serverFn/e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d" `
  -H "Authorization: Bearer $token" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json"

$clean = $instRes.Replace('\"', '"')
$pattern = '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]{36})\"\},\{\"t\":1,\"s\":\"(?<name>[^"]+)\"\}'
$matches = [regex]::Matches($clean, $pattern)

$meviSchools = @()
foreach ($m in $matches) {
    $n = $m.Groups['name'].Value
    $id = $m.Groups['id'].Value
    if ($n -notmatch "DUMMY|Belajar Plus|MARKETING") {
        $meviSchools += @{ Name = $n; Id = $id }
    }
}

Write-Host "`n=========================================================="
Write-Host " AUDIT LIVE DATA MEVI CLUSTER (CILACAP/BANYUMAS) VIA API"
Write-Host "=========================================================="

foreach ($sc in $meviSchools) {
    $sId = $sc.Id
    
    # Get TA
    $taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$sId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_ta_mevi.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
    $taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_ta_mevi.json"
      
    $cleanTa = $taRes.Replace('\"', '"')
    $taName = "Tidak Ada"
    $taId = ""
    $m = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"(?<name>202[0-9]/202[0-9])\"\}')
    if ($m.Success) {
        $taId = $m.Groups['id'].Value
        $taName = $m.Groups['name'].Value
    }

    # Siswa Count
    $cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$sId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cnt_mevi.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
    $cntRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cnt_mevi.json"
      
    $cntMatch = [regex]::Match($cntRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
    $siswaCount = if ($cntMatch.Success) { $cntMatch.Groups['count'].Value } else { "0" }

    # Rombel Count
    $rombelCount = 0
    if ($taId) {
        $rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$taId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_r_mevi.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
        $rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_r_mevi.json"
          
        $rMatches = [regex]::Matches($rRes, 'displayName')
        $rombelCount = $rMatches.Count
    }

    Write-Host "$($sc.Name.PadRight(26)) | TA: $($taName.PadRight(10)) | Siswa Live: $($siswaCount.PadLeft(5)) | Rombel Live: $($rombelCount.ToString().PadLeft(3))"
}
