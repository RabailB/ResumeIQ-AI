@echo off
title ResumeIQ AI - Backend Server
color 0A

echo.
echo  ██████╗ ███████╗███████╗██╗   ██╗███╗   ███╗███████╗██╗ ██████╗
echo  ██╔══██╗██╔════╝██╔════╝██║   ██║████╗ ████║██╔════╝██║██╔═══██╗
echo  ██████╔╝█████╗  ███████╗██║   ██║██╔████╔██║█████╗  ██║██║   ██║
echo  ██╔══██╗██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝  ██║██║▄▄ ██║
echo  ██║  ██║███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗██║╚██████╔╝
echo  ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝╚═╝ ╚══▀▀═╝
echo.
echo  Smart Resume Analyzer - Backend Server
echo  =========================================
echo.

cd /d "%~dp0backend"

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.9+ from https://python.org
    pause
    exit /b 1
)

:: Check if virtual environment exists
if not exist "venv" (
    echo [INFO] Creating virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created.
)

:: Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

:: Install dependencies
echo [INFO] Installing dependencies...
pip install -r requirements.txt --quiet
echo [OK] Dependencies installed.

:: Run setup if models don't exist
if not exist "ml\models\classifier.pkl" (
    echo [INFO] First run detected. Running setup (this may take a few minutes)...
    echo [INFO] Generating training data...
    echo [INFO] Training ML model...
    python setup.py
    echo [OK] Setup complete.
) else (
    echo [OK] ML models found. Skipping setup.
)

echo.
echo [OK] Starting Flask backend on http://localhost:5000
echo [INFO] Press Ctrl+C to stop the server.
echo.

python run.py

pause
