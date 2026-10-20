@echo off
title FocusVerse // Production Local Preview
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js / npm was not found in PATH or at C:\Program Files\nodejs.
    echo Please ensure Node.js is installed from https://nodejs.org/ and restart your terminal.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo ============================================================
    echo   First run detected: Installing dependencies...
    echo ============================================================
    call npm install
)

echo ============================================================
echo   FOCUSVERSE // BUILDING PRODUCTION BUNDLE & PREVIEW
echo ============================================================
call npm run build
call npm run preview -- --port 4173 --host
pause
