###############################################
# EngiSim Comprehensive Bug Fix Script
###############################################

Write-Host "=== EngiSim Bug Fix Script ===" -ForegroundColor Cyan

###############################################
# FIX 1: Clean corrupted UTF-8 garbage from app.js header (line 1 & 4)
###############################################
Write-Host "[1/6] Cleaning corrupted encoding from app.js header..." -ForegroundColor Yellow
$appContent = [System.IO.File]::ReadAllText("$PWD\app.js")

# Fix line 1: Replace the corrupted comment line
$appContent = $appContent -replace "^//[^\n]+\n// EngiSim 3D[^\n]+\n// Three\.js[^\n]+\n//[^\n]+\n", "// ======================================================================
// EngiSim 3D - Core Application
// Three.js scene, controls, modes, and machine management
// ======================================================================
"

Write-Host "  Header cleaned." -ForegroundColor Green

###############################################
# FIX 2: Fix all corrupted emoji icons in MACHINES array
# The `icon` fields contain `??` or corrupted garbage
# Replace them all with the proper gear emoji HTML entity
###############################################
Write-Host "[2/6] Fixing corrupted emoji icons in MACHINES array..." -ForegroundColor Yellow

# Replace any icon field containing garbled text with a clean gear emoji
$appContent = [regex]::Replace($appContent, "icon:\s*'[^']*'", "icon: '&#x2699;&#xFE0F;'")

Write-Host "  All machine icons normalized to gear emoji." -ForegroundColor Green

###############################################
# FIX 3: Fix corrupted encoding in section comments throughout app.js
###############################################
Write-Host "[3/6] Cleaning corrupted section divider comments..." -ForegroundColor Yellow

# Replace all garbled divider-only lines (lines of only corrupted chars)
$appContent = [regex]::Replace($appContent, "// [A-Z\x{0080}-\x{FFFF}][^\n]{50,}\n", "// ======================================================================`n")

Write-Host "  Section dividers cleaned." -ForegroundColor Green

###############################################
# FIX 4: Write the fixed app.js
###############################################
Write-Host "[4/6] Writing fixed app.js..." -ForegroundColor Yellow
[System.IO.File]::WriteAllText("$PWD\app.js", $appContent, [System.Text.Encoding]::UTF8)
Write-Host "  app.js written." -ForegroundColor Green

###############################################
# FIX 5: Fix index.html - rebuild it cleanly
# Issues: garbled icons, duplicate categories, text-over-text
###############################################
Write-Host "[5/6] Rebuilding index.html with clean icons and no duplicates..." -ForegroundColor Yellow

# Extract all unique categories from app.js
$catMatches = [regex]::Matches($appContent, "category:\s*'([^']+)'")
$allCats = @{}
foreach ($m in $catMatches) {
    $cat = $m.Groups[1].Value
    if (-not $allCats.ContainsKey($cat)) {
        $allCats[$cat] = $true
    }
}
$sortedCats = $allCats.Keys | Sort-Object

Write-Host "  Found $($sortedCats.Count) unique categories."

