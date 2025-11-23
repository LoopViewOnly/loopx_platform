
import React, { useState, useEffect, useRef } from 'react';
import { PROMPT_CHALLENGE } from '../challenges/content';

interface PromptChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const PromptChallenge: React.FC<PromptChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleSubmit = () => {
        if (!selected || submittedCorrectly) return;

        const isCorrect = selected === PROMPT_CHALLENGE.correctAnswer;
        
        if (isCorrect) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
             onComplete(null);
             setError("Not quite! The best prompts are more descriptive. Try another one.");
        }
    };
    
    const getOptionClass = (option: string) => {
        if (submittedCorrectly) {
            if (option === PROMPT_CHALLENGE.correctAnswer) {
                return 'bg-green-700 border-green-500';
            }
            return 'bg-black/40 border-gray-600 opacity-60';
        }

        return selected === option 
            ? 'bg-blue-600 border-blue-400 scale-105' 
            : 'bg-black/40 border-blue-500/50 hover:bg-white/10';
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-white mb-8 text-md">{PROMPT_CHALLENGE.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {PROMPT_CHALLENGE.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !submittedCorrectly && setSelected(option)}
                        disabled={submittedCorrectly}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-sm font-mono text-white ${getOptionClass(option)}`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {!submittedCorrectly && (
                <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Finalize Choice
                </button>
            )}

            <div className="mt-8 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Excellent choice! Moving on...</p>
                )}
            </div>
        </div>
    );
};

export default PromptChallenge;
