$token = (Get-Content andrew_token.txt -Raw).Trim()
$plan = Import-Clixml "deployment_plan_29_schools.xml"
$remaining = @("SMAN 1 Mirit", "SMAN 1 Kajen", "SMAN 1 Sragi", "SMAN 2 Batang", "SMAN 1 Subah", "SMAN 1 Bandar", "SMAN 1 Weleri", "SMAN 13 Semarang", "TASIKMALAYA")

foreach ($rName in $remaining) {
    $sc = $plan | Where-Object { $_.Sekolah -eq $rName }
    if (-not $sc) { continue }
    $scId = $sc.SchoolId
    $payload = '{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId"],"v":[{"t":1,"s":"' + $scId + '"}]},"o":0}]},"o":0},"f":127,"m":[]}'
    [System.IO.File]::WriteAllText("$pwd\tmp_ta_q.json", $payload)
    $res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $scId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@tmp_ta_q.json"
    $clean = $res.Replace('\"', '"')
    $hasTa = $clean.Contains("2026/2027")
    $isActive = $clean.Contains('"active":true') -or $clean.Contains('\"active\":true')
    Write-Host ("{0,-20} | Has 2026/2027: {1,-5} | Active: {2}" -f $rName, $hasTa, $isActive)
}
