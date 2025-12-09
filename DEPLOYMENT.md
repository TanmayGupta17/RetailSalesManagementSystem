# Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Completed
- [x] All test and debug scripts removed
- [x] Temporary files cleaned up
- [x] Database schema optimized with indexes
- [x] 344,000+ transactions imported
- [x] API endpoints tested and working
- [x] Frontend fully functional
- [x] Error handling implemented
- [x] CORS configured

### 🔧 Backend Deployment (Railway/Render/AWS)

#### 1. Environment Variables
Set the following in your production environment:

```env
PORT=8001
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/retail_sales
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

#### 2. MongoDB Atlas Setup
1. Create a MongoDB Atlas account (free tier available)
2. Create a new cluster
3. Add database user and password
4. Whitelist your deployment platform's IP (or 0.0.0.0/0 for all)
5. Get connection string and update `MONGO_URL`

#### 3. Deploy Backend
```bash
# Install dependencies
npm install --production

# Import data (one-time)
npm run import

# Start server
npm start
```

#### 4. Health Check Endpoint
Add to backend for monitoring:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
```

### 🎨 Frontend Deployment (Vercel/Netlify)

#### 1. Environment Variables
Set in your deployment platform:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

#### 2. Build Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

#### 3. Deploy
```bash
# Build for production
npm run build

# Test production build locally
npm start
```

### 🔒 Security Recommendations

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform-specific secret management
   - Rotate credentials regularly

2. **CORS Configuration**
   - Update `FRONTEND_URL` to actual production domain
   - Remove wildcard (*) origins

3. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```
   Add to backend:
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

4. **Helmet for Security Headers**
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

### 📊 Monitoring & Logging

1. **Backend Monitoring (PM2)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name retail-sales-api
   pm2 startup
   pm2 save
   ```

2. **Logging (Winston)**
   ```bash
   npm install winston
   ```

3. **Error Tracking**
   - Consider: Sentry, LogRocket, or New Relic

### 🚀 Deployment Platforms

#### Recommended Stack:
- **Backend:** Railway (https://railway.app)
  - Free tier available
  - Auto-deploy from GitHub
  - Built-in environment variables

- **Frontend:** Vercel (https://vercel.com)
  - Optimized for Next.js
  - Auto-deploy from GitHub
  - Edge network CDN

- **Database:** MongoDB Atlas (https://mongodb.com/atlas)
  - Free tier: 512MB storage
  - Automated backups
  - Global clusters

### 📈 Performance Optimization

1. **Database Indexes** (already implemented)
   - transactionID (unique, sparse)
   - customerName (text index)
   - phoneNumber (text index)
   - date, customerRegion, gender, productCategory (indexed)

2. **API Caching**
   - Implement Redis for frequently accessed data
   - Cache filter options endpoint

3. **Frontend Optimization**
   - Already using Next.js SSR/SSG
   - Image optimization with next/image
   - Code splitting automatic with Next.js

### 🔄 CI/CD Pipeline (Optional)

#### GitHub Actions Example:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
```

### 📞 Post-Deployment Verification

1. **Backend Health Check**
   ```bash
   curl https://your-backend-domain.com/health
   ```

2. **API Endpoints**
   ```bash
   curl https://your-backend-domain.com/api/transactions?page=1&limit=10
   ```

3. **Frontend Loading**
   - Visit https://your-frontend-domain.com
   - Test search, filter, sort, pagination
   - Check browser console for errors

### 🆘 Troubleshooting

**Issue:** MongoDB connection timeout
- **Solution:** Check Atlas IP whitelist, verify connection string

**Issue:** CORS errors in production
- **Solution:** Update `FRONTEND_URL` in backend `.env`

**Issue:** Environment variables not loading
- **Solution:** Verify platform-specific variable names (some use `NEXT_PUBLIC_` prefix)

**Issue:** API returns 502/504 errors
- **Solution:** Check backend logs, verify MongoDB connection, increase timeout

---

## Quick Deploy Commands

### Backend (Railway)
```bash
npm install -g railway
railway login
railway init
railway up
railway variables set MONGO_URL=<your-url>
railway variables set FRONTEND_URL=<your-url>
```

### Frontend (Vercel)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Database (MongoDB Atlas)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Add user in "Database Access"
4. Whitelist IP in "Network Access"
5. Get connection string from "Connect"

---

**Last Updated:** December 9, 2025
**Status:** ✅ Production Ready
