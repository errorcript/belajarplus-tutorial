$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = "b371451a-0121-4a68-81a2-ddc588c4edf5"
$crRes = curl.exe -4 -s -m 10 -X POST "https://belajarplus.com/_serverFn/1c49c2b9d560605ebafa91d06ae340ad60167fc050849fc66c2d729f799c583e" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_create_r.json"
Write-Host "Response: $crRes"
