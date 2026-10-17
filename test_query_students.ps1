$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '844770ac-55d7-4f68-8a15-c57dec9187a9' # SMAN 1 Kartasura
$payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade","limit"],"v":[{"t":1,"s":"$scId"},{"t":1,"s":""},{"t":1,"s":""},{"t":0,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_page.json", $payload, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/48555baf421f908efc1f77c5a31187bf65c3e314f204a3cb4d38ecbb0477728b" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_page.json"

Write-Host "Response length: $($res.Length)"
Write-Host ($res.Substring(0, [Math]::Min(500, $res.Length)))
