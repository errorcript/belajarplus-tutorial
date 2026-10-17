$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '938f357a-4477-4f52-8ef7-eb7c69e61c41' # SMAN 2 Batang
$opId = [System.Guid]::NewGuid().ToString()

$email = "test.siswa.sman2batang@belajarplus.id"
$password = "Batang2026!"
$fullName = "Test Siswa Batang"
$whatsapp = ""
$grade = "10"
$className = "X-1"

# Build Seroval payload
$rowSeroval = @"
{"t":10,"i":3,"p":{"k":["operationId","email","password","fullName","whatsapp","grade","className"],"v":[{"t":1,"s":"$opId"},{"t":1,"s":"$email"},{"t":1,"s":"$password"},{"t":1,"s":"$fullName"},{"t":1,"s":"$whatsapp"},{"t":1,"s":"$grade"},{"t":1,"s":"$className"}]},"o":0}
"@

$payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","role","rows"],"v":[{"t":1,"s":"$scId"},{"t":1,"s":"student"},{"t":9,"i":2,"a":[$rowSeroval],"o":0}]},"o":0}]},"o":0},"f":127,"m":[]}
"@

[System.IO.File]::WriteAllText("$pwd\temp_test_seroval.json", $payload, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Sending Seroval payload to 77decbcf..."
$res = curl.exe -4 -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://belajarplus.com/_serverFn/77decbcfbd7ea32873f74d5dbb8aff93b0aacd3bf9e3a187a2ed9cb4215261b4" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_test_seroval.json"

Write-Host "Response:"
Write-Host $res
