@echo off
REM Serve this folder on port 8766 and open the home page.
cd /d "%~dp0"
netstat -ano | findstr ":8766" >nul 2>&1
if errorlevel 1 (
  start "ShellPig Shelf Server 8766" /min python -m http.server 8766
  timeout /t 1 /nobreak >nul
)
start "" "http://localhost:8766/index.html"
