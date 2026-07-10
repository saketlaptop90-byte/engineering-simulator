$appjs = Get-Content 'app.js' -Raw
$allFiles = Get-ChildItem 'machines/*.js' | Select-Object -ExpandProperty Name
$unlinkedFiles = @()

foreach ($file in $allFiles) {
    if (-not ($appjs -match [regex]::Escape($file))) {
        $unlinkedFiles += $file
    }
}

Write-Host "Found $($unlinkedFiles.Count) unlinked files. Processing..."

$newEntries = @()
foreach ($file in $unlinkedFiles) {
    $content = Get-Content "machines/$file" -Raw
    if ($content -match "export function ([A-Za-z0-9_]+)\(") {
        $importName = $Matches[1]
        $id = $file -replace '\.js$', ''
        
        # Determine category based on prefix
        $category = 'misc'
        if ($id -match '^aero') { $category = 'aerospace' }
        elseif ($id -match '^acoustics' -or $id -match 'acoustic') { $category = 'acoustic_engineering' }
        elseif ($id -match '^bio') { $category = 'biology' }
        elseif ($id -match '^civil') { $category = 'civil_engineering' }
        elseif ($id -match '^chem') { $category = 'chemistry' }
        elseif ($id -match '^astro' -or $id -match 'space' -or $id -match 'asteroid' -or $id -match '^orbital') { $category = 'aerospace' }
        elseif ($id -match '^quantum' -or $id -match '^physics') { $category = 'theoretical_physics' }
        elseif ($id -match '^micro') { $category = 'microfluidics' }
        elseif ($id -match '^smart') { $category = 'smart_materials' }
        elseif ($id -match '^holo') { $category = 'holographics' }
        elseif ($id -match '^farm') { $category = 'vertical_farming' }
        elseif ($id -match '^bci' -or $id -match 'brain' -or $id -match 'neural') { $category = 'bci_engineering' }
        
        # Generate a nice name
        $nameParts = $id.Split('_')
        $name = ''
        foreach ($part in $nameParts) {
            $name += $part.Substring(0,1).ToUpper() + $part.Substring(1) + ' '
        }
        $name = $name.Trim()
        
        $entry = "  { id: '$id', name: '$name', icon: '??', category: '$category', importPath: './machines/$file', importName: '$importName' }"
        $newEntries += $entry
    }
}

if ($newEntries.Count -gt 0) {
    $insertBlock = "
" + ($newEntries -join ",
") + "
];"
    $appjs = $appjs -replace '];\s*window\.ENGISIM_MACHINES', ($insertBlock + "

window.ENGISIM_MACHINES")
    
    # Just to make sure we replace the ending bracket correctly
    # If the regex replacement didn't work, we'll try a simpler approach
    if ($appjs -match [regex]::Escape($insertBlock)) {
        Set-Content 'app.js' $appjs -Encoding UTF8
        Write-Host "Successfully injected $($newEntries.Count) machines into app.js"
    } else {
        # Fallback replacement logic
        $lines = $appjs -split "
"
        $out = @()
        $added = $false
        foreach ($line in $lines) {
            if ($line -match '^\];' -and -not $added) {
                $out += "  ," + ($newEntries -join ",
  ")
                $out += "];"
                $added = $true
            } else {
                $out += $line
            }
        }
        Set-Content 'app.js' ($out -join "
") -Encoding UTF8
        Write-Host "Successfully injected $($newEntries.Count) machines into app.js via fallback"
    }
} else {
    Write-Host "No valid entries found to inject."
}
