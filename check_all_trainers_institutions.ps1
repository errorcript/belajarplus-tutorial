# Re-auth all 5 trainers to get fresh tokens
$trainers = @(
    @{ Name = "Andrew"; Email = "And.aliffiansyah@gmail.com"; Pass = "kerja98"; TokenFile = "andrew_token.txt" },
    @{ Name = "Henri"; Email = "Henrisusilo00@gmail.com"; Pass = "Henri9087!!"; TokenFile = "henri_token.txt" },
    @{ Name = "Adnan"; Email = "adnancindyana1234@gmail.com"; Pass = "trainer98"; TokenFile = "adnan_token.txt" },
    @{ Name = "Mevi"; Email = "Fitrinoveiraa@gmail.com"; Pass = "Mevi2026^"; TokenFile = "mevi_token.txt" },
    @{ Name = "Arum"; Email = "rumaysch@gmail.com"; Pass = "A410Arum"; TokenFile = "arum_token.txt" }
)

$allLiveSchools = @()

foreach ($tr in $trainers) {
    Write-Host "`n>>> Authenticating $($tr.Name)..."
    $body = '{"email":"' + $tr.Email + '","password":"' + $tr.Pass + '"}'
    [System.IO.File]::WriteAllText("$pwd\temp_auth.json", $body, (New-Object System.Text.UTF8Encoding $false))
    
    $res = curl.exe -4 -s -X POST "https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password" `
      -H "apikey: sb_publishable_2Dp2ndaxCq-sDK-96n7HbA_M_kcQdTt" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_auth.json"
      
    $json = $res | ConvertFrom-Json
    if (-not $json.access_token) {
        Write-Host "  FAILED to auth $($tr.Name)"
        continue
    }
    $token = $json.access_token
    $token | Out-File -Encoding ascii $tr.TokenFile
    Write-Host "  Success! Token saved to $($tr.TokenFile)"
    
    # Fetch institutions
    $instRes = curl.exe -4 -s "https://belajarplus.com/_serverFn/e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d" `
      -H "Authorization: Bearer $token" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json"
      
    $clean = $instRes.Replace('\"', '"')
    $pattern = '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]{36})\"\},\{\"t\":1,\"s\":\"(?<name>[^"]+)\"\}'
    $matches = [regex]::Matches($clean, $pattern)
    
    foreach ($m in $matches) {
        $n = $m.Groups['name'].Value
        $id = $m.Groups['id'].Value
        if ($n -notmatch "DUMMY|Belajar Plus|MARKETING") {
            $allLiveSchools += [PSCustomObject]@{
                Trainer = $tr.Name
                SchoolName = $n
                SchoolId = $id
            }
        }
    }
}

Write-Host "`nTotal Live Institutions found across all trainers: $($allLiveSchools.Count)"
$allLiveSchools | Export-Clixml "all_trainer_institutions.xml"
$allLiveSchools | Format-Table -AutoSize Trainer, SchoolName, SchoolId
