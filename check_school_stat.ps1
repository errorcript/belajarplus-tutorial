param(
    [string]$SchoolId = "938f357a-4477-4f52-8ef7-eb7c69e61c41"
)

$token = (Get-Content andrew_token.txt -Raw).Trim()
$p = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$SchoolId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_stat_cnt.json", $p, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $SchoolId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_stat_cnt.json"

Write-Host "Count Response: $res"
