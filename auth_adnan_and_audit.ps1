# 1. Login Adnan
$body = '{"email":"adnancindyana1234@gmail.com","password":"trainer98"}'
[System.IO.File]::WriteAllText("$pwd\adnan_body.json", $body, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -X POST "https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password" `
  -H "apikey: sb_publishable_2Dp2ndaxCq-sDK-96n7HbA_M_kcQdTt" `
  -H "Content-Type: application/json" `
  --data-binary "@adnan_body.json"

$json = $res | ConvertFrom-Json
$token = $json.access_token
$token | Out-File -Encoding ascii adnan_token.txt
Write-Host "Adnan Login Success! User ID: $($json.user.id)"

$semarangSchools = @(
    @{ Name = "SMAN 11 Semarang"; Id = "7d29b6e9-70bf-4ed8-9d44-4f8a665f46da" },
    @{ Name = "SMAN 1 Ambarawa"; Id = "1acbff7f-b932-4dbf-9106-40f8ee3b41c5" },
    @{ Name = "SMAN 2 Ungaran"; Id = "d81f82e8-c51d-4b91-bdcb-5dd174743bbb" },
    @{ Name = "SMAN 1 Tuntang"; Id = "62e19b97-fdff-49c8-8f13-63b2c7bd8a3b" },
    @{ Name = "SMAN 7 Semarang"; Id = "e0102f78-bba2-41e7-9631-1742db944255" },
    @{ Name = "SMAN 10 Semarang"; Id = "e5610397-2037-4ac3-b629-ddff903c67aa" }
)

Write-Host "`n=========================================================="
Write-Host " AUDIT LIVE DATA SEMARANG CLUSTER VIA BELAJARPLUS API"
Write-Host "=========================================================="

foreach ($sc in $semarangSchools) {
    $sId = $sc.Id
    
    # Get TA
    $taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$sId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_ta_smg.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
    $taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_ta_smg.json"
      
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
    [System.IO.File]::WriteAllText("$pwd\temp_cnt_smg.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
    $cntRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cnt_smg.json"
      
    $cntMatch = [regex]::Match($cntRes, '\{\"t\":0,\"s\":(?<count>[0-9]+)\}')
    $siswaCount = if ($cntMatch.Success) { $cntMatch.Groups['count'].Value } else { "0" }

    # Rombel Count
    $rombelCount = 0
    if ($taId) {
        $rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$taId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_r_smg.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
        $rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_r_smg.json"
          
        $rMatches = [regex]::Matches($rRes, 'displayName')
        $rombelCount = $rMatches.Count
    }

    Write-Host "$($sc.Name.PadRight(20)) | TA: $($taName.PadRight(10)) | Siswa Live: $($siswaCount.PadLeft(5)) | Rombel Live: $($rombelCount.ToString().PadLeft(3))"
}
