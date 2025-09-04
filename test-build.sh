#!/bin/bash

echo "🧪 Testing TypeScript compilation and build..."

cd "/Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App"

# Run TypeScript check
echo "📋 Running TypeScript check..."
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo "✅ TypeScript check passed!"
else
    echo "❌ TypeScript check failed!"
    exit 1
fi

# Run ESLint
echo "📋 Running ESLint check..."
npx next lint

if [ $? -eq 0 ]; then
    echo "✅ ESLint check passed!"
else
    echo "❌ ESLint check failed!"
    exit 1
fi

# Run build
echo "📋 Running Next.js build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🎉 All checks passed! Ready for Vercel deployment."
else
    echo "❌ Build failed!"
    exit 1
fi
