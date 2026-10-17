$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '58486ebf-4028-4bde-b508-5e7c0e2e091b' # SMAN 1 Bulu
$firstRombelId = '7f8cc094-6822-43c2-97e2-4c0a04ad457f'

$candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRombelId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_test_cand_bulu.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))

$candRes = curl.exe -4 -s -m 10 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_test_cand_bulu.json"

$matches = [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>[^"]*)"\},\{"t":1,"s":"(?<email>[^"]*)"\}')
Write-Host "Unassigned candidates remaining in SMAN 1 Bulu: $($matches.Count)"
