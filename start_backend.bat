@echo off
title AgriMate Backend Server (Port 5000)
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0backend"
echo ===================================================
echo   Starting AgriMate Express REST API...
echo ===================================================
call npm start
pause
