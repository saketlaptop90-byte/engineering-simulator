$cellContent = Get-Content "machines/cell_phase5.js" -Raw
$organicContent = Get-Content "machines/organic.js" -Raw
$appJsContent = Get-Content "app.js"

$newEntries = @()

if ($cellContent -match "const modelsList = \[([\s\S]*?)\];") {
    $listStr = $matches[1]
    $regex = [regex]'"([^"]+)"'
    $match = $regex.Match($listStr)
    while ($match.Success) {
        $name = $match.Groups[1].Value
        $idStr = $name -replace "[^a-zA-Z0-9_]", "_"
        $id = "cell5_" + $idStr.ToLower()
        $newEntries += "  { id: '$id', name: '$name', icon: '🧬', category: 'biology', importPath: './machines/cell_phase5.js', importName: 'createCellPhase5' },"
        $match = $match.NextMatch()
    }
}

if ($organicContent -match "const reactionList = \[([\s\S]*?)\];") {
    $listStr = $matches[1]
    
    # strings
    $regexStr = [regex]'"([^"]+)"'
    $matchStr = $regexStr.Match($listStr)
    while ($matchStr.Success) {
        $name = $matchStr.Groups[1].Value
        if ($name.Length -gt 3) {
            $idStr = $name -replace "[^a-zA-Z0-9_]", "_"
            $id = "organic_" + $idStr.ToLower()
            $newEntries += "  { id: '$id', name: '$name', icon: '🧪', category: 'chemistry', importPath: './machines/organic.js', importName: 'createOrganicReactions' },"
        }
        $matchStr = $matchStr.NextMatch()
    }
    
    # objects
    $regexObj = [regex]'name:\s*"([^"]+)"'
    $matchObj = $regexObj.Match($listStr)
    while ($matchObj.Success) {
        $name = $matchObj.Groups[1].Value
        if ($name.Length -gt 3) {
            $idStr = $name -replace "[^a-zA-Z0-9_]", "_"
            $id = "organic_" + $idStr.ToLower()
            $newEntries += "  { id: '$id', name: '$name', icon: '🧪', category: 'chemistry', importPath: './machines/organic.js', importName: 'createOrganicReactions' },"
        }
        $matchObj = $matchObj.NextMatch()
    }
}

# Deduplicate
$newEntries = $newEntries | Select-Object -Unique
Write-Host "Found $($newEntries.Count) entries to unpack!"

# Insert into app.js
$insertIndex = -1
for ($i = $appJsContent.Count - 1; $i -ge 0; $i--) {
    if ($appJsContent[$i] -match "^\s*\];") {
        $insertIndex = $i
        break
    }
}

if ($insertIndex -ge 0) {
    $finalContent = @()
    for ($i = 0; $i -lt $insertIndex; $i++) {
        $finalContent += $appJsContent[$i]
    }
    foreach ($entry in $newEntries) {
        $finalContent += $entry
    }
    for ($i = $insertIndex; $i -lt $appJsContent.Count; $i++) {
        $finalContent += $appJsContent[$i]
    }
    $finalContent | Set-Content "app.js" -Encoding UTF8
    Write-Host "Successfully unpacked entries into app.js"
} else {
    Write-Host "Failed to find insertion point in app.js"
}
