import React, { useState } from 'react';
import { ASCII_CHALLENGE } from '../challenges/content';

interface ASCIIChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const ASCIIChallenge: React.FC<ASCIIChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const handleSubmit = () => {
        if (isComplete || !userAnswer.trim()) return;

        const normalizedUserAnswer = userAnswer.trim().toLowerCase();
        const normalizedCorrectAnswer = ASCII_CHALLENGE.answer.toLowerCase();

        if (normalizedUserAnswer === normalizedCorrectAnswer) {
            setFeedback({ message: '✅ Correct! You decoded the ASCII message!', color: 'text-green-400' });
            setIsComplete(true);
            onComplete(true);
        } else {
            setAttempts(prev => prev + 1);
            setFeedback({ message: '❌ Incorrect. Try again!', color: 'text-red-400' });
            
            // Clear feedback after a moment
            setTimeout(() => {
                if (!isComplete) {
                    setFeedback(null);
                }
            }, 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">{challengeTitle}</h2>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10 max-w-2xl mx-auto">
                <p className="text-gray-300">
                    Decode the following <strong className="text-blue-400">ASCII</strong> message:
                </p>
            </div>

            {/* ASCII Message Display */}
            <div className="mb-8 p-6 bg-black/40 rounded-lg border border-white/20 max-w-3xl mx-auto">
                <p className="text-white font-mono text-2xl md:text-3xl font-bold tracking-wide">
                    {ASCII_CHALLENGE.message}
                </p>
            </div>

            {/* Answer Input */}
            <div className="flex flex-col items-center gap-4 mb-6">
                <div className="flex items-center gap-4 w-full max-w-md">
                    <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isComplete}
                        placeholder="Type the decoded message..."
                        className="flex-1 px-4 py-3 bg-black/40 border-2 border-white/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-center text-lg"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isComplete || !userAnswer.trim()}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Submit Answer
                </button>
            </div>

            {/* Attempts Counter */}
            {attempts > 0 && !isComplete && (
                <p className="text-gray-500 text-sm mb-4">
                    Attempts: {attempts}
                </p>
            )}

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
            </div>

            {/* Hint */}
            {attempts >= 3 && !isComplete && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-md mx-auto">
                    <p className="text-yellow-300 text-sm">
                        💡 <strong>Hint:</strong> ASCII 76 = 'L', 32 = space. Look up an ASCII table online!
                    </p>
                </div>
            )}
        </div>
    );
};

export default ASCIIChallenge;

