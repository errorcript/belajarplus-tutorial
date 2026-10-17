# Script to generate Official Guru & PTK PDF Report for SMA Islam Sudirman Ambarawa
$ErrorActionPreference = "Stop"

$workspaceDir = (Get-Item .).FullName
$logoPath = Join-Path $workspaceDir "assets\belajar-plus-logo.png"
$logoBytes = [System.IO.File]::ReadAllBytes($logoPath)
$logoBase64 = "data:image/png;base64," + [Convert]::ToBase64String($logoBytes)

$guruData = Import-Clixml (Join-Path $workspaceDir "parsed_guru_smaisuda.xml")

$targetDriveDir = "H:\My Drive\Trainer\B+\AKUN\79. SMA Islam Sudirman Ambarawa"
$pdfName = "Laporan_Resmi_Akun_Guru_SMA_Islam_Sudirman_Ambarawa.pdf"
$localPdfPath = Join-Path $workspaceDir $pdfName
$drivePdfPath = Join-Path $targetDriveDir $pdfName
$tempHtmlPath = Join-Path $workspaceDir "temp_guru_report.html"

# Build Guru Table Rows
$guruRowsHtml = ""
$idx = 1
foreach ($g in $guruData) {
    $bg = if ($idx % 2 -eq 0) { "#f8fafc" } else { "#ffffff" }
    $roleBadgeClass = switch -Wildcard ($g.Peran) {
        "*Admin*" { "badge-admin" }
        "*Kepala*" { "badge-kepsek" }
        default { "badge-guru" }
    }
    
    $guruRowsHtml += @"
    <tr style="background: $bg;">
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 10px;">$idx</td>
      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-size: 10px; font-weight: 600; color: #0f172a;">$($g.Nama)</td>
      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-size: 10px; font-family: 'Consolas', monospace; color: #1e40af;">$($g.Email)</td>
      <td style="padding: 4px 8px; border: 1px solid #cbd5e1; font-size: 10px; font-family: 'Consolas', monospace; font-weight: 700; color: #b45309; text-align: center;">$($g.Pass)</td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center;"><span class="$roleBadgeClass">$($g.Peran)</span></td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9.5px; color: #15803d; font-weight: 700;">AKTIF</td>
      <td style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; font-size: 9px; color: #94a3b8;">[ &nbsp; &nbsp; &nbsp; &nbsp; ]</td>
    </tr>
"@
    $idx++
}

