$liveDetails = Import-Clixml "cat2_live_audit_detail.xml"
$batchResults = Import-Clixml "batch_sanitize_results.xml"

Write-Host "=========================================================="
Write-Host " COMPARISON: EXCEL DATA VS LIVE PLATFORM DATA"
Write-Host "=========================================================="

$comparison = @()

foreach ($lv in $liveDetails) {
    $matchedBatch = $batchResults | Where-Object { $_.Sekolah -eq $lv.Sekolah }
    $excelCount = if ($matchedBatch) { $matchedBatch.TotalSiswa } else { 0 }
    $excelRombel = if ($matchedBatch) { $matchedBatch.TotalRombel } else { 0 }
    
    $statusKeterangan = ""
    if ($lv.SiswaLive -ge $excelCount -and $excelCount -gt 0) {
        $statusKeterangan = "SUDAH LENGKAP DI PLATFORM (100%)"
    } elseif ($lv.SiswaLive -gt 0) {
        $statusKeterangan = "SEBAGIAN TERIMPOR ($($lv.SiswaLive)/$excelCount Siswa)"
    } else {
        $statusKeterangan = "BELUM TERIMPOR (0 Siswa)"
    }
    
    $comparison += [PSCustomObject]@{
        Sekolah = $lv.Sekolah
        LiveName = $lv.MatchedLiveName
        TA = $lv.TahunAjaran
        ExcelSiswa = $excelCount
        LiveSiswa = $lv.SiswaLive
        LiveRombel = $lv.RombelLive
        Status = $statusKeterangan
    }
}

$comparison | Format-Table -AutoSize Sekolah, TA, ExcelSiswa, LiveSiswa, LiveRombel, Status
$comparison | Export-Clixml "comparison_live_vs_excel.xml"
