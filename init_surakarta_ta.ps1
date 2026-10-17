$token = (Get-Content andrew_token.txt -Raw).Trim()

$schoolsToInitTA = @(
    @{ Name = "SMA Negeri 1 Surakarta"; Id = "a6725011-a00a-4964-a49b-e839b041bd13" },
    @{ Name = "SMA Negeri 2 Surakarta"; Id = "0154e5a7-e55b-4b69-9bbf-6637aa58c38f" },
    @{ Name = "SMA Negeri 3 Surakarta"; Id = "8176d900-86ac-474a-9ef7-0b7bfc26e23e" },
    @{ Name = "SMA Negeri 4 Surakarta"; Id = "671770c6-8f7c-414a-9d4c-45a9e23876e6" },
    @{ Name = "SMA Negeri 8 Surakarta"; Id = "4c112d86-c3a1-4910-a0be-8af7e82a83e3" },
    @{ Name = "SMA Negeri 9 Surakarta"; Id = "c12012d5-9aeb-4511-8d2d-f2d3c157bc74" },
    @{ Name = "SMA Budi Utomo Surakarta"; Id = "ddae94fd-1d92-47e9-9da8-396dd91fc53a" }
)

Write-Host "=========================================================="
Write-Host " INITIALIZING TA 2026/2027 FOR SURAKARTA CLUSTER"
Write-Host "=========================================================="

foreach ($sc in $schoolsToInitTA) {
    $sId = $sc.Id
    Write-Host "`n>>> Processing $($sc.Name) ($sId)..."
    
    # 1. Check if TA already exists
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
      
    $m = [regex]::Match($taRes, '\{"t":1,"s":"(?<id>[0-9a-fA-F-]+)"\},\{"t":1,"s":"(?<name>2026/2027)"\}')
    $yearId = ""
    if ($m.Success) {
        $yearId = $m.Groups['id'].Value
        Write-Host "  -> TA 2026/2027 already exists with ID: $yearId"
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
            Write-Host "  -> ERROR creating TA: $createRes"
            continue
        }
    }
    
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
    Write-Host "  -> Activate TA result: $actRes"

    # 3. Create Semesters
    Write-Host "  -> Setting Semester 1..."
    $sem1Payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId","number","startDate","endDate"],"v":[{"t":1,"s":"$yearId"},{"t":0,"s":1},{"t":1,"s":"2026-07-01"},{"t":1,"s":"2026-12-31"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_sem1.json", $sem1Payload, (New-Object System.Text.UTF8Encoding $false))
    $sem1Res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2ff4fa25dd2b9ff36b2e8457103a8fd0b6ced7e228befa66c8ba3386bb6b040a" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_sem1.json"
      
    Write-Host "  -> Setting Semester 2..."
    $sem2Payload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["yearId","number","startDate","endDate"],"v":[{"t":1,"s":"$yearId"},{"t":0,"s":2},{"t":1,"s":"2027-01-01"},{"t":1,"s":"2027-06-30"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_sem2.json", $sem2Payload, (New-Object System.Text.UTF8Encoding $false))
    $sem2Res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2ff4fa25dd2b9ff36b2e8457103a8fd0b6ced7e228befa66c8ba3386bb6b040a" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_sem2.json"

    # 4. Activate Semester 1
    # First query TA to find Semester 1 id
    [System.IO.File]::WriteAllText("$pwd\temp_ta.json", $taPayload, (New-Object System.Text.UTF8Encoding $false))
    $taResAfter = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/2b7407a379661cd29f0ce8f4cde53907401ef036fea96c368199d5415720f478" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $sId" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_ta.json"
      
    $sem1Match = [regex]::Match($taResAfter, '\{"t":1,"s":"(?<semId>[0-9a-fA-F-]+)"\},\{"t":1,"s":"Semester 1"\}')
    if ($sem1Match.Success) {
        $semId = $sem1Match.Groups['semId'].Value
        Write-Host "  -> Activating Semester 1 with ID: $semId..."
        $actSemPayload = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id"],"v":[{"t":1,"s":"$semId"}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
        [System.IO.File]::WriteAllText("$pwd\temp_act_sem.json", $actSemPayload, (New-Object System.Text.UTF8Encoding $false))
        $actSemRes = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/a3bba9c295e5bbed357d163256048a3601588bfa9a388ce3ce128ea585ab0af3" `
          -H "Authorization: Bearer $token" `
          -H "x-school-override: $sId" `
          -H "x-tsr-serverfn: true" `
          -H "Content-Type: application/json" `
          --data-binary "@temp_act_sem.json"
        Write-Host "  -> Semester 1 activated!"
    }
}

Write-Host "`n=========================================================="
Write-Host " ALL 7 SCHOOLS INITIALIZED WITH ACTIVE TA 2026/2027!"
Write-Host "=========================================================="
