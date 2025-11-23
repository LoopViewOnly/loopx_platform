import React, { useState, useEffect, useRef } from 'react';
import { MAGIC_CHALLENGE } from '../challenges/content';

interface MagicChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const MagicChallenge: React.FC<MagicChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly) return;

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
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h1 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h1>
            <p className="text-lg font-semibold text-gray-200 mb-6">{MAGIC_CHALLENGE.question}</p>
            
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
                            disabled={!answer.trim()}
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
    );
};

export default MagicChallenge;