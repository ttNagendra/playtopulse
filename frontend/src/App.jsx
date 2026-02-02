import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Feed from './components/Feed';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import Signup from './components/Signup';

function AppContent() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const switchToSignup = () => {
    setAuthMode('signup');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-5xl font-bold mb-2">
                <span className="text-gradient">PlaytoPulse</span>
              </h1>
              <p className="text-white/60">Share, discuss, and connect with the community</p>
            </div>

            {/* Auth buttons */}
            <div className="ml-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white/60">Welcome,</p>
                    <p className="font-semibold text-primary-300">{user?.username}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuth(true);
                  }}
                  className="btn-primary"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Auth Modal */}
        {showAuth && !isAuthenticated && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative max-w-md w-full">
              <button
                onClick={() => setShowAuth(false)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10"
              >
                ✕
              </button>
              {authMode === 'login' ? (
                <Login onSuccess={handleAuthSuccess} onSwitchToSignup={switchToSignup} />
              ) : (
                <Signup onSuccess={handleAuthSuccess} onSwitchToLogin={switchToLogin} />
              )}
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Feed />
          </div>

          {/* Leaderboard - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pb-8 text-center">
          <div className="glassmorphism inline-block px-8 py-4">
            <p className="text-white/60 text-sm">
              Made with ❤️ by{' '}
              <span className="text-gradient font-semibold text-lg">Nagendra</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
