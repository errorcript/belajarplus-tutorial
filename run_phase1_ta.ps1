$token = (Get-Content andrew_token.txt -Raw).Trim()

$schoolsToInit = @(
    @{ Name = "SMAN 1 Klaten"; Id = "2779c4d1-7104-45de-bab8-cb601ad77ee8" },
    @{ Name = "SMAN 2 Klaten"; Id = "ec633bf9-323e-4266-9a0c-623408bf617e" },
    @{ Name = "SMAN 2 Batang"; Id = "938f357a-4477-4f52-8ef7-eb7c69e61c41" },
    @{ Name = "SMAN 1 Bandar"; Id = "139d1f11-a59e-4f3f-bf6b-402788eb9fcf" },
    @{ Name = "SMAN 1 Weleri"; Id = "90c27648-b177-4650-9b4b-fa6b74f0c2b5" },
    @{ Name = "SMAN 13 Semarang"; Id = "2a1e1b08-9763-40fb-88d6-79a486c76502" },
    @{ Name = "SMA Negeri 1 Tasikmalaya"; Id = "b9e709be-08df-4ffb-8e95-785d88756fe7" }
)

Write-Host "=========================================================="
Write-Host " PHASE 1: INITIALIZE TA 2026/2027 & SEMESTER 1"
Write-Host "=========================================================="

foreach ($sc in $schoolsToInit) {
    $sId = $sc.Id
    Write-Host "`n>>> Setting up $($sc.Name) ($sId)..."
    
    # 1. Check existing TA
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
      
    $cleanTa = $taRes.Replace('\"', '"')
    $yearId = ""
    $m = [regex]::Match($cleanTa, '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"2026/2027\"\}')
    if ($m.Success) {
        $yearId = $m.Groups['id'].Value
        Write-Host "  -> TA 2026/2027 already exists: $yearId"
    } else {
        Write-Host "  -> Creating TA 2026/2027..."
        $createPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id","name","startDate","endDate"],"v":[{"t":2,"s":0},{"t":1,"s":"2026/2027"},{"t":1,"s":"2026-07-01"},{"t":1,"s":"2027-06-30"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_create_ta.json", $createPayload, (New-Object System.Text.UTF8Encoding $false))
        $createRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/f2883ee87e281b6825d9e18634f0e522c3fd3dabf77143731fc3523594854a26" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_create_ta.json"
          
        $createMatch = [regex]::Match($createRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\}')
        if ($createMatch.Success) {
            $yearId = $createMatch.Groups['id'].Value
            Write-Host "  -> Created TA 2026/2027 with ID: $yearId"
        } else {
            Write-Host "  -> Warning / error creating TA: $createRes"
        }
    }
    
    if (-not $yearId) { continue }
    
    # 2. Activate TA
    Write-Host "  -> Activating TA $yearId..."
    $actPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id"],"v":[{"t":1,"s":"$yearId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_act_ta.json", $actPayload, (New-Object System.Text.UTF8Encoding $false))
    $actRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/c45c9d7f37bf9d5c8cf3a2a8ad75ad88409c3c87ecd185a0a57f1a300eed97a2" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_act_ta.json"
      
    # 3. Create Semesters
    $sem1Payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId","number","startDate","endDate"],"v":[{"t":1,"s":"$yearId"},{"t":0,"s":1},{"t":1,"s":"2026-07-01"},{"t":1,"s":"2026-12-31"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_sem1.json", $sem1Payload, (New-Object System.Text.UTF8Encoding $false))
    $null = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2ff4fa25dd2b9ff36b2e8457103a8fd0b6ced7e228befa66c8ba3386bb6b040a" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_sem1.json"

    $sem2Payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId","number","startDate","endDate"],"v":[{"t":1,"s":"$yearId"},{"t":0,"s":2},{"t":1,"s":"2027-01-01"},{"t":1,"s":"2027-06-30"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_sem2.json", $sem2Payload, (New-Object System.Text.UTF8Encoding $false))
    $null = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2ff4fa25dd2b9ff36b2e8457103a8fd0b6ced7e228befa66c8ba3386bb6b040a" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_sem2.json"

    # 4. Activate Semester 1
    [System.IO.File]::WriteAllText("$pwd\temp_ta.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
    $taResAfter = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_ta.json"
      
    $cleanTaAfter = $taResAfter.Replace('\"', '"')
    $sem1Match = [regex]::Match($cleanTaAfter, '\{\"t\":1,\"s\":\"(?<semId>[0-9a-fA-F-]+)\"\},\{\"t\":1,\"s\":\"Semester 1\"\}')
    if ($sem1Match.Success) {
        $semId = $sem1Match.Groups['semId'].Value
        $actSemPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id"],"v":[{"t":1,"s":"$semId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_act_sem.json", $actSemPayload, (New-Object System.Text.UTF8Encoding $false))
        $null = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/a3bba9c295e5bbed357d163256048a3601588bfa9a388ce3ce128ea585ab0af3" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_act_sem.json"
        Write-Host "  -> Semester 1 ($semId) successfully activated!"
    }
}

Write-Host "`n=========================================================="
Write-Host " PHASE 1 COMPLETED: ALL 7 SCHOOLS HAVE ACTIVE TA 2026/2027!"
Write-Host "=========================================================="
