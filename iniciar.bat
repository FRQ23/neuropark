@echo off
chcp 65001 >nul
title NeuroParque - Sistema de Gestión y Adecuación
color 0F

echo ========================================================
echo       NEUROPARQUE - ADECUACIÓN DE ESPACIOS INCLUSIVOS
echo ========================================================
echo.

:: 1. Detectar si Node.js está disponible en el PATH o en ubicaciones comunes de Windows
where node >nul 2>&1
if %errorlevel% equ 0 goto node_found

if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    goto node_found
)

if exist "%ProgramFiles%\nodejs\node.exe" (
    set "PATH=%ProgramFiles%\nodejs;%PATH%"
    goto node_found
)

if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
    goto node_found
)

echo [ERROR] No se encontró Node.js instalado en este equipo.
echo.
echo Para ejecutar NeuroParque necesitas tener instalado Node.js (v18 o superior).
echo Puedes descargarlo de forma gratuita y segura desde el sitio oficial:
echo   https://nodejs.org/
echo.
echo Una vez instalado, vuelve a hacer doble clic en este archivo.
echo.
pause
exit /b 1

:node_found
echo [OK] Node.js detectado:
node -v
echo.

:: 2. Ubicarse en la carpeta del proyecto
cd /d "%~dp0"

:: 3. Instalar dependencias si no existen
if not exist "node_modules\" (
    echo [INFO] Primera ejecución detectada: instalando dependencias con npm...
    echo Esto puede demorar 1 o 2 minutos dependiendo de tu conexión.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Hubo un problema al ejecutar npm install.
        echo Verifica tu conexión a internet y vuelve a intentar.
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas correctamente.
    echo.
)

:: 4. Abrir automáticamente el navegador predeterminado
echo [INFO] Iniciando el servidor local de NeuroParque...
echo [INFO] Se abrirá automáticamente tu navegador en: http://localhost:3000
echo.
echo Para detener el sistema en cualquier momento, presiona Ctrl + C en esta ventana.
echo ========================================================
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

:: 5. Iniciar servidor Vite
call npm run dev

pause
