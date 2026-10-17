$d = Import-Clixml "audit_final_all_schools.xml"
$live = $d | Where-Object { $_.StatusKategori -eq 'LENGKAP & LIVE 100%' }
$onHold = $d | Where-Object { $_.StatusKategori -like '*HOLD*' }

$totalSiswa = ($live | Measure-Object -Property SiswaLive -Sum).Sum
$totalRombel = ($live | Measure-Object -Property RombelLive -Sum).Sum

Write-Host "=========================================================="
Write-Host " FINAL AUDIT TOTALS"
Write-Host " Total Schools in Scope: $($d.Count)"
Write-Host " Live Schools 100%     : $($live.Count) ($([math]::Round(($live.Count / $d.Count) * 100, 1))%)"
Write-Host " On Hold Schools       : $($onHold.Count) (SMA Islam Sudirman Ambarawa)"
Write-Host " Total Live Students   : $($totalSiswa.ToString('N0'))"
Write-Host " Total Active Rombels  : $($totalRombel.ToString('N0'))"
Write-Host "=========================================================="
