import React, { useState } from 'react';
import { INTERACTIVE_BINARY_DATA } from '../challenges/content';

interface InteractiveBinaryChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const MINIMUM_SCORE = 50;

const Bit: React.FC<{ value: number; power: number; onClick: () => void; isComplete: boolean }> = ({ value, power, onClick, isComplete }) => (
    <div className="flex flex-col items-center gap-1">
        <button
            type="button"
            onClick={onClick}
            disabled={isComplete}
            className={`w-12 h-16 md:w-16 md:h-20 rounded-lg flex items-center justify-center text-4xl font-bold transition-all duration-200 border-2
                ${value === 1
                    ? 'bg-green-500 text-white border-green-300 shadow-[0_0_15px_rgba(74,222,128,0.7)]'
                    : 'bg-black/40 text-gray-500 border-blue-500/30'
                }
                ${!isComplete ? 'hover:scale-105 hover:border-yellow-400' : 'cursor-default'}
            `}
        >
            {value}
        </button>
        <p className="text-xs text-gray-400 font-mono">{2 ** power}</p>
    </div>
);


const InteractiveBinaryChallenge: React.FC<InteractiveBinaryChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [stageIndex, setStageIndex] = useState(0);
    const [bits, setBits] = useState<number[]>(Array(8).fill(0));
    const [potentialScore, setPotentialScore] = useState(100);
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState<number | null>(null);

    const currentChallenge = INTERACTIVE_BINARY_DATA[stageIndex];
    if (!currentChallenge) {
        return null;
    }
    const powers = [7, 6, 5, 4, 3, 2, 1, 0];

    const handleBitClick = (index: number) => {
        if (isComplete) return;
        const newBits = [...bits];
        newBits[index] = newBits[index] === 0 ? 1 : 0;
        setBits(newBits);
        setFeedback(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete || hasSubmitted) return;
        setHasSubmitted(true);

        const userAnswer = bits.join('');
        if (userAnswer === currentChallenge.answer) {
            setFeedback({ message: 'Correct!', type: 'correct' });
            setTimeout(() => {
                if (stageIndex + 1 < INTERACTIVE_BINARY_DATA.length) {
                    setStageIndex(prev => prev + 1);
                    setBits(Array(8).fill(0));
                    setFeedback(null);
                    setHasSubmitted(false);
                } else {
                    const calculatedFinalScore = Math.max(MINIMUM_SCORE, potentialScore);
                    setFinalScore(calculatedFinalScore);
                    setFeedback({ message: `All conversions correct! Final score: ${calculatedFinalScore}`, type: 'correct' });
                    setIsComplete(true);
                }
            }, 1000);
        } else {
            setPotentialScore(prev => Math.max(0, prev - 10));
            setFeedback({ message: 'Incorrect. -10 points. Try again!', type: 'incorrect' });
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Click the bits to toggle them between 0 and 1 to represent the decimal number.</p>
            
            <div className="flex justify-between items-center max-w-lg mx-auto mb-6 p-3 bg-black/40 rounded-lg border border-white/10">
                <div>
                    <p className="text-sm text-gray-400">Stage</p>
                    <p className="text-3xl font-bold text-blue-400">{stageIndex + 1} / {INTERACTIVE_BINARY_DATA.length}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Potential Score</p>
                    <p className="text-3xl font-bold text-blue-400">{Math.max(MINIMUM_SCORE, potentialScore)}</p>
                </div>
            </div>

            <div className="p-4 bg-black/40 rounded-lg mb-8 max-w-md mx-auto">
                <p className="text-xl text-gray-300">Convert to 8-bit Binary:</p>
                <p className="text-5xl font-mono text-yellow-300 tracking-widest">
                    {currentChallenge.decimal}
                </p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="flex items-start justify-center gap-1 md:gap-2 mb-8">
                    {bits.map((bit, index) => (
                        <Bit
                            key={index}
                            value={bit}
                            power={powers[index]}
                            onClick={() => handleBitClick(index)}
                            isComplete={isComplete}
                        />
                    ))}
                </div>

                {!isComplete && (
                     <button
                        type="submit"
                        disabled={hasSubmitted}
                        className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[5rem] flex flex-col justify-center items-center gap-4">
                {feedback && (
                    <p className={`text-2xl font-bold ${feedback.type === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {feedback.message}
                    </p>
                )}
                 {isComplete && (
                     <button
                        onClick={() => finalScore !== null && onComplete(finalScore)}
                        className="w-full max-w-sm px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Next Challenge
                    </button>
                )}
            </div>
        </div>
    );
};

export default InteractiveBinaryChallenge;
