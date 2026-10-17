Add-Type -AssemblyName System.IO.Compression.FileSystem

function Inspect-RawExcel($filePath) {
    Write-Host "`n========================================================"
    Write-Host "File: $filePath"
    if (-not (Test-Path $filePath)) {
        Write-Host "File NOT FOUND"
        return
    }
    
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
    
    # Check sheets in workbook.xml
    $wbEntry = $zip.GetEntry("xl/workbook.xml")
    if ($wbEntry) {
        $r = New-Object System.IO.StreamReader($wbEntry.Open())
        $wbXml = $r.ReadToEnd()
        $r.Close()
        $sheetMatches = [regex]::Matches($wbXml, '<sheet[^>]*name="([^"]+)"')
        $sheets = ($sheetMatches | ForEach-Object { $_.Groups[1].Value }) -join ", "
        Write-Host "Sheets: $sheets"
    }
    
    # Read shared strings if any
    $ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
    $sharedStrings = @()
    if ($ssEntry) {
        $r = New-Object System.IO.StreamReader($ssEntry.Open())
        $ssXml = $r.ReadToEnd()
        $r.Close()
        # extract <t> content
        $tMatches = [regex]::Matches($ssXml, '<t[^>]*>(.*?)</t>')
        foreach ($m in $tMatches) {
            $sharedStrings += $m.Groups[1].Value
        }
        Write-Host "Shared strings count: $($sharedStrings.Count)"
    } else {
        Write-Host "No sharedStrings.xml (inline strings)"
    }
    
    # Read first sheet
    $s1 = $zip.GetEntry("xl/worksheets/sheet1.xml")
    if ($s1) {
        $r = New-Object System.IO.StreamReader($s1.Open())
        $s1Xml = $r.ReadToEnd()
        $r.Close()
        $rows = [regex]::Matches($s1Xml, '<row[^>]*>(.*?)</row>')
        Write-Host "Sheet1 total rows: $($rows.Count)"
        
        # Print first 5 rows
        for ($i = 0; $i -lt [Math]::Min(5, $rows.Count); $i++) {
            $rowXml = $rows[$i].Groups[1].Value
            $cellMatches = [regex]::Matches($rowXml, '<c\s+r="([A-Z0-9]+)"(?:\s+t="([^"]+)")?[^>]*>(?:<v>([^<]*)</v>)?')
            $vals = @()
            foreach ($cm in $cellMatches) {
                $ref = $cm.Groups[1].Value
                $t = $cm.Groups[2].Value
                $v = $cm.Groups[3].Value
                $valStr = $v
                if ($t -eq "s" -and $v -ne "" -and $sharedStrings.Count -gt [int]$v) {
                    $valStr = $sharedStrings[[int]$v]
                }
                $vals += "$($ref): $valStr"
            }
            Write-Host " Row $($i+1): $($vals -join ' | ')"
        }
    }
    $zip.Dispose()
}

Inspect-RawExcel "H:\My Drive\Trainer\B+\AKUN\28. SMAN 1 Klaten\SMA Negeri 1 Klaten.xlsx"
Inspect-RawExcel "H:\My Drive\Trainer\B+\AKUN\18. SMAN 2 Purworejo\SMA Negeri 2 Purworejo - bagian 1 dari 2.xlsx"
Inspect-RawExcel "H:\My Drive\Trainer\B+\AKUN\31. SMAN 1 Kartasura\SMA Negeri 1 Kartasura - bagian 1 dari 3.xlsx"
Inspect-RawExcel "H:\My Drive\Trainer\B+\AKUN\13. SMAN 1 Muntilan\SMA Negeri 1 Muntilan.xlsx"
