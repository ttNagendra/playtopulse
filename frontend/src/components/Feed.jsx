import React, { useState, useEffect } from 'react';
import { postsAPI } from '../api';
import Post from './Post';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');

    const fetchPosts = async () => {
        try {
            const response = await postsAPI.getAll();
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;

        try {
            await postsAPI.create(newPostContent);
            setNewPostContent('');
            setShowCreateForm(false);
            fetchPosts(); // Refresh posts
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glassmorphism p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-4xl font-bold text-gradient">Feed</h1>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn-primary"
                    >
                        {showCreateForm ? 'Cancel' : '+ New Post'}
                    </button>
                </div>

                {showCreateForm && (
                    <form onSubmit={handleCreatePost} className="animate-fade-in">
                        <textarea
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="input-field w-full resize-none"
                            rows="4"
                            autoFocus
                        />
                        <div className="flex gap-2 mt-3">
                            <button type="submit" className="btn-primary">
                                Post
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Posts */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="card text-center py-12">
                    <svg className="w-16 h-16 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-white/50 text-lg">No posts yet. Be the first to post!</p>
                </div>
            ) : (
                posts.map((post) => (
                    <Post key={post.id} post={post} onUpdate={fetchPosts} />
                ))
            )}
        </div>
    );
};

export default Feed;
