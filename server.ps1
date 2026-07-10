# EngiSim Local Web Server (PowerShell)
# Run this script then open http://localhost:8080 in your browser

$port = 8080
$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.mp3'  = 'audio/mpeg'
    '.wav'  = 'audio/wav'
    '.mp4'  = 'video/mp4'
    '.webm' = 'video/webm'
    '.webp' = 'image/webp'
    '.glb'  = 'model/gltf-binary'
    '.gltf' = 'model/gltf+json'
}

try {
    $listener.Start()
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  EngiSim Local Web Server" -ForegroundColor White
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Serving from: $root" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Open in your browser:" -ForegroundColor Yellow
    Write-Host "  http://localhost:$port" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""

    # Auto-open browser
    Start-Process "http://localhost:$port"

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath -replace '/', '\')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = $mimeTypes[$ext]
            if (-not $contentType) { $contentType = 'application/octet-stream' }

            $response.ContentType = $contentType
            $response.StatusCode = 200

            # Add CORS headers for ES modules
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")

            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)

            $statusColor = "Green"
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.ContentLength64 = $msg.Length
            $response.ContentType = 'text/plain'
            $response.OutputStream.Write($msg, 0, $msg.Length)

            $statusColor = "Red"
        }

        Write-Host "[$($response.StatusCode)] $($request.HttpMethod) $urlPath" -ForegroundColor $statusColor
        $response.OutputStream.Close()
    }
} catch {
    if ($_.Exception.Message -match "canceled") {
        Write-Host "`nServer stopped." -ForegroundColor Yellow
    } else {
        Write-Host "Error: $_" -ForegroundColor Red
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
