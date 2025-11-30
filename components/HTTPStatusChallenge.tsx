import React, { useState, useMemo } from 'react';
import { HTTP_STATUS_CHALLENGE } from '../challenges/content';

interface HTTPStatusChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const HTTPStatusChallenge: React.FC<HTTPStatusChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Shuffle meanings for display
    const shuffledMeanings = useMemo(() => {
        return [...HTTP_STATUS_CHALLENGE.pairs]
            .map(p => ({ meaning: p.meaning, code: p.code }))
            .sort(() => Math.random() - 0.5);
    }, []);

    const handleCodeClick = (code: string) => {
        if (isComplete || matchedPairs.has(code)) return;
        setSelectedCode(code);
        setFeedback(null);
    };

    const handleMeaningClick = (meaning: string, correctCode: string) => {
        if (isComplete || !selectedCode || matchedPairs.has(correctCode)) return;

        if (selectedCode === correctCode) {
            // Correct match!
            const newMatched = new Set(matchedPairs);
            newMatched.add(correctCode);
            setMatchedPairs(newMatched);
            setFeedback({ message: `✅ ${selectedCode} = ${meaning}`, color: 'text-green-400' });
            setSelectedCode(null);

            // Check if all matched
            if (newMatched.size === HTTP_STATUS_CHALLENGE.pairs.length) {
                setIsComplete(true);
                const score = Math.max(50, 100 - (wrongAttempts * 5));
                setTimeout(() => {
                    setFeedback({ message: `🎉 All matched! Score: ${score}`, color: 'text-green-400' });
                    onComplete(score);
                }, 500);
            }
        } else {
            // Wrong match
            setWrongAttempts(prev => prev + 1);
            setFeedback({ message: '❌ Wrong match! Try again.', color: 'text-red-400' });
            setSelectedCode(null);
        }
    };

    const getCodeStyle = (code: string) => {
        if (matchedPairs.has(code)) {
            return 'bg-green-600/30 border-green-500 text-green-300 cursor-default';
        }
        if (selectedCode === code) {
            return 'bg-blue-600/50 border-blue-400 text-blue-200 ring-2 ring-blue-400';
        }
        return 'bg-black/40 border-white/30 text-white hover:bg-blue-600/30 hover:border-blue-400 cursor-pointer';
    };

    const getMeaningStyle = (correctCode: string) => {
        if (matchedPairs.has(correctCode)) {
            return 'bg-green-600/30 border-green-500 text-green-300 cursor-default';
        }
        if (!selectedCode) {
            return 'bg-black/40 border-white/30 text-gray-400 cursor-not-allowed';
        }
        return 'bg-black/40 border-white/30 text-white hover:bg-purple-600/30 hover:border-purple-400 cursor-pointer';
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>

            {/* Instructions */}
            <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/10 max-w-xl mx-auto">
                <p className="text-gray-300">
                    Match each <strong className="text-blue-400">HTTP status code</strong> with its <strong className="text-purple-400">meaning</strong>
                </p>
                <p className="text-gray-500 text-sm mt-1">
                    Click a code on the left, then click its matching meaning on the right
                </p>
            </div>

            {/* Progress */}
            <div className="mb-6 flex justify-center gap-8">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Matched</p>
                    <p className="text-2xl font-bold text-green-400">{matchedPairs.size} / {HTTP_STATUS_CHALLENGE.pairs.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Wrong Attempts</p>
                    <p className="text-2xl font-bold text-red-400">{wrongAttempts}</p>
                </div>
            </div>

            {/* Matching Game Grid */}
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-6 max-w-4xl mx-auto">
                {/* Codes Column */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">Status Codes</h3>
                    <div className="flex flex-col gap-2">
                        {HTTP_STATUS_CHALLENGE.pairs.map((pair) => (
                            <button
                                key={pair.code}
                                onClick={() => handleCodeClick(pair.code)}
                                disabled={matchedPairs.has(pair.code) || isComplete}
                                className={`px-6 py-3 rounded-lg border-2 font-mono text-xl font-bold transition-all duration-200 ${getCodeStyle(pair.code)}`}
                            >
                                {pair.code}
                                {matchedPairs.has(pair.code) && <span className="ml-2">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Arrow indicator */}
                <div className="hidden md:flex items-center justify-center text-4xl text-gray-500">
                    →
                </div>

                {/* Meanings Column */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-400 mb-3">Meanings</h3>
                    <div className="flex flex-col gap-2">
                        {shuffledMeanings.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleMeaningClick(item.meaning, item.code)}
                                disabled={matchedPairs.has(item.code) || isComplete || !selectedCode}
                                className={`px-6 py-3 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${getMeaningStyle(item.code)}`}
                            >
                                {item.meaning}
                                {matchedPairs.has(item.code) && <span className="ml-2">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
            </div>

            {/* Hint */}
            {!selectedCode && !isComplete && matchedPairs.size === 0 && (
                <p className="text-gray-500 text-sm">
                    👆 Start by clicking a status code on the left
                </p>
            )}
        </div>
    );
};

export default HTTPStatusChallenge;

