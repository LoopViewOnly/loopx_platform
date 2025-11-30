import React, { useState, useCallback } from 'react';

interface NumberGuessingChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const NumberGuessingChallenge: React.FC<NumberGuessingChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState('');
    const [hearts, setHearts] = useState(10);
    const [feedback, setFeedback] = useState<'higher' | 'lower' | 'correct' | null>(null);
    const [guessHistory, setGuessHistory] = useState<{ value: number; result: 'higher' | 'lower' }[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);

    const resetGame = useCallback(() => {
        setTargetNumber(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setHearts(10);
        setFeedback(null);
        setGuessHistory([]);
        setGameOver(false);
        setWon(false);
    }, []);

    const handleGuess = () => {
        const guessNum = parseInt(guess, 10);
        
        if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
            return;
        }

        if (guessNum === targetNumber) {
            setFeedback('correct');
            setWon(true);
            setGameOver(true);
        } else {
            const result = guessNum < targetNumber ? 'higher' : 'lower';
            setFeedback(result);
            setGuessHistory(prev => [...prev, { value: guessNum, result }]);
            
            const newHearts = hearts - 1;
            setHearts(newHearts);
            
            if (newHearts === 0) {
                setGameOver(true);
            }
        }
        
        setGuess('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !gameOver) {
            handleGuess();
        }
    };

    const renderHearts = () => {
        return (
            <div className="flex justify-center gap-1 flex-wrap mb-6">
                {Array.from({ length: 10 }, (_, i) => (
                    <span
                        key={i}
                        className={`text-2xl transition-all duration-300 ${
                            i < hearts 
                                ? 'text-red-500 scale-100' 
                                : 'text-gray-600 scale-75 opacity-50'
                        }`}
                    >
                        ❤️
                    </span>
                ))}
            </div>
        );
    };

    const getFeedbackMessage = () => {
        if (feedback === 'higher') {
            return (
                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-500 rounded-xl p-4 mb-6 animate-pulse">
                    <span className="text-3xl">⬆️</span>
                    <p className="text-xl font-bold text-orange-400 mt-2">Go HIGHER!</p>
                    <p className="text-gray-400 text-sm">The number is bigger than your guess</p>
                </div>
            );
        }
        if (feedback === 'lower') {
            return (
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500 rounded-xl p-4 mb-6 animate-pulse">
                    <span className="text-3xl">⬇️</span>
                    <p className="text-xl font-bold text-blue-400 mt-2">Go LOWER!</p>
                    <p className="text-gray-400 text-sm">The number is smaller than your guess</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">
                I'm thinking of a number between <span className="text-yellow-400 font-bold">1</span> and <span className="text-yellow-400 font-bold">100</span>. Can you guess it?
            </p>

            {renderHearts()}

            {!gameOver ? (
                <>
                    {getFeedbackMessage()}

                    {guessHistory.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm text-gray-400 mb-2">Previous guesses:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {guessHistory.map((g, i) => (
                                    <span
                                        key={i}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            g.result === 'higher'
                                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                                        }`}
                                    >
                                        {g.value} {g.result === 'higher' ? '↑' : '↓'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your guess (1-100)"
                            className="w-64 px-4 py-3 text-center text-xl font-bold bg-black/50 border-2 border-blue-500/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                            autoFocus
                        />
                        <button
                            onClick={handleGuess}
                            disabled={!guess}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-purple-600/30"
                        >
                            🎯 Guess!
                        </button>
                    </div>

                    <p className="mt-6 text-gray-500 text-sm">
                        {hearts} {hearts === 1 ? 'heart' : 'hearts'} remaining
                    </p>
                </>
            ) : won ? (
                <div className="mt-4">
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500 rounded-xl p-6 mb-6">
                        <span className="text-5xl">🎉</span>
                        <h3 className="text-3xl font-bold text-green-400 mt-4">You Got It!</h3>
                        <p className="text-gray-300 mt-2">
                            The number was <span className="text-green-400 font-bold text-2xl">{targetNumber}</span>
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            You found it with {hearts} {hearts === 1 ? 'heart' : 'hearts'} remaining!
                        </p>
                    </div>
                    <button
                        onClick={() => onComplete(true)}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-600/30"
                    >
                        Next Challenge →
                    </button>
                </div>
            ) : (
                <div className="mt-4">
                    <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500 rounded-xl p-6 mb-6">
                        <span className="text-5xl">💔</span>
                        <h3 className="text-3xl font-bold text-red-400 mt-4">Out of Hearts!</h3>
                        <p className="text-gray-300 mt-2">
                            The number was <span className="text-red-400 font-bold text-2xl">{targetNumber}</span>
                        </p>
                    </div>
                    <button
                        onClick={resetGame}
                        className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:from-orange-500 hover:to-red-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-red-600/30"
                    >
                        🔄 Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default NumberGuessingChallenge;

