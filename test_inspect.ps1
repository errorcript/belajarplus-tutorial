Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead("H:\My Drive\Trainer\B+\AKUN\69. SMAN 1 Kutowinangun\[CLEAN_IMPORT] SMAN 1 Kutowinangun.xlsx")
$entry = $zip.GetEntry("xl/worksheets/sheet1.xml")
$reader = New-Object System.IO.StreamReader($entry.Open())
$s = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()
Write-Host ($s.Substring(0, [Math]::Min(1200, $s.Length)))
