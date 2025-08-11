#!/bin/bash

# Quick deployment script for Student Research Assistant App (No Auth Version)
echo "🚀 Quick Deployment Script for Student Research Assistant App"
echo "📦 Deploying without authentication for immediate launch..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Build the project to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo "📋 Don't forget to set these environment variables in Vercel dashboard:"
echo "   NEXT_PUBLIC_SUPABASE_URL=https://bfbhbaipgbazdhghrjho.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYmhiYWlwZ2JhemRoZ2hyamhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzODI5NjIsImV4cCI6MjA2OTk1ODk2Mn0.7GD80L7vxTKlnRSPVdq0LDNDmedT6oM3kV6qFgMFAOQ"
