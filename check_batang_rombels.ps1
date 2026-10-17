$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "74601a04-a991-41ac-8b8a-b4afa1403be5"
$yearId = "4b61c37c-4edc-4cd9-bec3-4c8b1b068f99"

# Query existing rombels
$rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$yearId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
$rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r.json"

Write-Host "Rombels in SMAN 1 Batang:"
$matches = [regex]::Matches($rRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},.*?"suffix".*?\{"t":1,"s":"(?<suf>[^"]+)"\}.*?"displayName".*?\{"t":1,"s":"(?<name>[^"]+)"\}')
foreach ($m in $matches) {
    Write-Host "  $($m.Groups['name'].Value) | Suffix: $($m.Groups['suf'].Value) | ID: $($m.Groups['id'].Value)"
}
