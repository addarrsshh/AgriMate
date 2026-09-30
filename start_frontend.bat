@echo off
title AgriMate React Frontend (Port 5173)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0frontend"
echo ===================================================
echo   Starting AgriMate Vite React Server...
echo ===================================================
call npm run dev
pause
