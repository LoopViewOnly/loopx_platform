
import React, { useState, useRef } from 'react';
import { HEX_TO_BINARY_CHALLENGE } from '../challenges/content';

interface HexToBinaryChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FeedbackState = ('correct' | 'incorrect' | null);

const HexToBinaryChallenge: React.FC<HexToBinaryChallengeProps> = ({ onComplete, challengeTitle }) => {
    // State for 4 input boxes, each holding 4 chars
    const [nibbles, setNibbles] = useState<string[]>(['', '', '', '']);
    const [feedback, setFeedback] = useState<FeedbackState[]>(Array(4).fill(null));
    const [isComplete, setIsComplete] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null)
    ];

    const handleInputChange = (index: number, value: string) => {
        if (isComplete) return;
        const newNibbles = [...nibbles];
        // Allow only 0 or 1, and limit length to 4
        newNibbles[index] = value.replace(/[^01]/g, '').slice(0, 4);
        setNibbles(newNibbles);

        // Auto-focus next input
        if (newNibbles[index].length === 4 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete) return;

        const fullAnswer = nibbles.join('');
        const correct = fullAnswer === HEX_TO_BINARY_CHALLENGE.answer;

        if (correct) {
            setFeedback(Array(4).fill('correct'));
            setIsComplete(true);
            setErrorMessage(null);
            onComplete(true);
        } else {
            // Provide feedback per nibble
            const newFeedback: FeedbackState[] = [];
            const correctAns = HEX_TO_BINARY_CHALLENGE.answer;
            for (let i = 0; i < 4; i++) {
                const userNibble = nibbles[i];
                const correctNibble = correctAns.substring(i * 4, i * 4 + 4);
                if (userNibble === correctNibble) {
                    newFeedback[i] = 'correct';
                } else {
                    newFeedback[i] = 'incorrect';
                }
            }
            setFeedback(newFeedback);
            setErrorMessage('One or more groups are incorrect. Please review the highlighted fields.');
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
            <p className="text-gray-300 mb-6">{HEX_TO_BINARY_CHALLENGE.question}</p>
            <p className="text-sm text-gray-400 mb-8">(Hint: Each hexadecimal digit corresponds to 4 binary digits)</p>
            
            <div className="flex items-center justify-center gap-4 p-3 bg-black/20 rounded-lg max-w-md mx-auto mb-8">
                <span className="text-3xl font-mono text-gray-200">{HEX_TO_BINARY_CHALLENGE.problem}</span>
                <span className="text-sm text-gray-400">(16)</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-sm text-gray-400">(2)</span>
            </div>

            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                <div className="flex items-center justify-center gap-2 md:gap-4">
                    {nibbles.map((nibble, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            value={nibble}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="0000"
                            maxLength={4}
                            disabled={isComplete}
                            className={`w-1/4 px-1 py-2 bg-black/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-lg md:text-xl font-mono tracking-widest ${getInputClass(index)}`}
                        />
                    ))}
                </div>

                {!isComplete && (
                    <button
                        type="submit"
                        disabled={nibbles.some(n => n.length !== 4)}
                        className="mt-6 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Answer
                    </button>
                )}
            </form>

            <div className="mt-6 min-h-[2.5rem]">
                {errorMessage && !isComplete && <p className="text-lg font-bold text-red-400">{errorMessage}</p>}
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">Correct Conversion! Proceeding...</p>
                )}
            </div>
        </div>
    );
};

export default HexToBinaryChallenge;
