# 🔧 Deployment Troubleshooting Guide

## Common Build & Deployment Errors and Solutions

---

## ❌ Error: "Command exited with 1"

### Problem
Build command fails during deployment with exit code 1.

### Solutions

#### For Vercel:
1. **Set Root Directory to `client`**
   - In Vercel dashboard → Project Settings → General
   - Set "Root Directory" to `client`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

2. **Check Node Version**
   - Ensure Node.js version is 18 or higher
   - Add to `package.json`:
     ```json
     "engines": {
       "node": ">=18.0.0"
     }
     ```

3. **Clear Build Cache**
   - Vercel Dashboard → Deployments → Click "..." → "Redeploy"
   - Check "Clear build cache and deploy"

#### For Netlify:
1. **Use netlify.toml** (already created in root)
   - File automatically sets base directory to `client`
   - No manual configuration needed

2. **Or Configure Manually:**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`

---

## ❌ Error: "ENOENT: no such file or directory"

### Problem
Missing files or incorrect paths during build.

### Solutions

1. **Check Working Directory**
   - Ensure build runs from correct directory
   - For monorepo (client/server structure), set root directory

2. **Verify package.json exists**
   ```bash
   # Should exist:
   client/package.json
   server/package.json
   ```

3. **Check Dependencies**
   ```bash
   cd client
   npm install
   npm run build
   ```

---

## ❌ Error: "Node.js version 20.19+ or 22.12+ required"

### Problem
Vite 7.2.2 requires Node.js version 20.19+ or 22.12+, but deployment platform is using an older version (e.g., Node 18).

### Solutions

1. **Netlify - Update netlify.toml**
   Already configured in the project:
   ```toml
   [build.environment]
     NODE_VERSION = "20"
   ```

2. **Vercel - Automatically uses latest Node LTS**
   Vercel automatically uses Node 20+, no action needed.

3. **Render - Set Node Version**
   Add to render.yaml or set in dashboard:
   ```yaml
   envVars:
     - key: NODE_VERSION
       value: 20
   ```

4. **Local Development**
   Upgrade your Node.js:
   ```bash
   # Check current version
   node --version
   
   # Download Node 20+ from nodejs.org
   # Or use nvm:
   nvm install 20
   nvm use 20
   ```

---

## ❌ Error: "Cannot find module 'vite'"

### Problem
Vite or other dependencies not installed.

### Solutions

1. **Install Dependencies**
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check package.json**
   Ensure vite is in devDependencies:
   ```json
   "devDependencies": {
     "vite": "^7.2.2"
   }
   ```

3. **Platform-specific:**
   - Vercel: Automatically installs dependencies
   - Netlify: Uses `netlify.toml` base directory

---

## ❌ Error: "CORS policy blocked"

### Problem
Frontend can't access backend API.

### Solutions

1. **Update Backend CORS**
   ```javascript
   // server/src/index.js
   const corsOptions = {
     origin: process.env.CLIENT_URL || '*',
     credentials: true
   };
   app.use(cors(corsOptions));
   ```

2. **Set CLIENT_URL Environment Variable**
   ```env
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

3. **Update Frontend API URL**
   ```env
   # client/.env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

---

## ❌ Error: "Failed to connect to MongoDB"

### Problem
Backend can't connect to database.

### Solutions

1. **Check MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allow all) or specific IPs

2. **Verify Connection String**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/silentvoice?retryWrites=true&w=majority
   ```
   - Replace `username` with database user
   - Replace `password` with actual password
   - Ensure no special characters in password (or URL encode them)

3. **Check Database User Permissions**
   - MongoDB Atlas → Database Access
   - User should have "Read and write" permissions

---

## ❌ Error: "JWT must be provided"

### Problem
JWT_SECRET environment variable not set.

### Solutions

1. **Set JWT_SECRET**
   ```env
   JWT_SECRET=your-super-secret-random-string-at-least-32-characters-long
   ```

2. **Generate Strong Secret**
   ```bash
   # Node.js
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   # Or online
   # Visit: https://randomkeygen.com/
   ```

3. **Verify Environment Variable**
   - Check hosting platform dashboard
   - Ensure no trailing spaces
   - Redeploy after adding

---

## ❌ Error: "Port already in use"

### Problem
Local development - port conflict.

### Solutions

