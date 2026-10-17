$token = (Get-Content andrew_token.txt -Raw).Trim()
$schools = @(
    @{ Name = "SMAN 1 Patikraja"; Id = "27ec5abd-dbb1-4f01-9a09-8f42249ddcdb"; Excel = 612 },
    @{ Name = "SMAN 2 Purbalingga"; Id = "c07f5f75-f286-4ef4-b4d3-5a89c55714d7"; Excel = 716 },
    @{ Name = "SMAN 1 Bobotsari"; Id = "5dd5d6fd-b273-423a-9b36-bed7dbaa4320"; Excel = 720 },
    @{ Name = "SMAN 1 Karangreja"; Id = "202bbc8b-9796-47bd-a75a-143147d4e91c"; Excel = 648 },
    @{ Name = "SMAN 1 Kutasari"; Id = "e6b64db1-cad5-4863-93c7-d3a401e84f53"; Excel = 500 },
    @{ Name = "SMAN 1 Rembang"; Id = "4a99337a-a21b-4d44-96e2-76edb5ccb2fb"; Excel = 576 },
    @{ Name = "SMAN 1 Kebumen"; Id = "4996b1d9-0915-4e06-b4de-0981dee1ddf2"; Excel = 720 },
    @{ Name = "SMAN 1 Kutowinangun"; Id = "906d821a-5cfb-4bd6-977b-46eeba05e2e9"; Excel = 720 }
)

foreach ($s in $schools) {
    $scId = $s.Id
    $payload = '{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"' + $scId + '"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}'
    [System.IO.File]::WriteAllText("$pwd\tmp_q.json", $payload)
    $res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $scId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@tmp_q.json"
    $m = [regex]::Match($res, '\"v\":\[\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
    if (-not $m.Success) {
        $m = [regex]::Match($res, '\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
    }
    $cnt = if ($m.Success) { [int]$m.Groups["c"].Value } else { -1 }
    Write-Host ("{0,-22} | Expected: {1,4} | Live on Platform: {2,4}" -f $s.Name, $s.Excel, $cnt)
}
