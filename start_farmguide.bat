@echo off
title Launch AgriMate Full-Stack
set "PATH=C:\Program Files\nodejs;%PATH%"

echo ========================================================
echo   🌾 Launching AgriMate Full-Stack Platform...
echo ========================================================

start "AgriMate Backend (Port 5000)" cmd /k "title AgriMate Backend && set "PATH=C:\Program Files\nodejs;%%PATH%%" && cd /d "%~dp0backend" && npm start"
timeout /t 2 /nobreak >nul
start "AgriMate Frontend (Port 5173)" cmd /k "title AgriMate Frontend && set "PATH=C:\Program Files\nodejs;%%PATH%%" && cd /d "%~dp0frontend" && npm run dev"

echo.
echo   Servers are launching in separate windows:
echo   - Backend REST API: http://localhost:5000/api/health
echo   - Frontend React:   http://localhost:5173
echo ========================================================
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
