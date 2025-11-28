
import React, { useState, useEffect, useMemo } from 'react';
// Import the flag data (keys and country names)
import { FLAG_CHALLENGE_DATA } from '../challenges/content';
// Import the flag image assets (base64 SVGs) from the user-provided assets.
import { USER_PROVIDED_FLAGS } from '../challenges/assets';

interface GuessTheFlagChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FlagData = {
    key: string;
    name: string;
};

type FeedbackState = ('correct' | 'incorrect' | null);

// Helper to shuffle and pick N items
const getShuffledItems = <T,>(arr: T[], num: number): T[] => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
};

const GuessTheFlagChallenge: React.FC<GuessTheFlagChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [selectedFlags, setSelectedFlags] = useState<FlagData[]>([]);
    const [answers, setAnswers] = useState<string[]>(['', '', '']);
    const [feedback, setFeedback] = useState<FeedbackState[]>([null, null, null]);
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        // This function shuffles the list of 6 provided flags
        // and selects 3 unique ones for this round.
        // It only uses the flags provided by the user.
        setSelectedFlags(getShuffledItems(FLAG_CHALLENGE_DATA, 3));
    }, []);

    const handleInputChange = (index: number, value: string) => {
        if (isComplete) return;
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        // Reset feedback on new input
        const newFeedback = [...feedback];
        newFeedback[index] = null;
        setFeedback(newFeedback);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete || hasSubmitted) return;
        setHasSubmitted(true);

        let allCorrect = true;
        const newFeedback: FeedbackState[] = answers.map((answer, index) => {
            if (answer.trim().toLowerCase() === selectedFlags[index].name.toLowerCase()) {
                return 'correct';
            } else {
                allCorrect = false;
                return 'incorrect';
            }
        });

        setFeedback(newFeedback);

        if (allCorrect) {
            setIsComplete(true);
            setTimeout(() => onComplete(true), 1500);
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

    if (selectedFlags.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-8">Identify the country for each flag shown below.</p>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {selectedFlags.map((flag, index) => (
                        <div key={flag.key} className="flex flex-col items-center gap-4">
                            <div className="w-full h-40 bg-black/20 p-2 rounded-lg border border-white/10 flex items-center justify-center">
                                <img
                                    // The src is looked up from the imported USER_PROVIDED_FLAGS object using the flag's key (e.g., 'canada')
                                    // to get the correct base64 image data provided in assets.
                                    src={USER_PROVIDED_FLAGS[flag.key]}
                                    alt={`Flag of a country`}
                                    className="max-w-full max-h-full object-contain rounded-sm shadow-lg"
                                />
                            </div>
                            <input
                                type="text"
                                value={answers[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="Country Name"
                                disabled={isComplete}
                                className={`w-full px-3 py-2 bg-black/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-lg capitalize ${getInputClass(index)}`}
                            />
                        </div>
                    ))}
                </div>

                {!isComplete && (
                    <button
                        type="submit"
                        disabled={answers.some(a => a.trim() === '') || hasSubmitted}
                        className="mt-10 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Answers
                    </button>
                )}

                {isComplete && (
                    <div className="mt-10">
                        <p className="text-2xl font-bold text-green-400">All correct! Proceeding...</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default GuessTheFlagChallenge;
