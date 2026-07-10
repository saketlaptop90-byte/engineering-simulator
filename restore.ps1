$content = Get-Content app.js -Raw

if (-not ($content -match "chatbot\.js")) {
    $content = $content -replace "import \* as THREE from 'three';", "import * as THREE from 'three';
import { initChatbot, loadCustomModels } from './chatbot.js';"
}

if (-not ($content -match "initChatbot\(\)")) {
    $replacement = "  updateLoader(80, 'Setting up interface...');
  try { await loadCustomModels(MACHINES); } catch(e) { console.warn('Chatbot error:', e); }
  try { initChatbot(); } catch(e) { console.warn('Chatbot UI error:', e); }
  setupUI();"
    $content = $content -replace "updateLoader\(80,\s*'Setting up interface\.\.\.'\);?
\s*setupUI\(\);", $replacement
}

$files = Get-ChildItem 'machines/*.js' | Select-Object -ExpandProperty Name
$missingFiles = @()
foreach ($file in $files) {
    if (-not ($content -match [regex]::Escape($file))) {
        $missingFiles += $file
    }
}

Write-Host "Found $($missingFiles.Count) missing machines..."

$newEntries = @()
$categoriesToMap = @{}

foreach ($file in $missingFiles) {
    $code = Get-Content "machines/$file" -Raw
    if ($code -match "export function ([A-Za-z0-9_]+)\(") {
        $func = $Matches[1]
        $id = $file -replace '\.js$', ''
        
        $cat = 'misc'
        if ($id -match '^bio') { $cat = 'biology' }
        elseif ($id -match '^organic') { $cat = 'organic_chemistry' }
        elseif ($id -match '^microbio') { $cat = 'microbiology' }
        elseif ($id -match '^synthetic_bio') { $cat = 'synthetic_biology' }
        elseif ($id -match '^genetics') { $cat = 'genetics' }
        elseif ($id -match '^immuno') { $cat = 'immunology' }
        elseif ($id -match '^biochem') { $cat = 'biochemistry' }
        elseif ($id -match '^chem') { $cat = 'chemistry' }
        elseif ($id -match '^neuro') { $cat = 'neuroscience' }
        elseif ($id -match '^biotech') { $cat = 'biotechnology' }
        elseif ($id -match '^marine') { $cat = 'marine_biology' }
        elseif ($id -match '^eco') { $cat = 'ecology' }
        elseif ($id -match '^paleo') { $cat = 'paleontology' }
        
        $nameParts = $id -split '_'
        $name = ''
        foreach ($part in $nameParts) {
            $name += $part.Substring(0,1).ToUpper() + $part.Substring(1) + ' '
        }
        $name = $name.Trim()
        
        $newEntries += "  { id: '$id', name: '$name', icon: '&#x2699;&#xFE0F;', category: '$cat', importPath: './machines/$file', importName: '$func' }"
        $categoriesToMap[$cat] = "machine-list-$cat"
    }
}

if ($newEntries.Count -gt 0) {
    $insertBlock = "
" + ($newEntries -join ",
") + "
];"
    $content = $content -replace "\];\s*window\.ENGISIM_MACHINES", "$insertBlock
window.ENGISIM_MACHINES"
    
    $catEntries = @()
    foreach ($k in $categoriesToMap.Keys) {
        if (-not ($content -match "`${k}:\s*'machine-list-$k'")) {
            $catEntries += "  `${k}: 'machine-list-$k'"
        }
    }
    
    if ($catEntries.Count -gt 0) {
        $catBlock = "
" + ($catEntries -join ",
") + "
};"
        $content = $content -replace "\};\s*function updateLoader", "$catBlock

function updateLoader"
    }
}

Set-Content app.js $content -Encoding UTF8
Write-Host "Done restoring."

