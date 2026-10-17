$lines = Get-Content -Path 'C:\Users\user\.gemini\antigravity-ide\brain\cffc48e8-a9d8-466a-8ae7-68e151f0c29c\.system_generated\logs\transcript.jsonl'
$targetLines = $lines | Where-Object { 
    $obj = $_ | ConvertFrom-Json
    $obj.step_index -ge 3425 -and $obj.step_index -le 3438
}
foreach ($line in $targetLines) {
    $obj = $line | ConvertFrom-Json
    Write-Output "=== STEP $($obj.step_index) [$($obj.type)] ==="
    if ($obj.content) {
        Write-Output ($obj.content.Substring(0, [Math]::Min(1000, $obj.content.Length)))
    }
}
