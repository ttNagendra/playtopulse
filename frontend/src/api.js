import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock user for development (in production, use real authentication)
const MOCK_USER_ID = 1;

export const postsAPI = {
    getAll: () => api.get('/posts/'),
    getOne: (id) => api.get(`/posts/${id}/`),
    create: (content) => api.post('/posts/', { content }),
};

export const commentsAPI = {
    create: (postId, content, parentId = null) =>
        api.post('/comments/', { post: postId, content, parent: parentId }),
};

export const likesAPI = {
    create: (postId = null, commentId = null) =>
        api.post('/likes/', { post: postId, comment: commentId }),
};

export const leaderboardAPI = {
    get: () => api.get('/leaderboard/'),
};

export default api;
