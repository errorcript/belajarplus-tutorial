Add-Type -AssemblyName System.IO.Compression.FileSystem

function Read-ExcelData($filePath) {
    if (-not (Test-Path $filePath)) { return $null }
    
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
    
    # 1. Read shared strings
    $sharedStrings = @()
    $ssEntry = $zip.GetEntry("xl/sharedStrings.xml")
    if ($ssEntry) {
        $r = New-Object System.IO.StreamReader($ssEntry.Open())
        $ssXml = $r.ReadToEnd()
        $r.Close()
        $siMatches = [regex]::Matches($ssXml, '<si>(.*?)</si>')
        foreach ($si in $siMatches) {
            $tMatches = [regex]::Matches($si.Groups[1].Value, '<t[^>]*>(.*?)</t>')
            $text = ($tMatches | ForEach-Object { $_.Groups[1].Value }) -join ''
            $sharedStrings += $text
        }
    }
    
    # 2. Find sheets in workbook
    $wbEntry = $zip.GetEntry("xl/workbook.xml")
    $wbRelsEntry = $zip.GetEntry("xl/_rels/workbook.xml.rels")
    $sheets = @()
    if ($wbEntry -and $wbRelsEntry) {
        $r = New-Object System.IO.StreamReader($wbEntry.Open())
        [xml]$wbXml = $r.ReadToEnd()
        $r.Close()
        
        $r = New-Object System.IO.StreamReader($wbRelsEntry.Open())
        [xml]$relsXml = $r.ReadToEnd()
        $r.Close()
        
        foreach ($sheet in $wbXml.workbook.sheets.sheet) {
            $name = $sheet.name
            $rid = $sheet.id
            if (-not $rid) { $rid = $sheet.Attributes['r:id'].Value }
            
            $rel = $relsXml.Relationships.Relationship | Where-Object { $_.Id -eq $rid }
            if ($rel) {
                $target = $rel.Target.TrimStart('/')
                if ($target -notmatch '^xl/') { $target = "xl/" + $target }
                $sheets += @{ Name = $name; Path = $target }
            }
        }
    }
    
    # Target sheet: look for Siswa, Student, or first sheet (avoid Panduan)
    $targetSheet = $sheets | Where-Object { $_.Name -match 'siswa|student' } | Select-Object -First 1
    if (-not $targetSheet) {
        $targetSheet = $sheets | Where-Object { $_.Name -notmatch 'panduan|guru|ptk|teacher' } | Select-Object -First 1
    }
    if (-not $targetSheet -and $sheets.Count -gt 0) {
        $targetSheet = $sheets[0]
    }
    
    $rowsData = @()
    if ($targetSheet) {
        $sEntry = $zip.GetEntry($targetSheet.Path)
        if ($sEntry) {
            $r = New-Object System.IO.StreamReader($sEntry.Open())
            $sXml = $r.ReadToEnd()
            $r.Close()
            
            $rowMatches = [regex]::Matches($sXml, '<row[^>]*>(.*?)</row>')
            foreach ($row in $rowMatches) {
                $cells = @{}
                $cellMatches = [regex]::Matches($row.Groups[1].Value, '<c\s+r="([A-Z]+)(\d+)"(?:\s+[^>]*?t="([^"]+)")?[^>]*>(.*?)</c>')
                foreach ($cm in $cellMatches) {
                    $col = $cm.Groups[1].Value
                    $t = $cm.Groups[3].Value
                    $inner = $cm.Groups[4].Value
                    
                    $val = ""
                    if ($t -eq "inlineStr") {
                        $tm = [regex]::Match($inner, '<t[^>]*>(.*?)</t>')
                        if ($tm.Success) { $val = $tm.Groups[1].Value }
                    } elseif ($t -eq "s") {
                        $vm = [regex]::Match($inner, '<v>([^<]*)</v>')
                        if ($vm.Success -and $vm.Groups[1].Value -ne "") {
                            $idx = [int]$vm.Groups[1].Value
                            if ($idx -lt $sharedStrings.Count) { $val = $sharedStrings[$idx] }
                        }
                    } else {
                        $vm = [regex]::Match($inner, '<v>([^<]*)</v>')
                        if ($vm.Success) { $val = $vm.Groups[1].Value }
                    }
                    $cells[$col] = [System.Net.WebUtility]::HtmlDecode($val.Trim())
                }
                if ($cells.Count -gt 0) {
                    $rowsData += $cells
                }
            }
        }
    }
    
    $zip.Dispose()
    return @{
        TargetSheet = if ($targetSheet) { $targetSheet.Name } else { "" }
        Rows = $rowsData
    }
}

$data = Import-Clixml "audit_final_all_schools.xml"
$cat3 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }

Write-Host "Scanning all 28 schools in Cat 3..."
$summary = @()

foreach ($s in $cat3) {
    $folder = Join-Path "H:\My Drive\Trainer\B+\AKUN" $s.Folder
    $excels = Get-ChildItem $folder -Filter "*.xlsx" | Where-Object { $_.Name -notmatch '^\[CLEAN_IMPORT\]' }
    
    $totalStudents = 0
    $fileInfo = @()
    
    foreach ($e in $excels) {
        $res = Read-ExcelData $e.FullName
        $rowCount = if ($res.Rows.Count -gt 1) { $res.Rows.Count - 1 } else { 0 }
        $totalStudents += $rowCount
        
        $hStr = ""
        if ($res.Rows.Count -gt 0) {
            $hStr = ($res.Rows[0].GetEnumerator() | Sort-Object Name | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ", "
        }
        $fileInfo += "$($e.Name) [Sheet: $($res.TargetSheet), Baris: $rowCount, Hdr: $hStr]"
    }
    
    $summary += [PSCustomObject]@{
        Sekolah = $s.Sekolah
        Folder = $s.Folder
        Klaster = $s.Klaster
        PIC = $s.PIC
        TotalSiswa = $totalStudents
        DetailFiles = $fileInfo -join "`n    "
    }
}

$summary | ForEach-Object {
    Write-Host "`n========================================================"
    Write-Host "$($_.Sekolah) (Klaster: $($_.Klaster), PIC: $($_.PIC)) - Est Siswa: $($_.TotalSiswa)"
    Write-Host "  Folder: $($_.Folder)"
    Write-Host "  Files:`n    $($_.DetailFiles)"
}

$summary | Export-Clixml "cat3_scanned_details.xml"
Write-Host "`nDone! Saved to cat3_scanned_details.xml"
