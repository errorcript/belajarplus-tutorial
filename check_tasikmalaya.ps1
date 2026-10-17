& .\auth_andrew.ps1 | Out-Null
$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "2ac70d47-7dc3-497b-a853-92e2e95b5788"

$cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$scId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_cnt.json"

Write-Host "Raw Response: $res"
$m = [regex]::Match($res, '\"v\":\[\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
if (-not $m.Success) {
    $m = [regex]::Match($res, '\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
}
if ($m.Success) {
    Write-Host "Live Student Count in TRY OUT SMA SWASTA TASIKMALAYA: $($m.Groups['c'].Value)"
}
