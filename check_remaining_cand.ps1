$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = 'ec633bf9-323e-4266-9a0c-623408bf617e' # SMAN 2 Klaten
$firstRombelId = '16b1c34d-48b1-45d2-9b3f-2a2d838acf00'

$candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_test_cand.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))

$candRes = curl.exe -4 -s -m 10 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_test_cand.json"

$matches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>[^"]*)"\},\{"t":1,"s":"(?<email>[^"]*)"\}')
Write-Host "Unassigned candidates remaining: $($matches.Count)"
