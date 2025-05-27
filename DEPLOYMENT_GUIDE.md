# DishRated Deployment Guide

This guide will help you deploy your DishRated application with dynamic editing capabilities, meaning you can make changes to your code and see them reflected immediately in the deployed application.

## Option 1: Vercel + Railway (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free tier available)
- MongoDB Atlas account (free tier available)

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   ```bash
   # If you haven't already, create a new repository on GitHub
   # Then push your code
   git remote add origin https://github.com/yourusername/dishrated.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas (Database)

1. **Create MongoDB Atlas account:** Go to https://www.mongodb.com/atlas
2. **Create a new cluster:** Choose the free tier (M0)
3. **Create database user:** 
   - Go to Database Access
   - Add new user with username/password
   - Give read/write access
4. **Whitelist IP addresses:**
   - Go to Network Access
   - Add IP address: `0.0.0.0/0` (allows access from anywhere)
5. **Get connection string:**
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string (replace `<password>` with your actual password)

### Step 3: Deploy Backend on Railway

1. **Go to Railway:** https://railway.app
2. **Sign up/Login** with GitHub
3. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `dishrated` repository
4. **Configure backend deployment:**
   - Railway will detect your backend automatically
   - Set the root directory to `backend`
   - Add environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_super_secret_jwt_key_here
     CORS_ORIGIN=https://your-frontend-domain.vercel.app
     ```
5. **Deploy:** Railway will automatically build and deploy your backend

### Step 4: Deploy Frontend on Vercel

1. **Go to Vercel:** https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import project:**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
4. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add environment variables:**
   ```
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```
6. **Deploy:** Vercel will build and deploy your frontend

### Step 5: Configure Dynamic Updates

Both Vercel and Railway support automatic deployments from GitHub:

1. **Automatic deployments are enabled by default**
2. **Every time you push to GitHub:**
   - Railway will redeploy your backend
   - Vercel will redeploy your frontend
3. **To make changes:**
   ```bash
   # Make your changes locally
   git add .
   git commit -m "Your changes"
   git push origin main
   # Your changes will be live in 2-3 minutes!
   ```

## Option 2: Netlify + Render

### Step 1: Deploy Backend on Render

1. **Go to Render:** https://render.com
2. **Create account** and connect GitHub
3. **Create new Web Service:**
   - Connect your repository
   - Set root directory: `backend`
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
4. **Add environment variables** (same as Railway above)

### Step 2: Deploy Frontend on Netlify

1. **Go to Netlify:** https://netlify.com
2. **Connect GitHub repository**
3. **Configure build:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. **Add environment variables** (same as Vercel above)

## Option 3: DigitalOcean App Platform (All-in-one)

1. **Create DigitalOcean account**
2. **Create new App:**
   - Connect GitHub repository
   - Configure two components:
     - **Backend:** Node.js service from `/backend`
     - **Frontend:** Static site from `/frontend`
3. **Add environment variables** for both components
4. **Deploy:** Both frontend and backend will be deployed together

## Testing Your Deployment

### 1. Test Backend API
```bash
curl https://your-backend-domain/api/health
```

### 2. Test Frontend
Visit your frontend URL and check:
- Homepage loads
- Nearby trucks section works
- Navigation works
- API calls are successful (check browser console)

### 3. Test Database Connection
- Try logging in/registering
- Check if food trucks are displayed
- Verify CRUD operations work

## Making Changes After Deployment

### For Code Changes:
```bash
# 1. Make your changes locally
# 2. Test locally first
npm run dev  # in both frontend and backend

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push origin main

# 4. Wait 2-3 minutes for automatic deployment
```

### For Environment Variables:
- **Vercel:** Go to project settings → Environment Variables
- **Railway:** Go to project → Variables tab
- **Netlify:** Go to site settings → Environment variables
- **Render:** Go to service → Environment tab

## Monitoring and Logs

### View Deployment Logs:
- **Vercel:** Functions tab → View logs
- **Railway:** Deployments tab → Click on deployment
- **Netlify:** Deploys tab → Click on deployment
- **Render:** Logs tab

### Monitor Performance:
- All platforms provide built-in analytics
- Set up error tracking with services like Sentry (optional)

## Domain Configuration (Optional)

### Custom Domain:
1. **Buy a domain** (e.g., from Namecheap, GoDaddy)
2. **Configure DNS:**
   - Frontend: Point to Vercel/Netlify
   - Backend: Point to Railway/Render
3. **Update CORS settings** in backend with new domain

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Update `CORS_ORIGIN` in backend environment variables
   - Include your frontend domain

2. **Database Connection:**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string format

3. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names

4. **Build Failures:**
   - Check build logs for specific errors
   - Ensure all dependencies are in package.json

## Cost Estimation

### Free Tier Limits:
- **Vercel:** 100GB bandwidth, unlimited deployments
- **Railway:** $5 credit monthly (covers small apps)
- **MongoDB Atlas:** 512MB storage, shared cluster
- **Netlify:** 100GB bandwidth, 300 build minutes

### Paid Plans (if needed):
- **Vercel Pro:** $20/month per user
- **Railway:** Pay-as-you-go after free credit
- **MongoDB Atlas:** $9/month for dedicated cluster

## Next Steps

1. **Set up monitoring** (error tracking, performance)
2. **Configure CI/CD** (automated testing before deployment)
3. **Set up staging environment** (for testing before production)
4. **Add SSL certificates** (usually automatic on these platforms)
5. **Configure backup strategies** for your database

Your application will now be live and automatically update whenever you push changes to GitHub!
