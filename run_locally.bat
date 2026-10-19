@echo off
title FocusVerse // Local Server
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   FOCUSVERSE // PIXEL-ARCADE PRODUCTIVITY PLATFORM
echo   Starting local dev server at http://localhost:5173/
echo ============================================================
call npm run dev -- --host
pause
