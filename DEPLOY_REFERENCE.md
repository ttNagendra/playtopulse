# 🚀 PlaytoPulse - Quick Deploy Reference

## 📋 Deployment Commands

### Backend (Railway)

```bash
# Build Command
pip install -r requirements.txt && python manage.py collectstatic --noinput

# Start Command
gunicorn reddit_clone.wsgi --log-file -

# Migrations (run in Railway console)
python manage.py migrate
python manage.py createsuperuser
```

### Frontend (Vercel)

```bash
# Build Command
npm run build

# Output Directory
dist
```

---

## 🔑 Environment Variables

### Backend (Railway)

```env
SECRET_KEY=<generate-random-secret-key>
DEBUG=False
ALLOWED_HOSTS=.railway.app
FRONTEND_URL=https://your-app.vercel.app
# DATABASE_URL is auto-provided by Railway
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| `Procfile` | `backend/` | Tells Railway how to run the app |
| `runtime.txt` | `backend/` | Specifies Python version |
| `requirements.txt` | `backend/` | Python dependencies |
| `vercel.json` | `frontend/` | Vercel build configuration |
| `.env.example` | `backend/` & `frontend/` | Environment variable templates |

---

## 🔗 Service URLs

| Service | Dashboard | Docs |
|---------|-----------|------|
| **Railway** | [railway.app/dashboard](https://railway.app/dashboard) | [docs.railway.app](https://docs.railway.app) |
| **Vercel** | [vercel.com/dashboard](https://vercel.com/dashboard) | [vercel.com/docs](https://vercel.com/docs) |

---

## ✅ Deployment Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend to Railway
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Run migrations
- [ ] Deploy frontend to Vercel
- [ ] Update CORS settings
- [ ] Test live app

**Time**: ~30 minutes

---

## 🐛 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Update `FRONTEND_URL` in Railway |
| 404 on API calls | Check `VITE_API_URL` includes `/api` |
| Build fails | Check Railway/Vercel logs |
| Database error | Ensure PostgreSQL is added to Railway |

---

**Full Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
