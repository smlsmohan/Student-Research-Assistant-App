#!/bin/bash

# Supabase Key Checker Script
# This script helps you verify you're using the correct Supabase keys

echo "🔑 Supabase Key Configuration Checker"
echo "====================================="
echo ""

# Check current .env.local
if [ -f ".env.local" ]; then
    echo "📄 Current .env.local configuration:"
    echo ""
    
    # Extract and display current keys (masked for security)
    url=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
    key=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local | cut -d'=' -f2)
    
    echo "URL: $url"
    echo "Key: ${key:0:20}...${key: -10}"
    echo ""
    
    # Check if it looks like a service role key (they're typically longer)
    if [[ ${#key} -gt 200 ]]; then
        echo "⚠️  WARNING: Your key appears to be a service_role key!"
        echo "   For security, you should use the anon/public key instead."
        echo ""
    else
        echo "✅ Key length looks correct for anon/public key"
        echo ""
    fi
else
    echo "❌ .env.local not found!"
    exit 1
fi

echo "🔧 How to get the correct Supabase keys:"
echo ""
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "2. Select your project: bfbhbaipgbazdhghrjho"
echo "3. Go to Settings → API"
echo "4. Copy these values:"
echo ""
echo "   ✅ Project URL: https://bfbhbaipgbazdhghrjho.supabase.co"
echo "   ✅ anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (shorter key)"
echo "   ❌ service_role key: NOT for frontend use!"
echo ""
echo "5. Update your .env.local with the anon/public key"
echo ""

echo "🔒 Security Best Practices:"
echo ""
echo "• NEVER use service_role key in frontend applications"
echo "• anon/public key is safe for client-side use"
echo "• Use Row Level Security (RLS) in Supabase for data protection"
echo "• Different keys for development/production environments"
echo ""

echo "📖 Need help? Check VERCEL_DEPLOYMENT.md for detailed instructions"
