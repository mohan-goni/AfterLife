#!/bin/bash

# This script automates the setup process for the EternalLegacy application.
# It sets up the backend (Python Flask) and frontend (React Vite) environments.

echo "======================================"
echo " EternalLegacy Application Setup Script "
echo "======================================"
echo ""

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Backend Setup ---
echo "[INFO] Setting up backend..."
if [ ! -d "eternal-legacy-backend" ]; then
    echo "[ERROR] eternal-legacy-backend directory not found. Please ensure you are in the project root."
    exit 1
fi
cd eternal-legacy-backend

echo "[INFO] Creating/activating Python virtual environment..."
if [ ! -d "venv" ]; then
    echo "[INFO] No virtual environment found. Creating one..."
    python3 -m venv venv # Use python3 explicitly for broader compatibility
fi
source venv/bin/activate

echo "[INFO] Installing Python dependencies from requirements.txt..."
pip install -r requirements.txt

echo "[INFO] Checking backend .env file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "[INFO] .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo ""
        echo "[IMPORTANT] Backend .env file created from .env.example."
        echo "            Please review and update eternal-legacy-backend/.env with your actual"
        echo "            database credentials, strong SECRET_KEY, JWT_SECRET_KEY,"
        echo "            and any necessary third-party API keys for backend services."
        echo "            You can generate secure keys using: python -c 'import secrets; print(secrets.token_hex(32))'"
        echo ""
    else
        echo "[WARNING] .env.example not found in backend. Skipping .env creation."
        echo "          Please ensure your backend environment variables are configured manually."
    fi
fi

echo "[INFO] Running database migrations (flask db upgrade)..."
# Ensure Flask app can be found. If main.py is in src, this might need FLASK_APP=src.main
export FLASK_APP=src.main 
flask db upgrade

echo "[INFO] Backend setup complete."
cd .. # Return to project root

echo ""
# --- Frontend Setup ---
echo "[INFO] Setting up frontend..."
if [ ! -d "eternal-legacy-frontend" ]; then
    echo "[ERROR] eternal-legacy-frontend directory not found."
    exit 1
fi
cd eternal-legacy-frontend

echo "[INFO] Installing Node.js dependencies using npm install..."
npm install

echo "[INFO] Checking frontend .env file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "[INFO] Frontend .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo ""
        echo "[IMPORTANT] Frontend .env file created from .env.example."
        echo "            Please review and update eternal-legacy-frontend/.env if necessary"
        echo "            (e.g., REACT_APP_API_URL if backend runs on a different port)."
        echo ""
    else
        echo "[INFO] Frontend .env.example not found. Skipping .env creation."
        echo "         Ensure your frontend environment variables (like REACT_APP_API_URL) are set if needed."
    fi
fi

echo "[INFO] Frontend setup complete."
cd .. # Return to project root

echo ""
echo "======================================"
echo " Setup Complete! "
echo "======================================"
echo ""
echo "To run the application:"
echo ""
echo "1. Ensure your PostgreSQL database server is running and accessible with the"
echo "   credentials specified in eternal-legacy-backend/.env."
echo ""
echo "2. Start the backend server:"
echo "   cd eternal-legacy-backend"
echo "   source venv/bin/activate"
echo "   flask run --host=0.0.0.0 --port=5000  (or your configured port)"
echo "   (The backend will typically run on http://localhost:5000)"
echo ""
echo "3. In a NEW terminal, start the frontend development server:"
echo "   cd eternal-legacy-frontend"
echo "   npm run dev"
echo "   (The frontend will typically run on http://localhost:5173 or another port shown in the output)"
echo ""
echo "--------------------------------------------------------------------------------"
echo "IMPORTANT: After this script is created, make it executable by running:"
echo "chmod +x setup_and_run.sh"
echo "--------------------------------------------------------------------------------"
echo ""
