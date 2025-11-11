# 🚀 Quick Deployment Reference Card

## One-Page Deployment Guide

---

## 📦 **VERCEL (Frontend)**

### Configuration
```
Root Directory: client
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 20+ (automatic)
```

### Environment Variables
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### URL
```
https://your-project.vercel.app
```

### ⚠️ Important
Vercel automatically uses Node 20+, which is required for Vite 7.

---

## 📦 **NETLIFY (Frontend Alternative)**

### Configuration
```
Configured via netlify.toml (automatic)
Base: client
Build: npm run build
Publish: client/dist
Node Version: 20 (set in netlify.toml)
```

### Environment Variables
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### ⚠️ Important
The `netlify.toml` file sets Node 20, which is required for Vite 7.

---

## 📦 **RENDER (Backend)**

### Configuration
```
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### Environment Variables
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/silentvoice
JWT_SECRET=random-32-char-string
CLIENT_URL=https://your-project.vercel.app
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=secure-password
```

### URL
```
https://your-api.onrender.com
```

---

## 📦 **MONGODB ATLAS (Database)**

### Setup Steps
1. Create account → Create cluster (M0 Free)
2. Database Access → Add user (username/password)
3. Network Access → Add IP (0.0.0.0/0)
4. Connect → Get connection string

### Connection String Format
```
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/silentvoice?retryWrites=true&w=majority
```

---

## 🔄 **DEPLOYMENT ORDER**

```
1. MongoDB Atlas → Get connection string
   ↓
2. Backend (Render) → Set env vars → Deploy
   ↓
3. Frontend (Vercel) → Set VITE_API_URL → Deploy
   ↓
4. Update Backend CLIENT_URL with Vercel URL
   ↓
5. Test everything
```

---

## ✅ **POST-DEPLOYMENT CHECKLIST**

- [ ] Backend health check: `GET https://your-api.onrender.com/`
- [ ] Frontend loads: `https://your-project.vercel.app`
- [ ] Submit test report
- [ ] Admin login works
- [ ] Report appears in dashboard
- [ ] Update report status works

---

## ⚡ **COMMON FIXES**

| Issue | Fix |
|-------|-----|
| Build fails | Set root directory to `client` |
| CORS error | Update `CLIENT_URL` in backend |
| DB connection fails | Check MongoDB network access |
| API timeout | Backend sleeping (wait 30s) |
| 401 on admin | Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` |

---

## 🆘 **EMERGENCY COMMANDS**

### Roll back deployment
```bash
# Vercel
vercel rollback

# Or use dashboard: Deployments → Previous → Promote
```

### Check logs
```bash
# Render: Dashboard → Logs tab
# Vercel: Dashboard → Deployments → Click → View logs
```

### Test API locally
```bash
cd server
npm install
npm run dev
# Visit: http://localhost:5000
```

### Test frontend locally
```bash
cd client
npm install
npm run dev
# Visit: http://localhost:3000
```

---

## 📞 **SUPPORT LINKS**

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Troubleshooting Guide**: See `TROUBLESHOOTING.md`
- **Full Deployment Guide**: See `DEPLOYMENT.md`

---

## 💰 **COST: $0/month**

All services have free tiers suitable for this project!

---

## ⏱️ **DEPLOYMENT TIME**

- MongoDB Setup: ~5 minutes
- Backend Deploy: ~5 minutes
- Frontend Deploy: ~2 minutes
- **Total: ~12 minutes** ⚡

---

**Print this page and keep it handy! 📄**

Last updated: November 11, 2025