$html = @"
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Resmi Akun Guru &amp; PTK - SMA Islam Sudirman Ambarawa</title>
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
  .ba-section p:last-child {
    margin-bottom: 0;
  }
  .badge-admin {
    background: #dc2626;
    color: #fff;
    padding: 2px 5px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 8.5px;
    display: inline-block;
  }
  .badge-kepsek {
    background: #7c3aed;
    color: #fff;
    padding: 2px 5px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 8.5px;
    display: inline-block;
  }
  .badge-guru {
    background: #2563eb;
    color: #fff;
    padding: 2px 5px;
    border-radius: 4px;
    font-weight: 600;
    font-size: 8.5px;
    display: inline-block;
  }
  .info-callout {
    background: #eff6ff;
    border-left: 3.5px solid #2563eb;
    padding: 7px 10px;
    font-size: 10px;
    margin-bottom: 14px;
    color: #1e3a8a;
  }
  .signatures {
    display: flex;
    justify-content: space-between;
    margin-top: 18px;
    padding: 0 25px;
  }
  .sign-box {
    text-align: center;
    width: 230px;
    font-size: 10.5px;
  }
  .sign-space {
    height: 50px;
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
    font-size: 12.5px;
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
    font-size: 10px;
    font-weight: 600;
    text-align: left;
    border: 1px solid #1e3a8a;
  }
  td {
    padding: 4px 6px;
    font-size: 10px;
    border: 1px solid #cbd5e1;
  }
  .doc-footer {
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

  <!-- ==================== HALAMAN 1: BERITA ACARA RESMI ==================== -->
  <div class="header-container">
    <div class="logo-box">
      <img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" />
    </div>
    <div class="doc-meta">
      <div><strong>Nomor:</strong> BP/BA-AKUN/SMAISUDA/PTK/X/2026</div>
      <div><strong>Tanggal:</strong> 17 Oktober 2026</div>
      <div><strong>Sifat:</strong> Resmi / Rahasia</div>
      <div><strong>NPSN:</strong> 20320373</div>
    </div>
  </div>

  <div class="title-banner">
    <h1>BERITA ACARA SERAH TERIMA AKUN PENDIDIK &amp; TENAGA KEPENDIDIKAN</h1>
    <p class="doc-num">Platform Pembelajaran Terintegrasi BelajarPlus &bull; <strong>Tahun Ajaran 2026/2027</strong></p>
  </div>

  <div class="portal-box">
    <div class="title">PORTAL AKSES RESMI LMS SEKOLAH</div>
    <a href="https://smaislamsudirmanambarawa.belajarplus.com" class="link">https://smaislamsudirmanambarawa.belajarplus.com</a>
    <div style="font-size: 10px; color: #4b5563; margin-top: 3px;">
      Pendidik (Guru &amp; Staf) dapat login mandiri melalui portal di atas atau tautan alternatif <strong>https://belajarplus.id</strong>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="label">Satuan Pendidikan</div>
      <div class="value" style="font-size: 11px;">SMA Islam Sudirman Ambarawa</div>
    </div>
    <div class="summary-card">
      <div class="label">Total Akun PTK</div>
      <div class="value" style="color: #2563eb;">50 PTK</div>
    </div>
    <div class="summary-card">
      <div class="label">Komposisi Akun</div>
      <div class="value" style="font-size: 10.5px; color: #059669;">48 Guru, 1 Admin, 1 Kepsek</div>
    </div>
    <div class="summary-card">
      <div class="label">Status Verifikasi</div>
      <div class="value" style="color: #16a34a; font-size: 11px;">100% TERVERIFIKASI</div>
    </div>
  </div>

  <div class="ba-section">
    <p>Pada hari ini, <strong>Sabtu, 17 Oktober 2026</strong>, telah diterbitkan dan diselaraskan kredensial akun Pendidik dan Tenaga Kependidikan (PTK) untuk satuan pendidikan <strong>SMA Islam Sudirman Ambarawa</strong> (NPSN: <strong>20320373</strong>) pada <strong>Tahun Ajaran 2026/2027</strong>.</p>
    <p>Penetapan format akun PTK mengacu secara ketat pada hasil konfirmasi teknis bersama Operator Sekolah (<strong>Bapak Faizal Firmandika, S.Pd.</strong>), dengan ketentuan:</p>
    <ul style="margin: 3px 0 5px 16px; padding: 0;">
      <li><strong>Akun Guru (48 Pendidik):</strong> Menggunakan <em>real personal email</em> aktif (Gmail, Yahoo, dll.) sebagaimana terdaftar resmi dalam ekosistem sekolah dan PesonaEdu sebelumnya agar mempermudah autentikasi serta retensi data materi ajar.</li>
      <li><strong>Akun Struktural (2 Akun):</strong> Disediakan akun dinas khusus <code>admin@smaissuda.sch.id</code> (Hak Akses Admin Sekolah) dan <code>kepsek@smaissuda.sch.id</code> (Hak Akses Kepala Sekolah).</li>
      <li><strong>Format Password Awal:</strong> Ditetapkan pola sandi institusi <code>Issuda#[DDMMYYYY]</code> berbasis tanggal lahir masing-masing pendidik, serta sandi khusus terenkripsi untuk akun struktural.</li>
    </ul>
    <p>Dokumen ini diserahkan kepada Pihak Sekolah sebagai dasar verifikasi akhir sebelum pengaktifan massal modul kurikulum, kelas virtual, dan distribusi perangkat ajar BelajarPlus.</p>
  </div>

  <div class="info-callout">
    <strong>Petunjuk Distribusi Kredensial:</strong> Mohon simpan dokumen ini di tempat aman. Kredensial akun guru bersifat personal dan rahasia. Guru yang telah menerima akun diimbau untuk segera mencoba login di portal dan memperbarui kata sandi sesuai kenyamanan masing-masing.
  </div>

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

  <!-- ==================== HALAMAN 2: DAFTAR KREDENSIAL PTK ==================== -->
  <div class="page-break"></div>

  <div class="header-container">
    <div class="logo-box">
      <img src="$logoBase64" alt="Logo BelajarPlus" class="official-logo" />
    </div>
    <div class="doc-meta">
      <div><strong>Satuan Pendidikan:</strong> SMA Islam Sudirman Ambarawa</div>
      <div><strong>Kategori:</strong> Pendidik &amp; Tenaga Kependidikan (PTK)</div>
      <div><strong>Total:</strong> 50 Akun Terdaftar</div>
    </div>
  </div>

  <div class="class-title-banner">
    <h2>DAFTAR KREDENSIAL LOGIN GURU &amp; STAF &mdash; SMA ISLAM SUDIRMAN AMBARAWA</h2>
    <p>Lampiran resmi kredensial login akun pendidik untuk proses konfirmasi, verifikasi, dan serah terima</p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 4%; text-align: center;">No</th>
        <th style="width: 31%;">Nama Lengkap Pendidik / Staf</th>
        <th style="width: 28%;">Email Login Resmi</th>
        <th style="width: 16%; text-align: center;">Password Awal</th>
        <th style="width: 9%; text-align: center;">Peran</th>
        <th style="width: 6%; text-align: center;">Status</th>
        <th style="width: 6%; text-align: center;">Paraf</th>
      </tr>
    </thead>
    <tbody>
      $guruRowsHtml
    </tbody>
  </table>

  <div class="doc-footer">
    <div>Portal Akses: <a href="https://smaislamsudirmanambarawa.belajarplus.com" style="color: #2563eb; font-weight: bold; text-decoration: underline;">https://smaislamsudirmanambarawa.belajarplus.com</a></div>
    <div>Dicetak secara otomatis oleh Sistem BelajarPlus &bull; Dokumen Rahasia Institusi</div>
  </div>

</body>
</html>
"@

[System.IO.File]::WriteAllText($tempHtmlPath, $html, [System.Text.Encoding]::UTF8)

Write-Host "Rendering Guru PDF via Chrome headless..."
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
Start-Process -FilePath $chromePath -ArgumentList "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf=""$localPdfPath""", """$tempHtmlPath""" -Wait

if (Test-Path $localPdfPath) {
    Copy-Item -Path $localPdfPath -Destination $drivePdfPath -Force
    $pdfSize = (Get-Item $localPdfPath).Length
    Write-Host "SUCCESS! Guru PDF generated: $localPdfPath ($pdfSize bytes)"
    Write-Host "Copied to Google Drive: $drivePdfPath"
} else {
    Write-Error "Failed to generate Guru PDF."
}
