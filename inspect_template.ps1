Add-Type -AssemblyName System.IO.Compression.FileSystem

$templatePath = "bot-tools\templates\template_resmi_belajarplus.xlsx"
Write-Host "Checking template: $templatePath"

$zip = [System.IO.Compression.ZipFile]::OpenRead($templatePath)
foreach ($entry in $zip.Entries) {
    Write-Host " - $($entry.FullName) ($($entry.Length) bytes)"
}
$zip.Dispose()
