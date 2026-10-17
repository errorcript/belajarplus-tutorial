$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '2779c4d1-7104-45de-bab8-cb601ad77ee8'
$res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_cand.json"

Write-Host "candRes length: $($res.Length)"
Write-Host ($res.Substring(0, [Math]::Min(500, $res.Length)))
