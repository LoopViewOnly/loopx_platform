import React, { useState, useEffect, useMemo } from 'react';
import { GOOGLE_APPS_CHALLENGE } from '../challenges/content';

interface GoogleAppsChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type AppItem = {
    name: string;
    isGoogle: boolean;
    isSelected: boolean;
    feedback: 'correct' | 'incorrect' | 'missed' | null;
};

const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const GoogleAppsChallenge: React.FC<GoogleAppsChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [apps, setApps] = useState<AppItem[]>([]);
    const [attemptsLeft, setAttemptsLeft] = useState(GOOGLE_APPS_CHALLENGE.maxAttempts);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [totalPenalty, setTotalPenalty] = useState(0);

    useEffect(() => {
        const allApps: AppItem[] = [
            ...GOOGLE_APPS_CHALLENGE.googleApps.map(name => ({
                name,
                isGoogle: true,
                isSelected: false,
                feedback: null,
            })),
            ...GOOGLE_APPS_CHALLENGE.nonGoogleApps.map(name => ({
                name,
                isGoogle: false,
                isSelected: false,
                feedback: null,
            })),
        ];
        setApps(shuffle(allApps));
    }, []);

    const handleToggleSelect = (index: number) => {
        if (isSubmitted || isComplete) return;
        
        setApps(prev => prev.map((app, i) => 
            i === index ? { ...app, isSelected: !app.isSelected } : app
        ));
    };

    const handleSubmit = () => {
        if (isComplete) return;

        const selectedApps = apps.filter(app => app.isSelected);
        const correctSelections = selectedApps.filter(app => app.isGoogle);
        const incorrectSelections = selectedApps.filter(app => !app.isGoogle);
        const missedGoogleApps = apps.filter(app => app.isGoogle && !app.isSelected);

        // Calculate penalty for this attempt and add to total
        const attemptPenalty = incorrectSelections.length * GOOGLE_APPS_CHALLENGE.penaltyPerWrong;
        const newTotalPenalty = totalPenalty + attemptPenalty;
        setTotalPenalty(newTotalPenalty);

        // Calculate final score with accumulated penalty
        const score = Math.max(0, GOOGLE_APPS_CHALLENGE.maxScore - newTotalPenalty);

        // Check if all Google apps are selected and no non-Google apps are selected
        const allGoogleSelected = missedGoogleApps.length === 0;
        const noIncorrectSelections = incorrectSelections.length === 0;
        const isPerfect = allGoogleSelected && noIncorrectSelections;

        // Update feedback for each app
        const updatedApps = apps.map(app => {
            if (app.isSelected && app.isGoogle) {
                return { ...app, feedback: 'correct' as const };
            } else if (app.isSelected && !app.isGoogle) {
                return { ...app, feedback: 'incorrect' as const };
            } else if (!app.isSelected && app.isGoogle && (attemptsLeft === 1 || isPerfect)) {
                // Show missed Google apps only on final attempt or if perfect
                return { ...app, feedback: 'missed' as const };
            }
            return { ...app, feedback: null };
        });

        setApps(updatedApps);
        setIsSubmitted(true);

        if (isPerfect) {
            setFeedbackMessage(`Perfect! You found all Google apps! Score: ${score}`);
            setIsComplete(true);
            setTimeout(() => onComplete(score), 2000);
        } else {
            const newAttemptsLeft = attemptsLeft - 1;
            setAttemptsLeft(newAttemptsLeft);

            if (newAttemptsLeft === 0) {
                // Final attempt failed - show solution
                setShowSolution(true);
                const finalApps = apps.map(app => {
                    if (app.isSelected && app.isGoogle) {
                        return { ...app, feedback: 'correct' as const };
                    } else if (app.isSelected && !app.isGoogle) {
                        return { ...app, feedback: 'incorrect' as const };
                    } else if (!app.isSelected && app.isGoogle) {
                        return { ...app, feedback: 'missed' as const };
                    }
                    return { ...app, feedback: null };
                });
                setApps(finalApps);
                setFeedbackMessage(`Out of attempts! Total penalty: -${newTotalPenalty} points. Final Score: ${score}`);
                setIsComplete(true);
                setTimeout(() => onComplete(score), 3000);
            } else {
                if (incorrectSelections.length > 0) {
                    setFeedbackMessage(`${incorrectSelections.length} wrong selection(s) (-${attemptPenalty} points). ${newAttemptsLeft} attempt(s) remaining.`);
                } else {
                    setFeedbackMessage(`You missed some Google apps. ${newAttemptsLeft} attempt(s) remaining.`);
                }
            }
        }
    };

    const handleTryAgain = () => {
        setIsSubmitted(false);
        setFeedbackMessage(null);
        // Reset feedback but keep selections
        setApps(prev => prev.map(app => ({ ...app, feedback: null })));
    };

    const getAppClass = (app: AppItem) => {
        let classes = 'p-4 rounded-lg font-semibold text-center transition-all duration-300 cursor-pointer border-2 ';
        
        if (isSubmitted || isComplete) {
            if (app.feedback === 'correct') {
                classes += 'bg-green-600/50 border-green-500 text-white';
            } else if (app.feedback === 'incorrect') {
                classes += 'bg-red-600/50 border-red-500 text-white';
            } else if (app.feedback === 'missed') {
                classes += 'bg-yellow-600/50 border-yellow-500 text-white';
            } else if (app.isSelected) {
                classes += 'bg-blue-600/50 border-blue-500 text-white';
            } else {
                classes += 'bg-gray-800/40 border-white/10 text-gray-300';
            }
        } else {
            if (app.isSelected) {
                classes += 'bg-blue-600/50 border-blue-500 text-white transform scale-105';
            } else {
                classes += 'bg-gray-800/40 border-white/10 text-gray-300 hover:bg-gray-700/50 hover:border-white/30';
            }
        }
        
        return classes;
    };

    const selectedCount = apps.filter(app => app.isSelected).length;

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-2">Select all the apps that belong to Google.</p>
            <p className="text-yellow-400 text-sm mb-2">
                You have <span className="font-bold">{attemptsLeft}</span> attempt{attemptsLeft !== 1 ? 's' : ''} remaining.
            </p>
            <p className="text-gray-400 text-sm mb-6">
                Current Score: <span className="font-bold text-blue-300">{Math.max(0, GOOGLE_APPS_CHALLENGE.maxScore - totalPenalty)}</span>
                {totalPenalty > 0 && <span className="text-red-400"> (-{totalPenalty} penalty)</span>}
            </p>

            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
                {apps.map((app, index) => (
                    <div
                        key={app.name}
                        onClick={() => handleToggleSelect(index)}
                        className={getAppClass(app)}
                    >
                        {app.name}
                    </div>
                ))}
            </div>

            {showSolution && (
                <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-sm text-gray-400">
                        <span className="text-green-400">■</span> Correct selection &nbsp;
                        <span className="text-red-400">■</span> Wrong selection &nbsp;
                        <span className="text-yellow-400">■</span> Missed Google app
                    </p>
                </div>
            )}

            <div className="mt-6">
                {isComplete ? (
                    <p className={`text-2xl font-bold ${showSolution ? 'text-yellow-400' : 'text-green-400'}`}>
                        {feedbackMessage}
                    </p>
                ) : isSubmitted ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg font-bold text-red-400">{feedbackMessage}</p>
                        <button
                            onClick={handleTryAgain}
                            className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-gray-400 text-sm">
                            {selectedCount} app{selectedCount !== 1 ? 's' : ''} selected
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={selectedCount === 0}
                            className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleAppsChallenge;

