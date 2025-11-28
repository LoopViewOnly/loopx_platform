import React, { useState, useEffect, useRef } from 'react';
import { MAGIC_CHALLENGE } from '../challenges/content';

interface MagicChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const MagicChallenge: React.FC<MagicChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        const correct = answer.trim() === MAGIC_CHALLENGE.answer;
        
        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false);
            setError("❌ Incorrect. The magic number is different. Check the page again!");
            setAnswer('');
        }
    };

    return (
        <>
        <style>{`
            @keyframes magic-glow {
              0%, 100% {
                box-shadow: 0 0 5px #a855f7, 0 0 10px #a855f7, 0 0 15px #d946ef;
              }
              50% {
                box-shadow: 0 0 10px #a855f7, 0 0 20px #d946ef, 0 0 25px #d946ef;
              }
            }

            @keyframes sparkle {
              0% { transform: scale(0) rotate(0deg); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: scale(1.5) rotate(360deg); opacity: 0; }
            }

            .magic-button {
                animation: magic-glow 3s infinite ease-in-out;
            }

            .magic-star::before,
            .magic-star::after {
              content: '✨';
              position: absolute;
              font-size: 12px;
              opacity: 0;
              animation: sparkle 2.5s infinite;
              text-shadow: 0 0 5px #fff;
            }

            .magic-star::before {
              top: 10%;
              left: 15%;
              animation-delay: 0s;
            }

            .magic-star::after {
              bottom: 10%;
              right: 15%;
              animation-delay: 1.25s;
            }
        `}</style>
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h1 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h1>
            <p className="text-lg font-semibold text-gray-200 mb-6">{MAGIC_CHALLENGE.question}</p>
            
            <div className="mb-8">
                <a 
                    href={MAGIC_CHALLENGE.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:scale-105 magic-button magic-star overflow-hidden"
                >
                    Visit The Magic Page
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="flex gap-2 justify-center mb-4">
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter count"
                        disabled={submittedCorrectly}
                        className="w-40 p-2 border rounded-lg text-center text-lg focus:ring-2 focus:ring-purple-500 outline-none bg-black/40 text-white border-blue-500/50 placeholder-gray-400"
                    />
                    {!submittedCorrectly && (
                         <button 
                            type="submit"
                            disabled={!answer.trim() || hasSubmitted}
                            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
            
            <div className="mt-2 text-lg font-bold min-h-6">
                 {error && <p className="text-red-400">{error}</p>}
                 {submittedCorrectly && (
                    <p className="text-green-400">✅ Correct! That's magical!</p>
                )}
            </div>
        </div>
        </>
    );
};

export default MagicChallenge;