1. **Kill Process on Port**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Or change port
   PORT=5001 npm run dev
   ```

2. **Change Port in .env**
   ```env
   PORT=5001
   ```

---

## ❌ Error: "Module not found: Can't resolve './styles.css'"

### Problem
Missing CSS or import path incorrect.

### Solutions

1. **Check File Exists**
   ```bash
   # Should exist:
   client/src/styles.css
   ```

2. **Verify Import Path**
   ```javascript
   // Correct
   import './styles.css';
   
   // Not
   import 'styles.css';
   ```

3. **Case Sensitivity**
   - Linux/Production is case-sensitive
   - Match exact filename: `styles.css` not `Styles.css`

---

## ❌ Error: "401 Unauthorized" on Admin Login

### Problem
Admin credentials not working.

### Solutions

1. **Check Admin Credentials**
   ```env
   ADMIN_EMAIL=admin@campus.edu
   ADMIN_PASSWORD=your-secure-password
   ```

2. **Verify Backend Receives Credentials**
   - Check backend logs
   - Ensure request reaches `/api/auth/login`

3. **Check JWT Token Storage**
   ```javascript
   // Should save token
   localStorage.setItem('sv_token', token);
   ```

---

## ❌ Error: "Request timeout" / "Network Error"

### Problem
API requests timing out.

### Solutions

1. **Check Backend is Running**
   - Visit: `https://your-backend-url.com/`
   - Should return: `{"status":"ok","service":"SilentVoice API"}`

2. **Free Tier Sleep (Render)**
   - First request takes 30-60 seconds
   - Increase timeout in api.js:
     ```javascript
     const api = axios.create({
       timeout: 30000 // 30 seconds
     });
     ```

3. **Check API URL**
   ```javascript
   // client/src/api.js
   const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

---

## ❌ Error: "Cannot read property 'map' of undefined"

### Problem
Frontend trying to render data before it loads.

### Solutions

1. **Add Loading State**
   ```javascript
   if (!reports) return <div>Loading...</div>;
   ```

2. **Initialize with Empty Array**
   ```javascript
   const [reports, setReports] = useState([]);
   ```

3. **Add Error Handling**
   ```javascript
   try {
     const response = await api.get('/api/reports');
     setReports(response.data);
   } catch (error) {
     console.error('Failed to fetch reports', error);
     setReports([]);
   }
   ```

---

## 🔍 Debugging Checklist

### When Build Fails:

1. **Local Build Test**
   ```bash
   cd client
   npm install
   npm run build
   ```
   If this works, it's a deployment configuration issue.

2. **Check Deployment Logs**
   - Vercel: Deployments → Click deployment → View logs
   - Netlify: Deploys → Click deploy → View logs
   - Render: Logs tab

3. **Verify File Structure**
   ```
   Silent-Voice/
   ├── client/
   │   ├── package.json ✓
   │   ├── vite.config.js ✓
   │   └── src/ ✓
   ├── server/
   │   ├── package.json ✓
   │   └── src/ ✓
   └── README.md
   ```

4. **Check Node Version**
   ```bash
   node --version  # Should be 18+
   ```

5. **Clear All Caches**
   ```bash
   # Local
   cd client
   rm -rf node_modules dist .vite
   npm install
   
   # Platform
   # Redeploy with "Clear cache" option
   ```

---

## 🚀 Platform-Specific Tips

### Vercel
- ✅ Auto-detects Vite
- ✅ Set Root Directory to `client`
- ✅ Environment variables in Settings
- ✅ Automatic HTTPS
- ✅ Instant rollback available

### Netlify
- ✅ Use `netlify.toml` in root
- ✅ Or set Base directory to `client`
- ✅ Environment variables in Site settings
- ✅ Deploy previews for PRs

### Render
- ✅ Set Root Directory to `server` for backend
- ✅ Build Command: `npm install`
- ✅ Start Command: `npm start`
- ✅ Free tier: Server sleeps after 15 min
- ✅ Environment variables in dashboard

---

## 📞 Still Having Issues?

### Steps to Get Help:

1. **Check Deployment Logs**
   - Copy full error message
   - Note when error occurs (build/runtime)

2. **Verify Environment Variables**
   - All required variables set?
   - No typos in variable names?
   - Values correct format?

3. **Test Locally**
   - Does it work on your machine?
   - Try production build locally

4. **Check Status Pages**
   - [Vercel Status](https://www.vercel-status.com/)
   - [Netlify Status](https://www.netlifystatus.com/)
   - [Render Status](https://status.render.com/)
   - [MongoDB Status](https://status.mongodb.com/)

5. **Create Issue**
   - Include: Error message, logs, configuration
   - What you've tried already
   - Screenshots if helpful

---

## ✅ Quick Fix Summary

| Error | Quick Fix |
|-------|-----------|
| Build fails | Set root directory to `client` |
| CORS error | Set `CLIENT_URL` in backend |
| MongoDB error | Check Atlas network access |
| JWT error | Set `JWT_SECRET` env var |
| Timeout error | Backend sleeping (free tier) |
| Module not found | Run `npm install` |
| 401 error | Check admin credentials |

---

**Most Common Issue:** Not setting the correct root directory (`client`) in deployment settings!

**Second Most Common:** Environment variables not set or incorrect values.

---

Good luck! 🍀
