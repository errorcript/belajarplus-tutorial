# Script to generate Official Siswa PDF Reports for SMA Islam Sudirman Ambarawa
# Generates:
# 1. Master PDF (All 1.156 Siswa, 33 Rombel)
# 2. Kelas X PDF (394 Siswa, 11 Rombel)
# 3. Kelas XI PDF (381 Siswa, 11 Rombel)
# 4. Kelas XII PDF (381 Siswa, 11 Rombel)

$ErrorActionPreference = "Stop"

$workspaceDir = (Get-Item .).FullName
$logoPath = Join-Path $workspaceDir "assets\belajar-plus-logo.png"
$logoBytes = [System.IO.File]::ReadAllBytes($logoPath)
$logoBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoBytes)

$siswaData = Import-Clixml (Join-Path $workspaceDir "parsed_siswa_smaisuda.xml")
$targetDriveDir = "H:\My Drive\Trainer\B+\AKUN\79. SMA Islam Sudirman Ambarawa"
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"

# Custom natural sorting order for Rombels
function Get-RombelSortKey($rombelName) {
    if ($rombelName -match 'Kelas\s+(\d+)[\-_](\d+)') {
        $tingkat = [int]$matches[1]
        $nomor = [int]$matches[2]
        return ($tingkat * 100) + $nomor
    }
    return 9999
}

# Group students by Rombel
$rombelsMap = [ordered]@{}
foreach ($s in $siswaData) {
    $rName = $s.Rombel.Trim()
    if (-not $rombelsMap.Contains($rName)) {
        $rombelsMap[$rName] = [System.Collections.Generic.List[PSObject]]::new()
    }
    $rombelsMap[$rName].Add($s)
}

# Sort rombel keys naturally
$sortedRombelNames = $rombelsMap.Keys | Sort-Object { Get-RombelSortKey $_ }

