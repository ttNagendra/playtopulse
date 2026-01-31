# 🚀 Quick Deployment Checklist

Use this checklist to deploy PlaytoPulse to the cloud in under 30 minutes!

---

## ✅ Pre-Deployment Checklist

### Local Setup
- [ ] All code is working locally (backend on :8000, frontend on :5173)
- [ ] No errors in browser console
- [ ] API endpoints responding correctly
- [ ] Database migrations applied

### Git Repository
- [ ] Create GitHub repository
- [ ] Add `.gitignore` file
- [ ] Commit all code
- [ ] Push to GitHub main branch

---

## 🔧 Backend Deployment (Railway)

### Setup
- [ ] Sign up/login to [Railway.app](https://railway.app)
- [ ] Create new project from GitHub repo
- [ ] Add PostgreSQL database to project

### Configuration
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `SECRET_KEY` (generate new random key)
  - [ ] `DEBUG=False`
  - [ ] `ALLOWED_HOSTS=.railway.app`
  - [ ] `FRONTEND_URL` (add after frontend deployment)
- [ ] Generate domain for backend

### Database
- [ ] Run migrations: `python manage.py migrate`
- [ ] Create superuser (optional): `python manage.py createsuperuser`
- [ ] Add test data (optional): `python create_test_data.py`

### Verification
- [ ] Backend URL accessible (e.g., `https://your-app.railway.app`)
- [ ] Visit `/api/posts/` - should return JSON
- [ ] Check Railway logs for errors

**Backend URL**: `___________________________________`

---

## 🎨 Frontend Deployment (Vercel)

### Setup
- [ ] Sign up/login to [Vercel.com](https://vercel.com)
- [ ] Import project from GitHub
- [ ] Set root directory to `frontend`

### Configuration
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` = your Railway backend URL + `/api`

### Verification
- [ ] Frontend URL accessible (e.g., `https://your-app.vercel.app`)
- [ ] UI loads without errors
- [ ] Check browser console for errors

**Frontend URL**: `___________________________________`

---

## 🔗 Connect Frontend & Backend

### Update Backend CORS
- [ ] Go to Railway → Environment Variables
- [ ] Update `FRONTEND_URL` to your Vercel URL
- [ ] Wait for Railway to redeploy (~1 min)

### Test Integration
- [ ] Visit your Vercel frontend URL
- [ ] Open browser DevTools → Network tab
- [ ] Try creating a post
- [ ] Verify API calls succeed (status 200/201)
- [ ] Check for CORS errors (should be none)

---

## 🧪 Final Testing

### Functionality Tests
- [ ] Create a new post
- [ ] Add a comment to a post
- [ ] Add a nested reply to a comment
- [ ] Like a post
- [ ] Like a comment
- [ ] View leaderboard (should update)

### Performance Tests
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] Images/fonts load correctly
- [ ] Mobile responsive (test on phone or DevTools)

---

## 📊 Post-Deployment

### Monitoring
- [ ] Bookmark Railway dashboard
- [ ] Bookmark Vercel dashboard
- [ ] Check Railway logs for errors
- [ ] Monitor Vercel deployment logs

### Documentation
- [ ] Update README.md with live URLs
- [ ] Share deployment URLs with team/reviewers
- [ ] Document any custom configuration

### Optional Enhancements
- [ ] Add custom domain (Railway + Vercel)
- [ ] Set up error monitoring (Sentry)
- [ ] Enable analytics (Google Analytics)
- [ ] Add SSL certificate (auto-enabled on Railway/Vercel)

---

## 🎯 Deployment URLs

Fill these in after deployment:

| Service | URL | Status |
|---------|-----|--------|
| **Backend API** | `https://__________________.railway.app` | ⬜ Live |
| **Frontend UI** | `https://__________________.vercel.app` | ⬜ Live |
| **Database** | Railway PostgreSQL | ⬜ Connected |

---

## 🐛 Common Issues & Fixes

### Issue: "Application failed to respond" (Railway)
**Fix**: 
- Check `Procfile` exists in `backend/` directory
- Verify `ALLOWED_HOSTS` includes `.railway.app`
- Check Railway logs for Python errors

### Issue: "CORS error" (Frontend)
**Fix**:
- Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Include `https://` in the URL
- Redeploy backend after changing CORS settings

### Issue: "API calls return 404" (Frontend)
**Fix**:
- Verify `VITE_API_URL` in Vercel includes `/api` at the end
- Check Railway backend is running (green status)
- Test backend URL directly in browser

### Issue: "Database connection error" (Railway)
**Fix**:
- Ensure PostgreSQL service is added to Railway project
- Check `DATABASE_URL` is automatically set (don't add manually)
- Verify migrations were run

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ Frontend loads at Vercel URL
- ✅ Backend API responds at Railway URL
- ✅ Can create posts and comments
- ✅ Likes work correctly
- ✅ Leaderboard updates
- ✅ No console errors
- ✅ No CORS errors

---

## 🎉 You're Done!

**Estimated Time**: 20-30 minutes

**Next Steps**:
1. Share your live URL!
2. Add it to your portfolio
3. Show it to friends/colleagues

**Live App**: `https://__________________.vercel.app`

---

**Need help?** Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
