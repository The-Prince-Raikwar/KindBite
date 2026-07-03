#!/bin/bash

# KindBite Deployment Script
# This script helps deploy all three components of the KindBite application

echo "🚀 KindBite Deployment Script"
echo "============================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Backend Deployment
echo ""
echo "🔧 Setting up Backend..."
cd Backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "📝 Please edit Backend/.env with your actual values"
    else
        echo "❌ env.example not found. Please create .env file manually"
    fi
fi

# Build/Start backend
echo "🏗️  Building backend..."
npm run build

echo "✅ Backend setup complete"
cd ..

# Frontend Deployment
echo ""
echo "🎨 Setting up Frontend..."
cd Frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit Frontend/.env with your actual values"
    else
        echo "❌ .env.example not found. Please create .env file manually"
    fi
fi

# Build frontend
echo "🏗️  Building frontend..."
npm run build

echo "✅ Frontend setup complete"
cd ..

# Admin Deployment
echo ""
echo "👨‍💼 Setting up Admin Panel..."
cd admin

# Install dependencies
echo "📦 Installing admin dependencies..."
npm install

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Please edit admin/.env with your actual values"
    else
        echo "❌ .env.example not found. Please create .env file manually"
    fi
fi

# Build admin
echo "🏗️  Building admin panel..."
npm run build

echo "✅ Admin panel setup complete"
cd ..

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in the .env files"
echo "2. Set up MongoDB Atlas database"
echo "3. Set up Stripe account"
echo "4. Deploy to your hosting platform (Render, Vercel, etc.)"
echo ""
echo "For detailed deployment instructions, see DEPLOY.md"
echo ""
echo "Local development commands:"
echo "Backend:    cd Backend && npm run dev"
echo "Frontend:   cd Frontend && npm run dev"
echo "Admin:      cd admin && npm run dev"
