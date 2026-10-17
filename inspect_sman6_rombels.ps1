$token = (Get-Content andrew_token.txt -Raw).Trim()
$sId = "91ded8dc-fd41-4bc1-8390-feeb7283f27a" # SMAN 6 Surakarta

# Get TA
$taPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"$sId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_ta.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
$taRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $sId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_ta.json"
  
$m = [regex]::Match($taRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>202[0-9]/202[0-9])"\}')
$taId = $m.Groups['id'].Value
Write-Host "SMAN 6 TA Id: $taId"

$rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"$taId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
[System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
$rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $sId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r.json"

$matches = [regex]::Matches($rRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},.*?"suffix".*?\{"t":1,"s":"(?<suf>[^"]+)"\}.*?"displayName".*?\{"t":1,"s":"(?<name>[^"]+)"\}')
Write-Host "Total rombels in SMAN 6: $($matches.Count)"
foreach ($rm in $matches) {
    Write-Host "$($rm.Groups['name'].Value) | Suffix: $($rm.Groups['suf'].Value) | Id: $($rm.Groups['id'].Value)"
}
