#!/bin/bash

# CORDIS Research Explorer - Vercel Deployment Script
# This script helps prepare your project for Vercel deployment

echo "🚀 CORDIS Research Explorer - Vercel Deployment"
echo "==============================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository found"
fi

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "🔗 Git remote 'origin' not found."
    echo "   Please set up your GitHub repository first:"
    echo ""
    echo "   1. Create a new repository on GitHub"
    echo "   2. Run: git remote add origin https://github.com/yourusername/cordis-research-explorer.git"
    echo "   3. Then run this script again"
    echo ""
    exit 1
else
    echo "✅ Git remote origin configured"
fi

# Check for required files
echo ""
echo "📋 Checking required files..."

required_files=("package.json" "next.config.ts" "src/app/page.tsx" "src/components/ProjectsSearchView.tsx")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo ""
    echo "❌ Missing required files. Please ensure all files are present."
    exit 1
fi

# Check environment variables
echo ""
echo "🔧 Checking environment variables..."

if [ -f ".env.local" ]; then
    echo "✅ .env.local found"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL configured"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
        exit 1
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configured"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
        exit 1
    fi
else
    echo "❌ .env.local not found"
    echo "   Please create .env.local with your Supabase credentials"
    exit 1
fi

# Test build
echo ""
echo "🏗️  Testing production build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Git operations
echo ""
echo "📤 Preparing Git commit..."

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "📝 Committing changes..."
    git commit -m "Prepare for Vercel deployment - $(date)"
    echo "✅ Changes committed"
fi

# Push to GitHub
echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Failed to push to GitHub. Please check your remote configuration."
    exit 1
fi

echo "✅ Code pushed to GitHub successfully!"

echo ""
echo "🎉 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your repository"
echo "5. Add environment variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "6. Deploy!"
echo ""
echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🚀 Happy deploying!"
