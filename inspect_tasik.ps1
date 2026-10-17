$plan = Import-Clixml "deployment_plan_29_schools.xml"
$t = $plan | Where-Object { $_.Sekolah -match "TASIKMALAYA" }
$t | Format-List
