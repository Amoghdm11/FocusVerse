@echo off
title FocusVerse // Production Local Preview
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   FOCUSVERSE // BUILDING PRODUCTION BUNDLE & PREVIEW
echo ============================================================
call npm run build
call npm run preview -- --port 4173 --host
pause
