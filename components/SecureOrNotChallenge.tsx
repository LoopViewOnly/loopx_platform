import React, { useState } from 'react';
import { SECURE_OR_NOT_CHALLENGE } from '../challenges/content';

interface SecureOrNotChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const POINTS_PER_STAGE = 40;
const WRONG_PENALTY = 10;
const HINT_COST = 20;

const SecureOrNotChallenge: React.FC<SecureOrNotChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [stageScore, setStageScore] = useState(POINTS_PER_STAGE);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hintUsedThisStage, setHintUsedThisStage] = useState(false);
    const [wrongAttempts, setWrongAttempts] = useState<string[]>([]);

    const currentStage = SECURE_OR_NOT_CHALLENGE.stages[stageIndex];
    const totalStages = SECURE_OR_NOT_CHALLENGE.stages.length;

    const handleUseHint = () => {
        if (!hintUsedThisStage && stageScore > HINT_COST) {
            setStageScore(prev => Math.max(0, prev - HINT_COST));
            setShowHint(true);
            setHintUsedThisStage(true);
            setFeedback({ message: `-${HINT_COST} points for hint`, color: 'text-yellow-400' });
        }
    };

    const handleLinkClick = (link: string) => {
        if (isComplete || selectedLink === link || wrongAttempts.includes(link)) return;
        
        setSelectedLink(link);

        if (link === currentStage.safeLink) {
            // Correct answer
            const earnedPoints = Math.max(0, stageScore);
            setTotalScore(prev => prev + earnedPoints);
            setFeedback({ message: `Correct! +${earnedPoints} points`, color: 'text-green-400' });
            
            setTimeout(() => {
                if (stageIndex + 1 < totalStages) {
                    // Move to next stage
                    setStageIndex(prev => prev + 1);
                    setStageScore(POINTS_PER_STAGE);
                    setFeedback(null);
                    setSelectedLink(null);
                    setShowHint(false);
                    setHintUsedThisStage(false);
                    setWrongAttempts([]);
                } else {
                    // Challenge complete
                    setIsComplete(true);
                    const finalScore = totalScore + earnedPoints;
                    setFeedback({ 
                        message: `Challenge Complete! Final Score: ${finalScore}`, 
                        color: 'text-green-400' 
                    });
                    onComplete(finalScore);
                }
            }, 1500);
        } else {
            // Wrong answer
            setWrongAttempts(prev => [...prev, link]);
            setStageScore(prev => Math.max(0, prev - WRONG_PENALTY));
            setFeedback({ message: `Wrong! -${WRONG_PENALTY} points`, color: 'text-red-500' });
            setSelectedLink(null);
        }
    };

    const getLinkStatus = (link: string) => {
        if (link === selectedLink && link === currentStage.safeLink) {
            return 'correct';
        }
        if (wrongAttempts.includes(link)) {
            return 'wrong';
        }
        return 'default';
    };

    const getLinkStyle = (link: string) => {
        const status = getLinkStatus(link);
        
        switch (status) {
            case 'correct':
                return 'bg-green-600/30 border-green-500 text-green-300';
            case 'wrong':
                return 'bg-red-600/20 border-red-500/50 text-red-400 opacity-50 cursor-not-allowed';
            default:
                return 'bg-black/40 border-white/20 text-blue-300 hover:bg-blue-600/20 hover:border-blue-400 cursor-pointer';
        }
    };

    if (!gameHasStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center flex flex-col items-center justify-center min-h-[500px]">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
                <div className="max-w-lg text-left space-y-4 mb-8 p-6 bg-black/20 rounded-lg border border-white/10">
                    <h3 className="text-xl font-bold text-white text-center">🔒 Secure or Not?</h3>
                    <p className="text-gray-300 text-center mb-4">
                        Can you spot the safe links from the dangerous ones?
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>You will see <strong className="text-blue-400">3 stages</strong> with 4 links each.</li>
                        <li>In each stage, <strong className="text-green-400">only 1 link</strong> is safe and legitimate.</li>
                        <li>Each stage is worth <strong className="text-yellow-400">40 points</strong>.</li>
                        <li>Wrong selections cost <strong className="text-red-400">-10 points</strong>.</li>
                        <li>You can use a hint for <strong className="text-orange-400">-20 points</strong>.</li>
                    </ul>
                </div>
                <button
                    onClick={() => setGameHasStarted(true)}
                    className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Start Challenge
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            
            {/* Progress and Score Bar */}
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-6 p-4 bg-black/40 rounded-lg border border-white/10">
                <div className="text-left">
                    <p className="text-sm text-gray-400">Stage</p>
                    <p className="text-2xl font-bold text-blue-400">{stageIndex + 1} / {totalStages}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Stage Points</p>
                    <p className="text-2xl font-bold text-yellow-400">{stageScore}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Score</p>
                    <p className="text-2xl font-bold text-green-400">{totalScore}</p>
                </div>
            </div>

            {/* Stage Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
                {SECURE_OR_NOT_CHALLENGE.stages.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index < stageIndex 
                                ? 'bg-green-500' 
                                : index === stageIndex 
                                    ? 'bg-blue-500 scale-125' 
                                    : 'bg-gray-600'
                        }`}
                    />
                ))}
            </div>

            {/* Instruction */}
            <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                {SECURE_OR_NOT_CHALLENGE.instruction}
            </p>

            {/* Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                {currentStage.links.map((link, index) => {
                    const status = getLinkStatus(link);
                    const isDisabled = status === 'wrong' || status === 'correct';

                    return (
                        <button
                            key={index}
                            onClick={() => handleLinkClick(link)}
                            disabled={isDisabled || isComplete}
                            className={`p-4 rounded-lg border-2 font-mono text-sm md:text-base transition-all duration-200 ${getLinkStyle(link)} ${
                                isDisabled ? '' : 'hover:scale-[1.02]'
                            }`}
                        >
                            <span className="break-all">{link}</span>
                            {status === 'correct' && <span className="ml-2">✅</span>}
                            {status === 'wrong' && <span className="ml-2">❌</span>}
                        </button>
                    );
                })}
            </div>

            {/* Hint Button */}
            {!showHint && !hintUsedThisStage && !isComplete && (
                <button
                    onClick={handleUseHint}
                    className="mb-4 px-4 py-2 bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded-lg hover:bg-orange-600/50 transition-all duration-200"
                >
                    💡 Use Hint (-{HINT_COST} points)
                </button>
            )}

            {/* Hint Display */}
            {showHint && (
                <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg max-w-2xl mx-auto">
                    <p className="text-orange-300 text-sm">
                        <strong>💡 Hint:</strong> {SECURE_OR_NOT_CHALLENGE.hint}
                    </p>
                </div>
            )}

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && !isComplete && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
                {isComplete && feedback && (
                    <div className="flex flex-col items-center gap-4">
                        <p className={`text-2xl font-bold ${feedback.color}`}>{feedback.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecureOrNotChallenge;

