$token = (Get-Content andrew_token.txt -Raw).Trim()

# 1. SMAN 1 Surakarta
$s1Id = "a6725011-a00a-4964-a49b-e839b041bd13"
$s1Year = "61f894e1-a6ae-43ee-a9de-201d80e40127"
$s1Rombels = @(
    @{ Grade = "10"; Suffix = "1" },
    @{ Grade = "11"; Suffix = "1" },
    @{ Grade = "12"; Suffix = "1" }
)

Write-Host "Creating Rombels for SMAN 1 Surakarta..."
foreach ($r in $s1Rombels) {
    $p = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id","yearId","levelCode","gradeCode","suffix","homeroomId","active"],"v":[{"t":2,"s":0},{"t":1,"s":"$s1Year"},{"t":1,"s":"SMA"},{"t":1,"s":"$($r.Grade)"},{"t":1,"s":"$($r.Suffix)"},{"t":2,"s":0},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_create_r.json", $p, (New-Object System.Text.UTF8Encoding $false))
    $res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/1c49c2b9d560605ebafa91d06ae340ad60167fc050849fc66c2d729f799c583e" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $s1Id" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_create_r.json"
    Write-Host "Kelas $($r.Grade)-$($r.Suffix) => $res"
}

# 2. SMAN 2 Surakarta
$s2Id = "0154e5a7-e55b-4b69-9bbf-6637aa58c38f"
$s2Year = "c28a5165-f863-4123-9f4a-87da201c53f8"
$s2Rombels = @(
    @{ Grade = "12"; Suffix = "F. 1" },
    @{ Grade = "12"; Suffix = "F. 2" },
    @{ Grade = "12"; Suffix = "F. 3" },
    @{ Grade = "12"; Suffix = "F. 4" },
    @{ Grade = "12"; Suffix = "F. 5" }
)

Write-Host "`nCreating Rombels for SMAN 2 Surakarta..."
foreach ($r in $s2Rombels) {
    $p = @"
{"t":{"t":10,"i":0,"p":{"k":["data"],"v":[{"t":10,"i":1,"p":{"k":["id","yearId","levelCode","gradeCode","suffix","homeroomId","active"],"v":[{"t":2,"s":0},{"t":1,"s":"$s2Year"},{"t":1,"s":"SMA"},{"t":1,"s":"$($r.Grade)"},{"t":1,"s":"$($r.Suffix)"},{"t":2,"s":0},{"t":2,"s":2}]},"o":0}]},"o":0},"f":127,"m":[]}
"@
    [System.IO.File]::WriteAllText("$pwd\temp_create_r.json", $p, (New-Object System.Text.UTF8Encoding $false))
    $res = curl.exe -4 -s -X POST "https://belajarplus.com/_serverFn/1c49c2b9d560605ebafa91d06ae340ad60167fc050849fc66c2d729f799c583e" `
      -H "Authorization: Bearer $token" `
      -H "x-school-override: $s2Id" `
      -H "x-tsr-serverfn: true" `
      -H "Content-Type: application/json" `
      --data-binary "@temp_create_r.json"
    Write-Host "Kelas $($r.Grade)-$($r.Suffix) => $res"
}
