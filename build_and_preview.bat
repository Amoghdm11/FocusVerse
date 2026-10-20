@echo off
setlocal enabledelayedexpansion
title FocusVerse // Production Local Preview
cd /d "%~dp0"

echo ============================================================
echo   FOCUSVERSE // BUILDING PRODUCTION BUNDLE & PREVIEW
echo ============================================================

set "PATH=%~dp0node_modules\.bin;C:\Program Files\nodejs;%ProgramFiles%\nodejs;%PATH%"
set "PATHEXT=.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC"

if not exist "%~dp0node_modules\vite\bin\vite.js" (
  echo [FOCUSVERSE] Dependencies not detected. Installing packages...
  call npm install
)

if exist "%~dp0node_modules\typescript\bin\tsc" (
  node "%~dp0node_modules\typescript\bin\tsc"
) else (
  call npx tsc
)

if exist "%~dp0node_modules\vite\bin\vite.js" (
  node "%~dp0node_modules\vite\bin\vite.js" build
  node "%~dp0node_modules\vite\bin\vite.js" preview --port 4173 --host
) else (
  call npx vite build
  call npx vite preview --port 4173 --host
)

pause
