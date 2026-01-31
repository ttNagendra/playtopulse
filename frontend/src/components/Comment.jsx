import React, { useState } from 'react';
import { likesAPI, commentsAPI } from '../api';

const Comment = ({ comment, depth = 0, onLike, onReply }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.like_count || 0);

    const handleLike = async () => {
        if (isLiked) return; // Prevent double-liking

        try {
            await likesAPI.create(null, comment.id);
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            if (onLike) onLike();
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            await commentsAPI.create(comment.post, replyContent, comment.id);
            setReplyContent('');
            setShowReplyForm(false);
            if (onReply) onReply();
        } catch (error) {
            console.error('Error replying to comment:', error);
        }
    };

    return (
        <div
            className={`animate-slide-up ${depth > 0 ? 'comment-indent mt-3' : 'mt-4'}`}
            style={{ marginLeft: `${depth * 20}px` }}
        >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-primary-300">
                                {comment.author.username}
                            </span>
                            <span className="text-xs text-white/50">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-white/90 mb-3">{comment.content}</p>

                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={handleLike}
                                className={`like-button flex items-center gap-1 ${isLiked ? 'liked' : ''}`}
                                disabled={isLiked}
                            >
                                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{likeCount}</span>
                            </button>

                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-white/70 hover:text-primary-400 transition-colors"
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReply} className="mt-4 animate-fade-in">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="input-field w-full resize-none"
                            rows="2"
                        />
                        <div className="flex gap-2 mt-2">
                            <button type="submit" className="btn-primary text-sm">
                                Reply
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowReplyForm(false)}
                                className="btn-secondary text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Recursive rendering of replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <Comment
                            key={reply.id}
                            comment={reply}
                            depth={depth + 1}
                            onLike={onLike}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment;
