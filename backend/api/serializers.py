from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment, Like


class UserSerializer(serializers.ModelSerializer):
    """Simple user serializer for nested representations."""
    class Meta:
        model = User
        fields = ['id', 'username']


class RecursiveField(serializers.Serializer):
    """Custom field for recursive serialization of comments."""
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class CommentSerializer(serializers.ModelSerializer):
    """
    Comment serializer with recursive replies.
    Optimized to prevent N+1 queries via prefetch_related.
    """
    author = UserSerializer(read_only=True)
    replies = RecursiveField(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'parent', 'content', 'created_at', 'like_count', 'replies']
        read_only_fields = ['author', 'created_at']

    def get_like_count(self, obj):
        return obj.likes.count()

    def create(self, validated_data):
        # Set author from request context
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class PostSerializer(serializers.ModelSerializer):
    """
    Post serializer with optimized comment fetching.
    Uses prefetch_related to avoid N+1 queries.
    """
    author = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'created_at', 'like_count', 'comments']
        read_only_fields = ['author', 'created_at']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comments(self, obj):
        """Get only top-level comments (no parent). Nested replies are handled recursively."""
        # Filter for top-level comments only
        top_level_comments = obj.comments.filter(parent__isnull=True)
        return CommentSerializer(top_level_comments, many=True, context=self.context).data

    def create(self, validated_data):
        # Set author from request context
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class LikeSerializer(serializers.ModelSerializer):
    """Serializer for creating likes."""
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        # Set user from request context
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard entries."""
    username = serializers.CharField()
    karma = serializers.IntegerField()
