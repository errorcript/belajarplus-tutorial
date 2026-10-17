Add-Type -AssemblyName System.IO.Compression.FileSystem

$files = @(
    @{ Name = "SMA Budi Utomo Surakarta"; Path = "H:\My Drive\Trainer\B+\AKUN\19. SMA Budi Utomo Surakarta\[CLEAN_IMPORT] SMA Budi Utomo Surakarta.xlsx" },
    @{ Name = "SMAN 3 Surakarta"; Path = "H:\My Drive\Trainer\B+\AKUN\22. SMAN 3 Surakarta\[CLEAN_IMPORT] SMAN 3 Surakarta.xlsx" },
    @{ Name = "SMAN 4 Surakarta"; Path = "H:\My Drive\Trainer\B+\AKUN\23. SMAN 4 Surakarta\[CLEAN_IMPORT] SMAN 4 Surakarta.xlsx" },
    @{ Name = "SMAN 8 Surakarta"; Path = "H:\My Drive\Trainer\B+\AKUN\26. SMAN 8 Surakarta\[CLEAN_IMPORT] SMAN 8 Surakarta.xlsx" },
    @{ Name = "SMAN 9 Surakarta"; Path = "H:\My Drive\Trainer\B+\AKUN\27. SMAN 9 Surakarta\[CLEAN_IMPORT] SMAN 9 Surakarta.xlsx" }
)

foreach ($f in $files) {
    Write-Host "`n=========================================================="
    Write-Host " Inspecting: $($f.Name)"
    Write-Host "=========================================================="
    
    $zip = [System.IO.Compression.ZipFile]::OpenRead($f.Path)
    $s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
    $reader = New-Object System.IO.StreamReader($s1.Open())
    $content = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()

    $rows = [regex]::Matches($content, '<row[^>]*>(.*?)</row>')
    Write-Host "Total rows: $($rows.Count)"
    
    $rombels = @{}
    $studentCount = 0
    foreach ($row in $rows) {
        $cells = [regex]::Matches($row.Groups[1].Value, '<v>([^<]+)</v>')
        if ($cells.Count -ge 4) {
            $email = $cells[1].Groups[1].Value.Trim().ToLower()
            $rombel = $cells[3].Groups[1].Value.Trim()
            if ($email -ne 'email' -and $email -match '@') {
                $studentCount++
                $rombels[$rombel] = $rombels[$rombel] + 1
            }
        }
    }
    Write-Host "Valid student records: $studentCount"
    Write-Host "Rombels found: $($rombels.Count)"
    $rombels.GetEnumerator() | Sort-Object Name | ForEach-Object {
        Write-Host "  - $($_.Key): $($_.Value) siswa"
    }
}
