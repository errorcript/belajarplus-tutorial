Add-Type -AssemblyName System.IO.Compression
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
            $rid = [regex]::Match($sheet.OuterXml, 'r:id="([^"]+)"').Groups[1].Value
            $rel = $relsXml.Relationships.Relationship | Where-Object { $_.Id -eq $rid }
            if ($rel) {
                $target = $rel.Target.TrimStart('/')
                if ($target -notmatch '^xl/') { $target = "xl/" + $target }
                $sheets += @{ Name = $name; Path = $target }
            }
        }
    }
    $targetSheet = $sheets | Where-Object { $_.Name -match 'siswa|student' } | Select-Object -First 1
    if (-not $targetSheet) { $targetSheet = $sheets | Where-Object { $_.Name -notmatch 'panduan|guru|ptk|teacher' } | Select-Object -First 1 }
    if (-not $targetSheet -and $sheets.Count -gt 0) { $targetSheet = $sheets[0] }
    
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
                if ($cells.Count -gt 0) { $rowsData += $cells }
            }
        }
    }
    $zip.Dispose()
    return @{ TargetSheet = if ($targetSheet) { $targetSheet.Name } else { "" }; Rows = $rowsData }
}

function New-CleanImportExcel($outputPath, $studentsList) {
    $templatePath = "bot-tools\templates\template_resmi_belajarplus.xlsx"
    Copy-Item $templatePath $outputPath -Force
    
    $totalRows = $studentsList.Count + 1
    $dimRef = "A1:D$totalRows"
    
    $sb = New-Object System.Text.StringBuilder
    [void]$sb.Append('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')
    [void]$sb.Append('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">')
    [void]$sb.Append("<dimension ref=""$dimRef""/>")
    [void]$sb.Append('<sheetViews><sheetView workbookViewId="0"/></sheetViews>')
    [void]$sb.Append('<sheetData>')
    
    [void]$sb.Append('<row r="1">')
    [void]$sb.Append('<c r="A1" t="str"><v>Nama</v></c>')
    [void]$sb.Append('<c r="B1" t="str"><v>Email</v></c>')
    [void]$sb.Append('<c r="C1" t="str"><v>Password Awal</v></c>')
    [void]$sb.Append('<c r="D1" t="str"><v>Rombel</v></c>')
    [void]$sb.Append('</row>')
    
    $rowIdx = 2
    foreach ($st in $studentsList) {
        $nama = [System.Security.SecurityElement]::Escape($st.Nama)
        $email = [System.Security.SecurityElement]::Escape($st.Email)
        $pass = [System.Security.SecurityElement]::Escape($st.Password)
        $rombel = [System.Security.SecurityElement]::Escape($st.Rombel)
        
        [void]$sb.Append("<row r=""$rowIdx"">")
        [void]$sb.Append("<c r=""A$rowIdx"" t=""str""><v>$nama</v></c>")
        [void]$sb.Append("<c r=""B$rowIdx"" t=""str""><v>$email</v></c>")
        [void]$sb.Append("<c r=""C$rowIdx"" t=""str""><v>$pass</v></c>")
        [void]$sb.Append("<c r=""D$rowIdx"" t=""str""><v>$rombel</v></c>")
        [void]$sb.Append('</row>')
        $rowIdx++
    }
    
    [void]$sb.Append('</sheetData>')
    [void]$sb.Append("<ignoredErrors><ignoredError numberStoredAsText=""1"" sqref=""$dimRef""/></ignoredErrors>")
    [void]$sb.Append('</worksheet>')
    
    $zip = [System.IO.Compression.ZipFile]::Open($outputPath, [System.IO.Compression.ZipArchiveMode]::Update)
    $entry = $zip.GetEntry("xl/worksheets/sheet1.xml")
    if ($entry) { $entry.Delete() }
    $newEntry = $zip.CreateEntry("xl/worksheets/sheet1.xml", [System.IO.Compression.CompressionLevel]::Optimal)
    $writer = New-Object System.IO.StreamWriter($newEntry.Open(), [System.Text.Encoding]::UTF8)
    $writer.Write($sb.ToString())
    $writer.Close()
    $zip.Dispose()
}

