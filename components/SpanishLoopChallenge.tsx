import React, { useState } from 'react';
import { SPANISH_LOOP_CHALLENGE } from '../challenges/content';

interface SpanishLoopChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const SpanishLoopChallenge: React.FC<SpanishLoopChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        const correct = answer.trim().toLowerCase() === SPANISH_LOOP_CHALLENGE.answer.toLowerCase();
        
        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false);
            setError("❌ Incorrect. That's not the right translation. Try again!");
            setAnswer('');
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h1 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h1>
            <p className="text-lg font-semibold text-gray-200 mb-6">{SPANISH_LOOP_CHALLENGE.question}</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="flex gap-2 justify-center mb-4">
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter word in Spanish"
                        disabled={submittedCorrectly}
                        className="w-60 p-2 border rounded-lg text-center text-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-black/40 text-white border-blue-500/50 placeholder-gray-400"
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
                    <p className="text-green-400">✅ ¡Correcto! Well done!</p>
                )}
            </div>
        </div>
    );
};

export default SpanishLoopChallenge;
