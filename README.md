# PlaytoPulse - Full Stack Application

A modern social platform built with Django + DRF backend and React + Tailwind frontend, featuring posts, nested comments, likes, and a dynamic 24-hour leaderboard.

## 🎯 Technical Requirements Met

This project implements three critical engineering challenges:

### 1. ✅ N+1 Query Optimization
- Uses `prefetch_related()` and `select_related()` to fetch entire comment trees efficiently
- Reduces database queries from O(N) to O(1) for nested comments
- Aggressive prefetching strategy prevents performance degradation

### 2. ✅ Atomic Like System
- `@transaction.atomic` decorator ensures race-condition-free likes
- `UniqueTogether` constraints at database level prevent duplicate likes
- `get_or_create()` pattern handles concurrent requests gracefully

### 3. ✅ Dynamic 24-Hour Leaderboard
- Real-time karma calculation: **Post Likes × 5 + Comment Likes × 1**
- Filters likes by `created_at >= now - 24h` dynamically
- No static fields - always accurate and up-to-date

## 🚀 Features

- **Posts** - Create and view posts with like functionality
- **Nested Comments** - Unlimited comment threading with recursive rendering
- **Like System** - Atomic, duplicate-proof likes on posts and comments
- **Leaderboard** - Top 5 users by karma (auto-refreshes every 30s)
- **Premium UI** - Glassmorphism, gradients, smooth animations
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

**Backend:**
- Django 4.2.7
- Django REST Framework 3.14.0
- SQLite (development) / PostgreSQL (recommended for production)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Axios

**Deployment:**
- Railway (Backend + PostgreSQL)
- Vercel (Frontend)

## ☁️ Cloud Deployment

**🚀 Ready to deploy?** Check out our deployment guides:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete step-by-step deployment guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick checklist for 30-min deployment

**Quick Start:**
1. Push code to GitHub
2. Deploy backend to [Railway.app](https://railway.app) (free tier)
3. Deploy frontend to [Vercel.com](https://vercel.com) (free tier)
4. Connect them with environment variables

**All configuration files are ready!** ✅


## 📦 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create test data (optional)
python create_test_data.py

# Start server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📖 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts/` | GET | List all posts with nested comments |
| `/api/posts/` | POST | Create a new post |
| `/api/posts/{id}/` | GET | Get single post details |
| `/api/comments/` | POST | Create a comment (supports threading via `parent` field) |
| `/api/likes/` | POST | Create a like (atomic, prevents duplicates) |
| `/api/leaderboard/` | GET | Get top 5 users by karma (24h window) |

## 🎨 Design Features

- **Dark Theme** - Gradient background (slate-900 → purple-900)
- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Animations** - Smooth transitions, heartbeat likes, fade-ins
- **Typography** - Inter font from Google Fonts
- **Responsive** - Mobile-first design with Tailwind

## 🧪 Testing

### Create Test Data

```bash
cd backend
python create_test_data.py
```

This creates:
- 5 test users
- 5 posts
- 7 nested comments (3 levels deep)
- 30 likes
- 1 old like (25h ago) for leaderboard testing

### Verify N+1 Optimization

Check Django debug toolbar or query logs to confirm minimal queries when loading posts with comments.

### Test Atomic Likes

Try rapidly clicking the like button - only one like should be created.

### Test 24h Leaderboard

Visit `/api/leaderboard/` to see karma calculations. Old likes (>24h) should be excluded.

## 📁 Project Structure

```
project/
├── backend/
│   ├── api/
│   │   ├── models.py          # Post, Comment, Like models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── views.py           # ViewSets with optimizations
│   │   ├── urls.py            # API routes
│   │   └── admin.py           # Admin interface
│   ├── reddit_clone/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL config
│   └── create_test_data.py    # Test data generator
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Feed.jsx       # Main feed
    │   │   ├── Post.jsx       # Post component
    │   │   ├── Comment.jsx    # Recursive comments
    │   │   └── Leaderboard.jsx # Leaderboard widget
    │   ├── api.js             # API client
    │   ├── index.css          # Tailwind styles
    │   └── App.jsx            # Main app
    └── tailwind.config.js     # Tailwind config
```

## 🔑 Key Implementation Details

### Recursive Comment Component

```jsx
function Comment({ comment, depth = 0 }) {
  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      {/* Comment content */}
      {comment.replies?.map(reply => (
        <Comment key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}
```

### Atomic Like Creation

```python
@transaction.atomic
def create(self, request, *args, **kwargs):
    like, created = Like.objects.get_or_create(
        user=user,
        post_id=post_id,
        defaults={'comment': None}
    )
    return Response(status=201 if created else 200)
```

### Dynamic Leaderboard Query

```python
User.objects.annotate(
    post_likes=Count('posts__likes', filter=Q(posts__likes__created_at__gte=last_24h)),
    comment_likes=Count('comments__likes', filter=Q(comments__likes__created_at__gte=last_24h)),
    karma=F('post_likes') * 5 + F('comment_likes') * 1
).order_by('-karma')[:5]
```

## 🎯 Future Enhancements

- [ ] User authentication (JWT tokens)
- [ ] Real-time updates with WebSockets
- [ ] Post categories/subreddits
- [ ] Search functionality
- [ ] Markdown support in posts/comments
- [ ] Image uploads
- [ ] Voting system (upvote/downvote)
- [ ] User profiles

## 📝 License

MIT

## 👨‍💻 Author

Built as a technical challenge demonstrating:
- Advanced Django ORM optimization
- Atomic database operations
- Recursive React components
- Modern UI/UX design