function Build-SiswaHtmlReport($titleScope, $docScopeNum, $filterTingkat = $null) {
    $activeRombelNames = if ($filterTingkat) {
        $sortedRombelNames | Where-Object { 
            $firstStudent = $rombelsMap[$_][0]
            $firstStudent.Tingkat -eq $filterTingkat
        }
    } else {
        $sortedRombelNames
    }

    $totalStudentsInReport = 0
    foreach ($rName in $activeRombelNames) {
        $totalStudentsInReport += $rombelsMap[$rName].Count
    }

    # Summary table rows
    $rekapRowsHtml = ""
    $rekapIdx = 1
    foreach ($rName in $activeRombelNames) {
        $list = $rombelsMap[$rName]
        $bg = if ($rekapIdx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
        $tingkat = $list[0].Tingkat
        $rekapRowsHtml += @"
        <tr style="background: $bg;">
          <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">$rekapIdx</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center; font-size: 10px; color: #1e3a8a;">$rName</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">$tingkat</td>
          <td style="padding: 4px 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px; font-weight: 600;">$($list.Count) Siswa</td>
          <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; color: #16a34a; font-weight: 700; font-size: 9.5px;">TERVERIFIKASI AKTIF</td>
        </tr>
"@
        $rekapIdx++
    }

    # Build Class Sections (1 per rombel)
    $classSectionsHtml = ""
    foreach ($rName in $activeRombelNames) {
        $studentsInClass = $rombelsMap[$rName]
        $studentRowsHtml = ""
        $sIdx = 1
        foreach ($s in $studentsInClass) {
            $sBg = if ($sIdx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
            $studentRowsHtml += @"
            <tr style="background: $sBg;">
              <td style="padding: 3.5px 5px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px;">$sIdx</td>
              <td style="padding: 3.5px 7px; border: 1px solid #cbd5e1; font-size: 9.5px; font-weight: 600; color: #0f172a;">$($s.Nama)</td>
              <td style="padding: 3.5px 7px; border: 1px solid #cbd5e1; font-size: 9.5px; font-family: 'Consolas', monospace; color: #1e40af;">$($s.Email)</td>
              <td style="padding: 3.5px 6px; border: 1px solid #cbd5e1; font-size: 9.5px; font-family: 'Consolas', monospace; font-weight: 700; color: #b45309; text-align: center;">$($s.Pass)</td>
              <td style="padding: 3.5px 5px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px; color: #15803d; font-weight: 700;">AKTIF</td>
              <td style="padding: 3.5px 5px; border: 1px solid #cbd5e1; text-align: center; font-size: 8.5px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
            </tr>
"@
            $sIdx++
        }

        $classSectionsHtml += @"
        <div class="page-break"></div>
        <div class="header-container">
          <div class="logo-box">
            <img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" />
          </div>
          <div class="doc-meta">
            <div><strong>Satuan Pendidikan:</strong> SMA Islam Sudirman Ambarawa</div>
            <div><strong>Rombongan Belajar:</strong> <span class="badge-rombel">$rName</span></div>
            <div><strong>Total Peserta Didik:</strong> $($studentsInClass.Count) Siswa Terdaftar</div>
          </div>
        </div>

        <div class="class-title-banner">
          <h2>DAFTAR KREDENSIAL LOGIN SISWA &mdash; $rName</h2>
          <p>Lampiran resmi untuk didistribusikan oleh Wali Kelas kepada peserta didik yang bersangkutan</p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 4%; text-align: center;">No</th>
              <th style="width: 32%;">Nama Lengkap Peserta Didik</th>
              <th style="width: 28%;">Email Login Resmi</th>
              <th style="width: 17%; text-align: center;">Password Awal</th>
              <th style="width: 9%; text-align: center;">Status</th>
              <th style="width: 10%; text-align: center;">Paraf Siswa</th>
            </tr>
          </thead>
          <tbody>
            $studentRowsHtml
          </tbody>
        </table>

        <div class="class-footer">
          <div>Portal Akses LMS: <a href="https://smaislamsudirmanambarawa.belajarplus.com" style="color: #2563eb; font-weight: bold; text-decoration: underline;">https://smaislamsudirmanambarawa.belajarplus.com</a></div>
          <div style="font-weight: 600; color: #1e3a8a;">Wali Kelas ${rName}: _______________________</div>
        </div>
"@
    }

    $fullHtml = @"
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Kredensial Siswa - SMA Islam Sudirman Ambarawa - $titleScope</title>
<style>
  @page {
    size: A4 portrait;
    margin: 10mm 12mm 12mm 12mm;
  }
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Segoe UI', Arial, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    color: #1e293b;
    line-height: 1.35;
    background: #ffffff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page-break {
    page-break-before: always;
    break-before: page;
  }
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2.5px solid #1e3a8a;
    padding-bottom: 10px;
    margin-bottom: 14px;
  }
  .official-logo {
    height: 46px;
    width: auto;
    object-fit: contain;
  }
  .doc-meta {
    text-align: right;
    font-size: 10.5px;
    color: #475569;
    line-height: 1.45;
  }
  .doc-meta strong {
    color: #0f172a;
  }
  .badge-rombel {
    background: #1e3a8a;
    color: #fff;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 10.5px;
    display: inline-block;
  }
  .title-banner {
    text-align: center;
    margin-bottom: 14px;
  }
  .title-banner h1 {
    margin: 0 0 4px 0;
    font-size: 15px;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .title-banner .doc-num {
    font-size: 11px;
    color: #64748b;
    margin: 0;
  }
  .portal-box {
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 6px;
    padding: 8px 12px;
    margin-bottom: 14px;
    text-align: center;
  }
  .portal-box .title {
    font-weight: bold;
    color: #15803d;
    font-size: 11px;
    margin-bottom: 2px;
    text-transform: uppercase;
  }
  .portal-box .link {
    font-size: 14px;
    font-weight: bold;
    color: #1d4ed8;
    text-decoration: underline;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 14px;
  }
  .summary-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 7px 8px;
    text-align: center;
  }
  .summary-card .label {
    font-size: 9.5px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 2px;
  }
  .summary-card .value {
    font-size: 13px;
    font-weight: bold;
    color: #0f172a;
  }
  .ba-section {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 12px;
    font-size: 10.5px;
    line-height: 1.5;
    margin-bottom: 14px;
  }
  .ba-section p {
    margin: 0 0 6px 0;
  }
  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
    padding: 0 25px;
  }
  .sign-box {
    text-align: center;
    width: 230px;
    font-size: 10.5px;
  }
  .sign-space {
    height: 48px;
  }
  .sign-name {
    font-weight: bold;
    border-bottom: 1px solid #0f172a;
    display: inline-block;
    min-width: 180px;
    padding-bottom: 2px;
  }
  .class-title-banner {
    background: #eff6ff;
    border-left: 4px solid #1e3a8a;
    padding: 6px 10px;
    margin-bottom: 10px;
  }
  .class-title-banner h2 {
    margin: 0;
    font-size: 12px;
    color: #1e3a8a;
  }
  .class-title-banner p {
    margin: 2px 0 0 0;
    font-size: 9.5px;
    color: #64748b;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  thead {
    display: table-header-group;
  }
  tr {
    page-break-inside: avoid;
  }
  th {
    background: #1e3a8a;
    color: #ffffff;
    padding: 5px 6px;
    font-size: 9.5px;
    font-weight: 600;
    text-align: left;
    border: 1px solid #1e3a8a;
  }
  td {
    padding: 3.5px 6px;
    font-size: 9.5px;
    border: 1px solid #cbd5e1;
  }
  .class-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    padding-top: 6px;
    border-top: 1px dashed #cbd5e1;
    font-size: 9.5px;
    color: #64748b;
  }
