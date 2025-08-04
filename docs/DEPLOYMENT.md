# Deployment Guide

This guide covers deploying Unlate to various platforms and configuring it for production.

## Quick Deploy Options

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/binyominzeev/unlate)

1. Click the deploy button above or go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables (see below)
4. Deploy!

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Configure environment variables
5. Deploy

## Environment Variables

Set these environment variables in your hosting platform:

```env
# Database - Use appropriate connection string for your database
DATABASE_URL="file:./prod.db"

# NextAuth.js - REQUIRED for authentication
NEXTAUTH_SECRET="your-super-secure-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
```

### Generating Secure Secrets

Generate a secure `NEXTAUTH_SECRET`:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Database Options

### SQLite (Default - Development)

Good for development and small deployments:

```env
DATABASE_URL="file:./prod.db"
```

### PostgreSQL (Recommended for Production)

For production deployments, use PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Hosted Database Options

- **Vercel Postgres** (if using Vercel)
- **Supabase** (PostgreSQL)
- **PlanetScale** (MySQL)
- **Railway** (PostgreSQL)
- **Neon** (PostgreSQL)

## Production Setup

### 1. Build Configuration

Ensure your build is optimized:

```bash
npm run build
```

### 2. Database Migration

For production databases:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### 3. Environment Security

- Use environment variables for all secrets
- Never commit `.env` files to version control
- Use different secrets for each environment

## Platform-Specific Guides

### Vercel Deployment

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from GitHub

2. **Configure Build**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**
   ```
   NEXTAUTH_SECRET=your-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   DATABASE_URL=your-database-url
   ```

4. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update `NEXTAUTH_URL` to your domain

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t unlate .
docker run -p 3000:3000 -e NEXTAUTH_SECRET=your-secret unlate
```

### VPS/Server Deployment

1. **Prepare Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade

   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/binyominzeev/unlate.git
   cd unlate

   # Install dependencies
   npm ci --only=production

   # Set up environment
   cp .env .env.local
   # Edit .env.local with your configuration

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "unlate" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx** (Optional)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## PWA Configuration for Production

### 1. HTTPS Setup

PWAs require HTTPS in production. Most hosting platforms provide this automatically.

### 2. Service Worker

The service worker is automatically generated. Ensure these files are accessible:

- `/sw.js`
- `/manifest.json`
- All icon files

### 3. Manifest Validation

Validate your PWA manifest:
- [Web App Manifest Validator](https://manifest-validator.appspot.com/)
- Chrome DevTools → Application → Manifest

## Monitoring and Analytics

### Error Tracking

Add error tracking service:

```bash
npm install @sentry/nextjs
```

### Analytics

Add analytics to `src/app/layout.tsx`:

```tsx
// Google Analytics, Plausible, or other analytics
```

### Performance Monitoring

- Use Vercel Analytics (if on Vercel)
- Google PageSpeed Insights
- Chrome DevTools Lighthouse

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is secure and unique
- [ ] Environment variables are not exposed to client
- [ ] Database is secured with proper credentials
- [ ] HTTPS is enabled in production
- [ ] Content Security Policy is configured
- [ ] Rate limiting is implemented for API routes

## Backup and Maintenance

### Database Backups

For SQLite:
```bash
cp prisma/dev.db backups/backup-$(date +%Y%m%d).db
```

For PostgreSQL:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Regular Updates

1. Update dependencies regularly
2. Monitor security advisories
3. Test in staging environment
4. Deploy during low-traffic periods

## Troubleshooting Production Issues

### Common Problems

**Build Failures**
- Check Node.js version compatibility
- Verify all environment variables are set
- Ensure database is accessible

**Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure HTTPS is configured

**Database Connection**
- Check connection string format
- Verify database server is running
- Test connectivity from deployment environment

**PWA Not Installing**
- Verify HTTPS is enabled
- Check manifest.json is accessible
- Ensure service worker is registered

### Debug Mode

Enable debug logging in production:

```env
NEXTAUTH_DEBUG=true
```

**Remove after debugging!**

## Performance Optimization

### Image Optimization

- Use Next.js `Image` component
- Optimize icon files
- Enable compression

### Caching

- Configure CDN caching headers
- Use Redis for session storage (optional)
- Enable static file caching

### Database Performance

- Add database indexes for frequent queries
- Use connection pooling
- Monitor query performance

## Support

For deployment issues:

1. Check the [documentation](../README.md)
2. Review [common issues](DEVELOPMENT.md#troubleshooting)
3. Open an issue on GitHub
4. Check platform-specific documentation