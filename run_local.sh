#!/bin/bash
# Local development startup script for Clinic OS

set -e

echo "🏥 Clinic OS - Local Development Setup"
echo "======================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please update with your API keys."
fi

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -q -r requirements.txt

# Check if Docker is running (for Docker Compose)
if command -v docker-compose &> /dev/null; then
    echo ""
    echo "🐳 Docker available. Starting PostgreSQL and Redis..."
    docker-compose up -d postgres redis
    sleep 5
    echo "✅ Services started"
else
    echo ""
    echo "⚠️  Docker not found. Make sure PostgreSQL and Redis are running separately."
    echo "   PostgreSQL: postgresql://clinic_user:clinic_pass@localhost:5432/clinic_os"
    echo "   Redis: redis://localhost:6379/0"
fi

# Run migrations
echo ""
echo "🗄️  Running database migrations..."
alembic upgrade head

# Display startup info
echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting Clinic OS server..."
echo "================================"
echo ""
echo "📍 API running on: http://localhost:8000"
echo "📚 Docs on: http://localhost:8000/docs"
echo "🔍 ReDoc on: http://localhost:8000/redoc"
echo "❤️  Health check: http://localhost:8000/health"
echo ""
echo "To stop: Press Ctrl+C"
echo ""

# Start the server
uvicorn clinic_os.main:app --reload --host 0.0.0.0 --port 8000