function Clean-RombelString($raw) {
    if (-not $raw) { return "Kelas Umum" }
    $r = $raw.Trim()
    if ($r.EndsWith('__') -or $r -eq '-' -or $r -eq '') { return "Kelas Umum" }
    
    if ($r -match '_kelas\d+_(.+)$') {
        $val = $matches[1].ToUpper().Replace('_', '-')
        if ($val -match '^([A-Z]+)(\d+)$') { $val = "$($matches[1])-$($matches[2])" }
        return $val
    }
    if ($r -match '_(x[i|v|x]*[_-][^_-]+)$') {
        $val = $matches[1].ToUpper().Replace('_', '-')
        return $val
    }
    if ($r -match '^[a-zA-Z0-9]+_(.+)$') {
        $sub = $matches[1].Trim()
        if ($sub -notmatch '^[a-zA-Z0-9]+@') {
            return $sub.ToUpper().Replace('_', ' ')
        }
    }
    return $r
}

# Prefix dictionary
$prefixMap = @{
    "13. SMAN 1 Muntilan" = "sman1mun"
    "SMAN 2 Purworejo"    = "sman2pur"
    "SMAN 1 Klaten"       = "sman1kla"
    "SMAN 2 Klaten"       = "sman2kla"
    "SMAN 1 Kartasura"    = "sman1kar"
    "SMAN 1 Bulu"         = "sman1bul"
    "SMAN 1 Maos"         = "sman1mao"
    "SMAN 1 Patikraja"    = "sman1pat"
    "SMAN 2 Purbalingga"  = "sman2pbg"
    "SMAN 1 Bobotsari"    = "sman1bob"
    "SMAN 1 Bojong"       = "sman1boj"
    "63. SMAN 1 Bukateja" = "sman1buk"
    "SMAN 1 Karangreja"   = "sman1krg"
    "SMAN 1 Kemangkon"    = "sman1kmg"
    "SMAN 1 Kutasari"     = "sman1kts"
    "SMAN 1 Rembang"      = "sman1rmb"
    "SMAN 1 Kebumen"      = "sman1kbm"
    "SMAN 1 Kutowinangun" = "sman1ktw"
    "SMAN 1 Mirit"        = "sman1mrt"
    "SMAN 1 Kajen"        = "sman1kjn"
    "SMAN 1 Sragi"        = "sman1srg"
    "SMAN 1 Batang"       = "sman1btg"
    "SMAN 2 Batang"       = "sman2btg"
    "SMAN 1 Subah"        = "sman1sbh"
    "SMAN 1 Bandar"       = "sman1bnd"
    "SMAN 1 Weleri"       = "sman1wlr"
    "SMAN 13 Semarang"    = "sman13smg"
    "TASIKMALAYA"         = "tasik"
}

$cleanNameMap = @{
    "13. SMAN 1 Muntilan" = "SMAN 1 Muntilan"
    "63. SMAN 1 Bukateja" = "SMAN 1 Bukateja"
}

$data = Import-Clixml "audit_final_all_schools.xml"
$cat3 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }

Write-Host "=========================================================="
Write-Host " MEMULAI BATCH SANITASI 28 SEKOLAH KATEGORI 3"
Write-Host "=========================================================="

$batchResults = @()

