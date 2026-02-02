import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSuccess, onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            if (onSuccess) onSuccess();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="card max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gradient mb-6">Login</h2>

            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-2">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field w-full"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-white/60">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToSignup}
                        className="text-primary-400 hover:text-primary-300 font-semibold"
                    >
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
