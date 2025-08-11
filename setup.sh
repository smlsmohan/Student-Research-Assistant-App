#!/bin/bash

# CORDIS Research Explorer Setup Script
# This script helps set up the application with your Supabase credentials

echo "🔬 CORDIS Research Explorer Setup"
echo "================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Set up environment variables
echo ""
echo "🔧 Setting up environment variables..."

if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
else
    echo "⚠️  .env.local already exists"
fi

echo ""
echo "📝 Please update .env.local with your Supabase credentials:"
echo ""
echo "   1. Go to your Supabase project dashboard"
echo "   2. Navigate to Settings > API"
echo "   3. Copy your Project URL and anon/public key"
echo "   4. Update .env.local with these values:"
echo ""
echo "      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
echo "      NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here"
echo ""

# Check if Supabase table exists
echo "📊 Make sure your Supabase database has the 'cordis_projects' table"
echo "   with the CORDIS data loaded. See the parent directory for the ETL pipeline."
echo ""

# Build the project
echo "🏗️  Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check your environment variables and try again."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🚀 Setup complete! To start the development server, run:"
echo ""
echo "   npm run dev"
echo ""
echo "   Then open http://localhost:3000 in your browser"
echo ""
echo "🎉 Happy exploring!"
