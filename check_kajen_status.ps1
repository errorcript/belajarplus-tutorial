& .\auth_andrew.ps1 | Out-Null
$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "b371451a-0121-4a68-81a2-ddc588c4edf5"

# Query rombels for SMAN 1 Kajen
$rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","active"],"v":[{"t":1,"s":"$scId"},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
$rRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/1460c33a2eb833ff53907ffce1f215fc4b1ba04825d19db2f3493722241aa2c3" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r.json"

$cleanR = if ([string]::IsNullOrEmpty($rRes)) { "" } else { $rRes.Replace('\"', '"') }
$records = [regex]::Matches($cleanR, '\{\"t\":10,\"i\":[0-9]+,\"p\":\{\"k\":\[\"id\",\"active\",\"suffix\".*?\"v\":\[(?<values>.*?)\]\},\"o\":0\}')
Write-Host "SMAN 1 Kajen has $($records.Count) existing active rombels."

# Now check candidates
$firstRombelId = ""
if ($records.Count -gt 0) {
    $vals = $records[0].Groups['values'].Value.Split(',')
    if ($vals.Count -ge 1 -and $vals[0] -match '\"s\":\"(?<id>[0-9a-fA-F-]+)\"') {
        $firstRombelId = $Matches['id']
    }
}

if ($firstRombelId) {
    $candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cand.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))
    $candRes = curl.exe -4 -s -m 20 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $scId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cand.json"
      
    $matches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\}')
    Write-Host "Unassigned candidates left in SMAN 1 Kajen: $($matches.Count)"
}
