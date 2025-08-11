# 🚀 Authentication System - Detailed Setup Steps

## Step 1: Database Setup in Supabase (REQUIRED)

### 1.1 Access Supabase SQL Editor
1. Go to [supabase.com](https://supabase.com) and log into your account
2. Select your project: `bfbhbaipgbazdhghrjho`
3. In the left sidebar, click **"SQL Editor"**
4. Click **"New Query"**

### 1.2 Run Database Setup Script
1. Copy the entire contents of the file: `supabase/auth-setup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** button (or press Ctrl+Enter)
4. Verify you see success messages for:
   - Tables created: `user_profiles`, `user_bookmarks`
   - Policies created: RLS policies for both tables
   - Functions created: `update_updated_at_column`, `handle_new_user`
   - Triggers created: Auto profile creation

### 1.3 Verify Database Setup
After running the script, verify in Supabase:
1. Go to **"Table Editor"** in sidebar
2. You should see two new tables:
   - `user_profiles` (with columns: id, email, full_name, avatar_url, bio, university, research_interests, academic_level, created_at, updated_at)
   - `user_bookmarks` (with columns: id, user_id, project_id, created_at)

## Step 2: Configure Supabase Authentication Settings

### 2.1 Set Site URL
1. In Supabase dashboard, go to **"Authentication"** → **"Settings"**
2. Find **"Site URL"** field
3. Set it to: `http://localhost:3000` (for development)
4. Click **"Save"**

### 2.2 Configure Redirect URLs
1. In the same settings page, find **"Redirect URLs"**
2. Add these URLs (one per line):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/dashboard
   http://localhost:3000/auth/verify-email
   http://localhost:3000/auth/reset-password
   ```
3. Click **"Save"**

### 2.3 Email Configuration (Optional but Recommended)
1. Go to **"Authentication"** → **"Settings"**
2. Scroll to **"Email"** section
3. **Option A - Use Supabase SMTP (Quick Setup):**
   - Leave settings as default
   - Supabase will handle email sending

4. **Option B - Custom SMTP (Production Recommended):**
   - Enable "Custom SMTP"
   - Add your SMTP settings (Gmail, SendGrid, etc.)

### 2.4 Configure Email Templates
1. Go to **"Authentication"** → **"Email Templates"**
2. Customize templates for:
   - **Confirm signup**: Welcome email for new users
   - **Magic Link**: For passwordless login (optional)
   - **Change Email Address**: When users change email
   - **Reset Password**: Password reset instructions

## Step 3: Test Authentication Flow

### 3.1 Start Development Server
```bash
cd /Users/mohan/Development/Projects/Mohan_Research/cordis-to-supabase/Student-Research-Assistant
npm run dev
```

### 3.2 Test User Registration
1. Open browser to: `http://localhost:3000/auth/register`
2. Fill out registration form:
   - Email: Use a real email you can access
   - Password: At least 6 characters
   - Full Name: Your name
3. Click **"Sign Up"**
4. Check for confirmation email (if email confirmation is enabled)

### 3.3 Test User Login
1. Go to: `http://localhost:3000/auth/login`
2. Enter the credentials you just created
3. Click **"Sign In"**
4. You should be redirected to: `http://localhost:3000/dashboard`

### 3.4 Test Profile Management
1. While logged in, click your profile avatar (top right)
2. Select **"Profile Settings"**
3. Update your profile information:
   - Institution/University
   - Research interests
   - Academic level
4. Click **"Update Profile"**

### 3.5 Test Bookmark Functionality
1. On the dashboard, find a research project
2. Click the bookmark icon (bookmark outline)
3. Icon should change to filled bookmark
4. Click your profile avatar → **"My Bookmarks"**
5. Verify the project appears in your bookmarks
6. Test search functionality in bookmarks page

### 3.6 Test Password Reset
1. Go to: `http://localhost:3000/auth/forgot-password`
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email for reset link
5. Click the link in email
6. Should redirect to reset password page
7. Enter new password and confirm
8. Try logging in with new password

## Step 4: Verify Database Data

### 4.1 Check User Profiles Table
1. In Supabase, go to **"Table Editor"** → **"user_profiles"**
2. You should see your user profile with:
   - Your user ID
   - Email address
   - Full name
   - Creation timestamp

### 4.2 Check User Bookmarks Table
1. Go to **"Table Editor"** → **"user_bookmarks"**
2. If you bookmarked projects, you should see entries with:
   - Your user ID
   - Project IDs you bookmarked
   - Creation timestamps

## Step 5: Optional OAuth Setup (Google/GitHub)

### 5.1 Configure Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://bfbhbaipgbazdhghrjho.supabase.co/auth/v1/callback`
6. In Supabase: **"Authentication"** → **"Providers"** → **"Google"**
7. Enable Google and add Client ID and Secret

### 5.2 Configure GitHub OAuth (Optional)
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set redirect URI: `https://bfbhbaipgbazdhghrjho.supabase.co/auth/v1/callback`
4. In Supabase: **"Authentication"** → **"Providers"** → **"GitHub"**
5. Enable GitHub and add Client ID and Secret

## Step 6: Production Deployment Preparation

### 6.1 Update Environment Variables for Production
When deploying to production (Vercel, Netlify, etc.):
```env
NEXT_PUBLIC_SUPABASE_URL=https://bfbhbaipgbazdhghrjho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6.2 Update Supabase Settings for Production
1. In Supabase **"Authentication"** → **"Settings"**
2. Update **"Site URL"** to your production domain
3. Add production redirect URLs:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/dashboard
   https://yourdomain.com/auth/verify-email
   https://yourdomain.com/auth/reset-password
   ```

## 🔍 Troubleshooting Common Issues

### Issue 1: "User not found" or Login Fails
**Solution:**
- Check if user exists in Supabase **"Authentication"** → **"Users"**
- Verify email confirmation if required
- Check browser console for error messages

### Issue 2: "Policy violation" Errors
**Solution:**
- Ensure RLS policies were created correctly
- Check if user_profiles table has the user's record
- Verify the handle_new_user trigger is working

### Issue 3: Bookmarks Not Saving
**Solution:**
- Check browser console for errors
- Verify user_bookmarks table exists
- Check if user is logged in (user object exists in AuthContext)

### Issue 4: Email Not Sending
**Solution:**
- Check Supabase **"Authentication"** → **"Settings"** → Email configuration
- For development, check Supabase logs in **"Logs"** section
- Verify SMTP settings if using custom email provider

### Issue 5: Redirect Issues After Login
**Solution:**
- Verify redirect URLs in Supabase settings
- Check that Site URL matches your domain
- Ensure ProtectedRoute component is working

## 🎯 Success Checklist

Mark each item as you complete it:

### Database Setup
- [ ] Ran auth-setup.sql successfully
- [ ] user_profiles table created
- [ ] user_bookmarks table created
- [ ] RLS policies active on both tables

### Supabase Configuration
- [ ] Site URL set to http://localhost:3000
- [ ] Redirect URLs configured
- [ ] Email settings configured

### Authentication Testing
- [ ] User registration works
- [ ] Email verification works (if enabled)
- [ ] User login works
- [ ] Protected routes redirect properly
- [ ] User profile updates save
- [ ] Password reset flow works

### Bookmarks Testing
- [ ] Can bookmark a project
- [ ] Bookmarks appear in /bookmarks page
- [ ] Can search bookmarks
- [ ] Can remove bookmarks
- [ ] Bookmarks persist after logout/login

### UI/UX Testing
- [ ] All themes work (Normal/Dark/Warm)
- [ ] Mobile responsive design works
- [ ] Loading states display properly
- [ ] Error messages are user-friendly

## 🎉 Completion

Once all checklist items are complete, your authentication system is fully functional and ready for production deployment!

**Need Help?** Check the browser console (F12) for detailed error messages, and verify your Supabase database logs if you encounter issues.
