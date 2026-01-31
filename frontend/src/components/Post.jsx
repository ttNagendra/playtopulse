import React, { useState } from 'react';
import { likesAPI, commentsAPI } from '../api';
import Comment from './Comment';

const Post = ({ post, onUpdate }) => {
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);

    const handleLike = async () => {
        if (isLiked) return; // Prevent double-liking

        try {
            await likesAPI.create(post.id, null);
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        try {
            await commentsAPI.create(post.id, commentContent);
            setCommentContent('');
            setShowCommentForm(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    // Get top-level comments (no parent)
    const topLevelComments = post.comments || [];

    return (
        <div className="card animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold">
                            {post.author.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gradient">
                                {post.author.username}
                            </h3>
                            <p className="text-xs text-white/50">
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <p className="text-white/90 text-lg mb-4 leading-relaxed">
                        {post.content}
                    </p>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLike}
                            className={`like-button flex items-center gap-2 ${isLiked ? 'liked' : ''}`}
                            disabled={isLiked}
                        >
                            <svg className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="font-semibold">{likeCount}</span>
                        </button>

                        <button
                            onClick={() => setShowCommentForm(!showCommentForm)}
                            className="flex items-center gap-2 text-white/70 hover:text-primary-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="font-semibold">{topLevelComments.length} Comments</span>
                        </button>
                    </div>
                </div>
            </div>

            {showCommentForm && (
                <form onSubmit={handleComment} className="mb-4 animate-fade-in">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="input-field w-full resize-none"
                        rows="3"
                    />
                    <div className="flex gap-2 mt-2">
                        <button type="submit" className="btn-primary">
                            Comment
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCommentForm(false)}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Render top-level comments with recursive nesting */}
            {topLevelComments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-white/70 mb-4">Comments</h4>
                    {topLevelComments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            depth={0}
                            onLike={onUpdate}
                            onReply={onUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Post;
