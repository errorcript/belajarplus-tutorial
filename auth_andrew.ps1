$body = '{"email":"And.aliffiansyah@gmail.com","password":"kerja98"}'
[System.IO.File]::WriteAllText("$pwd\andrew_body.json", $body, (New-Object System.Text.UTF8Encoding $false))

$res = curl.exe -4 -s -X POST "https://jpmfsldnzptdgfhvdqpb.supabase.co/auth/v1/token?grant_type=password" `
  -H "apikey: sb_publishable_2Dp2ndaxCq-sDK-96n7HbA_M_kcQdTt" `
  -H "Content-Type: application/json" `
  --data-binary "@andrew_body.json"

$json = $res | ConvertFrom-Json
Write-Host "Andrew Token Length: $($json.access_token.Length)"
Write-Host "Andrew User ID     : $($json.user.id)"
$json.access_token | Out-File -Encoding ascii andrew_token.txt
