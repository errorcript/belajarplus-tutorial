# Query live counts for specific schools
& .\auth_andrew.ps1 | Out-Null
$token = (Get-Content andrew_token.txt -Raw).Trim()

$schools = @(
    @{ Name = "SMAN 1 Klaten"; Id = "2779c4d1-7104-45de-bab8-cb601ad77ee8"; Target = 395 },
    @{ Name = "SMAN 2 Klaten"; Id = "ec633bf9-323e-4266-9a0c-623408bf617e"; Target = 360 },
    @{ Name = "SMAN 1 Bulu"; Id = "58486ebf-4028-4bde-b508-5e7c0e2e091b"; Target = 540 },
    @{ Name = "SMAN 1 Patikraja"; Id = "27ec5abd-dbb1-4f01-9a09-8f42249ddcdb"; Target = 612 },
    @{ Name = "SMAN 2 Purbalingga"; Id = "c07f5f75-f286-4ef4-b4d3-5a89c55714d7"; Target = 716 },
    @{ Name = "SMAN 1 Bobotsari"; Id = "5dd5d6fd-b273-423a-9b36-bed7dbaa4320"; Target = 720 },
    @{ Name = "SMAN 1 Batang"; Id = "74601a04-a991-41ac-8b8a-b4afa1403be5"; Target = 144 },
    @{ Name = "SMAN 1 Kajen"; Id = "b371451a-0121-4a68-81a2-ddc588c4edf5"; Target = 1187 },
    @{ Name = "TASIKMALAYA"; Id = "b9e709be-08df-4ffb-8e95-785d88756fe7"; Target = 337 }
)

foreach ($s in $schools) {
    $scId = $s.Id
    $cntPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","search","grade"],"v":[{"t":1,"s":"$scId"},{"t":1,"s":""},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_cnt.json", $cntPayload, (New-Object System.Text.UTF8Encoding $false))
    $res = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/71a00dcbb6b98c3ee9ab10d0bd7179bdf9597c04b33e7bb3e718092af1f9c382" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $scId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_cnt.json"
      
    $cnt = 0
    if (-not [string]::IsNullOrEmpty($res)) {
        $m = [regex]::Match($res, '\"v\":\[\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
        if (-not $m.Success) {
            $m = [regex]::Match($res, '\{\"t\":0,\"s\":(?<c>[0-9]+)\}')
        }
        if ($m.Success) {
            $cnt = [int]$m.Groups['c'].Value
        }
    }
    
    $status = if ($cnt -ge $s.Target) { "100% OK" } elseif ($cnt -gt 0) { "PARTIAL ($cnt/$($s.Target))" } else { "EMPTY (0)" }
    Write-Host "$($s.Name.PadRight(22)) : Live = $($cnt.ToString().PadLeft(5)) / $($s.Target.ToString().PadLeft(5)) -> $status"
}
