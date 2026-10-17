$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '2779c4d1-7104-45de-bab8-cb601ad77ee8'

$assignRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/337a3c1afccf4d21720d2417c45550a065b920ed76dc347564097da6421cecdd" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_assign.json"

Write-Host "assignRes: $assignRes"
