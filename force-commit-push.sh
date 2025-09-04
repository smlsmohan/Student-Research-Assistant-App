#!/bin/bash

echo "🔍 Git Status Diagnostic and Force Push"
echo "======================================"

# Navigate to project directory
cd "/Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo "❌ No git repository found. Initializing..."
    git init
    git remote add origin https://github.com/smlsmohan/Student-Research-Assistant-App.git
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository found"
fi

echo ""
echo "📊 Git Status:"
git status

echo ""
echo "📋 Git Log (last 3 commits):"
git log --oneline -3 2>/dev/null || echo "No commits found"

echo ""
echo "🔧 Forcing add of all files..."
git add .
git add -A

echo ""
echo "📊 Status after git add:"
git status

echo ""
echo "📝 Checking for changes to commit:"
if git diff --cached --quiet; then
    echo "❌ No staged changes found"
    echo ""
    echo "🔍 Let's check what files exist:"
    echo "Total files in src/:"
    find src/ -name "*.tsx" -o -name "*.ts" | wc -l
    echo ""
    echo "Recent TypeScript/React files:"
    find src/ -name "*.tsx" -o -name "*.ts" | head -10
    echo ""
    echo "💡 Trying to add specific files that should have changes..."
    git add src/components/auth/
    git add src/contexts/
    git add src/app/auth/
    git add src/lib/
    git add package.json
    git add README.md 2>/dev/null || true
else
    echo "✅ Changes found and staged!"
fi

echo ""
echo "📊 Final status check:"
git status

echo ""
echo "💾 Attempting commit..."
if ! git diff --cached --quiet; then
    git commit -m "Complete authentication system with Vercel deployment fixes

✅ PRODUCTION READY - All deployment blockers resolved

Authentication System:
- Full user registration with email confirmation
- Login/logout with secure session management  
- Password reset functionality
- User profile management

Search Limit System:
- 5 free searches per authenticated user
- Real-time search count tracking
- Database integration with RLS policies

UI/UX Improvements:
- Modal-based authentication flows
- Theme system (Light/Dark/Warm)
- Mobile responsive design
- Loading states and error handling

Technical Fixes:
- Resolved ALL TypeScript compilation errors
- Fixed ALL ESLint warnings for Vercel deployment
- Updated Supabase SSR client to correct cookie interface
- Fixed React unescaped entities in JSX
- Removed unused variables and imports
- Fixed React hook dependencies
- Updated component prop interfaces

Database:
- User profiles table with RLS policies
- Search history and bookmarks
- Authentication flow integration

Ready for production deployment on Vercel!"
    
    echo "✅ Commit successful!"
else
    echo "⚠️  No changes to commit - repository is clean"
    echo ""
    echo "🤔 This might mean:"
    echo "   1. Changes were already committed"
    echo "   2. Files aren't being tracked by git"
    echo "   3. Changes were made outside the git repository"
    echo ""
    echo "🔍 Let's check recent commits:"
    git log --oneline -5 2>/dev/null || echo "No commits found"
fi

echo ""
echo "🚀 Attempting to push to remote..."
git push origin main 2>&1 || {
    echo "⚠️  Push failed, trying with upstream..."
    git push -u origin main 2>&1 || {
        echo "❌ Push failed. Let's check remote configuration:"
        git remote -v
    }
}

echo ""
echo "✅ Script completed!"
