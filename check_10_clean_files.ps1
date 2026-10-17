Add-Type -AssemblyName System.IO.Compression.FileSystem

$targets = @(
    @{ Name = "SMAN 1 Batang"; Folder = "73. SMAN 1 Batang"; File = "[CLEAN_IMPORT] SMAN 1 Batang.xlsx" },
    @{ Name = "SMAN 2 Batang"; Folder = "74. SMAN 2 Batang"; File = "[CLEAN_IMPORT] SMAN 2 Batang.xlsx" },
    @{ Name = "SMAN 1 Bandar"; Folder = "76. SMAN 1 Bandar"; File = "[CLEAN_IMPORT] SMAN 1 Bandar.xlsx" },
    @{ Name = "SMAN 1 Weleri"; Folder = "77. SMAN 1 Weleri"; File = "[CLEAN_IMPORT] SMAN 1 Weleri.xlsx" },
    @{ Name = "SMAN 13 Semarang"; Folder = "84. SMAN 13 Semarang"; File = "[CLEAN_IMPORT] SMAN 13 Semarang.xlsx" },
    @{ Name = "TASIKMALAYA"; Folder = "TASIKMALAYA"; File = "[CLEAN_IMPORT] TASIKMALAYA.xlsx" },
    @{ Name = "SMAN 2 Klaten"; Folder = "29. SMAN 2 Klaten"; File = "[CLEAN_IMPORT] SMAN 2 Klaten.xlsx" },
    @{ Name = "SMAN 1 Bulu"; Folder = "45. SMAN 1 Bulu"; File = "[CLEAN_IMPORT] SMAN 1 Bulu.xlsx" },
    @{ Name = "SMAN 1 Bojong"; Folder = "62. SMAN 1 Bojong"; File = "[CLEAN_IMPORT] SMAN 1 Bojong.xlsx" },
    @{ Name = "SMAN 1 Patikraja"; Folder = "57. SMAN 1 Patikraja"; File = "[CLEAN_IMPORT] SMAN 1 Patikraja.xlsx" }
)

foreach ($t in $targets) {
    $path = "H:\My Drive\Trainer\B+\AKUN\$($t.Folder)\$($t.File)"
    if (Test-Path $path) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
        $s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
        $reader = New-Object System.IO.StreamReader($s1.Open())
        $content = $reader.ReadToEnd()
        $reader.Close()
        $zip.Dispose()
        
        $rows = [regex]::Matches($content, '<row[^>]*>(.*?)</row>')
        $firstRow = if ($rows.Count -gt 0) { $rows[0].Groups[1].Value } else { "" }
        Write-Host "$($t.Name.PadRight(20)) | Rows: $($rows.Count.ToString().PadLeft(4)) | Path: OK"
    } else {
        Write-Host "$($t.Name.PadRight(20)) | FILE NOT FOUND: $path"
    }
}
