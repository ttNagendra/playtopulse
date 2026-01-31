"""
Script to create test data for the Reddit clone application.
Creates users, posts, comments, and likes to demonstrate functionality.
"""
import os
import django
import sys
from datetime import timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reddit_clone.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Post, Comment, Like

def create_test_data():
    print("Creating test data...")
    
    # Create users
    users = []
    for i in range(5):
        username = f"user{i+1}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={'email': f'{username}@example.com'}
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"Created user: {username}")
        users.append(user)
    
    # Create posts
    posts = []
    post_contents = [
        "Just discovered this amazing community! Excited to be here 🎉",
        "What's everyone working on today? I'm building a Django app!",
        "Hot take: Python is the best programming language for beginners",
        "Looking for recommendations on React state management libraries",
        "Just finished a 24-hour coding marathon. Time for sleep! 😴"
    ]
    
    for i, content in enumerate(post_contents):
        post, created = Post.objects.get_or_create(
            author=users[i % len(users)],
            content=content
        )
        if created:
            print(f"Created post: {content[:50]}...")
        posts.append(post)
    
    # Create comments with threading
    comments = []
    
    # Top-level comments
    comment1 = Comment.objects.get_or_create(
        author=users[1],
        post=posts[0],
        content="Welcome! This is a great place to learn and share.",
        defaults={'parent': None}
    )[0]
    comments.append(comment1)
    
    # Nested reply
    comment2 = Comment.objects.get_or_create(
        author=users[2],
        post=posts[0],
        content="Totally agree! The community here is awesome.",
        defaults={'parent': comment1}
    )[0]
    comments.append(comment2)
    
    # Deeply nested reply
    comment3 = Comment.objects.get_or_create(
        author=users[3],
        post=posts[0],
        content="I've been here for a month and learned so much!",
        defaults={'parent': comment2}
    )[0]
    comments.append(comment3)
    
    # More comments on other posts
    for i in range(1, len(posts)):
        comment = Comment.objects.get_or_create(
            author=users[(i + 1) % len(users)],
            post=posts[i],
            content=f"Great post! This is really helpful.",
            defaults={'parent': None}
        )[0]
        comments.append(comment)
    
    print(f"Created {len(comments)} comments")
    
    # Create likes
    like_count = 0
    
    # Like posts
    for post in posts:
        for user in users[:3]:  # First 3 users like all posts
            _, created = Like.objects.get_or_create(
                user=user,
                post=post,
                comment=None
            )
            if created:
                like_count += 1
    
    # Like comments
    for comment in comments:
        for user in users[:2]:  # First 2 users like all comments
            _, created = Like.objects.get_or_create(
                user=user,
                post=None,
                comment=comment
            )
            if created:
                like_count += 1
    
    print(f"Created {like_count} likes")
    
    # Create some old likes (older than 24h) to test leaderboard filtering
    old_time = timezone.now() - timedelta(hours=25)
    old_like = Like.objects.create(
        user=users[4],
        post=posts[0],
        comment=None
    )
    old_like.created_at = old_time
    old_like.save()
    print("Created 1 old like (25h ago) for leaderboard testing")
    
    print("\n✅ Test data created successfully!")
    print(f"Users: {User.objects.count()}")
    print(f"Posts: {Post.objects.count()}")
    print(f"Comments: {Comment.objects.count()}")
    print(f"Likes: {Like.objects.count()}")

if __name__ == '__main__':
    create_test_data()
