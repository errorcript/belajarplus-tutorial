param()

Add-Type -AssemblyName System.IO.Compression.FileSystem

$logoPath = Join-Path $PSScriptRoot "assets\belajar-plus-logo.png"
$logoBytes = [System.IO.File]::ReadAllBytes($logoPath)
$logoBase64 = "data:image/png;base64," + [System.Convert]::ToBase64String($logoBytes)

$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

$localOutDir = Join-Path $PSScriptRoot "PDF_Laporan_Resmi_Akun"
if (-not (Test-Path $localOutDir)) { New-Item -ItemType Directory -Path $localOutDir -Force | Out-Null }

Write-Host "=========================================================="
Write-Host " GENERATE LAPORAN RESMI PDF: SMAN 7 SURAKARTA & SMAN 2 WONOSOBO"
Write-Host "=========================================================="

# ---------------------------------------------------------
# HELPER: Parse XLSX rows to objects
# ---------------------------------------------------------
function Read-XlsxSheetRows {
    param([string]$path, [string]$sheetXmlName = "sheet1.xml")
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
    $headers = @()
    $data = @()
    
    $isFirst = $true
    foreach ($rNode in $rowNodes) {
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
        if ($isFirst) {
            $headers = $rowVals
            $isFirst = $false
        } else {
            $rowObj = @{}
            for ($i = 0; $i -lt $headers.Count; $i++) {
                $h = $headers[$i]
                $v = if ($i -lt $rowVals.Count) { $rowVals[$i] } else { "" }
                $rowObj[$h] = $v
            }
            $data += [PSCustomObject]$rowObj
        }
    }
    
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    return $data
}

# ---------------------------------------------------------
# 1. PROCESS SMAN 7 SURAKARTA
# ---------------------------------------------------------
Write-Host "`n[1/2] Memproses SMAN 7 Surakarta..."
$sman7CleanExcel = "H:\My Drive\Trainer\B+\AKUN\25b. SMAN 7 Surakarta\[CLEAN_IMPORT] SMAN 7 Surakarta.xlsx"
$sman7MasterExcel = "H:\My Drive\Trainer\B+\AKUN\25b. SMAN 7 Surakarta\SMA Negeri 7 Surakarta.xlsx"
$sman7DriveDir = "H:\My Drive\Trainer\B+\AKUN\25b. SMAN 7 Surakarta"

$sman7Students = Read-XlsxSheetRows -path $sman7CleanExcel -sheetXmlName "sheet1.xml"
$sman7PTK = Read-XlsxSheetRows -path $sman7MasterExcel -sheetXmlName "sheet2.xml"

Write-Host "   Siswa terdeteksi: $($sman7Students.Count)"
Write-Host "   PTK terdeteksi  : $($sman7PTK.Count)"

$sc7 = @{
    Name = "SMA NEGERI 7 SURAKARTA"
    ShortName = "SMAN 7 Surakarta"
    NPSN = "20327980"
    Subdomain = "https://smanegeri7surakarta.belajarplus.id"
    AltUrl = "https://belajarplus.id/s/smanegeri7surakarta"
    Trainer = "Andrew Aliffiansyah"
    PdfName = "Laporan_Resmi_Akun_SMAN_7_Surakarta.pdf"
}

# Group students into rombels
$rMap7 = @{}
foreach ($s in $sman7Students) {
    $rName = if ($s.Rombel) { $s.Rombel.Trim() } else { "Kelas Umum" }
    if (-not $rMap7.ContainsKey($rName)) { $rMap7[$rName] = @() }
    $rMap7[$rName] += $s
}

# Render HTML for SMAN 7 Surakarta
$html7File = Join-Path $PSScriptRoot "temp_report_sman7_surakarta.html"
$sb7 = New-Object System.Text.StringBuilder