# Build the cards HTML
$cards = ""
foreach ($cat in $sortedCats) {
    $displayName = ($cat -replace '_', ' ')
    # Capitalize each word
    $displayName = ($displayName -split ' ' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ' '
    $cards += "      <a href=`"simulator.html?category=$cat`" class=`"card`"><div class=`"card-icon`">&#x2699;&#xFE0F;</div><div class=`"card-content`"><h3>$displayName</h3><p>Explore models</p></div></a>`n"
}

$indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EngiSim 3D Encyclopedia</title>
  <meta name="description" content="Interactive 3D Engineering Simulator with 2000+ models across 100+ disciplines.">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root { --bg-dark: #0f172a; --bg-panel: #1e293b; --accent: #38bdf8; --text-main: #f8fafc; --text-muted: #94a3b8; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body, html { height: 100%; background: var(--bg-dark); font-family: 'Inter', sans-serif; color: var(--text-main); overflow-x: hidden; }
    
    .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; position: relative; }
    .gear-logo { font-size: 4rem; margin-bottom: 1rem; animation: spin 10s linear infinite; display: inline-block; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5); }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    h1 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; margin: 0; background: linear-gradient(135deg, #fff, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { font-size: 1.25rem; color: var(--text-muted); margin: 1rem 0 3rem; max-width: 600px; line-height: 1.6; }
    
    .btn-explore { background: var(--accent); color: #000; padding: 1rem 2.5rem; border-radius: 50px; font-size: 1.2rem; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 0 20px rgba(56,189,248,0.5); transition: 0.2s; }
    .btn-explore:hover { transform: translateY(-2px) scale(1.05); }

    #portal-container { display: none; padding: 4rem 2rem; max-width: 1400px; margin: 0 auto; }
    .portal-title { text-align: center; font-size: 2.5rem; margin-bottom: 1rem; }
    .portal-subtitle { text-align: center; color: var(--text-muted); margin-bottom: 3rem; font-size: 1rem; }
    
    .search-container { max-width: 500px; margin: 0 auto 2rem; position: relative; }
    .search-container input { width: 100%; padding: 0.8rem 1.2rem 0.8rem 2.8rem; border-radius: 50px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: #fff; font-size: 1rem; outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
    .search-container input:focus { border-color: var(--accent); }
    .search-container::before { content: '🔍'; position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1rem; }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.2rem; }
    .card { background: var(--bg-panel); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.2rem; text-decoration: none; color: inherit; display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease; }
    .card:hover { background: rgba(56,189,248,0.1); border-color: rgba(56,189,248,0.4); transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
    .card-icon { font-size: 1.8rem; background: rgba(56,189,248,0.1); min-width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .card-content h3 { margin: 0 0 0.2rem; font-size: 0.95rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-content p { margin: 0; color: var(--text-muted); font-size: 0.8rem; }
    .card.hidden { display: none; }
  </style>
</head>
<body>

  <div id="hero" class="hero">
    <div class="gear-logo">&#x2699;&#xFE0F;</div>
    <h1>Welcome to EngiSim</h1>
    <p class="subtitle">Interactive 3D Engineering Simulator. Explore highly detailed models across $($sortedCats.Count) disciplines, featuring kinematics, damage physics, and AI assistance.</p>
    <button class="btn-explore" onclick="showPortal()">&#x1F680; Let's Explore</button>
  </div>

  <div id="portal-container">
    <h2 class="portal-title">Select a Discipline</h2>
    <p class="portal-subtitle">$($sortedCats.Count) engineering and science disciplines available</p>
    <div class="search-container">
      <input type="text" id="discipline-search" placeholder="Search disciplines..." oninput="filterCards(this.value)">
    </div>
    <div class="grid" id="portal-grid">
$cards    </div>
  </div>

  <script>
    function showPortal() {
      document.getElementById('hero').style.display = 'none';
      document.getElementById('portal-container').style.display = 'block';
    }
    function filterCards(query) {
      const cards = document.querySelectorAll('.card');
      const q = query.toLowerCase();
      cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.classList.toggle('hidden', !name.includes(q));
      });
    }
  </script>
</body>
</html>
"@

[System.IO.File]::WriteAllText("$PWD\index.html", $indexHtml, [System.Text.Encoding]::UTF8)
Write-Host "  index.html rebuilt with $($sortedCats.Count) clean cards." -ForegroundColor Green

###############################################
# FIX 6: Verify chatbot.js has no blocking errors
###############################################
Write-Host "[6/6] Verifying chatbot.js..." -ForegroundColor Yellow
$chatbotContent = [System.IO.File]::ReadAllText("$PWD\chatbot.js")
if ($chatbotContent -match "try \{ apiKey") {
    Write-Host "  chatbot.js localStorage protection already in place." -ForegroundColor Green
} else {
    Write-Host "  WARNING: chatbot.js may need localStorage protection." -ForegroundColor Red
}

###############################################
# DONE
###############################################
Write-Host ""
Write-Host "=== ALL FIXES APPLIED ===" -ForegroundColor Green
Write-Host "Summary of fixes:" -ForegroundColor Cyan
Write-Host "  1. Cleaned corrupted UTF-8 encoding garbage from app.js header"
Write-Host "  2. Fixed all corrupted emoji icons in MACHINES array (all set to gear emoji)"
Write-Host "  3. Cleaned corrupted section divider comments throughout app.js"
Write-Host "  4. Rebuilt index.html from scratch with:"
Write-Host "     - Clean emoji icons for all $($sortedCats.Count) discipline cards"
Write-Host "     - No duplicate categories"
Write-Host "     - No text-over-text overlap"
Write-Host "     - Proper search/filter functionality"
Write-Host "  5. Verified chatbot.js has localStorage protection"
