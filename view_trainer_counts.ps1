$items = Import-Clixml "all_trainer_institutions.xml"
$items | Group-Object Trainer | Format-Table -AutoSize Name, Count
