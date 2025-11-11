# 🚀 Deployment Guide - SilentVoice

This guide covers deploying SilentVoice to popular hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ MongoDB database (MongoDB Atlas recommended)
- ✅ Environment variables configured
- ✅ Code tested locally
- ✅ Git repository

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project

### 2. Create Cluster
1. Click "Build a Database"
2. Choose the FREE tier (M0)
3. Select your region
4. Name your cluster
5. Click "Create"

### 3. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Add `0.0.0.0/0` (allow from anywhere) OR specific IPs
4. Save

### 4. Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and strong password
5. Grant "Read and write to any database" role
6. Save

### 5. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `silentvoice`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/silentvoice?retryWrites=true&w=majority`

---

## 🖥️ Backend Deployment

### Option 1: Render (Recommended - Free Tier Available)

#### Steps:
1. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   ```
   Name: silentvoice-api
   Region: Choose nearest
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/silentvoice
   JWT_SECRET=your-super-secret-random-string-here
   ADMIN_EMAIL=admin@campus.edu
   ADMIN_PASSWORD=your-secure-password
   CLIENT_URL=https://your-frontend-url.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Copy the service URL (e.g., `https://silentvoice-api.onrender.com`)

#### Important Notes:
- Free tier: Server sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Upgrade to paid plan for 24/7 uptime

---

### Option 2: Railway

#### Steps:
1. Go to [Railway](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `server`
6. Add environment variables (same as above)
7. Deploy

---

### Option 3: Heroku

#### Steps:
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login and Create App**
   ```bash
   heroku login
   heroku create silentvoice-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGO_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   heroku config:set CLIENT_URL=your-frontend-url
   ```

4. **Deploy**
   ```bash
   cd server
   git subtree push --prefix server heroku main
   ```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended - Free & Fast)

#### Steps:
1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub**
   - Go to [Vercel](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: client
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live!

#### Auto-deployments:
- Every push to `main` branch auto-deploys
- Pull requests get preview deployments

---

### Option 2: Netlify

#### Steps:
1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub and select repository
4. Configure:
   ```
   Base directory: client
   Build command: npm run build
   Publish directory: client/dist
   ```
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```
6. Deploy

---

### Option 3: Manual Build & Deploy

#### Build Locally:
```bash
cd client
npm install
npm run build
```

Upload the `dist` folder to any static hosting:
- AWS S3 + CloudFront
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

---

## 🔧 Post-Deployment Steps

### 1. Update CORS Settings
Update your backend `.env`:
```env
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 2. Test the Deployment
- Visit your frontend URL
- Submit a test report
- Login to admin dashboard
- Verify report appears

### 3. Update Environment Variables
Make sure both frontend and backend have correct URLs pointing to each other.

### 4. Monitor Logs
- Backend: Check Render/Railway/Heroku logs
- Frontend: Check browser console

---

## 🔐 Security Checklist

Before going live:
- ✅ Strong `JWT_SECRET` (min 32 characters, random)
- ✅ Secure admin password
- ✅ MongoDB network access configured
- ✅ CORS properly configured
- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ Environment variables secured
- ✅ `.env` files in `.gitignore`

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Update `CLIENT_URL` in backend environment variables to match your frontend URL.

### Issue: API Not Responding
**Solution:** 
- Check if backend service is running
- Verify `VITE_API_URL` in frontend
- Check backend logs for errors

### Issue: Database Connection Failed
**Solution:**
- Verify MongoDB Atlas connection string
- Check network access whitelist
- Ensure database user credentials are correct

### Issue: 502 Bad Gateway (Render)
**Solution:** Free tier servers sleep. First request takes 30-60 seconds to wake up.

### Issue: Build Failed
**Solution:**
- Check Node.js version compatibility
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

---

## 📊 Monitoring

### Backend Health Check
Visit: `https://your-backend-url.com/`

Should return:
```json
{
  "status": "ok",
  "service": "SilentVoice API"
}
```

### Frontend Health Check
- Open your frontend URL
- Check browser console for errors
- Test report submission

---

## 💰 Cost Estimates

### Free Tier (Suitable for testing/small projects)
- MongoDB Atlas: M0 Cluster (512MB storage)
- Render: 750 hours/month (sleeps after inactivity)
- Vercel: Unlimited bandwidth (hobby)
- **Total: $0/month**

### Paid Tier (For production)
- MongoDB Atlas: M10 Cluster (~$57/month)
- Render: Standard instance ($7-25/month)
- Vercel: Pro ($20/month)
- **Total: ~$84-102/month**

---

## 🔄 Continuous Deployment

### Automatic Deployments
Both Vercel and Render support automatic deployments:

1. **Push to Main Branch**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Build & Deploy**
   - Vercel/Render detect changes
   - Build and deploy automatically
   - Live in 2-3 minutes

### Preview Deployments
- Create pull request
- Get preview URL automatically
- Test before merging to main

---

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Connection string obtained
- [ ] Backend deployed and running
- [ ] Backend environment variables set
- [ ] Frontend deployed and running
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Test report submission works
- [ ] Admin login works
- [ ] Dashboard displays reports
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up

---

**Need help?** Open an issue on GitHub or contact the development team.

**Happy Deploying! 🚀**
