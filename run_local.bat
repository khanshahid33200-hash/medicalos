@echo off
REM Local development startup script for Clinic OS (Windows)

setlocal enabledelayedexpansion

echo.
echo 🏥 Clinic OS - Local Development Setup
echo ======================================

REM Check if .env exists
if not exist .env (
    echo 📋 Creating .env from .env.example...
    copy .env.example .env
    echo ✅ .env created. Please update with your API keys.
)

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔌 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -q -r requirements.txt

REM Check if Docker is available
where docker-compose >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo 🐳 Docker available. Starting PostgreSQL and Redis...
    docker-compose up -d postgres redis
    timeout /t 5 /nobreak
    echo ✅ Services started
) else (
    echo.
    echo ⚠️  Docker not found. Make sure PostgreSQL and Redis are running separately.
    echo    PostgreSQL: postgresql://clinic_user:clinic_pass@localhost:5432/clinic_os
    echo    Redis: redis://localhost:6379/0
)

REM Run migrations
echo.
echo 🗄️  Running database migrations...
alembic upgrade head

REM Display startup info
echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting Clinic OS server...
echo ================================
echo.
echo 📍 API running on: http://localhost:8000
echo 📚 Docs on: http://localhost:8000/docs
echo 🔍 ReDoc on: http://localhost:8000/redoc
echo ❤️  Health check: http://localhost:8000/health
echo.
echo To stop: Press Ctrl+C
echo.

REM Start the server
uvicorn clinic_os.main:app --reload --host 0.0.0.0 --port 8000
