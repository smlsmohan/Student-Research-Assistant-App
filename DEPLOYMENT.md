# Deployment Guide

This guide covers different deployment options for the CORDIS Research Explorer.

## 🚀 Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

### Quick Deploy

1. **Fork or clone this repository**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your GitHub repository
3. **Configure Environment Variables**:
   - In your Vercel project settings, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**: Vercel will automatically build and deploy your app

### Custom Domain

- In Vercel project settings, go to "Domains"
- Add your custom domain
- Update DNS settings as instructed

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t cordis-explorer .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  cordis-explorer
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'
services:
  cordis-explorer:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    restart: unless-stopped
```

Run with: `docker-compose up -d`

## ☁️ Cloud Providers

### AWS Amplify

1. Connect your GitHub repository
2. Set build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables in Amplify console

### Netlify

1. Connect repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in site settings

### Railway

1. Connect GitHub repository
2. Add environment variables
3. Railway will auto-deploy

## 🔒 Security Considerations

### Environment Variables

- Never commit real credentials to version control
- Use different Supabase projects for development/production
- Enable RLS (Row Level Security) in Supabase for production

### Supabase Setup

1. **Enable RLS** on your `cordis_projects` table:
   ```sql
   ALTER TABLE cordis_projects ENABLE ROW LEVEL SECURITY;
   ```

2. **Create read-only policy**:
   ```sql
   CREATE POLICY "Enable read access for all users" ON cordis_projects
   FOR SELECT USING (true);
   ```

3. **Restrict API access** in Supabase settings:
   - Limit allowed origins to your domain
   - Monitor API usage

## 📊 Performance Optimization

### Database

- Ensure proper indexing on frequently queried columns:
  ```sql
  CREATE INDEX idx_cordis_framework ON cordis_projects(frameworkprogramme);
  CREATE INDEX idx_cordis_status ON cordis_projects(status);
  CREATE INDEX idx_cordis_countries ON cordis_projects USING GIN(to_tsvector('english', org_countries));
  ```

### Next.js

- Enable compression and caching in `next.config.ts`
- Use Next.js Image optimization
- Implement proper error boundaries

### CDN

- Use Vercel's global CDN (automatic)
- Or configure CloudFlare for other providers

## 🔍 Monitoring

### Analytics

Add analytics to track usage:

```javascript
// pages/_app.js or app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### Error Tracking

Consider adding Sentry for error tracking:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**: Check environment variables
2. **Database connection**: Verify Supabase credentials
3. **Slow queries**: Check database indexes
4. **Memory issues**: Increase container/instance memory

### Health Check

Create a health check endpoint at `app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date() });
}
```

## 📈 Scaling

### Database

- Monitor Supabase usage and upgrade plan if needed
- Consider read replicas for high traffic
- Implement caching with Redis

### Application

- Use horizontal scaling (multiple instances)
- Implement rate limiting
- Consider using a load balancer

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run test # if you have tests
      # Add deployment step for your platform
```
