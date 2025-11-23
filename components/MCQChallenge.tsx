import React, { useState, useEffect, useRef } from 'react';

interface MCQChallengeProps {
    question: string;
    options: string[];
    correctAnswer: string;
    challengeTitle: string;
    onComplete: (mistakes: number) => void;
    isCode?: boolean;
}

// Helper shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MCQChallenge: React.FC<MCQChallengeProps> = ({ question, options, correctAnswer, challengeTitle, onComplete, isCode }) => {
    const [selected, setSelected] = useState<string | null>(null);
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mistakes, setMistakes] = useState(0);
    
    // Shuffle options once on mount to randomize order. 
    const [shuffledOptions] = useState(() => shuffleArray(options));
    
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleSubmit = () => {
        if (!selected || submittedCorrectly) return;

        const isCorrect = selected === correctAnswer;
        
        if (isCorrect) {
            onComplete(mistakes);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
             setMistakes(prev => prev + 1);
             setError("Incorrect answer. Please try again.");
        }
    };
    
    const getOptionClass = (option: string) => {
        if (submittedCorrectly) {
            if (option === correctAnswer) {
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
            <p className="text-white mb-8 text-lg">{question}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffledOptions.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !submittedCorrectly && setSelected(option)}
                        disabled={submittedCorrectly}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-sm font-semibold text-white whitespace-pre-wrap font-mono ${isCode ? 'text-left' : 'text-center'} ${getOptionClass(option)}`}
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
                    Submit Answer
                </button>
            )}

            <div className="mt-8 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Moving on...</p>
                )}
            </div>
        </div>
    );
};

export default MCQChallenge;