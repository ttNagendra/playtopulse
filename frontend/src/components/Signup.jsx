import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Signup = ({ onSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        // Client-side validation
        if (formData.password !== formData.password2) {
            setErrors({ password: "Passwords don't match" });
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setErrors({ password: "Password must be at least 8 characters" });
            setLoading(false);
            return;
        }

        const result = await register(
            formData.username,
            formData.email,
            formData.password,
            formData.password2
        );

        if (result.success) {
            if (onSuccess) onSuccess();
        } else {
            setErrors(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="card max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-gradient mb-6">Sign Up</h2>

            {errors.non_field_errors && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                    {errors.non_field_errors}
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
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                        autoFocus
                    />
                    {errors.username && (
                        <p className="text-red-400 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                        minLength={8}
                    />
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password2" className="block text-sm font-medium text-white/70 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password2"
                        name="password2"
                        value={formData.password2}
                        onChange={handleChange}
                        className="input-field w-full"
                        required
                        minLength={8}
                    />
                    {errors.password2 && (
                        <p className="text-red-400 text-sm mt-1">{errors.password2}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-white/60">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-primary-400 hover:text-primary-300 font-semibold"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
