$raw = Get-Content "andrew_inst_raw.txt" -Raw
$clean = $raw.Replace('\"', '"')

# Extract pairs of id and name
$pattern = '\{\"t\":1,\"s\":\"(?<id>[0-9a-fA-F-]{36})\"\},\{\"t\":1,\"s\":\"(?<name>[^"]+)\"\}'
$matches = [regex]::Matches($clean, $pattern)

Write-Host "Total Seroval matches: $($matches.Count)"
$dict = @{}
foreach ($m in $matches) {
    $name = $m.Groups['name'].Value
    $id = $m.Groups['id'].Value
    if (-not $dict.ContainsKey($name)) {
        $dict[$name] = $id
        Write-Host "$name => $id"
    }
}

