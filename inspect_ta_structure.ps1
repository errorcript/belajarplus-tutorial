$token = (Get-Content andrew_token.txt -Raw).Trim()
$sId = "69b68867-20c4-4f77-8d01-f913488b92d1" # SMAN 7 Surakarta

$payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$sId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_ta.json", $payload, (New-Object System.Text.UTF8Encoding $false))

$taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $sId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_ta.json"

Write-Host "TA RESPONSE:"
Write-Host $taRes.Substring(0, [Math]::Min(1200, $taRes.Length))
