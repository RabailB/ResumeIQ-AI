@echo off
title ResumeIQ AI - Frontend Dev Server
color 0B

echo.
echo  ResumeIQ AI - Frontend (React + Vite)
echo  =======================================
echo.

cd /d "%~dp0frontend"

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Install npm packages if node_modules doesn't exist
if not exist "node_modules" (
    echo [INFO] Installing npm packages (first time setup)...
    npm install
    echo [OK] Packages installed.
) else (
    echo [OK] node_modules found. Skipping install.
)

echo.
echo [OK] Starting frontend on http://localhost:5173
echo [INFO] Make sure backend is running on http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server.
echo.

npm run dev

pause
