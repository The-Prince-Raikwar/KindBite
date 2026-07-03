@echo off
REM KindBite Deployment Script for Windows
REM This script helps deploy all three components of the KindBite application

echo 🚀 KindBite Deployment Script
echo ============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Backend Deployment
echo.
echo 🔧 Setting up Backend...
cd Backend

REM Install dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Check if .env exists, if not copy from example
if not exist .env (
    echo ⚠️  .env file not found. Creating from env.example...
    if exist env.example (
        copy env.example .env
        echo 📝 Please edit Backend\.env with your actual values
    ) else (
        echo ❌ env.example not found. Please create .env file manually
    )
)

REM Build/Start backend
echo 🏗️  Building backend...
call npm run build

echo ✅ Backend setup complete
cd ..

REM Frontend Deployment
echo.
echo 🎨 Setting up Frontend...
cd Frontend

REM Install dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Check if .env exists, if not copy from example
if not exist .env (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo 📝 Please edit Frontend\.env with your actual values
    ) else (
        echo ❌ .env.example not found. Please create .env file manually
    )
)

REM Build frontend
echo 🏗️  Building frontend...
call npm run build

echo ✅ Frontend setup complete
cd ..

REM Admin Deployment
echo.
echo 👨‍💼 Setting up Admin Panel...
cd admin

REM Install dependencies
echo 📦 Installing admin dependencies...
call npm install

REM Check if .env exists, if not copy from example
if not exist .env (
    echo ⚠️  .env file not found. Creating from .env.example...
    if exist .env.example (
        copy .env.example .env
        echo 📝 Please edit admin\.env with your actual values
    ) else (
        echo ❌ .env.example not found. Please create .env file manually
    )
)

REM Build admin
echo 🏗️  Building admin panel...
call npm run build

echo ✅ Admin panel setup complete
cd ..

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next steps:
echo 1. Configure your environment variables in the .env files
echo 2. Set up MongoDB Atlas database
echo 3. Set up Stripe account
echo 4. Deploy to your hosting platform (Render, Vercel, etc.)
echo.
echo For detailed deployment instructions, see DEPLOY.md
echo.
echo Local development commands:
echo Backend:    cd Backend && npm run dev
echo Frontend:   cd Frontend && npm run dev
echo Admin:      cd admin && npm run dev
echo.
pause
