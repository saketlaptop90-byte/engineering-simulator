$organicFile = "machines\organic.js"
$phase4File = "machines\organic_phase4.js"

$lines = Get-Content $organicFile
$startIdx = -1
$endIdx = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "const advancedReactionsList = \[") {
        $startIdx = $i
    }
    if ($startIdx -ne -1 -and $lines[$i] -match "];") {
        $endIdx = $i
        break
    }
}

$phase4List = @(
    "    `"Akiyama–Borono Mannich Reaction`", `"Alcaide–Dominguez Cyclization`", `"Anders–Gaßner Reaction`", `"Anschütz–Schmidt Rearrangement`", `"Aubé Lactam Rearrangement`",",
    "    `"Bäckvall–Moberg Oxidation`", `"Banik Cyclization`", `"Bannister–Hazeldine Reaction`", `"Barluenga–Fañanás Coupling`", `"Behrend Rearrangement`",",
    "    `"Belokon Alkylation`", `"Bergman–Sammes Cyclization`", `"Beyer Condensation`", `"Biehlmann Cyclization`", `"Boeckman Rearrangement`",",
    "    `"Boger–Diels–Alder Cyclization`", `"Bradsher Aromatization`", `"Brunner Imidazole Synthesis`", `"Caglioti Reaction`", `"Caple–Stevens Rearrangement`",",
    "    `"Carreira Asymmetric Addition`", `"Casiraghi Formylation`", `"Cheng–Yuan Cyclization`", `"Clive Rearrangement`", `"Cossy–Denis Cyclization`",",
    "    `"Crabbé Homologation Reaction`", `"Danheiser–Danishefsky Annulation`", `"Dax Inversion`", `"de Kimpe Aziridine Rearrangement`", `"DeShong Annulation`",",
    "    `"Donohoe Hydroxylation`", `"Doyle–Kirmse Sulfur Ylide Reaction`", `"Effenberger Annulation`", `"Enders Triazoline Formation`", `"Evans–Prunet Acetalization`",",
    "    `"Feringa–Minnaard Alkylation`", `"Ficini–Claisen Cyclization`", `"Fischer–Smith Cyclization`", `"Franck–Kondratyeva Rearrangement`", `"Fukuyama–Nozaki Coupling`",",
    "    `"Ganem–Boeckman Cyclization`", `"Gassman–Pfister Rearrangement`", `"Gevorgyan Cycloisomerization`", `"Gribble–Leese Indole Synthesis`", `"Hassner–Alexanian Cyclization`",",
    "    `"Hayashi–Ito Coupling`", `"Hegedus Cyclization`", `"Hilt Cobalt Cycloaddition`", `"Hodgson Cyclization`", `"Imamoto–Sato Olefination`",",
    "    `"Ito–Mukaiyama Reaction`", `"Kakiuchi Coupling`", `"Katsuki Oxidation`", `"Kende–Murai Cyclization`", `"Kraus–Pinnick Oxidation`",",
    "    `"Lautens Carbocyclization`", `"Ley–Oxidation Protocol`", `"MacMillan–List Aldol Reaction`", `"Marshall–Bartlett Reaction`", `"Meyers–Snieckus Annulation`",",
    "    `"Morken Catalytic Diboration`", `"Murahashi Amination`", `"Narasaka–Yamamoto Reduction`", `"Nicolaou Pyran Annulation`", `"Nishizawa Reduction`",",
    "    `"Oppolzer Aldol Reaction`", `"Padwa–Smolanoff Cyclization`", `"Pfaltz–Spindler Hydrogenation`", `"Ranu Reduction`", `"Rapoport Cyclization`",",
    "    `"Rawal Diels–Alder Reaction`", `"Rychnovsky–Evans Acetal Rearrangement`", `"Sakai Triazole Synthesis`", `"Schlosser–Van Leusen Olefination`", `"Shair Cyclization`",",
    "    `"Shibasaki–Matsunaga Catalysis`", `"Snieckus Directed Metalation`", `"Tius–Nazarov Cyclization`", `"Trost–Tsuji Allylation`", `"Utimoto Oxidative Cyclization`",",
    "    `"Wulff Cyclization`", `"Yadav Lactonization`", `"Yamamoto–Maruoka Aldol Reaction`", `"Zefirov Cyclization`", `"Ziegler–Bailey Condensation`""
)

# Rewrite organic_phase4.js
$newContent4 = @()
$newContent4 += $lines[0..$startIdx]
$newContent4 += $phase4List
$newContent4 += $lines[$endIdx..($lines.Length - 1)]

# Also replace the export and description
for ($i = 0; $i -lt $newContent4.Length; $i++) {
    if ($newContent4[$i] -match "export function createOrganicReactions") {
        $newContent4[$i] = $newContent4[$i] -replace "createOrganicReactions", "createOrganicPhase4"
    }
    if ($newContent4[$i] -match "description: 'Comprehensive Library of") {
        $newContent4[$i] = "    group, parts, description: 'Organic Reactions Phase 4 (85 Advanced Reactions).', quizQuestions,"
    }
}

$newContent4 | Set-Content $phase4File -Encoding UTF8

# Now rewrite organic.js to REMOVE those 85 from the array
# They were added at the very end of the array, so we can just drop the last 17 lines of the array before the ];
$organicKeepEndIdx = $endIdx - 17

$newContentOrg = @()
$newContentOrg += $lines[0..($organicKeepEndIdx - 1)]

# The line before the cutoff might end in a comma, let's fix it by stripping the comma if it exists on the new last line
$lastLine = $newContentOrg[$newContentOrg.Length - 1]
if ($lastLine.EndsWith(",")) {
    $newContentOrg[$newContentOrg.Length - 1] = $lastLine.Substring(0, $lastLine.Length - 1)
}

$newContentOrg += $lines[$endIdx..($lines.Length - 1)]
$newContentOrg | Set-Content $organicFile -Encoding UTF8

Write-Host "Done splitting!"
