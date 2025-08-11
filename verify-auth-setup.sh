#!/bin/bash

echo "🚀 Authentication System Setup Verification"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ In correct project directory"

# Check if .env.local exists and has required variables
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

echo "✅ .env.local file found"

# Check for required environment variables
if ! grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    exit 1
fi

if ! grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
    exit 1
fi

echo "✅ Environment variables configured"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Dependencies installed"

# Check if the auth setup SQL file exists
if [ ! -f "supabase/auth-setup.sql" ]; then
    echo "❌ Error: supabase/auth-setup.sql file not found"
    exit 1
fi

echo "✅ Database setup script found"

# Try to build the project
echo "🔨 Testing build..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please check your code for errors."
    echo "Run 'npm run build' to see detailed error messages."
    exit 1
fi

echo "✅ Project builds successfully"

echo ""
echo "🎉 Environment verification complete!"
echo ""
echo "Next steps:"
echo "1. Run the SQL script in Supabase (see DETAILED_SETUP_STEPS.md)"
echo "2. Configure Supabase authentication settings"
echo "3. Start development server: npm run dev"
echo "4. Test authentication flow at http://localhost:3000"
echo ""
echo "📖 See DETAILED_SETUP_STEPS.md for complete instructions"
