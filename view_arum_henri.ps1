$items = Import-Clixml "all_trainer_institutions.xml"
$items | Where-Object { $_.Trainer -in @('Arum', 'Henri') } | Format-Table -AutoSize Trainer, SchoolName, SchoolId
