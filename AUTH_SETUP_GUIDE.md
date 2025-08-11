# Authentication Setup Guide

## 🎯 Current Status
✅ **AUTHENTICATION SYSTEM COMPLETE**:
- Complete auth components (LoginForm, RegisterForm, UserProfile, UserMenu)
- Protected routes and authentication context
- Theme-aware styling across all components
- TypeScript types and error handling
- **Forgot password functionality** with ResetPasswordForm
- **User bookmarks system** with BookmarksContext and BookmarksPage
- **Bookmark functionality** integrated into ProjectCard components

## 🚀 Features Implemented

### Authentication Features
- **User Registration**: Email/password with validation
- **User Login**: Secure authentication with session management  
- **User Profile**: Profile management with institution and research interests
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Forgot Password**: Email-based password reset flow
- **Password Reset**: Secure password update with token validation

### Bookmarks System
- **Save Projects**: Users can bookmark research projects
- **Bookmarks Page**: Dedicated page to view all saved projects
- **Search Bookmarks**: Filter saved projects by title, acronym, topics
- **Visual Indicators**: Clear bookmark status with icons
- **Database Integration**: Persistent storage with RLS policies

### UI/UX Features
- **Theme Integration**: All components work with Normal/Dark/Warm themes
- **Responsive Design**: Mobile-friendly authentication and bookmarks
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: User-friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📋 Remaining Setup Tasks

### 1. Database Setup
Run the SQL commands in `supabase/auth-setup.sql` in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard → Your Project → SQL Editor
# Copy and run the contents of supabase/auth-setup.sql
```

This will create:
- `user_profiles` table with RLS policies
- `user_bookmarks` table with RLS policies  
- Automatic profile creation trigger
- Proper indexes and constraints

### 2. Supabase Authentication Configuration

#### A. Enable Email Authentication
1. Go to Supabase Dashboard → Authentication → Settings
2. Ensure "Enable email confirmations" is configured as needed
3. Set up email templates under Authentication → Email Templates

#### B. Configure Site URL (Important!)
1. Go to Authentication → Settings
2. Set Site URL to: `http://localhost:3000` (development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/auth/verify-email`

#### C. Set up OAuth Providers (Optional)
1. Go to Authentication → Providers
2. Configure Google OAuth:
   - Enable Google provider
   - Add Client ID and Client Secret from Google Cloud Console
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

3. Configure GitHub OAuth:
   - Enable GitHub provider
   - Add Client ID and Client Secret from GitHub App
   - Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 3. Environment Variables
Update `.env.local` with additional variables if needed:

```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=https://bfbhbaipgbazdhghrjho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add if using OAuth
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Test Authentication Flow

#### A. Test User Registration
1. Navigate to `http://localhost:3000/auth/register`
2. Create a new account
3. Check email for verification (if enabled)
4. Verify profile creation in Supabase

#### B. Test User Login
1. Navigate to `http://localhost:3000/auth/login`
2. Login with created account
3. Verify redirect to dashboard
4. Test logout functionality

#### C. Test Protected Routes
1. Try accessing `http://localhost:3000/dashboard` without login
2. Should redirect to login page
3. After login, should access dashboard successfully

### 5. Additional Features to Implement

#### A. Forgot Password
```tsx
// Add to AuthContext
const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { error };
};
```

#### B. User Bookmarks Feature
- Implement bookmark/save functionality for projects
- Add bookmark management in user profile
- Create bookmark-filtered project views

#### C. Enhanced Profile Management
- Add profile picture upload to Supabase Storage
- Implement research interests tagging
- Add university/institution verification

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Check if user exists in Supabase auth.users table
   - Verify email confirmation if required

2. **"Row Level Security policy violation"**
   - Ensure RLS policies are created correctly
   - Check if user_profiles trigger is working

3. **Redirect issues**
   - Verify Site URL in Supabase settings
   - Check redirect URLs configuration

4. **Theme not applying**
   - Ensure ThemeProvider wraps AuthProvider
   - Check CSS variables are defined

## 🎨 Theme Integration Status
✅ All authentication components fully integrated with theme system:
- Normal theme (blue accents)
- Dark theme (same colors, dark backgrounds)  
- Warm theme (amber/orange accents)

## 📁 File Structure
```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── callback/route.ts
│   ├── bookmarks/page.tsx (new)
│   ├── dashboard/page.tsx (protected)
│   └── layout.tsx (with AuthProvider + BookmarksProvider)
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── UserProfile.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── UserMenu.tsx (with bookmarks link)
│   │   ├── ForgotPasswordForm.tsx (new)
│   │   └── ResetPasswordForm.tsx (new)
│   ├── ProjectCard.tsx (enhanced with bookmarks)
│   └── ui/ (form components)
├── contexts/
│   ├── AuthContext.tsx (with resetPassword)
│   └── BookmarksContext.tsx (new)
├── lib/
│   └── supabase-auth.ts
└── types/
    └── supabase.ts
```

## 🔧 Authentication Routes
- **`/auth/login`** - User login page
- **`/auth/register`** - User registration page  
- **`/auth/profile`** - Profile management (protected)
- **`/auth/forgot-password`** - Password reset request
- **`/auth/reset-password`** - Password reset (from email)
- **`/auth/verify-email`** - Email verification page
- **`/auth/callback`** - OAuth callback handler
- **`/dashboard`** - Protected dashboard page
- **`/bookmarks`** - User bookmarks page (protected)

## ✨ Next Steps After Setup
1. Run database setup SQL
2. Configure Supabase authentication settings
3. Test complete authentication flow
4. Implement user bookmarks feature
5. Add forgot password functionality
6. Set up OAuth providers (optional)
7. Deploy to production with proper environment variables
