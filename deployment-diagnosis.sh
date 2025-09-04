#!/bin/zsh

echo "🔍 COMPREHENSIVE DEPLOYMENT ISSUE DIAGNOSIS"
echo "============================================="

cd "/Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App"

echo "📂 Current directory: $(pwd)"
echo ""

# Step 1: Check if we can build locally first
echo "🔨 Step 1: Local Build Test"
echo "Running: npm run build"
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed - this needs to be fixed first"
    echo "Build errors above need to be resolved before deployment"
    exit 1
fi
echo ""

# Step 2: Check TypeScript compilation
echo "📋 Step 2: TypeScript Check"
echo "Running: npx tsc --noEmit"
npx tsc --noEmit
TS_STATUS=$?

if [ $TS_STATUS -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
else
    echo "❌ TypeScript errors found - these will block deployment"
fi
echo ""

# Step 3: Check ESLint
echo "🔍 Step 3: ESLint Check"
echo "Running: npx next lint"
npx next lint
LINT_STATUS=$?

if [ $LINT_STATUS -eq 0 ]; then
    echo "✅ ESLint check passed!"
else
    echo "⚠️ ESLint issues found - checking if they're deployment blockers..."
fi
echo ""

# Step 4: Check git status and commit issues
echo "📦 Step 4: Git Status Check"
echo "Current git status:"
git status --porcelain

echo ""
echo "Files to be committed:"
git diff --cached --name-only

echo ""
echo "Modified files not staged:"
git diff --name-only

echo ""
echo "Untracked files:"
git ls-files --others --exclude-standard
echo ""

# Step 5: Check environment variables
echo "🔧 Step 5: Environment Variables Check"
if [ -f ".env.local" ]; then
    echo "✅ .env.local file found"
    echo "Checking for required Supabase keys..."
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo "✅ Required environment variables present"
    else
        echo "❌ Missing required environment variables"
        echo "Need: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    fi
else
    echo "⚠️ No .env.local file found"
    echo "Environment variables might be missing for deployment"
fi
echo ""

# Step 6: Check package.json
echo "📋 Step 6: Package.json Check"
echo "Current scripts:"
grep -A 10 '"scripts"' package.json
echo ""

# Step 7: Check for common deployment blockers
echo "🚫 Step 7: Common Deployment Blocker Check"

# Check for console.logs (can cause warnings)
CONSOLE_LOGS=$(grep -r "console\." src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "Console statements found: $CONSOLE_LOGS"

# Check for any TODO comments
TODOS=$(grep -r "TODO\|FIXME\|XXX" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "TODO/FIXME comments found: $TODOS"

# Check file sizes
echo ""
echo "Checking large files that might cause issues:"
find . -type f -size +1M -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./out/*"
echo ""

# Step 8: Generate deployment-ready commands
echo "🚀 Step 8: Deployment Action Plan"
echo "================================="

if [ $BUILD_STATUS -eq 0 ] && [ $TS_STATUS -eq 0 ]; then
    echo "✅ Code is ready for deployment!"
    echo ""
    echo "Next steps to deploy:"
    echo "1. Commit and push changes:"
    echo "   git add -A"
    echo "   git commit -m 'Fix deployment issues and finalize authentication system'"
    echo "   git push origin main"
    echo ""
    echo "2. Deploy to Vercel:"
    echo "   npx vercel --prod"
    echo ""
    echo "3. Set environment variables in Vercel dashboard:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (if using server functions)"
    
else
    echo "❌ Issues need to be fixed before deployment:"
    
    if [ $BUILD_STATUS -ne 0 ]; then
        echo "- Fix build errors shown above"
    fi
    
    if [ $TS_STATUS -ne 0 ]; then
        echo "- Fix TypeScript compilation errors"
    fi
    
    echo ""
    echo "Run this script again after fixing issues."
fi

echo ""
echo "🏁 Diagnosis complete!"
