#!/bin/bash

echo "🔍 Checking Supabase Keys..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found"
    exit 1
fi

# Extract the JWT payload from the anon key
ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d'=' -f2)

if [ -z "$ANON_KEY" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"
    exit 1
fi

# Decode the JWT payload (middle part)
PAYLOAD=$(echo $ANON_KEY | cut -d'.' -f2)
# Add padding if needed
PADDED_PAYLOAD="${PAYLOAD}$(printf '%*s' $((4 - ${#PAYLOAD} % 4)) | tr ' ' '=')"

# Decode base64
DECODED=$(echo $PADDED_PAYLOAD | base64 -d 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ JWT Key Structure Valid"
    echo "Key Role: $(echo $DECODED | grep -o '"role":"[^"]*"' | cut -d':' -f2 | tr -d '"')"
    
    ROLE=$(echo $DECODED | grep -o '"role":"[^"]*"' | cut -d':' -f2 | tr -d '"')
    
    if [ "$ROLE" = "anon" ]; then
        echo "✅ Correct anon key detected"
    elif [ "$ROLE" = "service_role" ]; then
        echo "⚠️  WARNING: You're using a service_role key as anon key!"
        echo "   This might cause authentication issues."
        echo "   Please use the 'anon/public' key from Supabase dashboard."
    else
        echo "❓ Unknown role: $ROLE"
    fi
else
    echo "❌ Invalid JWT format"
fi
