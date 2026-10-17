$res = Get-Content test_r_res.txt -Raw
$records = [regex]::Matches($res, '\{\"t\":10,\"i\":[0-9]+,\"p\":\{\"k\":\[\"id\",\"active\",\"suffix\".*?\"v\":\[(?<values>.*?)\]\},\"o\":0\}')
Write-Host "Matched records: $($records.Count)"
foreach ($rec in $records) {
    $strMatches = [regex]::Matches($rec.Groups['values'].Value, '\{\"t\":1,\"s\":\"(?<str>[^\"]*)\"\}')
    $id = if ($strMatches.Count -gt 0) { $strMatches[0].Groups['str'].Value } else { "" }
    $suffix = if ($strMatches.Count -gt 1) { $strMatches[1].Groups['str'].Value } else { "" }
    $grade = if ($strMatches.Count -gt 3) { $strMatches[3].Groups['str'].Value } else { "" }
    $dispName = if ($strMatches.Count -gt 6) { $strMatches[6].Groups['str'].Value } else { "" }
    Write-Host ("Rombel: {0,-15} | Suffix: {1,-10} | Grade: {2,-3} | Id: {3}" -f $dispName, $suffix, $grade, $id)
}
