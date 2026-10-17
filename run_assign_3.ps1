& .\auth_andrew.ps1 | Out-Null

Write-Host "=========================================================="
Write-Host " 1. Assigning candidates for SMAN 1 Patikraja..."
Write-Host "=========================================================="
& .\assign_school_candidates.ps1 -SchoolId "27ec5abd-dbb1-4f01-9a09-8f42249ddcdb" -ExcelPath "H:\My Drive\Trainer\B+\AKUN\57. SMAN 1 Patikraja\[CLEAN_IMPORT] SMAN 1 Patikraja.xlsx"

Write-Host "`n=========================================================="
Write-Host " 2. Assigning candidates for SMAN 2 Purbalingga..."
Write-Host "=========================================================="
& .\assign_school_candidates.ps1 -SchoolId "c07f5f75-f286-4ef4-b4d3-5a89c55714d7" -ExcelPath "H:\My Drive\Trainer\B+\AKUN\60. SMAN 2 Purbalingga\[CLEAN_IMPORT] SMAN 2 Purbalingga.xlsx"

Write-Host "`n=========================================================="
Write-Host " 3. Assigning candidates for SMAN 1 Bobotsari..."
Write-Host "=========================================================="
& .\assign_school_candidates.ps1 -SchoolId "5dd5d6fd-b273-423a-9b36-bed7dbaa4320" -ExcelPath "H:\My Drive\Trainer\B+\AKUN\61. SMAN 1 Bobotsari\[CLEAN_IMPORT] SMAN 1 Bobotsari.xlsx"

Write-Host "`n>>> All 3 schools candidate assignment finished!"
