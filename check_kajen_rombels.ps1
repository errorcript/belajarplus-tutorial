$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "b371451a-0121-4a68-81a2-ddc588c4edf5"
$yearId = "11bc7351-0d91-47c0-b875-fce42a1cfa5d"
$rPayload = '{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId"],"v":[{"t":1,"s":"' + $yearId + '"}]},"o":0}]},"o":0},"f":127,"m":[]}'
[System.IO.File]::WriteAllText("$pwd\tmp_rkajen.json", $rPayload)
$rRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@tmp_rkajen.json"

$clean = $rRes.Replace('\"', '"')
$rMatches = [regex]::Matches($clean, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},.*?"suffix".*?\{\"t\":1,\"s\":\"(?<suf>[^\"]+)\"\}.*?"displayName".*?\{\"t\":1,\"s\":\"(?<name>[^\"]+)\"\}')
foreach ($rm in $rMatches) {
    Write-Host ("Rombel: {0,-15} | Suffix: {1,-10} | Id: {2}" -f $rm.Groups['name'].Value, $rm.Groups['suf'].Value, $rm.Groups['id'].Value)
}
Write-Host "Total existing rombels: $($rMatches.Count)"
