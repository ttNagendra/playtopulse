import React from 'react';
import Feed from './components/Feed';
import Leaderboard from './components/Leaderboard';

function App() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-gradient">PlaytoPulse</span>
          </h1>
          <p className="text-white/60">Share, discuss, and connect with the community</p>
        </header>

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
      </div>
    </div>
  );
}

export default App;
