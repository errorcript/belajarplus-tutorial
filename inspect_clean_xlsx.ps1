Add-Type -AssemblyName System.IO.Compression.FileSystem

$xlsxPath = "H:\My Drive\Trainer\B+\AKUN\73. SMAN 1 Batang\[CLEAN_IMPORT] SMAN 1 Batang.xlsx"

$zip = [System.IO.Compression.ZipFile]::OpenRead($xlsxPath)

# 1. Load shared strings if present
$sst = @()
$sstEntry = $zip.GetEntry("xl/sharedStrings.xml")
if ($sstEntry) {
    $reader = New-Object System.IO.StreamReader($sstEntry.Open())
    $sstContent = $reader.ReadToEnd()
    $reader.Close()
    
    $matches = [regex]::Matches($sstContent, '<si>(.*?)</si>')
    foreach ($m in $matches) {
        $tMatch = [regex]::Match($m.Groups[1].Value, '<t[^>]*>(.*?)</t>')
        if ($tMatch.Success) {
            $sst += $tMatch.Groups[1].Value
        } else {
            $sst += ""
        }
    }
}

Write-Host "Shared strings count: $($sst.Count)"

# 2. Read sheet1
$s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
$reader = New-Object System.IO.StreamReader($s1.Open())
$sheetContent = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

$rows = [regex]::Matches($sheetContent, '<row[^>]*>(.*?)</row>')
Write-Host "Total XML rows: $($rows.Count)"

for ($i = 0; $i -lt [Math]::Min(5, $rows.Count); $i++) {
    $rXml = $rows[$i].Groups[1].Value
    $cells = [regex]::Matches($rXml, '<c([^>]*)>(.*?)</c>')
    $rowVals = @()
    foreach ($c in $cells) {
        $attr = $c.Groups[1].Value
        $valXml = $c.Groups[2].Value
        $vMatch = [regex]::Match($valXml, '<v>(.*?)</v>')
        $val = if ($vMatch.Success) { $vMatch.Groups[1].Value } else { "" }
        if ($attr.Contains('t="s"') -and $val -ne "") {
            $idx = [int]$val
            $val = if ($idx -lt $sst.Count) { $sst[$idx] } else { $val }
        }
        $rowVals += $val
    }
    Write-Host "Row $i : $($rowVals -join ' | ')"
}
