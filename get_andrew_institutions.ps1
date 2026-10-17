$token = (Get-Content andrew_token.txt -Raw).Trim()

$res = curl.exe -4 -s "https://belajarplus.com/_serverFn/e35542c971d68586633ce35db94ff40095d3062c0d6693763dae07ac400ba23d" `
  -H "Authorization: Bearer $token" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json"

[System.IO.File]::WriteAllText("$pwd\andrew_inst_raw.txt", $res, (New-Object System.Text.UTF8Encoding $false))

$clean = $res.Replace('\"', '"')
$matches = [regex]::Matches($clean, '"name":"(?<name>[^"]+)".*?"id":"(?<id>[^"]+)"')
Write-Host "Total Institusi Ditemukan: $($matches.Count)"
foreach ($m in $matches) {
    Write-Host "$($m.Groups['name'].Value) | ID: $($m.Groups['id'].Value)"
}