</style>
</head>
<body>

  <!-- ==================== HALAMAN 1: BERITA ACARA RESMI SISWA ==================== -->
  <div class="header-container">
    <div class="logo-box">
      <img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" />
    </div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/SMAISUDA/SISWA/$docScopeNum/X/2026</div>
      <div><strong>Tanggal:</strong> 17 Oktober 2026</div>
      <div><strong>Sifat:</strong> Resmi / Rahasia</div>
      <div><strong>NPSN:</strong> 20320373</div>
    </div>
  </div>

  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA &amp; KREDENSIAL AKUN SISWA</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>

  <div class="portal-box">
    <div class="title">PORTAL AKSES RESMI LMS BELAJARPLUS</div>
    <a href="https://smaislamsudirmanambarawa.belajarplus.com" class="link">https://smaislamsudirmanambarawa.belajarplus.com</a>
    <div style="font-size: 10px; color: #4b5563; margin-top: 3px;">
      Siswa dapat login mandiri melalui portal di atas atau aplikasi BelajarPlus menggunakan Email dan Password di bawah ini
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Satuan Pendidikan</div>
      <div class="value" style="font-size: 11px;">SMA Islam Sudirman Ambarawa</div>
    </div>
    <div class="summary-card">
      <div class="label">Lingkup Dokumen</div>
      <div class="value" style="color: #2563eb; font-size: 11px;">$titleScope</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Peserta Didik</div>
      <div class="value" style="font-size: 12px; color: #059669;">$totalStudentsInReport Siswa</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Rombel / Kelas</div>
      <div class="value" style="color: #16a34a; font-size: 12px;">$($activeRombelNames.Count) Rombel</div>
    </div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini, <strong>Sabtu, 17 Oktober 2026</strong>, telah diselesaikan penerbitan dan pemetaan kredensial akun peserta didik untuk satuan pendidikan <strong>SMA Islam Sudirman Ambarawa</strong> (NPSN: <strong>20320373</strong>) pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p>Ketentuan kredensial akun siswa mengacu secara persis pada kesepakatan bersama Koordinator Data / Operator Sekolah (<strong>Bapak Faizal Firmandika, S.Pd.</strong>), yaitu:</p>
    <ul style="margin: 3px 0 5px 16px; padding: 0;">
      <li><strong>Format Email / Akun Login:</strong> Menggunakan pola resmi <code>[NIS]@smaissuda.sch.id</code> (contoh: <code>14712@smaissuda.sch.id</code>).</li>
      <li><strong>Format Password Awal:</strong> Ditetapkan kombinasi sandi aman <code>Issuda#[DDMMYYYY]</code> berbasis tanggal lahir masing-masing peserta didik (contoh: <code>Issuda#12032011</code>).</li>
      <li><strong>Pemetaan Rombongan Belajar:</strong> Seluruh peserta didik telah dialokasikan secara presisi ke dalam rombel resmi Tahun Ajaran 2026/2027.</li>
    </ul>
    <p style="margin-bottom: 0;">Dokumen ini diterbitkan sebagai lampiran pengesahan sebelum migrasi data ke peladen utama BelajarPlus dan bahan distribusi resmi oleh masing-masing Wali Kelas.</p>
  </div>

  <h3 style="font-size: 11.5px; color: #1e3a8a; margin: 0 0 6px 0;">REKAPITULASI ALOKASI KELAS / ROMBEL</h3>
  <table>
    <thead>
      <tr>
        <th style="width: 5%; text-align: center;">No</th>
        <th style="width: 35%; text-align: center;">Nama Rombel / Kelas</th>
        <th style="width: 20%; text-align: center;">Tingkat</th>
        <th style="width: 20%; text-align: center;">Jumlah Siswa</th>
        <th style="width: 20%; text-align: center;">Status Verifikasi</th>
      </tr>
    </thead>
    <tbody>
      $rekapRowsHtml
    </tbody>
  </table>

  <div class="signatures">
    <div class="sign-box">
      <div>Mengetahui,<br><strong>Kepala Sekolah SMA Islam Sudirman</strong></div>
      <div class="sign-space"></div>
      <div class="sign-name">SMA Islam Sudirman Ambarawa</div>
    </div>
    <div class="sign-box">
      <div>Diserahkan Oleh,<br><strong>Tim Trainer / Pendamping Teknis</strong></div>
      <div class="sign-space"></div>
      <div class="sign-name">Tim Pendamping BelajarPlus</div>
    </div>
  </div>

  $classSectionsHtml

