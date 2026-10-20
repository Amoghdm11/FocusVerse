@echo off
title FocusVerse // Local Server
cd /d "%~dp0"

echo ============================================================
echo   FOCUSVERSE // PIXEL-ARCADE PRODUCTIVITY PLATFORM
echo   Starting local dev server at http://localhost:5173/
echo ============================================================

:: 1. Ensure Node.js and local node_modules bin are in PATH
set "PATH=%~dp0node_modules\.bin;C:\Program Files\nodejs;%ProgramFiles%\nodejs;%PATH%"
set "PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"

:: 2. Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js not found in PATH or standard installation directory.
  echo Please make sure Node.js is installed from https://nodejs.org/
  pause
  exit /b 1
)

:: 3. Check if dependencies are installed
if not exist "%~dp0node_modules\vite\bin\vite.js" (
  echo [FOCUSVERSE] Dependencies not detected. Installing packages...
  call npm install
  if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies. Please run 'npm install' manually.
    pause
    exit /b 1
  )
)

:: 4. Free port 5173 if currently occupied by an orphaned process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
  echo [FOCUSVERSE] Clearing busy port 5173 PID %%a
  taskkill /f /pid %%a >nul 2>nul
)

:: 5. Launch Vite directly with Node.js
if exist "%~dp0node_modules\vite\bin\vite.js" (
  node "%~dp0node_modules\vite\bin\vite.js" --host --port 5173
) else (
  call npx vite --host --port 5173
)

if %errorlevel% neq 0 (
  echo [ERROR] Dev server stopped with exit code %errorlevel%.
)

pause
