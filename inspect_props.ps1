$data = Import-Clixml "audit_final_all_schools.xml"
$cat3 = $data | Where-Object { $_.StatusKategori -eq 'LAPORAN PDF TERSEDIA (BELUM SANITASI/IMPOR)' }
$cat3[0] | Format-List *