foreach ($s in $cat3) {
    $folder = Join-Path "H:\My Drive\Trainer\B+\AKUN" $s.Folder
    $prefix = if ($prefixMap[$s.Sekolah]) { $prefixMap[$s.Sekolah] } else { "siswa" }
    $cleanSchoolName = if ($cleanNameMap[$s.Sekolah]) { $cleanNameMap[$s.Sekolah] } else { $s.Sekolah }
    
    Write-Host "`n>>> Memproses: $($s.Sekolah) [Prefix: $prefix]..."
    
    if (-not (Test-Path $folder)) {
        Write-Host "  [SKIP] Folder tidak ditemukan: $folder"
        continue
    }
    
    # Get all raw excel files
    $excels = Get-ChildItem $folder -Filter "*.xlsx" | 
        Where-Object { $_.Name -notmatch '^\[CLEAN_IMPORT\]' } |
        Sort-Object Name
        
    if ($excels.Count -eq 0) {
        Write-Host "  [SKIP] Tidak ada file raw excel"
        continue
    }
    
    # Handle TASIKMALAYA special case if MASTER_IMPOR_RESMI exists
    if ($s.Sekolah -eq "TASIKMALAYA") {
        $masterFile = Join-Path $folder "MASTER_IMPOR_RESMI_TASIKMALAYA_KELAS12.xlsx"
        if (Test-Path $masterFile) {
            $destConsolidated = Join-Path $folder "[CLEAN_IMPORT] TASIKMALAYA.xlsx"
            Copy-Item $masterFile $destConsolidated -Force
            Write-Host "  [OK] TASIKMALAYA master copied to [CLEAN_IMPORT] TASIKMALAYA.xlsx"
            $batchResults += [PSCustomObject]@{
                Sekolah = $s.Sekolah
                TotalSiswa = 337
                TotalRombel = 10
                CleanFiles = "[CLEAN_IMPORT] TASIKMALAYA.xlsx"
            }
            continue
        }
    }
    
    $rawRecords = @()
    foreach ($e in $excels) {
        $res = Read-ExcelData $e.FullName
        if (-not $res -or $res.Rows.Count -le 1) { continue }
        
        $header = $res.Rows[0]
        
        # Determine column mappings
        $colNama = ""
        $colEmail = ""
        $colPass = ""
        $colRombel = ""
        
        # Check if Type A: Nama, Email, Password Awal, Rombel
        foreach ($k in $header.Keys) {
            $val = $header[$k].Trim().ToLower()
            if ($val -match '^nama$|^nama siswa$|^nama lengkap$') { $colNama = $k }
            elseif ($val -match '^email$|^email siswa$|^e-mail$') { $colEmail = $k }
            elseif ($val -match '^password awal$|^password$|^sandi$') { $colPass = $k }
            elseif ($val -match '^rombel$|^kelas$') { $colRombel = $k }
            
            # Type B mappings
            elseif ($val -eq 'firstname') { $colNama = $k }
            elseif ($val -eq 'lastname') { $colRombel = $k }
        }
        
        # Fallbacks for standard positions
        if (-not $colNama) { $colNama = "A" }
        if (-not $colEmail) { $colEmail = "B" }
        if (-not $colPass) { $colPass = "C" }
        if (-not $colRombel) { $colRombel = "D" }
        
        for ($i = 1; $i -lt $res.Rows.Count; $i++) {
            $row = $res.Rows[$i]
            $rNama = if ($row[$colNama]) { $row[$colNama].Trim() } else { "" }
            if (-not $rNama) { continue }
            
            $rEmail = if ($row[$colEmail]) { $row[$colEmail].Trim() } else { "" }
            $rPass = if ($row[$colPass]) { $row[$colPass].Trim() } else { "" }
            $rRombel = if ($row[$colRombel]) { $row[$colRombel].Trim() } else { "" }
            
            $rawRecords += [PSCustomObject]@{
                Nama = $rNama
                Email = $rEmail
                Pass = $rPass
                Rombel = $rRombel
            }
        }
    }
    
    if ($rawRecords.Count -eq 0) {
        Write-Host "  [SKIP] 0 baris siswa terbaca"
        continue
    }
    
    # Count email occurrences
    $emailCounts = @{}
    foreach ($r in $rawRecords) {
        $em = $r.Email.ToLower().Replace(' ', '')
        if ($em) {
            $emailCounts[$em] = $emailCounts[$em] + 1
        }
    }
    
    $cleanStudents = @()
    $seenEmails = New-Object 'System.Collections.Generic.HashSet[string]'
    $stIdx = 1
    
    foreach ($r in $rawRecords) {
        $nama = $r.Nama.ToUpper()
        
        # Email sanitization
        $em = $r.Email.ToLower().Replace(' ', '')
        $needsDummy = $false
        
        if (-not $em -or $em -eq '-' -or $em.Contains('pesonaedu.com') -or $em.Contains('pesonaedu.id')) {
            $needsDummy = $true
        } elseif ($em -notmatch '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$') {
            $needsDummy = $true
        } elseif ($emailCounts[$em] -gt 2) {
            # Duplikasi massal
            $needsDummy = $true
        }
        
        if ($needsDummy) {
            $em = "$($prefix)_siswa$($stIdx)@belajarplus.com"
        }
        
        # Ensure school-wide uniqueness
        if ($seenEmails.Contains($em)) {
            $em = "$($prefix)_siswa$($stIdx)@belajarplus.com"
            if ($seenEmails.Contains($em)) {
                $em = "$($prefix)_siswa$($stIdx)_$($stIdx)@belajarplus.com"
            }
        }
        [void]$seenEmails.Add($em)
        
        # Password sanitization
        $pass = $r.Pass
        if (-not $pass -or $pass.Length -lt 6) {
            $pass = "BelajarPlus#2026"
        }
        
        # Rombel sanitization
        $rombel = Clean-RombelString $r.Rombel
        
        $cleanStudents += [PSCustomObject]@{
            Nama = $nama
            Email = $em
            Password = $pass
            Rombel = $rombel
        }
        $stIdx++
    }
    
    # 1. Write Consolidated Master File
    $masterFileName = "[CLEAN_IMPORT] $cleanSchoolName.xlsx"
    $masterFilePath = Join-Path $folder $masterFileName
    New-CleanImportExcel $masterFilePath $cleanStudents
    
    $createdFiles = @($masterFileName)
    
    # 2. If > 500 students, also generate part files (max 500 each)
    if ($cleanStudents.Count -gt 500) {
        $partNum = 1
        $startIdx = 0
        while ($startIdx -lt $cleanStudents.Count) {
            $chunkSize = [Math]::Min(500, $cleanStudents.Count - $startIdx)
            $chunk = $cleanStudents[$startIdx..($startIdx + $chunkSize - 1)]
            
            $partFileName = "[CLEAN_IMPORT] ${cleanSchoolName}_Part${partNum}.xlsx"
            $partFilePath = Join-Path $folder $partFileName
            New-CleanImportExcel $partFilePath $chunk
            $createdFiles += $partFileName
            
            $startIdx += $chunkSize
            $partNum++
        }
    }
    
    $uniqueRombels = ($cleanStudents | Select-Object -ExpandProperty Rombel -Unique).Count
    Write-Host "  [SELESAI] $($cleanStudents.Count) Siswa, $uniqueRombels Rombel => $($createdFiles -join ', ')"
    
    $batchResults += [PSCustomObject]@{
        Sekolah = $s.Sekolah
        Folder = $s.Folder
        Klaster = $s.Klaster
        PIC = $s.PIC
        TotalSiswa = $cleanStudents.Count
        TotalRombel = $uniqueRombels
        CleanFiles = $createdFiles -join "; "
    }
}

$batchResults | Export-Clixml "batch_sanitize_results.xml"

Write-Host "`n=========================================================="
Write-Host " REKAPITULASI BATCH SANITASI 28 SEKOLAH KATEGORI 3"
Write-Host "=========================================================="
$batchResults | Format-Table -AutoSize Sekolah, Klaster, PIC, TotalSiswa, TotalRombel, CleanFiles
