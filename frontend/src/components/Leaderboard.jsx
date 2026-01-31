import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const response = await leaderboardAPI.get();
            setLeaders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchLeaderboard, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glassmorphism p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <h2 className="text-2xl font-bold text-gradient">Leaderboard</h2>
            </div>

            <p className="text-sm text-white/60 mb-4">Top contributors (24h)</p>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
            ) : leaders.length === 0 ? (
                <p className="text-white/50 text-center py-8">No activity yet</p>
            ) : (
                <div className="space-y-3">
                    {leaders.map((leader, index) => (
                        <div
                            key={leader.username}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900' : ''}
                  ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900' : ''}
                  ${index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900' : ''}
                  ${index > 2 ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : ''}
                `}>
                                    {index + 1}
                                </div>
                                <span className="font-semibold text-white/90">
                                    {leader.username}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-lg font-bold text-gradient">
                                    {leader.karma}
                                </span>
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                    Karma = Post Likes × 5 + Comment Likes × 1
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;
