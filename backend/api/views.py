from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q, Count, F, Value, IntegerField
from django.db.models.functions import Coalesce
from django.utils import timezone
from django.contrib.auth.models import User
from datetime import timedelta

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer, LeaderboardSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Posts with N+1 query optimization.
    Uses select_related and prefetch_related to minimize database hits.
    """
    serializer_class = PostSerializer

    def get_queryset(self):
        """
        Optimized queryset to prevent N+1 queries.
        Prefetches all related data in a minimal number of queries.
        """
        return Post.objects.select_related('author').prefetch_related(
            'likes',
            'comments__author',
            'comments__likes',
            'comments__replies__author',
            'comments__replies__likes',
            'comments__replies__replies__author',
            'comments__replies__replies__likes',
        )


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Comments with recursive reply support."""
    serializer_class = CommentSerializer
    queryset = Comment.objects.select_related('author', 'post').prefetch_related(
        'likes',
        'replies__author',
        'replies__likes',
    )


class LikeCreateView(generics.CreateAPIView):
    """
    Create a Like with atomic transaction to prevent race conditions.
    Uses get_or_create to prevent duplicate likes.
    """
    serializer_class = LikeSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Atomic like creation - prevents duplicate likes even with concurrent requests.
        """
        user = request.user
        post_id = request.data.get('post')
        comment_id = request.data.get('comment')

        # Determine what we're liking
        if post_id:
            like, created = Like.objects.get_or_create(
                user=user,
                post_id=post_id,
                defaults={'comment': None}
            )
        elif comment_id:
            like, created = Like.objects.get_or_create(
                user=user,
                comment_id=comment_id,
                defaults={'post': None}
            )
        else:
            return Response(
                {'error': 'Must specify either post or comment'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(like)
        
        if created:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'message': 'Already liked', 'like': serializer.data},
                status=status.HTTP_200_OK
            )


class LeaderboardView(generics.ListAPIView):
    """
    Dynamic 24-hour leaderboard.
    Calculates karma on-the-fly: post_likes * 5 + comment_likes * 1
    Only counts likes from the last 24 hours.
    """
    serializer_class = LeaderboardSerializer

    def get_queryset(self):
        """
        Calculate karma dynamically from likes in the last 24 hours.
        Post likes are worth 5 points, comment likes are worth 1 point.
        """
        now = timezone.now()
        last_24h = now - timedelta(hours=24)

        # Annotate users with karma calculation
        queryset = User.objects.annotate(
            # Count post likes from last 24h
            post_likes=Count(
                'posts__likes',
                filter=Q(posts__likes__created_at__gte=last_24h),
                distinct=True
            ),
            # Count comment likes from last 24h
            comment_likes=Count(
                'comments__likes',
                filter=Q(comments__likes__created_at__gte=last_24h),
                distinct=True
            ),
            # Calculate total karma
            karma=F('post_likes') * 5 + F('comment_likes') * 1
        ).filter(
            karma__gt=0  # Only show users with karma
        ).order_by('-karma')[:5]  # Top 5 users

        return queryset

    def list(self, request, *args, **kwargs):
        """Return leaderboard data."""
        queryset = self.get_queryset()
        data = [
            {'username': user.username, 'karma': user.karma}
            for user in queryset
        ]
        return Response(data)
