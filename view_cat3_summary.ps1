$items = Import-Clixml "cat3_scanned_details.xml"
$items | Format-Table -AutoSize Sekolah, Klaster, PIC, TotalSiswa
