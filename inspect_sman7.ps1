Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-XlsxRows {
    param([string]$path, [int]$maxRows = 10)
    $tempDir = Join-Path $env:TEMP ([System.IO.Path]::GetRandomFileName())
    [System.IO.Compression.ZipFile]::ExtractToDirectory($path, $tempDir)
    
    $sharedStringsFile = Join-Path $tempDir "xl\sharedStrings.xml"
    $strings = @()
    if (Test-Path $sharedStringsFile) {
        [xml]$ssXml = Get-Content $sharedStringsFile -Raw -Encoding UTF8
        $ns = New-Object System.Xml.XmlNamespaceManager($ssXml.NameTable)
        $ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        $nodes = $ssXml.SelectNodes("//x:si", $ns)
        foreach ($node in $nodes) {
            $t = $node.SelectSingleNode(".//x:t", $ns)
            if ($t) { $strings += $t.InnerText } else { $strings += "" }
        }
    }
    
    $sheetFile = Join-Path $tempDir "xl\worksheets\sheet1.xml"
    [xml]$sheetXml = Get-Content $sheetFile -Raw -Encoding UTF8
    $nsSheet = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
    $nsSheet.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
    
    $rowNodes = $sheetXml.SelectNodes("//x:row", $nsSheet)
    Write-Host "Total rows found in XML: $($rowNodes.Count)"
    
    $count = 0
    foreach ($rNode in $rowNodes) {
        $rNum = $rNode.GetAttribute("r")
        $cNodes = $rNode.SelectNodes("x:c", $nsSheet)
        $rowVals = @()
        foreach ($c in $cNodes) {
            $tAttr = $c.GetAttribute("t")
            $vNode = $c.SelectSingleNode("x:v", $nsSheet)
            $val = if ($vNode) { $vNode.InnerText } else { "" }
            if ($tAttr -eq "s" -and $val -ne "") {
                $idx = [int]$val
                if ($idx -lt $strings.Count) { $val = $strings[$idx] }
            }
            $rowVals += $val
        }
        Write-Host "Row $rNum : $($rowVals -join ' | ')"
        $count++
        if ($count -ge $maxRows) { break }
    }
    
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "=== INSPECTING [CLEAN_IMPORT] SMAN 7 Surakarta.xlsx ==="
Read-XlsxRows -path "H:\My Drive\Trainer\B+\AKUN\25b. SMAN 7 Surakarta\[CLEAN_IMPORT] SMAN 7 Surakarta.xlsx" -maxRows 5

function Read-XlsxSheet {
    param([string]$path, [string]$sheetXmlName = "sheet2.xml")
    $tempDir = Join-Path $env:TEMP ([System.IO.Path]::GetRandomFileName())
    [System.IO.Compression.ZipFile]::ExtractToDirectory($path, $tempDir)
    
    $sharedStringsFile = Join-Path $tempDir "xl\sharedStrings.xml"
    $strings = @()
    if (Test-Path $sharedStringsFile) {
        [xml]$ssXml = Get-Content $sharedStringsFile -Raw -Encoding UTF8
        $ns = New-Object System.Xml.XmlNamespaceManager($ssXml.NameTable)
        $ns.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
        $nodes = $ssXml.SelectNodes("//x:si", $ns)
        foreach ($node in $nodes) {
            $t = $node.SelectSingleNode(".//x:t", $ns)
            if ($t) { $strings += $t.InnerText } else { $strings += "" }
        }
    }
    
    $sheetFile = Join-Path $tempDir "xl\worksheets\$sheetXmlName"
    [xml]$sheetXml = Get-Content $sheetFile -Raw -Encoding UTF8
    $nsSheet = New-Object System.Xml.XmlNamespaceManager($sheetXml.NameTable)
    $nsSheet.AddNamespace("x", "http://schemas.openxmlformats.org/spreadsheetml/2006/main")
    
    $rowNodes = $sheetXml.SelectNodes("//x:row", $nsSheet)
    Write-Host "Total rows found in $sheetXmlName : $($rowNodes.Count)"
    
    foreach ($rNode in $rowNodes) {
        $rNum = $rNode.GetAttribute("r")
        $cNodes = $rNode.SelectNodes("x:c", $nsSheet)
        $rowVals = @()
        foreach ($c in $cNodes) {
            $tAttr = $c.GetAttribute("t")
            $vNode = $c.SelectSingleNode("x:v", $nsSheet)
            $val = if ($vNode) { $vNode.InnerText } else { "" }
            if ($tAttr -eq "s" -and $val -ne "") {
                $idx = [int]$val
                if ($idx -lt $strings.Count) { $val = $strings[$idx] }
            }
            $rowVals += $val
        }
        Write-Host "Row $rNum : $($rowVals -join ' | ')"
    }
    
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "`n=== READING SHEET2.XML IN SMA Negeri 7 Surakarta.xlsx ==="
Read-XlsxSheet -path "H:\My Drive\Trainer\B+\AKUN\25b. SMAN 7 Surakarta\SMA Negeri 7 Surakarta.xlsx" -sheetXmlName "sheet2.xml"


