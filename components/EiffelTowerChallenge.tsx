import React, { useState, useEffect, useRef } from 'react';
import { EIFFEL_TOWER_CHALLENGE } from '../challenges/content';

interface EiffelTowerChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const EiffelTowerChallenge: React.FC<EiffelTowerChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        // Normalize answer: remove commas, spaces, and "cm"
        const normalizedAnswer = answer.trim()
            .replace(/,/g, '')
            .replace(/\s/g, '')
            .replace(/cm/gi, '')
            .trim();
        
        const correct = normalizedAnswer === EIFFEL_TOWER_CHALLENGE.answer;

        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false);
            setError('Incorrect! Think about how many cm are in a meter... 🗼');
            setAnswer('');
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            
            {/* Eiffel Tower Emoji/Visual */}
            <div className="text-8xl mb-4">🗼</div>
            
            <p className="text-gray-300 mb-6 text-lg">{EIFFEL_TOWER_CHALLENGE.question}</p>
            <p className="text-gray-500 text-sm mb-6 italic">{EIFFEL_TOWER_CHALLENGE.hint}</p>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter height in cm"
                        disabled={submittedCorrectly}
                        className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">cm</span>
                </div>
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Answer
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">
                        ✅ Correct! The Eiffel Tower is 324 meters = 32,400 cm!
                    </p>
                )}
            </div>
        </div>
    );
};

export default EiffelTowerChallenge;

