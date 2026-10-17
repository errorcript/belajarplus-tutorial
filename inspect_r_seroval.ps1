$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "b371451a-0121-4a68-81a2-ddc588c4edf5"
$yearId = "11bc7351-0d91-47c0-b875-fce42a1cfa5d"
$rPayload = '{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"' + $yearId + '"}]},"o":0}]},"o":0},"f":127,"m":[]}'
[System.IO.File]::WriteAllText("$pwd\tmp_test_r.json", $rPayload)
$rRes = curl.exe -4 -s -m 10 -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@tmp_test_r.json"

[System.IO.File]::WriteAllText("$pwd\test_r_res.txt", $rRes)
Write-Host ("Length: " + $rRes.Length)
