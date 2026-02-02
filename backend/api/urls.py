from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostViewSet, CommentViewSet, LikeCreateView, LeaderboardView,
    RegisterView, LoginView, LogoutView, CurrentUserView
)

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
    path('likes/', LikeCreateView.as_view(), name='like-create'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', CurrentUserView.as_view(), name='current-user'),
]
