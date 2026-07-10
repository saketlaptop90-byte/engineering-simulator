$lines = Get-Content index.html
$newlines = $lines[0..250] + $lines[418..($lines.Length-1)]
Set-Content index.html -Value $newlines -Encoding UTF8
