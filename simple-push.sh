#!/usr/bin/env bash
set -e

echo "Starting git operations..."

# Change to project directory
cd "/Users/mohan/Development/Projects/Mohan_research_app/Student-Research-Assistant-App"

# Add all files
git add .

# Commit with comprehensive message
git commit -m "Complete authentication system implementation

- Full authentication system with registration, login, password reset
- Search limit system (5 free searches per user)
- Modal-based authentication with theme support  
- User profiles, search history, bookmarks with RLS policies
- Fixed duplicate profile icons and dashboard issues
- TypeScript compilation clean - production ready
- Mobile responsive design across all components"

# Push to main branch
git push origin main

echo "Successfully pushed all changes to main branch!"