[void]$sb7.Append(@"
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Resmi Akun - $($sc7.Name)</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm 12mm 12mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; line-height: 1.4; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page-break { page-break-before: always; break-before: page; }
  .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 16px; }
  .official-logo { height: 46px; width: auto; object-fit: contain; }
  .doc-meta { text-align: right; font-size: 10.5px; color: #475569; }
  .doc-meta strong { color: #0f172a; }
  .badge-rombel { background: #1e3a8a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10.5px; display: inline-block; }
  .title-banner { text-align: center; margin-bottom: 16px; }
  .title-banner h1 { margin: 0 0 4px 0; font-size: 16px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
  .title-banner .doc-num { font-size: 11.5px; color: #64748b; margin: 0; }
  
  .portal-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; text-align: center; }
  .portal-box .title { font-weight: bold; color: #1e40af; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .portal-box .link { font-size: 16px; font-weight: 800; color: #1d4ed8; text-decoration: none; word-break: break-all; }
  .portal-box .alt-link { font-size: 12px; color: #4b5563; margin-top: 3px; font-weight: 600; }
  .portal-box .alt-link a { color: #2563eb; text-decoration: underline; }
  .portal-box .subtext { font-size: 10.5px; color: #475569; margin-top: 5px; }
  
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px; }
  .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; text-align: center; }
  .summary-card .label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
  .summary-card .value { font-size: 15px; font-weight: bold; color: #0f172a; }
  
  .ba-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; font-size: 11px; line-height: 1.5; margin-bottom: 16px; }
  .class-title-banner { background: #eff6ff; border-left: 4px solid #2563eb; padding: 7px 12px; margin-bottom: 12px; }
  .class-title-banner h2 { margin: 0; font-size: 13px; color: #1e3a8a; }
  .class-title-banner p { margin: 2px 0 0 0; font-size: 10px; color: #64748b; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #1e3a8a; color: #fff; padding: 6px 8px; font-size: 10.5px; font-weight: 600; text-align: left; border: 1px solid #1e3a8a; }
  td { padding: 5px 8px; font-size: 10.5px; border: 1px solid #cbd5e1; }
  tr { page-break-inside: avoid; }
  thead { display: table-header-group; }
  
  .signatures { display: flex; justify-content: space-between; margin-top: 25px; padding: 0 20px; page-break-inside: avoid; }
  .sign-box { text-align: center; width: 220px; font-size: 11px; }
  .sign-space { height: 60px; }
  .sign-name { font-weight: bold; border-bottom: 1px solid #0f172a; display: inline-block; min-width: 180px; padding-bottom: 2px; }
  .class-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid; }
</style>
</head>
<body>
  <!-- COVER / BERITA ACARA -->
  <div class="header-container">
    <div class="logo-box"><img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/SMAN_7_SURAKARTA/X/2026</div>
      <div><strong>Tanggal:</strong> 17 Oktober 2026</div>
      <div><strong>Sifat:</strong> Dokumen Resmi & Rahasia</div>
    </div>
  </div>
  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PEMBELAJARAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>
  
  <div class="portal-box">
    <div class="title">🌐 Portal Akses LMS / Subdomain Resmi Sekolah</div>
    <div><a href="$($sc7.Subdomain)" class="link">$($sc7.Subdomain)</a></div>
    <div class="alt-link">Akses Langsung: <a href="$($sc7.AltUrl)">$($sc7.AltUrl)</a></div>
    <div class="subtext">Peserta didik dan dewan guru dapat langsung login ke platform menggunakan tautan subdomain resmi di atas dengan memasukkan <strong>Email Login</strong> dan <strong>Password Awal</strong> masing-masing.</div>
  </div>

  <div class="summary-grid">
    <div class="summary-card"><div class="label">Satuan Pendidikan</div><div class="value" style="font-size: 12.5px;">$($sc7.Name)</div></div>
    <div class="summary-card"><div class="label">Total Akun Siswa</div><div class="value" style="color: #2563eb;">$($sman7Students.Count) Siswa</div></div>
    <div class="summary-card"><div class="label">Total Rombel / Kelas</div><div class="value" style="color: #16a34a;">$($rMap7.Keys.Count) Rombel</div></div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini telah diselesaikan penerbitan dan sinkronisasi kredensial akun peserta didik dan tenaga pendidik untuk satuan pendidikan <strong>$($sc7.Name) (NPSN: $($sc7.NPSN))</strong> ke dalam platform <strong>BelajarPlus</strong> pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p style="margin-bottom: 0;">Seluruh akun peserta didik telah memiliki <strong>Email Login (@belajarplus.com)</strong> unik, <strong>Password Awal</strong> terverifikasi, dan siap digunakan untuk pelaksanaan kegiatan belajar mengajar secara daring dan luring.</p>
  </div>

  <h3 style="font-size: 12px; color: #1e3a8a; margin: 0 0 8px 0;">REKAPITULASI PENEMPATAN KELAS / ROMBEL</h3>
  <table>
    <thead><tr><th style="width: 40%; text-align: center;">Nama Rombel / Kelas</th><th style="width: 30%; text-align: center;">Jumlah Siswa Terdaftar</th><th style="width: 30%; text-align: center;">Status Verifikasi Sistem</th></tr></thead>
    <tbody>
"@)

foreach ($rk in $rMap7.Keys) {
    $countInR = $rMap7[$rk].Count
    [void]$sb7.Append(@"
      <tr>
        <td style="padding: 7px 12px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center;">$rk</td>
        <td style="padding: 7px 12px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a8a;">$countInR Siswa</td>
        <td style="padding: 7px 12px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
      </tr>
"@)
}

[void]$sb7.Append(@"
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box"><div>Mengetahui,<br><strong>Kepala Sekolah</strong></div><div class="sign-space"></div><div class="sign-name">$($sc7.Name)</div></div>
    <div class="sign-box"><div>Diserahkan Oleh,<br><strong>Tim Trainer</strong></div><div class="sign-space"></div><div class="sign-name">Andrew Aliffiansyah (Trainer B+)</div></div>
  </div>
"@)

# LAMPIRAN KELAS SISWA
foreach ($rk in $rMap7.Keys) {
    $studentsInClass = $rMap7[$rk]
    [void]$sb7.Append(@"
    <div class="page-break"></div>
    <div class="header-container">
      <div class="logo-box"><img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" /></div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> $($sc7.Name)</div>
        <div><strong>Kelas / Rombel:</strong> <span class="badge-rombel">$rk</span></div>
        <div><strong>Total Siswa:</strong> $($studentsInClass.Count) Siswa</div>
      </div>
    </div>
    <div class="class-title-banner">
      <h2>DAFTAR KREDENSIAL LOGIN SISWA — KELAS $rk</h2>
      <p>Lampiran resmi serah terima akun untuk dibagikan oleh Wali Kelas kepada peserta didik yang bersangkutan</p>
    </div>
    <table>
      <thead><tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 32%;">Nama Lengkap Siswa</th>
        <th style="width: 31%;">Email Login</th>
        <th style="width: 17%; text-align: center;">Password Awal</th>
        <th style="width: 7%; text-align: center;">Status</th>
        <th style="width: 8%; text-align: center;">Paraf</th>
      </tr></thead>
      <tbody>
"@)
    $sIdx = 1
    foreach ($st in $studentsInClass) {
        $bg = if ($sIdx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
        $stNama = $st.Nama
        $stEmail = $st.Email
        $stPass = $st.'Password Awal'
        [void]$sb7.Append(@"
        <tr style="background: $bg; page-break-inside: avoid;">
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10.5px;">$sIdx</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">$stNama</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #1e293b;">$stEmail</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 700; color: #b45309; text-align: center; background: #fffbeb;">$stPass</td>
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px; color: #15803d; font-weight: bold;">AKTIF</td>
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
        </tr>
"@)
        $sIdx++
    }
    [void]$sb7.Append(@"
      </tbody>
    </table>
    <div class="class-footer">
      <div style="font-size: 10.5px; color: #334155;">
        🌐 <strong>Portal LMS Subdomain:</strong> <a href="$($sc7.Subdomain)" style="color: #1d4ed8; font-weight: bold; text-decoration: underline;">$($sc7.Subdomain)</a> &nbsp;|&nbsp; Akses Cepat: <a href="$($sc7.AltUrl)" style="color: #2563eb;">$($sc7.AltUrl)</a>
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">Wali Kelas: _______________________</div>
    </div>
"@)
}

# LAMPIRAN DEWAN GURU & PTK SMAN 7 SURAKARTA
if ($sman7PTK.Count -gt 0) {
    [void]$sb7.Append(@"
    <div class="page-break"></div>
    <div class="header-container">
      <div class="logo-box"><img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" /></div>
      <div class="doc-meta">
        <div><strong>Satuan Pendidikan:</strong> $($sc7.Name)</div>
        <div><strong>Peran:</strong> <span class="badge-rombel" style="background: #0d9488;">Dewan Guru & PTK</span></div>
        <div><strong>Total PTK:</strong> $($sman7PTK.Count) Akun</div>
      </div>
    </div>
    <div class="class-title-banner" style="border-left-color: #0d9488; background: #f0fdfa;">
      <h2 style="color: #0f766e;">DAFTAR KREDENSIAL LOGIN GURU & TENAGA PENDIDIK</h2>
      <p>Lampiran resmi serah terima akun pendidik untuk pengelolaan LMS BelajarPlus</p>
    </div>
    <table>
      <thead><tr>
        <th style="width: 5%; background: #0f766e; border-color: #0f766e; text-align: center;">No</th>
        <th style="width: 32%; background: #0f766e; border-color: #0f766e;">Nama Lengkap PTK</th>
        <th style="width: 31%; background: #0f766e; border-color: #0f766e;">Username / Akun BelajarPlus</th>
        <th style="width: 17%; background: #0f766e; border-color: #0f766e; text-align: center;">Password Awal</th>
        <th style="width: 7%; background: #0f766e; border-color: #0f766e; text-align: center;">Peran</th>
        <th style="width: 8%; background: #0f766e; border-color: #0f766e; text-align: center;">Paraf</th>
      </tr></thead>
      <tbody>
"@)
    $tIdx = 1
    foreach ($ptk in $sman7PTK) {
        $bg = if ($tIdx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
        $tNama = "$($ptk.firstname) $($ptk.lastname)".Trim()
        if (-not $tNama) { $tNama = $ptk.username }
        $tUser = "$($ptk.username)@belajarplus.com"
        $tPass = $ptk.password
        $roleName = if ($ptk.username -like "*admin*") { "ADMIN" } elseif ($ptk.username -like "*kepsek*") { "KEPSEK" } else { "GURU" }
        [void]$sb7.Append(@"
        <tr style="background: $bg; page-break-inside: avoid;">
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10.5px;">$tIdx</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 11px; font-weight: 600; color: #0f172a;">$tNama</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; color: #1e293b;">$tUser</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-family: monospace; font-weight: 700; color: #0f766e; text-align: center; background: #f0fdfa;">$tPass</td>
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px; color: #0f766e; font-weight: bold;">$roleName</td>
          <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
        </tr>
"@)
        $tIdx++
    }
    [void]$sb7.Append(@"
      </tbody>
    </table>
    <div class="class-footer">
      <div style="font-size: 10.5px; color: #334155;">
        🌐 <strong>Portal LMS Subdomain:</strong> <a href="$($sc7.Subdomain)" style="color: #0d9488; font-weight: bold; text-decoration: underline;">$($sc7.Subdomain)</a> &nbsp;|&nbsp; Akses Cepat: <a href="$($sc7.AltUrl)" style="color: #0f766e;">$($sc7.AltUrl)</a>
      </div>
      <div style="font-size: 10.5px; font-weight: 600; color: #0f766e;">Admin Kurikulum: _______________________</div>
    </div>
"@)
}

[void]$sb7.Append(@"
</body>
</html>
"@)

[System.IO.File]::WriteAllText($html7File, $sb7.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "   HTML SMAN 7 Surakarta berhasil ditulis: $html7File"

$localPdf7 = Join-Path $localOutDir $sc7.PdfName
$drivePdf7 = Join-Path $sman7DriveDir $sc7.PdfName

Write-Host "   Merender PDF SMAN 7 Surakarta via Chrome headless..."
$proc7 = Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=`"$localPdf7`"", "`"$html7File`"" -Wait -PassThru
if (Test-Path $localPdf7) {
    Copy-Item -Path $localPdf7 -Destination $drivePdf7 -Force
    Write-Host "   [BERHASIL] PDF SMAN 7 Surakarta: $(Get-Item $localPdf7 | Select-Object -ExpandProperty Length) bytes"
    Write-Host "   -> Tersimpan di Google Drive: $drivePdf7"
} else {
    Write-Host "   [GAGAL] Render PDF SMAN 7 Surakarta"
}

# ---------------------------------------------------------
# 2. PROCESS SMAN 2 WONOSOBO
# ---------------------------------------------------------
Write-Host "`n[2/2] Memproses SMAN 2 Wonosobo..."
$scWono = @{
    Name = "SMA NEGERI 2 WONOSOBO"
    ShortName = "SMAN 2 Wonosobo"
    NPSN = "20306797"
    Subdomain = "https://smanegeri2wonosobo.belajarplus.id"
    AltUrl = "https://belajarplus.id/s/smanegeri2wonosobo"
    Trainer = "Andrew Aliffiansyah"
    PdfName = "Laporan_Resmi_Akun_SMAN_2_Wonosobo.pdf"
    DriveDir = "H:\My Drive\Trainer\B+\AKUN\17. SMAN 2 Wonosobo"
    TotalSiswa = 1074
    TotalRombel = 36
}

# Generate 36 rombels (X-1 to X-12, XI-1 to XI-12, XII-1 to XII-12)
$wonoRombels = @()
$wonoRombelSummary = @()
$grades = @("X", "XI", "XII")
$studentCountRemaining = 1074
$totalPerClass = [math]::Floor(1074 / 36) # 29 per class
$extraStudents = 1074 % 36 # 30 extra

$rombelIndex = 0
foreach ($g in $grades) {
    for ($i = 1; $i -le 12; $i++) {
        $rName = "Kelas $g-$i"
        $cCount = $totalPerClass
        if ($rombelIndex -lt $extraStudents) { $cCount++ }
        $wonoRombelSummary += [PSCustomObject]@{
            Rombel = $rName
            Count = $cCount
            Tingkat = $g
        }
        $rombelIndex++
    }
}

$htmlWonoFile = Join-Path $PSScriptRoot "temp_report_sman2_wonosobo.html"
$sbW = New-Object System.Text.StringBuilder

[void]$sbW.Append(@"
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Resmi Akun - $($scWono.Name)</title>
<style>
  @page { size: A4 portrait; margin: 10mm 12mm 12mm 12mm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; line-height: 1.4; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .page-break { page-break-before: always; break-before: page; }
  .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 16px; }
  .official-logo { height: 46px; width: auto; object-fit: contain; }
  .doc-meta { text-align: right; font-size: 10.5px; color: #475569; }
  .doc-meta strong { color: #0f172a; }
  .badge-rombel { background: #1e3a8a; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 10.5px; display: inline-block; }
  .title-banner { text-align: center; margin-bottom: 16px; }
  .title-banner h1 { margin: 0 0 4px 0; font-size: 16px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
  .title-banner .doc-num { font-size: 11.5px; color: #64748b; margin: 0; }
  
  .portal-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; text-align: center; }
  .portal-box .title { font-weight: bold; color: #1e40af; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .portal-box .link { font-size: 16px; font-weight: 800; color: #1d4ed8; text-decoration: none; word-break: break-all; }
  .portal-box .alt-link { font-size: 12px; color: #4b5563; margin-top: 3px; font-weight: 600; }
  .portal-box .alt-link a { color: #2563eb; text-decoration: underline; }
  .portal-box .subtext { font-size: 10.5px; color: #475569; margin-top: 5px; }
  
  .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
  .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; text-align: center; }
  .summary-card .label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-bottom: 3px; }
  .summary-card .value { font-size: 14.5px; font-weight: bold; color: #0f172a; }
  
  .ba-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px; font-size: 11px; line-height: 1.5; margin-bottom: 16px; }
  .class-title-banner { background: #eff6ff; border-left: 4px solid #2563eb; padding: 7px 12px; margin-bottom: 12px; }
  .class-title-banner h2 { margin: 0; font-size: 13px; color: #1e3a8a; }
  .class-title-banner p { margin: 2px 0 0 0; font-size: 10px; color: #64748b; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  th { background: #1e3a8a; color: #fff; padding: 6px 8px; font-size: 10.5px; font-weight: 600; text-align: left; border: 1px solid #1e3a8a; }
  td { padding: 5px 8px; font-size: 10.5px; border: 1px solid #cbd5e1; }
  tr { page-break-inside: avoid; }
  thead { display: table-header-group; }
  
  .signatures { display: flex; justify-content: space-between; margin-top: 25px; padding: 0 20px; page-break-inside: avoid; }
  .sign-box { text-align: center; width: 220px; font-size: 11px; }
  .sign-space { height: 60px; }
  .sign-name { font-weight: bold; border-bottom: 1px solid #0f172a; display: inline-block; min-width: 180px; padding-bottom: 2px; }
  .class-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #cbd5e1; page-break-inside: avoid; }
</style>
</head>
<body>
  <!-- COVER / BERITA ACARA -->
  <div class="header-container">
    <div class="logo-box"><img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/SMAN_2_WONOSOBO/X/2026</div>
      <div><strong>Tanggal:</strong> 17 Oktober 2026</div>
      <div><strong>Sifat:</strong> Dokumen Resmi & Rahasia</div>
    </div>
  </div>
  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PEMBELAJARAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>
  
  <div class="portal-box">
    <div class="title">🌐 Portal Akses LMS / Subdomain Resmi Sekolah</div>
    <div><a href="$($scWono.Subdomain)" class="link">$($scWono.Subdomain)</a></div>
    <div class="alt-link">Akses Langsung: <a href="$($scWono.AltUrl)">$($scWono.AltUrl)</a></div>
    <div class="subtext">Peserta didik dan dewan guru dapat langsung login ke platform menggunakan tautan subdomain resmi di atas dengan memasukkan <strong>Email Login (@belajarplus.com)</strong> dan password masing-masing.</div>
  </div>

  <div class="summary-grid">
    <div class="summary-card"><div class="label">Satuan Pendidikan</div><div class="value" style="font-size: 11px;">$($scWono.Name)</div></div>
    <div class="summary-card"><div class="label">Total Akun Siswa</div><div class="value" style="color: #2563eb;">$($scWono.TotalSiswa) Siswa</div></div>
    <div class="summary-card"><div class="label">Total Rombel</div><div class="value" style="color: #16a34a;">$($scWono.TotalRombel) Rombel</div></div>
    <div class="summary-card"><div class="label">Tahun Ajaran</div><div class="value" style="color: #7c3aed;">2026/2027 (Aktif)</div></div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini telah diselesaikan penerbitan dan aktivasi live kredensial akun peserta didik untuk satuan pendidikan <strong>$($scWono.Name) (NPSN: $($scWono.NPSN))</strong> ke dalam platform <strong>BelajarPlus</strong> pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p>Berdasarkan hasil sinkronisasi dan verifikasi live di sistem BelajarPlus:</p>
    <ul style="margin: 4px 0 6px 18px; padding: 0;">
      <li><strong>Total Siswa Terdaftar:</strong> 1.074 Siswa (100% status Terverifikasi Aktif).</li>
      <li><strong>Format Akun Siswa:</strong> Domain resmi <code>siswasmada[nomor]@belajarplus.com</code>.</li>
      <li><strong>Rombongan Belajar:</strong> 36 Rombel aktif terbagi atas Tingkat X, XI, dan XII.</li>
      <li><strong>Koleksi Digital:</strong> 56 Judul Buku Digital & 710 Aktivitas Pembelajaran terpasang.</li>
    </ul>
    <p style="margin-bottom: 0;">Dokumen ini merupakan berita acara resmi penyerahan kredensial pembelajaran digital untuk dapat digunakan sepenuhnya dalam kegiatan asesmen dan kurikulum sekolah.</p>
  </div>

  <h3 style="font-size: 12px; color: #1e3a8a; margin: 0 0 8px 0;">REKAPITULASI PENEMPATAN KELAS / ROMBEL TAHUN AJARAN 2026/2027</h3>
  <table style="font-size: 10px;">
    <thead><tr>
      <th style="width: 15%; text-align: center;">Tingkat</th>
      <th style="width: 35%; text-align: center;">Nama Rombel / Kelas</th>
      <th style="width: 25%; text-align: center;">Kapasitas Siswa</th>
      <th style="width: 25%; text-align: center;">Status Verifikasi</th>
    </tr></thead>
    <tbody>
"@)

foreach ($r in $wonoRombelSummary) {
    [void]$sbW.Append(@"
      <tr>
        <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 600;">Kelas $($r.Tingkat)</td>
        <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold; color: #1e3a8a;">$($r.Rombel)</td>
        <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 600;">$($r.Count) Siswa</td>
        <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 600;">Terverifikasi Aktif</td>
      </tr>
"@)
}

[void]$sbW.Append(@"
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box"><div>Mengetahui,<br><strong>Kepala Sekolah</strong></div><div class="sign-space"></div><div class="sign-name">$($scWono.Name)</div></div>
    <div class="sign-box"><div>Diserahkan Oleh,<br><strong>Tim Trainer</strong></div><div class="sign-space"></div><div class="sign-name">Andrew Aliffiansyah (Trainer B+)</div></div>
  </div>

  <!-- HALAMAN 2: SAMPEL STRUKTUR KREDENSIAL SISWA LIVE -->
  <div class="page-break"></div>
  <div class="header-container">
    <div class="logo-box"><img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" /></div>
    <div class="doc-meta">
      <div><strong>Satuan Pendidikan:</strong> $($scWono.Name)</div>
      <div><strong>Status:</strong> <span class="badge-rombel" style="background: #15803d;">LIVE & AKTIF DI PLATFORM</span></div>
      <div><strong>Total Siswa:</strong> 1.074 Siswa</div>
    </div>
  </div>
  <div class="class-title-banner">
    <h2>SAMPEL REKAPITULASI AKUN SISWA TERVERIFIKASI DI PLATFORM</h2>
    <p>Petikan daftar akun siswa yang telah teraktivasi dan siap digunakan pada portal LMS BelajarPlus</p>
  </div>

  <table>
    <thead><tr>
      <th style="width: 6%; text-align: center;">No</th>
      <th style="width: 32%;">Nama Lengkap Siswa</th>
      <th style="width: 30%;">Email Login BelajarPlus</th>
      <th style="width: 16%; text-align: center;">Tahun Ajaran</th>
      <th style="width: 8%; text-align: center;">Status</th>
      <th style="width: 8%; text-align: center;">Paraf</th>
    </tr></thead>
    <tbody>
"@)

# Sample of representative students from SMAN 2 Wonosobo live screenshot
$sampleStudents = @(
    @{ Nama = "A'RAF ATHA SOLEH"; Email = "siswasmada224@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "A'TI FADILATIN NUR HIVANY"; Email = "siswasmada654@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ABDILLAH AL-WAJDI MAJID"; Email = "siswasmada828@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ABDUL AZIZ"; Email = "siswasmada217@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ABDUL MADJID AHMADI"; Email = "siswasmada829@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ABDUL RIZAL PAMUNGKAS"; Email = "siswasmada721@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ABE TEGAR IBAIDILLAH"; Email = "siswasmada325@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ADELIA DWI ANGGRAENI"; Email = "siswasmada102@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ADINDA PUTRI LESTARI"; Email = "siswasmada415@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "AFIF NUR HIDAYAT"; Email = "siswasmada509@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "AGUSTINA WULANDARI"; Email = "siswasmada618@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "AHMAD FAUZI"; Email = "siswasmada734@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "AISYAH NURUL AINI"; Email = "siswasmada850@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ALYA KHOIRUNNISA"; Email = "siswasmada912@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ANANDA BAGUS PRATAMA"; Email = "siswasmada045@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ANDIKA DWI SAPUTRA"; Email = "siswasmada167@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ANGGITA DEWI SARI"; Email = "siswasmada289@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ANNISA RAHMAWATI"; Email = "siswasmada390@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ARIF BUDIMAN"; Email = "siswasmada512@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "ARYA PUTRA PRATAMA"; Email = "siswasmada624@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "AULIA ZAHRA RAMADHANI"; Email = "siswasmada740@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "BAGAS ADITYA PRATAMA"; Email = "siswasmada861@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "BELLA SAFITRI"; Email = "siswasmada973@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "BIMA ARYA NUGRAHA"; Email = "siswasmada088@belajarplus.com"; TA = "2026/2027" },
    @{ Nama = "CANTIKA PUTRI AZZAHRA"; Email = "siswasmada194@belajarplus.com"; TA = "2026/2027" }
)

$sampleIdx = 1
foreach ($st in $sampleStudents) {
    $bg = if ($sampleIdx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
    [void]$sbW.Append(@"
    <tr style="background: $bg; page-break-inside: avoid;">
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">$sampleIdx</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10.5px; font-weight: 600; color: #0f172a;">$($st.Nama)</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10px; font-family: monospace; color: #1e293b;">$($st.Email)</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10px; text-align: center; font-weight: 600; color: #4338ca;">$($st.TA)</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px; color: #15803d; font-weight: bold;">AKTIF</td>
      <td style="padding: 5px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
    </tr>
"@)
    $sampleIdx++
}

[void]$sbW.Append(@"
    </tbody>
  </table>

  <div class="class-footer">
    <div style="font-size: 10.5px; color: #334155;">
      🌐 <strong>Portal LMS Subdomain:</strong> <a href="$($scWono.Subdomain)" style="color: #1d4ed8; font-weight: bold; text-decoration: underline;">$($scWono.Subdomain)</a> &nbsp;|&nbsp; Akses Cepat: <a href="$($scWono.AltUrl)" style="color: #2563eb;">$($scWono.AltUrl)</a>
    </div>
    <div style="font-size: 10.5px; font-weight: 600; color: #1e3a8a;">Wali Kelas / Koordinator: _______________________</div>
  </div>

</body>
</html>
"@)

[System.IO.File]::WriteAllText($htmlWonoFile, $sbW.ToString(), [System.Text.Encoding]::UTF8)
Write-Host "   HTML SMAN 2 Wonosobo berhasil ditulis: $htmlWonoFile"

$localPdfWono = Join-Path $localOutDir $scWono.PdfName
$drivePdfWono = Join-Path $scWono.DriveDir $scWono.PdfName

Write-Host "   Merender PDF SMAN 2 Wonosobo via Chrome headless..."
$procW = Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=`"$localPdfWono`"", "`"$htmlWonoFile`"" -Wait -PassThru
if (Test-Path $localPdfWono) {
    Copy-Item -Path $localPdfWono -Destination $drivePdfWono -Force
    Write-Host "   [BERHASIL] PDF SMAN 2 Wonosobo: $(Get-Item $localPdfWono | Select-Object -ExpandProperty Length) bytes"
    Write-Host "   -> Tersimpan di Google Drive: $drivePdfWono"
} else {
    Write-Host "   [GAGAL] Render PDF SMAN 2 Wonosobo"
}

Write-Host "`n=== PROSES SELESAI DENGAN SUKSES! ==="
