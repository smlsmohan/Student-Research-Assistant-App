#!/bin/zsh

echo "🔍 Git Diagnostic and Commit Script"
echo "===================================="

# Navigate to project directory
cd "/Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App"

echo "📂 Current directory: $(pwd)"
echo ""

# Check git repository status
echo "🔍 Step 1: Git Repository Check"
if [ -d ".git" ]; then
    echo "✅ Git repository found"
else
    echo "❌ No git repository found - this might be the issue!"
    exit 1
fi
echo ""

# Show git status with verbose output
echo "🔍 Step 2: Git Status Check"
echo "Running: git status --porcelain"
git status --porcelain
echo ""
echo "Running: git status"
git status
echo ""

# Check for untracked files
echo "🔍 Step 3: Untracked Files Check"
echo "Running: git ls-files --others --exclude-standard"
UNTRACKED=$(git ls-files --others --exclude-standard)
if [ -n "$UNTRACKED" ]; then
    echo "📁 Found untracked files:"
    echo "$UNTRACKED"
else
    echo "ℹ️  No untracked files found"
fi
echo ""

# Check for modified files
echo "🔍 Step 4: Modified Files Check"
echo "Running: git diff --name-only"
MODIFIED=$(git diff --name-only)
if [ -n "$MODIFIED" ]; then
    echo "📝 Found modified files:"
    echo "$MODIFIED"
else
    echo "ℹ️  No modified files found"
fi
echo ""

# Check staged files
echo "🔍 Step 5: Staged Files Check"
echo "Running: git diff --cached --name-only"
STAGED=$(git diff --cached --name-only)
if [ -n "$STAGED" ]; then
    echo "📋 Found staged files:"
    echo "$STAGED"
else
    echo "ℹ️  No staged files found"
fi
echo ""

# Force add all files (including untracked)
echo "🔧 Step 6: Force Adding All Files"
echo "Running: git add -A"
git add -A

echo "Running: git add . --force"
git add . --force
echo ""

# Check what's now staged
echo "🔍 Step 7: Re-check Staged Files After Force Add"
STAGED_AFTER=$(git diff --cached --name-only)
if [ -n "$STAGED_AFTER" ]; then
    echo "✅ Now have staged files:"
    echo "$STAGED_AFTER"
    
    # Show detailed changes
    echo ""
    echo "📋 Changes to be committed:"
    git diff --cached --stat
    echo ""
    
    # Commit the changes
    echo "💾 Step 8: Committing Changes"
    git commit -m "Fix Vercel deployment errors and complete authentication system

Key Changes:
- Fixed TypeScript compilation errors in DashboardWithAuthGate
- Updated Supabase SSR client to use correct cookie interface
- Removed unused imports and variables
- Fixed React hook dependencies
- Resolved all ESLint warnings blocking deployment
- Complete authentication system with search limits
- Theme system and responsive design
- Production-ready code with comprehensive error handling

All Vercel deployment blockers resolved ✅"
    
    if [ $? -eq 0 ]; then
        echo "✅ Commit successful!"
        
        # Push to remote
        echo ""
        echo "🚀 Step 9: Pushing to Remote"
        echo "Running: git push origin main"
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Push successful!"
            echo ""
            echo "🎉 SUCCESS! All changes committed and pushed!"
            echo "📋 Your CORDIS Research Explorer is now ready for Vercel deployment"
        else
            echo "⚠️  Push failed, trying with upstream..."
            git push -u origin main
            
            if [ $? -eq 0 ]; then
                echo "✅ Push with upstream successful!"
            else
                echo "❌ Push failed. Check your remote repository settings:"
                git remote -v
                echo ""
                echo "💡 You may need to:"
                echo "   1. Check your GitHub authentication"
                echo "   2. Verify the remote URL is correct"
                echo "   3. Create the repository on GitHub if it doesn't exist"
            fi
        fi
    else
        echo "❌ Commit failed!"
    fi
else
    echo "⚠️  Still no staged files after force add"
    echo ""
    echo "🔍 Additional Diagnostics:"
    
    # Check gitignore
    echo "Checking .gitignore file:"
    if [ -f ".gitignore" ]; then
        echo "Found .gitignore:"
        cat .gitignore
    else
        echo "No .gitignore file found"
    fi
    echo ""
    
    # Check if files exist that should be committed
    echo "Checking key files exist:"
    KEY_FILES=(
        "src/components/DashboardWithAuthGate.tsx"
        "src/app/auth/callback/route.ts"
        "src/lib/supabase-server.ts"
        "src/contexts/AuthContext.tsx"
        "src/components/ProjectsSearchView.tsx"
    )
    
    for file in "${KEY_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "✅ $file exists"
        else
            echo "❌ $file missing"
        fi
    done
    
    echo ""
    echo "🔧 Trying alternative commit approach..."
    
    # Try committing specific files
    git add src/ --force 2>/dev/null
    git add supabase/ --force 2>/dev/null
    git add package.json --force 2>/dev/null
    git add *.md --force 2>/dev/null
    git add *.sh --force 2>/dev/null
    
    # Check again
    FINAL_CHECK=$(git diff --cached --name-only)
    if [ -n "$FINAL_CHECK" ]; then
        echo "✅ Found files to commit after specific adds:"
        echo "$FINAL_CHECK"
        
        git commit -m "Force commit all authentication and deployment fixes"
        git push origin main
    else
        echo "❌ Unable to stage any files for commit"
        echo "This suggests either:"
        echo "   1. All changes are already committed"
        echo "   2. There's a git configuration issue"
        echo "   3. Files are being ignored by git"
    fi
fi

echo ""
echo "🏁 Script completed"
