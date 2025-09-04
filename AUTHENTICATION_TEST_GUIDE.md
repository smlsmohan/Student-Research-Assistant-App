# 🧪 Authentication System Test Guide

## Current Status: ✅ READY FOR TESTING

The authentication system is fully implemented and running on **http://localhost:3000**

## 🔧 Prerequisites Setup

**IMPORTANT: Before testing, you need to configure email confirmation in Supabase:**

1. **Go to Supabase Dashboard** → Authentication → Settings
2. **Enable Email Confirmations:**
   - Toggle ON "Enable email confirmations" 
   - Set "Site URL" to `http://localhost:3000`
   - Set "Redirect URLs" to include:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/confirm`

3. **Configure Email Templates** (optional but recommended):
   - Customize confirmation email template
   - Customize password reset email template

## 🚀 Complete Authentication Test Flow

### Test 1: User Registration
1. **Navigate to Registration:**
   - Open: http://localhost:3000/auth/register
   - Fill in: Name, Email, Password
   - Click "Create Account"
   
2. **Expected Result:**
   - Success message: "Account created! Check your email for confirmation."
   - User receives confirmation email

### Test 2: Email Confirmation
3. **Check Email Inbox:**
   - Look for confirmation email from Supabase
   - Click the confirmation link
   
4. **Expected Result:**
   - Redirects to: http://localhost:3000/auth/confirm
   - Shows: "Email confirmed successfully!"

### Test 3: User Login
5. **Navigate to Login:**
   - Open: http://localhost:3000/auth/login
   - Enter confirmed email and password
   - Click "Sign In"
   
6. **Expected Result:**
   - Success message: "Login successful! Redirecting..."
   - Automatically redirects to dashboard

### Test 4: Protected Dashboard Access
7. **Dashboard Access:**
   - Should automatically be at: http://localhost:3000/dashboard
   - Should see research dashboard interface
   - Should see search functionality
   
8. **Expected Result:**
   - Full access to CORDIS research data
   - Search limits tracking (5 free searches)
   - User menu with logout option

### Test 5: Search Limits
9. **Test Search Functionality:**
   - Try searching for research projects
   - Should see search count increment
   - After 5 searches, should show limit warning
   
10. **Expected Result:**
    - Search counter: "4 of 5 free searches remaining"
    - After limit: "Free search limit reached"

### Test 6: Logout & Re-access
11. **Test Logout:**
    - Click user menu → "Sign Out"
    - Try to access http://localhost:3000/dashboard directly
    
12. **Expected Result:**
    - Redirected to login page
    - Cannot access protected routes without authentication

## 🔍 Troubleshooting Common Issues

### Issue: "Email not confirmed" error
- **Solution:** Enable email confirmations in Supabase Dashboard
- **Check:** Email confirmation settings are ON

### Issue: No confirmation email received
- **Check:** Email settings in Supabase Authentication
- **Check:** Spam/Junk folder
- **Test:** Use a different email provider (Gmail, Yahoo, etc.)

### Issue: Redirect loops or infinite loading
- **Solution:** Clear browser cache and cookies
- **Check:** Site URL and redirect URLs in Supabase

### Issue: Database connection errors
- **Check:** .env.local file contains correct Supabase credentials
- **Test:** Database connectivity from Supabase dashboard

## 🎯 Success Criteria

**Authentication system is working correctly when:**
- ✅ User registration creates account
- ✅ Email confirmation works
- ✅ Login redirects to dashboard
- ✅ Dashboard shows research data
- ✅ Search limits are enforced
- ✅ Logout protects routes
- ✅ Unauthorized access redirects to login

## 🚨 Current Test Accounts

**Test User Created:**
- **Email:** testuser@cordis-research.com
- **Password:** TestPass123!
- **Status:** Ready for testing

## 📧 Next Steps After Testing

1. **If tests pass:** Move to production deployment
2. **If issues found:** Debug specific components
3. **Email templates:** Customize Supabase email designs
4. **Production setup:** Configure production URLs and domains

---

**Testing Environment:** Next.js 15 + React 18 + Supabase + CORDIS Database
**Last Updated:** September 4, 2025