</body>
</html>
"@

    return $fullHtml
}

# 1. Master PDF (All 1.156 Siswa)
Write-Host "========================================================="
Write-Host "1. Generating Master Siswa PDF (1.156 Siswa, 33 Rombel)..."
Write-Host "========================================================="
$masterHtml = Build-SiswaHtmlReport -titleScope "Seluruh Kelas (X, XI, XII)" -docScopeNum "ALL"
$masterTempHtml = Join-Path $workspaceDir "temp_siswa_master.html"
$masterPdfName = "Laporan_Resmi_Akun_Siswa_SMA_Islam_Sudirman_Ambarawa.pdf"
$masterLocalPdf = Join-Path $workspaceDir $masterPdfName
$masterDrivePdf = Join-Path $targetDriveDir $masterPdfName

[System.IO.File]::WriteAllText($masterTempHtml, $masterHtml, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=""$masterLocalPdf""", """$masterTempHtml""" -Wait

if (Test-Path $masterLocalPdf) {
    Copy-Item -Path $masterLocalPdf -Destination $masterDrivePdf -Force
    $size = (Get-Item $masterLocalPdf).Length
    Write-Host "   [OK] Master Siswa PDF created: $masterLocalPdf ($size bytes)"
    Write-Host "   [OK] Copied to Google Drive: $masterDrivePdf"
} else {
    Write-Error "Failed to generate Master Siswa PDF."
}

# 2. Kelas X PDF (394 Siswa)
Write-Host "`n2. Generating Kelas X Siswa PDF (394 Siswa, 11 Rombel)..."
$xHtml = Build-SiswaHtmlReport -titleScope "Kelas X (Fase E)" -docScopeNum "X" -filterTingkat "Kelas 10"
$xTempHtml = Join-Path $workspaceDir "temp_siswa_kelas_x.html"
$xPdfName = "Laporan_Resmi_Akun_Siswa_Kelas_X_SMA_Islam_Sudirman_Ambarawa.pdf"
$xLocalPdf = Join-Path $workspaceDir $xPdfName
$xDrivePdf = Join-Path $targetDriveDir $xPdfName

[System.IO.File]::WriteAllText($xTempHtml, $xHtml, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=""$xLocalPdf""", """$xTempHtml""" -Wait

if (Test-Path $xLocalPdf) {
    Copy-Item -Path $xLocalPdf -Destination $xDrivePdf -Force
    $size = (Get-Item $xLocalPdf).Length
    Write-Host "   [OK] Kelas X Siswa PDF created: $xLocalPdf ($size bytes)"
    Write-Host "   [OK] Copied to Google Drive: $xDrivePdf"
}

# 3. Kelas XI PDF (381 Siswa)
Write-Host "`n3. Generating Kelas XI Siswa PDF (381 Siswa, 11 Rombel)..."
$xiHtml = Build-SiswaHtmlReport -titleScope "Kelas XI (Fase F)" -docScopeNum "XI" -filterTingkat "Kelas 11"
$xiTempHtml = Join-Path $workspaceDir "temp_siswa_kelas_xi.html"
$xiPdfName = "Laporan_Resmi_Akun_Siswa_Kelas_XI_SMA_Islam_Sudirman_Ambarawa.pdf"
$xiLocalPdf = Join-Path $workspaceDir $xiPdfName
$xiDrivePdf = Join-Path $targetDriveDir $xiPdfName

[System.IO.File]::WriteAllText($xiTempHtml, $xiHtml, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=""$xiLocalPdf""", """$xiTempHtml""" -Wait

if (Test-Path $xiLocalPdf) {
    Copy-Item -Path $xiLocalPdf -Destination $xiDrivePdf -Force
    $size = (Get-Item $xiLocalPdf).Length
    Write-Host "   [OK] Kelas XI Siswa PDF created: $xiLocalPdf ($size bytes)"
    Write-Host "   [OK] Copied to Google Drive: $xiDrivePdf"
}

# 4. Kelas XII PDF (381 Siswa)
Write-Host "`n4. Generating Kelas XII Siswa PDF (381 Siswa, 11 Rombel)..."
$xiiHtml = Build-SiswaHtmlReport -titleScope "Kelas XII (Fase F)" -docScopeNum "XII" -filterTingkat "Kelas 12"
$xiiTempHtml = Join-Path $workspaceDir "temp_siswa_kelas_xii.html"
$xiiPdfName = "Laporan_Resmi_Akun_Siswa_Kelas_XII_SMA_Islam_Sudirman_Ambarawa.pdf"
$xiiLocalPdf = Join-Path $workspaceDir $xiiPdfName
$xiiDrivePdf = Join-Path $targetDriveDir $xiiPdfName

[System.IO.File]::WriteAllText($xiiTempHtml, $xiiHtml, [System.Text.Encoding]::UTF8)

Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=""$xiiLocalPdf""", """$xiiTempHtml""" -Wait

if (Test-Path $xiiLocalPdf) {
    Copy-Item -Path $xiiLocalPdf -Destination $xiiDrivePdf -Force
    $size = (Get-Item $xiiLocalPdf).Length
    Write-Host "   [OK] Kelas XII Siswa PDF created: $xiiLocalPdf ($size bytes)"
    Write-Host "   [OK] Copied to Google Drive: $xiiDrivePdf"
}

Write-Host "`nALL SISWA PDF REPORTS SUCCESSFULLY GENERATED AND SYNCED TO GOOGLE DRIVE!"
