$token = (Get-Content andrew_token.txt -Raw).Trim()
$scId = '938f357a-4477-4f52-8ef7-eb7c69e61c41' # SMAN 2 Batang
$opId = [System.Guid]::NewGuid().ToString()

# First test with standard JSON
$jsonPayload = @"
{
  "data": {
    "schoolId": "$scId",
    "role": "student",
    "rows": [
      {
        "operationId": "$opId",
        "email": "test.student1.sman2batang@belajarplus.id",
        "password": "Password123!",
        "fullName": "Test Siswa Batang",
        "whatsapp": "",
        "grade": "10",
        "className": "X-1"
      }
    ]
  }
}
"@
[System.IO.File]::WriteAllText("$pwd\temp_test_bulk.json", $jsonPayload, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Sending JSON payload to 77decbcf..."
$res = curl.exe -4 -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://belajarplus.com/_serverFn/77decbcfbd7ea32873f74d5dbb8aff93b0aacd3bf9e3a187a2ed9cb4215261b4" `
  -H "Authorization: Bearer $token" `
  -H "x-school-override: $scId" `
  -H "x-tsr-serverfn: true" `
  -H "Content-Type: application/json" `
  --data-binary "@temp_test_bulk.json"

Write-Host "Response:"
Write-Host $res
