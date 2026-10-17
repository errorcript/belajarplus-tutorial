Add-Type -AssemblyName System.IO.Compression.FileSystem

$templatePath = "bot-tools\templates\template_resmi_belajarplus.xlsx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($templatePath)

function Read-ZipEntryText($zip, $entryName) {
    $e = $zip.GetEntry($entryName)
    if ($e) {
        $r = New-Object System.IO.StreamReader($e.Open())
        $t = $r.ReadToEnd()
        $r.Close()
        return $t
    }
    return $null
}

Write-Host "=== workbook.xml ==="
Write-Host (Read-ZipEntryText $zip "xl/workbook.xml")

Write-Host "`n=== sheet1.xml ==="
Write-Host (Read-ZipEntryText $zip "xl/worksheets/sheet1.xml")

Write-Host "`n=== sheet2.xml ==="
Write-Host (Read-ZipEntryText $zip "xl/worksheets/sheet2.xml")

$zip.Dispose()
