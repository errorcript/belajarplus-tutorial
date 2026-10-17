Write-Host "=========================================================="
Write-Host " RE-RUN DEPLOYMENT: SMAN 1 KAJEN"
Write-Host "=========================================================="

& .\auth_andrew.ps1 | Out-Null
& .\deploy_school_engine.ps1 -SchoolName "SMAN 1 Kajen" `
  -Folder "71. SMAN 1 Kajen" `
  -SchoolId "b371451a-0121-4a68-81a2-ddc588c4edf5" `
  -CleanFileName "[CLEAN_IMPORT] SMAN 1 Kajen.xlsx"

Write-Host "`n>>> SMAN 1 Kajen deployment finished!"
