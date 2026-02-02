import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle 401 unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Optionally redirect to login
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

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
