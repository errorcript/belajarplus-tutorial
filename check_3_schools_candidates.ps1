& .\auth_andrew.ps1 | Out-Null
$token = (Get-Content andrew_token.txt -Raw).Trim()

$targets = @(
    @{ Name = "SMAN 1 Patikraja"; Id = "27ec5abd-dbb1-4f01-9a09-8f42249ddcdb"; Folder = "57. SMAN 1 Patikraja"; File = "[CLEAN_IMPORT] SMAN 1 Patikraja.xlsx" },
    @{ Name = "SMAN 2 Purbalingga"; Id = "c07f5f75-f286-4ef4-b4d3-5a89c55714d7"; Folder = "60. SMAN 2 Purbalingga"; File = "[CLEAN_IMPORT] SMAN 2 Purbalingga.xlsx" },
    @{ Name = "SMAN 1 Bobotsari"; Id = "5dd5d6fd-b273-423a-9b36-bed7dbaa4320"; Folder = "61. SMAN 1 Bobotsari"; File = "[CLEAN_IMPORT] SMAN 1 Bobotsari.xlsx" }
)

foreach ($t in $targets) {
    Write-Host "`n>>> Checking Candidates for $($t.Name)..."
    $scId = $t.Id
    
    # Query rombels
    $rPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["schoolId","active"],"v":[{"t":1,"s":"$scId"},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_r.json", $rPayload, (New-Object System.Text.UTF8Encoding $false))
    $rRes = curl.exe -4 -s -m 15 -X POST "https://belajarplus.com/_serverFn/1460c33a2eb833ff53907ffce1f215fc4b1ba04825d19db2f3493722241aa2c3" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $scId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_r.json"
      
    $cleanR = if ([string]::IsNullOrEmpty($rRes)) { "" } else { $rRes.Replace('\"', '"') }
    $mR = [regex]::Match($cleanR, '\"id\",\"active\",\"suffix\".*?\"v\":\[(?<vals>.*?)\]')
    $firstRId = ""
    if ($mR.Success) {
        $firstStr = [regex]::Match($mR.Groups['vals'].Value, '\"s\":\"(?<id>[0-9a-fA-F-]+)\"')
        if ($firstStr.Success) { $firstRId = $firstStr.Groups['id'].Value }
    }
    
    if (-not $firstRId) {
        # Try finding any GUID
        $anyGuid = [regex]::Match($cleanR, '(?<id>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})')
        if ($anyGuid.Success) { $firstRId = $anyGuid.Groups['id'].Value }
    }
    
    if ($firstRId) {
        $candPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["rombelId","q"],"v":[{"t":1,"s":"$firstRId"},{"t":1,"s":""}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_cand.json", $candPayload, (New-Object System.Text.UTF8Encoding $false))
        $candRes = curl.exe -4 -s -m 20 -X POST "https://belajarplus.com/_serverFn/a30d7ae826e53b88cdaa1315cd06cc9915d19c405a03aa9593a36a48f8a25af5" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $scId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_cand.json"
          
        $matches = if (-not [string]::IsNullOrEmpty($candRes)) {
            [regex]::Matches($candRes, '\{"t":10,"i":[0-9]+,"p":\{"k":\["id","name","email","grade","className"\],"v":\[\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\}')
        } else { @() }
        Write-Host "    $($t.Name): Found $($matches.Count) unassigned candidates remaining."
    } else {
        Write-Host "    $($t.Name): No rombel ID found."
    }
}
