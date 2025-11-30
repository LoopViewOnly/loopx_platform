import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ReactionTestChallengeProps {
    onComplete: (reactionTime: number) => void;
    challengeTitle: string;
}

type GameState = 'waiting' | 'ready' | 'go' | 'too_early' | 'result';

// Average human reaction time is around 250ms
// Professional gamers can hit 150-180ms
const REACTION_BENCHMARKS = {
    INCREDIBLE: 150,  // < 150ms - Incredible reflexes!
    EXCELLENT: 200,   // 150-200ms - Excellent
    GOOD: 250,        // 200-250ms - Good (average)
    AVERAGE: 300,     // 250-300ms - Average
    SLOW: 400,        // 300-400ms - Below average
};

const getReactionRating = (time: number): { rating: string; color: string; emoji: string } => {
    if (time < REACTION_BENCHMARKS.INCREDIBLE) {
        return { rating: 'INCREDIBLE!', color: 'text-purple-400', emoji: '🏆' };
    } else if (time < REACTION_BENCHMARKS.EXCELLENT) {
        return { rating: 'EXCELLENT!', color: 'text-green-400', emoji: '⚡' };
    } else if (time < REACTION_BENCHMARKS.GOOD) {
        return { rating: 'GOOD!', color: 'text-blue-400', emoji: '👍' };
    } else if (time < REACTION_BENCHMARKS.AVERAGE) {
        return { rating: 'AVERAGE', color: 'text-yellow-400', emoji: '😊' };
    } else if (time < REACTION_BENCHMARKS.SLOW) {
        return { rating: 'SLOW', color: 'text-orange-400', emoji: '🐢' };
    } else {
        return { rating: 'VERY SLOW', color: 'text-red-400', emoji: '😴' };
    }
};

const calculateScore = (reactionTime: number): number => {
    // Score based on reaction time
    // 100 points for < 150ms, decreasing from there
    if (reactionTime < 150) return 100;
    if (reactionTime < 180) return 95;
    if (reactionTime < 200) return 90;
    if (reactionTime < 220) return 85;
    if (reactionTime < 250) return 80;
    if (reactionTime < 280) return 70;
    if (reactionTime < 300) return 60;
    if (reactionTime < 350) return 50;
    if (reactionTime < 400) return 40;
    if (reactionTime < 500) return 30;
    return 20; // Minimum score for completing
};

