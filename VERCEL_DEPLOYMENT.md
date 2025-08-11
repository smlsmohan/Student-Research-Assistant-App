# 🚀 Vercel Deployment Guide

## Step-by-Step Deployment to Vercel

### Prerequisites ✅
- [x] GitHub account
- [x] Vercel account (free at [vercel.com](https://vercel.com))
- [x] Your CORDIS Research Explorer code
- [x] Supabase project with CORDIS data

### Step 1: Prepare Your Repository 📁

1. **Push your code to GitHub** (if not already done):
   ```bash
   # Initialize git repository (if needed)
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Initial commit: CORDIS Research Explorer"
   
   # Add GitHub remote (replace with your repository URL)
   git remote add origin https://github.com/yourusername/cordis-research-explorer.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Verify your project structure** includes:
   - `package.json` ✅
   - `next.config.ts` ✅
   - `src/app/` directory ✅
   - All components and dependencies ✅

### Step 2: Deploy to Vercel 🌐

#### Option A: Quick Deploy (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "New Project"**

3. **Import your GitHub repository**:
   - Find your `cordis-research-explorer` repository
   - Click "Import"

4. **Configure project settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Add Environment Variables** (CRITICAL):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bfbhbaipgbazdhghrjho.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   
   ⚠️ **Important**: Use your Supabase **anon/public** key, not the service role key for security!

6. **Click "Deploy"** 🚀

#### Option B: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? `N`
   - In which scope? Choose your account
   - Link to different project? `N`
   - What's your project's name? `cordis-research-explorer`
   - In which directory? `./`
   - Auto-detected settings? `Y`

5. **Set environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

### Step 3: Configure Environment Variables 🔧

In your Vercel dashboard:

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add the following variables**:

   ```env
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://bfbhbaipgbazdhghrjho.supabase.co
   Environment: Production, Preview, Development
   
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [your_anon_key_from_supabase]
   Environment: Production, Preview, Development
   ```

### Step 4: Get Your Correct Supabase Keys 🔑

1. **Go to your Supabase dashboard**
2. **Navigate to Settings → API**
3. **Copy the correct keys**:
   - **Project URL**: `https://bfbhbaipgbazdhghrjho.supabase.co` ✅
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different from service_role)

⚠️ **Security Note**: Never use the `service_role` key in frontend applications!

### Step 5: Verify Deployment ✅

1. **Check build logs** in Vercel dashboard
2. **Visit your deployed URL** (e.g., `https://cordis-research-explorer.vercel.app`)
3. **Test functionality**:
   - Search works
   - Filters work
   - Data loads from Supabase
   - No console errors

### Step 6: Custom Domain (Optional) 🌍

1. **In Vercel project settings**, go to "Domains"
2. **Add your custom domain**:
   ```
   cordis-explorer.yourdomain.com
   ```
3. **Update DNS settings** as instructed by Vercel
4. **SSL certificate** is automatically provisioned

### Step 7: Set Up Continuous Deployment 🔄

Vercel automatically sets up CI/CD:
- **Every push to `main`** triggers a production deployment
- **Pull requests** get preview deployments
- **Automatic builds** with caching for fast deployments

### Troubleshooting Common Issues 🔧

#### Build Fails
```bash
# Check your build locally first
npm run build

# If it works locally, check:
# 1. Environment variables in Vercel
# 2. Node.js version (Vercel uses Node 18+ by default)
# 3. Dependencies in package.json
```

#### Environment Variables Not Working
1. **Verify variable names** (case-sensitive)
2. **Check all environments** are selected
3. **Redeploy** after adding variables
4. **Use NEXT_PUBLIC_** prefix for client-side variables

#### Database Connection Issues
1. **Verify Supabase URL** is correct
2. **Check anon key** (not service_role key)
3. **Ensure RLS policies** allow public read access
4. **Test connection** in development first

#### Slow Loading
1. **Check Supabase indexes** on frequently queried columns
2. **Monitor Vercel analytics** for performance insights
3. **Consider implementing caching** for static data

### Step 8: Production Optimization 🚀

1. **Enable Vercel Analytics**:
   ```bash
   npm install @vercel/analytics
   ```
   
   Add to your layout:
   ```tsx
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

2. **Set up monitoring**:
   - **Vercel Speed Insights** for performance monitoring
   - **Error tracking** with built-in error reporting
   - **Function logs** for debugging

3. **Optimize for production**:
   - **Image optimization** (already configured)
   - **Static generation** where possible
   - **Database query optimization**

### Success! 🎉

Your CORDIS Research Explorer should now be live at:
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom domain**: `https://your-custom-domain.com` (if configured)

### Next Steps 📈

1. **Share your application** with users
2. **Monitor usage** with Vercel analytics
3. **Iterate based on feedback**
4. **Scale as needed** (Vercel handles this automatically)

**Your research data is now accessible to the world! 🌍🔬**
