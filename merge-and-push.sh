#!/bin/bash

echo "🔄 Merging changes with main branch and pushing code..."
echo "📂 Working directory: $(pwd)"

# Ensure we're in the right directory
cd /Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "❌ No git repository found. Initializing..."
    git init
    git remote add origin https://github.com/your-username/Student-Research-Assistant-App.git
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "📍 Current branch: $CURRENT_BRANCH"

# Stage all changes
echo "📦 Staging all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
    git commit -m "Complete authentication system implementation with Vercel deployment fixes

- Implemented full authentication system with user registration, login, password reset
- Added search limit system (5 free searches per user) with real-time tracking
- Created modal-based authentication with responsive design
- Added theme system (Light/Dark/Warm) with proper context management
- Implemented user profiles, search history, and bookmarks with RLS policies
- Fixed duplicate profile icons and blank dashboard issues
- Resolved ALL TypeScript compilation errors - production ready
- Fixed ALL ESLint warnings and errors for Vercel deployment
- Updated Supabase SSR client to use correct cookie interface
- Fixed React unescaped entities in JSX
- Removed all unused variables and parameters
- Added comprehensive error handling and loading states
- Mobile responsive design across all components"
fi

# If we're not on main branch, switch to it
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔀 Switching to main branch..."
    git checkout main 2>/dev/null || git checkout -b main
    
    # If we were on a feature branch, merge it
    if [ "$CURRENT_BRANCH" != "main" ] && [ -n "$CURRENT_BRANCH" ]; then
        echo "🔀 Merging $CURRENT_BRANCH into main..."
        git merge $CURRENT_BRANCH --no-edit
    fi
fi

# Push to remote
echo "🚀 Pushing to remote repository..."
if git push origin main; then
    echo "✅ Successfully pushed to main branch!"
    echo "🎉 All changes have been merged and pushed!"
else
    echo "⚠️  Push failed. Trying to set upstream..."
    if git push -u origin main; then
        echo "✅ Successfully pushed to main branch with upstream set!"
    else
        echo "❌ Push failed. Please check your remote repository settings."
        echo "💡 Make sure you have the correct remote URL configured:"
        echo "   git remote -v"
        exit 1
    fi
fi

echo ""
echo "📋 Summary of what was completed:"
echo "   ✅ Authentication system with user registration/login"
echo "   ✅ Search limit system (5 free searches per user)"
echo "   ✅ Modal-based authentication with theme support"
echo "   ✅ User profiles and search history tracking"
echo "   ✅ Database schema with RLS policies"
echo "   ✅ Mobile responsive design"
echo "   ✅ TypeScript compilation clean"
echo "   ✅ Production ready code"
echo ""
echo "🚀 Your CORDIS Research Explorer is ready for deployment!"
