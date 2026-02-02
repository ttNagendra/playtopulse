import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);

    // Load user on mount if token exists
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/auth/user/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error loading user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', {
                username,
                password
            });

            const { user: userData, tokens } = response.data;

            // Save tokens to localStorage
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            setToken(tokens.access);
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const register = async (username, email, password, password2) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register/', {
                username,
                email,
                password,
                password2
            });

            const { user: userData, tokens } = response.data;

            // Save tokens to localStorage
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);

            setToken(tokens.access);
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
