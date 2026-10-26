# ========================================================
#       NEUROPARQUE - ADECUACIÓN DE ESPACIOS INCLUSIVOS
# ========================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      NEUROPARQUE - ADECUACIÓN DE ESPACIOS INCLUSIVOS" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Detectar si Node.js está disponible
$nodeInPath = Get-Command node -ErrorAction SilentlyContinue

if (-not $nodeInPath) {
    $commonPaths = @(
        "$env:LOCALAPPDATA\Programs\nodejs",
        "$env:ProgramFiles\nodejs",
        "${env:ProgramFiles(x86)}\nodejs"
    )
    foreach ($p in $commonPaths) {
        if (Test-Path "$p\node.exe") {
            $env:PATH = "$p;$env:PATH"
            $nodeInPath = Get-Command node -ErrorAction SilentlyContinue
            break
        }
    }
}

if (-not $nodeInPath) {
    Write-Host "[ERROR] No se encontró Node.js instalado en el sistema." -ForegroundColor Red
    Write-Host ""
    Write-Host "Para ejecutar NeuroParque necesitas tener instalado Node.js (v18 o superior)."
    Write-Host "Por favor descárgalo gratis desde: https://nodejs.org/"
    Write-Host ""
    Read-Host "Presiona Enter para salir..."
    exit 1
}

$nodeVersion = node -v
Write-Host "[OK] Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

Set-Location -Path $PSScriptRoot

# 2. Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Primera ejecución detectada. Instalando dependencias con npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Ocurrió un error al instalar las dependencias con npm." -ForegroundColor Red
        Read-Host "Presiona Enter para salir..."
        exit 1
    }
    Write-Host "[OK] Dependencias instaladas con éxito." -ForegroundColor Green
    Write-Host ""
}

# 3. Abrir navegador en segundo plano e iniciar Vite
Write-Host "[INFO] Iniciando servidor en http://localhost:3000..." -ForegroundColor Cyan
Write-Host "[INFO] Abriendo navegador predeterminado..." -ForegroundColor Cyan
Start-Process -FilePath "powershell" -ArgumentList "-NoProfile -Command Start-Sleep -Seconds 2; Start-Process http://localhost:3000" -WindowStyle Hidden

npm run dev
