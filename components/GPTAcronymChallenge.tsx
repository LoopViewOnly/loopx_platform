import React, { useState, useEffect, useRef } from 'react';
import { GPT_ACRONYM_CHALLENGE } from '../challenges/content';

interface GPTAcronymChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FeedbackState = 'correct' | 'incorrect' | null;

const GPTAcronymChallenge: React.FC<GPTAcronymChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answers, setAnswers] = useState<string[]>(['', '', '']);
    const [feedback, setFeedback] = useState<FeedbackState[]>([null, null, null]);
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleInputChange = (index: number, value: string) => {
        if (isComplete) return;
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        
        // Clear feedback when typing
        if (feedback[index] !== null) {
            const newFeedback = [...feedback];
            newFeedback[index] = null;
            setFeedback(newFeedback);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && index < 2) {
            e.preventDefault();
            inputRefs[index + 1].current?.focus();
        } else if (e.key === 'Enter' && index === 2) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (isComplete || hasSubmitted) return;
        if (answers.some(a => !a.trim())) return;
        
        setHasSubmitted(true);

        const results: FeedbackState[] = GPT_ACRONYM_CHALLENGE.letters.map((item, index) => {
            const userAnswer = answers[index].trim().toLowerCase().replace(/-/g, '');
            const correctAnswer = item.answer.toLowerCase().replace(/-/g, '');
            return userAnswer === correctAnswer ? 'correct' : 'incorrect';
        });

        setFeedback(results);

        const allCorrect = results.every(r => r === 'correct');

        if (allCorrect) {
            setIsComplete(true);
            setErrorMessage(null);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setErrorMessage('One or more answers are incorrect. Check the highlighted fields!');
            setHasSubmitted(false);
        }
    };

    const getInputClass = (index: number) => {
        switch (feedback[index]) {
            case 'correct':
                return 'border-green-500 ring-2 ring-green-500/50 bg-green-900/20';
            case 'incorrect':
                return 'border-red-500 ring-2 ring-red-500/50 bg-red-900/20';
            default:
                return 'border-blue-500/50';
        }
    };

    const getLetterColor = (index: number) => {
        switch (feedback[index]) {
            case 'correct':
                return 'text-green-400';
            case 'incorrect':
                return 'text-red-400';
            default:
                return 'text-cyan-400';
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-8 text-lg">{GPT_ACRONYM_CHALLENGE.question}</p>

            <div className="max-w-md mx-auto space-y-4">
                {GPT_ACRONYM_CHALLENGE.letters.map((item, index) => (
                    <div key={item.letter} className="flex items-center gap-4">
                        <span className={`text-4xl font-bold w-12 text-right ${getLetterColor(index)}`}>
                            {item.letter}
                        </span>
                        <span className="text-2xl text-gray-400">:</span>
                        <input
                            ref={inputRefs[index]}
                            type="text"
                            value={answers[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            placeholder={`Enter word for ${item.letter}`}
                            disabled={isComplete}
                            className={`flex-1 px-4 py-3 bg-black/40 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-lg ${getInputClass(index)}`}
                        />
                        {feedback[index] === 'correct' && (
                            <span className="text-green-400 text-2xl">✓</span>
                        )}
                        {feedback[index] === 'incorrect' && (
                            <span className="text-red-400 text-2xl">✗</span>
                        )}
                    </div>
                ))}
            </div>

            {!isComplete && (
                <button
                    onClick={handleSubmit}
                    disabled={answers.some(a => !a.trim()) || hasSubmitted}
                    className="mt-8 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Check Answers
                </button>
            )}

            <div className="mt-6 min-h-[2.5rem]">
                {errorMessage && !isComplete && (
                    <p className="text-lg font-bold text-red-400">{errorMessage}</p>
                )}
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">
                        ✅ Correct! GPT = Generative Pre-trained Transformer
                    </p>
                )}
            </div>
        </div>
    );
};

export default GPTAcronymChallenge;

