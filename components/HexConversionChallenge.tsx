
import React, { useState } from 'react';
import { HEX_CONVERSION_CHALLENGE } from '../challenges/content';

interface HexConversionChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FeedbackState = ('correct' | 'incorrect' | null);

const HexConversionChallenge: React.FC<HexConversionChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answers, setAnswers] = useState<string[]>(Array(HEX_CONVERSION_CHALLENGE.problems.length).fill(''));
    const [feedback, setFeedback] = useState<FeedbackState[]>(Array(HEX_CONVERSION_CHALLENGE.problems.length).fill(null));
    const [isComplete, setIsComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        // Allow only valid hex characters and limit length
        newAnswers[index] = value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 3);
        setAnswers(newAnswers);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete) return;

        let allCorrect = true;
        const newFeedback: FeedbackState[] = [];

        HEX_CONVERSION_CHALLENGE.problems.forEach((problem, index) => {
            if (answers[index].trim().toUpperCase() === problem.answer.toUpperCase()) {
                newFeedback[index] = 'correct';
            } else {
                newFeedback[index] = 'incorrect';
                allCorrect = false;
            }
        });

        setFeedback(newFeedback);

        if (allCorrect) {
            setIsComplete(true);
            setErrorMessage(null);
            onComplete(true);
        } else {
            setErrorMessage('Some answers are incorrect. Please review the highlighted fields.');
        }
    };

    const getInputClass = (index: number) => {
        switch (feedback[index]) {
            case 'correct':
                return 'border-green-500 ring-2 ring-green-500/50';
            case 'incorrect':
                return 'border-red-500 ring-2 ring-red-500/50';
            default:
                return 'border-blue-500/50';
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-8">{HEX_CONVERSION_CHALLENGE.instructions}</p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                {HEX_CONVERSION_CHALLENGE.problems.map((problem, index) => (
                    <div key={index} className="flex items-center justify-center gap-4 p-3 bg-black/20 rounded-lg">
                        <div className="flex-1 text-right">
                            <span className="text-2xl font-mono text-gray-200">{problem.decimal}</span>
                            <span className="text-xs text-gray-400 ml-1">(10)</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div className="flex-1 text-left">
                            <input
                                type="text"
                                value={answers[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="HEX"
                                maxLength={3}
                                disabled={isComplete}
                                className={`w-24 px-3 py-2 bg-black/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl font-mono tracking-widest uppercase ${getInputClass(index)}`}
                            />
                             <span className="text-xs text-gray-400 ml-1">(16)</span>
                        </div>
                    </div>
                ))}

                {!isComplete && (
                    <button
                        type="submit"
                        disabled={answers.some(a => a.trim() === '')}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Answers
                    </button>
                )}
            </form>

            <div className="mt-6 min-h-[2.5rem]">
                {errorMessage && !isComplete && <p className="text-lg font-bold text-red-400">{errorMessage}</p>}
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">All correct! Proceeding...</p>
                )}
            </div>
        </div>
    );
};

export default HexConversionChallenge;
