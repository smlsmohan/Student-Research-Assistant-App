# 🔐 Authentication System Setup Guide

## ✅ What's Been Implemented

The authentication system is now **COMPLETE** with the following features:

### 🚀 Core Authentication Features
- **User Registration** with email and password
- **User Login** with secure session management
- **Protected Routes** (Dashboard requires authentication)
- **User Menu** with profile info and search usage display
- **Search Limits** (5 free searches per user)
- **Search Tracking** (stores user search history)
- **Automatic Redirects** (unauthenticated users → login, authenticated users → dashboard)

### 📊 Search Limit System
- Each user gets **5 free searches**
- Search count is tracked in real-time
- Visual indicator shows remaining searches
- Search history is stored for each user
- After 5 searches, users are blocked from searching with clear messaging

### 🎨 UI Components
- **LoginForm**: Clean, responsive login interface
- **RegisterForm**: User registration with validation
- **UserMenu**: Dropdown showing user info and search usage
- **SearchLimitWarning**: Visual warnings about search limits
- **ProtectedRoute**: Automatic authentication checks

## 🛠 Setup Instructions

### 1. Environment Configuration

Update your `.env.local` file with your actual Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bfbhbaipgbazdhghrjho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**Get your keys from**: https://supabase.com/dashboard → Your Project → Settings → API

### 2. Database Setup

Run the SQL script in your Supabase dashboard:

1. Go to: https://supabase.com/dashboard
2. Select your project: `bfbhbaipgbazdhghrjho`
3. Navigate to: **SQL Editor** → **New Query**
4. Copy the entire contents of `supabase/auth-setup.sql`
5. Paste and click **Run**

This creates:
- `user_profiles` table (stores user information)
- `user_search_counts` table (tracks search usage)
- `user_search_history` table (stores search history)
- Row Level Security policies
- Automatic triggers for user creation

### 3. Supabase Configuration

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Click **Save**

## 🧪 Testing the System

### Test User Registration
1. Visit: `http://localhost:3000/auth/register`
2. Create an account with real email
3. Should redirect to login after success

### Test User Login
1. Visit: `http://localhost:3000/auth/login`
2. Login with created credentials
3. Should redirect to dashboard

### Test Search Limits
1. After logging in, perform 5 searches
2. Watch the search counter in the user menu
3. After 5 searches, search should be blocked

### Test Protected Routes
1. Logout from user menu
2. Try to visit: `http://localhost:3000/dashboard`
3. Should redirect to login page

## 🎯 How the Search Limit System Works

### For Authenticated Users:
1. **First Search**: Counter shows 1/5, search executes normally
2. **Subsequent Searches**: Counter increments, search history saved
3. **5th Search**: Counter shows 5/5, warning appears
4. **After 5 Searches**: Search blocked, error message shown

### Search Tracking:
- Every search query and filters are saved to `user_search_history`
- Search count is maintained in `user_search_counts`
- Real-time updates in the UI
- Visual progress bar in user menu

### Database Tables:
- **user_profiles**: Basic user information
- **user_search_counts**: Current search count per user
- **user_search_history**: Detailed log of all searches

## 🚪 Application Flow

```
Home Page (/) 
    ↓
Checks authentication
    ↓
If logged in → Dashboard
If not logged in → Login Page
    ↓
Login/Register
    ↓
Dashboard (Protected)
    ↓
Search with limits
```

## 🔧 Key Features

### Authentication Context
- Manages user state globally
- Handles login/logout/registration
- Tracks search count and limits
- Provides `canSearch` boolean

### Search Limit Logic
- Increments count on each search
- Saves search history to database
- Blocks searches after limit
- Visual feedback to users

### Database Security
- Row Level Security on all tables
- Users can only access their own data
- Automatic user profile creation
- Secure session management

## 🎉 Success Indicators

When everything is working correctly, you should see:

- ✅ Successful user registration and login
- ✅ Dashboard accessible only when authenticated
- ✅ User menu showing search count (X/5)
- ✅ Search limit warnings appearing
- ✅ Search blocking after 5 searches
- ✅ Smooth redirects between pages

## 🆘 Troubleshooting

### Common Issues:

1. **"User not found" error**: Check if user exists in Supabase Auth → Users
2. **Search not counting**: Verify database tables were created correctly
3. **Redirect loops**: Check Site URL in Supabase settings
4. **Database errors**: Ensure RLS policies are active

### Check Database:
1. Go to Supabase → Table Editor
2. Verify these tables exist:
   - `user_profiles`
   - `user_search_counts` 
   - `user_search_history`
3. Check if test user has entries in these tables

## 🚀 Next Steps

The authentication system is production-ready! You can now:

1. **Deploy to production** with proper environment variables
2. **Customize search limits** by modifying the limit (currently 5)
3. **Add payment integration** to allow unlimited searches
4. **Enhance user profiles** with additional fields
5. **Add email verification** if desired

---

**🎯 The system is complete and ready for use!** Users will now need to authenticate before accessing the research dashboard, and their search usage will be tracked and limited appropriately.