const ReactionTestChallenge: React.FC<ReactionTestChallengeProps> = ({ 
    onComplete, 
    challengeTitle 
}) => {
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_ATTEMPTS = 3;

    const startGame = useCallback(() => {
        setGameState('ready');
        setReactionTime(null);
        
        // Random delay between 1.5 and 5 seconds
        const delay = Math.random() * 3500 + 1500;
        
        timeoutRef.current = setTimeout(() => {
            startTimeRef.current = performance.now();
            setGameState('go');
        }, delay);
    }, []);

    const handleClick = useCallback(() => {
        if (gameState === 'waiting') {
            startGame();
        } else if (gameState === 'ready') {
            // Clicked too early!
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setGameState('too_early');
        } else if (gameState === 'go') {
            const endTime = performance.now();
            const time = Math.round(endTime - startTimeRef.current);
            setReactionTime(time);
            setAttempts(prev => prev + 1);
            
            // Update best time
            if (bestTime === null || time < bestTime) {
                setBestTime(time);
            }
            
            setGameState('result');
        } else if (gameState === 'too_early') {
            startGame();
        } else if (gameState === 'result') {
            if (attempts < MAX_ATTEMPTS) {
                startGame();
            }
        }
    }, [gameState, startGame, bestTime, attempts]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleComplete = () => {
        if (bestTime !== null) {
            onComplete(bestTime);
        }
    };

    const renderBox = () => {
        switch (gameState) {
            case 'waiting':
                return (
                    <div 
                        onClick={handleClick}
                        className="w-full h-64 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:from-blue-500 hover:to-blue-700 transition-all duration-300 border-4 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                    >
                        <span className="text-6xl mb-4">🎯</span>
                        <span className="text-white text-2xl font-bold">Click to Start!</span>
                        <span className="text-blue-200 text-sm mt-2">Test your reaction speed</span>
                    </div>
                );
            
            case 'ready':
                return (
                    <div 
                        onClick={handleClick}
                        className="w-full h-64 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-4 border-red-400 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse"
                    >
                        <span className="text-6xl mb-4">⏳</span>
                        <span className="text-white text-2xl font-bold">WAIT FOR GREEN...</span>
                        <span className="text-red-200 text-sm mt-2">Don't click yet!</span>
                    </div>
                );
            
            case 'go':
                return (
                    <div 
                        onClick={handleClick}
                        className="w-full h-64 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-4 border-green-300 shadow-[0_0_50px_rgba(34,197,94,0.8)] transition-all duration-100"
                    >
                        <span className="text-6xl mb-4">⚡</span>
                        <span className="text-white text-3xl font-bold animate-bounce">CLICK NOW!</span>
                    </div>
                );
            
            case 'too_early':
                return (
                    <div 
                        onClick={handleClick}
                        className="w-full h-64 bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-4 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                    >
                        <span className="text-6xl mb-4">😬</span>
                        <span className="text-white text-2xl font-bold">TOO EARLY!</span>
                        <span className="text-orange-200 text-sm mt-2">Click to try again</span>
                    </div>
                );
            
            case 'result':
                const rating = reactionTime ? getReactionRating(reactionTime) : null;
                return (
                    <div 
                        onClick={attempts < MAX_ATTEMPTS ? handleClick : undefined}
                        className={`w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex flex-col items-center justify-center border-4 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] ${attempts < MAX_ATTEMPTS ? 'cursor-pointer hover:border-cyan-400' : ''}`}
                    >
                        <span className="text-5xl mb-2">{rating?.emoji}</span>
                        <span className={`text-4xl font-bold ${rating?.color}`}>
                            {reactionTime}ms
                        </span>
                        <span className={`text-xl font-semibold mt-1 ${rating?.color}`}>
                            {rating?.rating}
                        </span>
                        {attempts < MAX_ATTEMPTS && (
                            <span className="text-cyan-300 text-sm mt-3">
                                Click to try again ({MAX_ATTEMPTS - attempts} attempts left)
                            </span>
                        )}
                    </div>
                );
            
            default:
                return null;
        }
    };

    const rating = bestTime ? getReactionRating(bestTime) : null;
    const score = bestTime ? calculateScore(bestTime) : 0;
    const canComplete = attempts >= 1 && bestTime !== null;

    return (
        <div className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-500/50 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] text-center select-none">
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">{challengeTitle}</h2>
            
            {/* Icon */}
            <div className="text-4xl mb-4">⚡</div>

            {/* Instructions */}
            <div className="mb-6 bg-black/40 border border-cyan-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">🎯 REACTION TEST</h3>
                <p className="text-gray-300 text-sm">
                    Click the box when it turns <span className="text-green-400 font-bold">GREEN</span>!
                </p>
                <p className="text-gray-400 text-xs mt-1">
                    Average human reaction time: ~250ms
                </p>
            </div>

            {/* Stats Bar */}
            <div className="flex justify-center gap-6 mb-6">
                <div className="bg-black/30 px-4 py-2 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400">Attempts</p>
                    <p className="text-xl font-bold text-white">{attempts}/{MAX_ATTEMPTS}</p>
                </div>
                {bestTime !== null && (
                    <div className="bg-black/30 px-4 py-2 rounded-lg border border-green-500/30">
                        <p className="text-xs text-gray-400">Best Time</p>
                        <p className={`text-xl font-bold ${rating?.color}`}>{bestTime}ms</p>
                    </div>
                )}
                {bestTime !== null && (
                    <div className="bg-black/30 px-4 py-2 rounded-lg border border-yellow-500/30">
                        <p className="text-xs text-gray-400">Score</p>
                        <p className="text-xl font-bold text-yellow-400">{score} pts</p>
                    </div>
                )}
            </div>

            {/* Game Box */}
            <div className="mb-6">
                {renderBox()}
            </div>

            {/* Benchmark Guide */}
            <div className="mb-6 bg-black/30 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-bold text-gray-400 mb-3">⏱️ REACTION TIME BENCHMARKS</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-purple-900/30 px-2 py-1 rounded">
                        <span className="text-purple-400">🏆 &lt;150ms</span>
                        <span className="text-gray-400 ml-1">Incredible</span>
                    </div>
                    <div className="bg-green-900/30 px-2 py-1 rounded">
                        <span className="text-green-400">⚡ 150-200ms</span>
                        <span className="text-gray-400 ml-1">Excellent</span>
                    </div>
                    <div className="bg-blue-900/30 px-2 py-1 rounded">
                        <span className="text-blue-400">👍 200-250ms</span>
                        <span className="text-gray-400 ml-1">Good</span>
                    </div>
                    <div className="bg-yellow-900/30 px-2 py-1 rounded">
                        <span className="text-yellow-400">😊 250-300ms</span>
                        <span className="text-gray-400 ml-1">Average</span>
                    </div>
                    <div className="bg-orange-900/30 px-2 py-1 rounded">
                        <span className="text-orange-400">🐢 300-400ms</span>
                        <span className="text-gray-400 ml-1">Slow</span>
                    </div>
                    <div className="bg-red-900/30 px-2 py-1 rounded">
                        <span className="text-red-400">😴 &gt;400ms</span>
                        <span className="text-gray-400 ml-1">Very Slow</span>
                    </div>
                </div>
            </div>

            {/* Complete Button */}
            {canComplete && (
                <button
                    onClick={handleComplete}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-600/30"
                >
                    Complete Challenge → ({score} pts)
                </button>
            )}
        </div>
    );
};

export default ReactionTestChallenge;

