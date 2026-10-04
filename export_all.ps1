$pptxPath = Resolve-Path "Sosialisasi_BelajarPlus_Kepala_Sekolah.pptx"
$outputFolder = Join-Path (Get-Location) "assets\pptx_slides"

if (!(Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

$ppt = New-Object -ComObject PowerPoint.Application
$p = $ppt.Presentations.Open($pptxPath, [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)

for ($i = 1; $i -le $p.Slides.Count; $i++) {
    $outImg = Join-Path $outputFolder ("slide_" + $i.ToString("00") + ".png")
    $p.Slides.Item($i).Export($outImg, "PNG", 1920, 1080)
}

$p.Close()
$ppt.Quit()
Write-Host "EXPORT_ALL_SUCCESS"
