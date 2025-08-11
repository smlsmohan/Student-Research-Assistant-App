# 📋 Authentication Setup Checklist

Copy this checklist and mark items as you complete them:

## Pre-Setup Verification
- [ ] Run `./verify-auth-setup.sh` to check environment
- [ ] Confirm development server starts: `npm run dev`
- [ ] Verify you can access: http://localhost:3000

## Database Setup (CRITICAL - Do This First!)
- [ ] Open Supabase dashboard: https://supabase.com
- [ ] Navigate to your project: `bfbhbaipgbazdhghrjho`
- [ ] Go to "SQL Editor" → "New Query"
- [ ] Copy entire contents of `supabase/auth-setup.sql`
- [ ] Paste into SQL Editor and click "Run"
- [ ] Verify success messages (no red errors)
- [ ] Check "Table Editor" - see `user_profiles` and `user_bookmarks` tables

## Supabase Authentication Configuration
- [ ] Go to "Authentication" → "Settings" in Supabase
- [ ] Set Site URL: `http://localhost:3000`
- [ ] Add Redirect URLs:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `http://localhost:3000/dashboard`
  - [ ] `http://localhost:3000/auth/verify-email`
  - [ ] `http://localhost:3000/auth/reset-password`
- [ ] Click "Save"

## Email Configuration (Optional)
- [ ] Stay in "Authentication" → "Settings"
- [ ] Configure email settings (use default or custom SMTP)
- [ ] Test email sending (optional)

## Test Authentication Flow

### User Registration
- [ ] Go to: http://localhost:3000/auth/register
- [ ] Create account with real email
- [ ] Check for confirmation email (if enabled)
- [ ] Complete email verification (if required)

### User Login
- [ ] Go to: http://localhost:3000/auth/login
- [ ] Login with created credentials
- [ ] Verify redirect to dashboard
- [ ] Check user menu appears (top right)

### Profile Management
- [ ] Click user avatar → "Profile Settings"
- [ ] Update profile information
- [ ] Save changes successfully
- [ ] Verify data persists after refresh

### Bookmark System
- [ ] Browse projects on dashboard
- [ ] Click bookmark icon on a project
- [ ] Icon changes to filled bookmark
- [ ] Click user avatar → "My Bookmarks"
- [ ] See bookmarked project in list
- [ ] Test search in bookmarks
- [ ] Remove bookmark (icon becomes outline)

### Password Reset
- [ ] Go to: http://localhost:3000/auth/forgot-password
- [ ] Enter your email
- [ ] Check email for reset link
- [ ] Click link and reset password
- [ ] Login with new password

### Protected Routes
- [ ] Logout from user menu
- [ ] Try to access: http://localhost:3000/dashboard
- [ ] Verify redirect to login page
- [ ] Login and verify access to dashboard

## Database Verification
- [ ] In Supabase "Table Editor" → "user_profiles"
- [ ] See your user record with correct data
- [ ] In "user_bookmarks" table
- [ ] See bookmark records if you bookmarked projects

## Theme Testing
- [ ] Test Normal theme (blue accents)
- [ ] Test Dark theme (dark backgrounds)
- [ ] Test Warm theme (amber accents)
- [ ] Verify all auth components look correct in each theme

## Mobile/Responsive Testing
- [ ] Test on mobile device or browser dev tools
- [ ] Verify login/register forms work on mobile
- [ ] Check dashboard and bookmarks page on mobile
- [ ] Ensure user menu works on small screens

## Error Handling Testing
- [ ] Try login with wrong password
- [ ] Try registration with existing email
- [ ] Check error messages are user-friendly
- [ ] Test bookmark while logged out
- [ ] Verify appropriate error handling

## Production Preparation (If Deploying)
- [ ] Update environment variables for production domain
- [ ] Update Supabase Site URL for production
- [ ] Add production redirect URLs to Supabase
- [ ] Test OAuth providers (if configured)

---

## 🆘 Having Issues?

### Check These First:
1. **Browser Console**: Open F12 and check for JavaScript errors
2. **Supabase Logs**: Check "Logs" section in Supabase dashboard
3. **Network Tab**: Look for failed API requests (401, 403, 500 errors)
4. **Database**: Verify tables exist and have correct RLS policies

### Common Fixes:
- **Login fails**: Check if user exists in Supabase "Authentication" → "Users"
- **Bookmarks don't save**: Verify user_bookmarks table and RLS policies
- **Redirect issues**: Check Site URL and Redirect URLs in Supabase
- **Email not sending**: Verify email configuration in Supabase

### Get Help:
- Check `DETAILED_SETUP_STEPS.md` for troubleshooting section
- Look at browser console errors for specific issues
- Verify Supabase dashboard for configuration problems

---

## ✅ Completion
When all items are checked, your authentication system is fully functional!

**Time to complete**: ~30-60 minutes depending on email configuration and testing thoroughness.
