#!/bin/bash

echo "🚀 Authentication System - Quick Verification"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ In correct project directory"

# Check if development server is running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Development server is running on port 3000"
else
    echo "⚠️  Development server not running. Start with: npm run dev"
fi

# Check environment variables
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "✅ Supabase URL configured"
else
    echo "❌ Supabase URL not found in .env.local"
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo "✅ Supabase anon key configured"
    
    # Check if it's the correct type of key
    ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2)
    if [ ! -z "$ANON_KEY" ]; then
        # Decode JWT to check role
        PAYLOAD=$(echo $ANON_KEY | cut -d'.' -f2)
        PADDED_PAYLOAD="${PAYLOAD}$(printf '%*s' $((4 - ${#PAYLOAD} % 4)) | tr ' ' '=')"
        DECODED=$(echo $PADDED_PAYLOAD | base64 -d 2>/dev/null)
        
        if echo $DECODED | grep -q '"role":"anon"'; then
            echo "✅ Correct anon key type detected"
        elif echo $DECODED | grep -q '"role":"service_role"'; then
            echo "⚠️  WARNING: Using service_role key instead of anon key"
            echo "   Please get the 'anon public' key from Supabase dashboard"
        else
            echo "❓ Could not determine key type"
        fi
    fi
else
    echo "❌ Supabase anon key not found in .env.local"
fi

# Check if key files exist
echo ""
echo "📁 Authentication files check:"
if [ -f "src/contexts/AuthContext.tsx" ]; then
    echo "✅ AuthContext.tsx exists"
else
    echo "❌ AuthContext.tsx missing"
fi

if [ -f "src/contexts/BookmarksContext.tsx" ]; then
    echo "✅ BookmarksContext.tsx exists"
else
    echo "❌ BookmarksContext.tsx missing"
fi

if [ -f "supabase/auth-setup.sql" ]; then
    echo "✅ Database setup script exists"
else
    echo "❌ auth-setup.sql missing"
fi

# Test URLs (if server is running)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo ""
    echo "🌐 Testing key URLs:"
    
    # Test main page
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo "✅ Main page (/) - Working"
    else
        echo "❌ Main page (/) - Not responding"
    fi
    
    # Test auth pages
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/login | grep -q "200"; then
        echo "✅ Login page - Working"
    else
        echo "❌ Login page - Not responding"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/auth/register | grep -q "200"; then
        echo "✅ Register page - Working"
    else
        echo "❌ Register page - Not responding"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard | grep -q "200"; then
        echo "✅ Dashboard page - Working (will redirect if not authenticated)"
    else
        echo "❌ Dashboard page - Not responding"
    fi
fi

echo ""
echo "🎯 Next Steps:"
echo "1. If anon key is wrong: Get correct key from Supabase dashboard"
echo "2. Run database setup: Execute supabase/auth-setup.sql in Supabase"
echo "3. Configure Supabase: Set redirect URLs in dashboard"
echo "4. Test authentication: Register → Login → Use bookmarks"
echo ""
echo "📖 See LOCALHOST_WORKING.md for detailed instructions"
