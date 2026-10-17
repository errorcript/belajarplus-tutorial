$mainHtml = curl.exe -4 -s "https://belajarplus.id/admin/students"
$matches = [regex]::Matches($mainHtml, '/assets/[a-zA-Z0-9_\.-]+\.js')
Write-Host "Found JS files in /admin/students:"
$targetUrl = ""
foreach ($m in $matches) {
    Write-Host "  $($m.Value)"
    $content = curl.exe -4 -s "https://belajarplus.id$($m.Value)"
    if ($content.Contains("77decbcf") -or $content.Contains("school-accounts.functions")) {
        Write-Host ">>> FOUND IN $($m.Value)!"
        [System.IO.File]::WriteAllText("$pwd\found_import_chunk.js", $content, (New-Object System.Text.UTF8Encoding $false))
        break
    }
}
