import React, { useState } from 'react';

interface HiddenPasswordChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const CORRECT_PASSWORD = "67";

const HiddenPasswordChallenge: React.FC<HiddenPasswordChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCorrect) return;

        if (password.trim() === CORRECT_PASSWORD) {
            setError(null);
            setIsCorrect(true);
            onComplete(true);
        } else {
            setError("Incorrect password. The secret is closer than you think. Try inspecting the box!");
            setPassword('');
        }
    };

    return (
        <>
        <style>{`
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.3);
              }
              50% {
                box-shadow: 0 0 30px rgba(168, 85, 247, 0.6), 0 0 45px rgba(168, 85, 247, 0.5);
              }
            }
            .purple-glow-box {
              animation: pulse-glow 3s infinite ease-in-out;
            }
        `}</style>
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">A secret password is hidden inside the glowing box. Find it and enter it below.</p>

            <div className="flex justify-center my-8">
                <div 
                    className="w-full max-w-lg h-48 bg-purple-800 rounded-lg border-2 border-purple-500/50 purple-glow-box transition-all duration-300 hover:bg-purple-700 hover:scale-105 cursor-pointer"
                    data-secret={`Password="${CORRECT_PASSWORD}"`}
                    title="There might be more to this box than meets the eye..."
                >
                    {/* The box is visually empty */}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={isCorrect}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-purple-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 text-center text-xl"
                />
                {!isCorrect && (
                    <button
                        type="submit"
                        disabled={!password.trim()}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Password
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {isCorrect && (
                    <p className="text-2xl font-bold text-green-400">Correct! You found the secret!</p>
                )}
            </div>
        </div>
        </>
    );
};

export default HiddenPasswordChallenge;