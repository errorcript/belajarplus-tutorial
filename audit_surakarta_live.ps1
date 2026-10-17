$token = (Get-Content andrew_token.txt -Raw).Trim()

$schools = @(
    @{ Name = "SMA Budi Utomo Surakarta"; Id = "ddae94fd-1d92-47e9-9da8-396dd91fc53a" },
    @{ Name = "SMA Negeri 1 Surakarta"; Id = "a6725011-a00a-4964-a49b-e839b041bd13" },
    @{ Name = "SMA Negeri 2 Surakarta"; Id = "0154e5a7-e55b-4b69-9bbf-6637aa58c38f" },
    @{ Name = "SMA Negeri 3 Surakarta"; Id = "8176d900-86ac-474a-9ef7-0b7bfc26e23e" },
    @{ Name = "SMA Negeri 4 Surakarta"; Id = "671770c6-8f7c-414a-9d4c-45a9e23876e6" },
    @{ Name = "SMA Negeri 5 Surakarta"; Id = "bad3a655-5d8f-4512-82cd-2d40cf2b0277" },
    @{ Name = "SMA Negeri 6 Surakarta"; Id = "91ded8dc-fd41-4bc1-8390-feeb7283f27a" },
    @{ Name = "SMA Negeri 7 Surakarta"; Id = "69b68867-20c4-4f77-8d01-f913488b92d1" },
    @{ Name = "SMA Negeri 8 Surakarta"; Id = "4c112d86-c3a1-4910-a0be-8af7e82a83e3" },
    @{ Name = "SMA Negeri 9 Surakarta"; Id = "c12012d5-9aeb-4511-8d2d-f2d3c157bc74" },
    @{ Name = "SMA Negeri 2 Wonosobo"; Id = "6e71049c-9b8c-4d50-a91c-ccacdb10fe28" },
    @{ Name = "SMA NEGERI 3 KLATEN"; Id = "36c1020a-f0ae-4e45-99d0-45ef48f5cd04" }
)

Write-Host "=========================================================="
Write-Host " AUDIT LIVE DATA SURAKARTA CLUSTER VIA BELAJARPLUS API"
Write-Host "=========================================================="

foreach ($sc in $schools) {
    $sId = $sc.Id
    
    # 1. Get TA
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
      
    $taName = "Tidak Ada"
    $taId = ""
    $m = [regex]::Match($taRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>202[0-9]/202[0-9])"\}')
    if ($m.Success) {
        $taId = $m.Groups['id'].Value
        $taName = $m.Groups['name'].Value
    }

    # 2. Get Siswa Count
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
      
    $cntMatch = [regex]::Match($cntRes, '\{"t":0,"s":(?<count>[0-9]+)\}')
    $siswaCount = if ($cntMatch.Success) { $cntMatch.Groups['count'].Value } else { "0" }

    # 3. Get Rombel Count
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

    Write-Host "$($sc.Name.PadRight(28)) | TA: $($taName.PadRight(10)) | Siswa Live: $($siswaCount.PadLeft(5)) | Rombel Live: $($rombelCount.ToString().PadLeft(3))"
}
