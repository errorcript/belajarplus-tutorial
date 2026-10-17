$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "74601a04-a991-41ac-8b8a-b4afa1403be5"
$res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/05af1666567a0173ed0ea1ba6eb5124e2939fdfac61f41f75d2853b900b88c87" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_r.json"

[System.IO.File]::WriteAllText("$pwd\batang_r_raw.txt", $res, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Raw Rombel Response Length: $($res.Length)"
Write-Host $res.Substring(0, [Math]::Min(500, $res.Length))
