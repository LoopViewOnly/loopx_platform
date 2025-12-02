import React, { useState, useEffect } from 'react';
import { HACKER_TYPES_CHALLENGE } from '../challenges/content';

interface HackerTypesChallengeProps {
    onComplete: (scoreChange: number, allCorrect: boolean) => void;
    challengeTitle: string;
}

type Description = {
    id: string;
    text: string;
    correctHackerId: string;
    currentHackerId: string | null;
};

const INITIAL_MAX_SCORE = 100;
const MINIMUM_SCORE = 50;
const PENALTY_PER_WRONG = 15;

const HackerTypesChallenge: React.FC<HackerTypesChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [descriptions, setDescriptions] = useState<Description[]>(() =>
        HACKER_TYPES_CHALLENGE.descriptions.map(desc => ({ ...desc, currentHackerId: null }))
    );
    const [draggedDescId, setDraggedDescId] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [allCorrect, setAllCorrect] = useState(false);
    const [currentPotentialScore, setCurrentPotentialScore] = useState(INITIAL_MAX_SCORE);
    const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isSubmitted && allCorrect) {
            const finalScore = Math.max(MINIMUM_SCORE, currentPotentialScore);
            setSubmissionMessage(`All connections correct! Final score: ${finalScore} points!`);
            onComplete(finalScore, true);
        }
    }, [isSubmitted, allCorrect, currentPotentialScore, onComplete]);

    const resetAfterIncorrectAttempt = () => {
        setIsSubmitted(false);
        setSubmissionMessage(null);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, descId: string) => {
        if (isSubmitted) {
            e.preventDefault();
            return;
        }
        setDraggedDescId(descId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (isSubmitted) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, hackerId: string | null) => {
        if (!draggedDescId || isSubmitted) return;

        setDescriptions(prev => prev.map(desc =>
            desc.id === draggedDescId ? { ...desc, currentHackerId: hackerId } : desc
        ));
        setDraggedDescId(null);
    };

    const handleCheckAnswers = () => {
        if (isSubmitted && allCorrect) return;

        let incorrectMatches = 0;
        descriptions.forEach(desc => {
            if (desc.currentHackerId !== desc.correctHackerId) {
                incorrectMatches++;
            }
        });

        const allDescriptionsAreCorrect = incorrectMatches === 0;

        if (allDescriptionsAreCorrect) {
            setAllCorrect(true);
        } else {
            const scoreDeduction = incorrectMatches * PENALTY_PER_WRONG;
            const newPotentialScore = Math.max(0, currentPotentialScore - scoreDeduction);
            setCurrentPotentialScore(newPotentialScore);
            setSubmissionMessage(`You have ${incorrectMatches} incorrect connection${incorrectMatches > 1 ? 's' : ''}. Please try again!`);
            onComplete(0, false);
        }
        setIsSubmitted(true);
    };

    const handleReplay = () => {
        resetAfterIncorrectAttempt();
    };

    const getHackerColor = (hackerId: string) => {
        switch (hackerId) {
            case 'white_hat': return 'border-green-500 bg-green-900/30';
            case 'grey_hat': return 'border-gray-400 bg-gray-700/30';
            case 'black_hat': return 'border-red-500 bg-red-900/30';
            default: return 'border-blue-500/50';
        }
    };

    const getHackerTextColor = (hackerId: string) => {
        switch (hackerId) {
            case 'white_hat': return 'text-green-400';
            case 'grey_hat': return 'text-gray-300';
            case 'black_hat': return 'text-red-400';
            default: return 'text-blue-300';
        }
    };

    const renderDescriptionCard = (desc: Description) => {
        const buttonClass = isSubmitted
            ? 'bg-gray-600 opacity-70 cursor-default'
            : 'bg-blue-600/80 hover:bg-blue-700 active:bg-blue-800';

        return (
            <div
                key={desc.id}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, desc.id)}
                className={`px-4 py-3 rounded-lg text-white text-sm shadow-md transition-all duration-200 border border-white/20
                    ${!isSubmitted ? 'cursor-grab' : 'cursor-default'} ${buttonClass}`}
            >
                {desc.text}
            </div>
        );
    };

    const renderHackerDropZone = (hacker: { id: string; name: string }) => {
        const placedDescriptions = descriptions.filter(desc => desc.currentHackerId === hacker.id);

        let dropZoneClass = getHackerColor(hacker.id);

        if (isSubmitted) {
            if (allCorrect) {
                dropZoneClass = 'border-green-500 bg-green-900/20';
            } else {
                const correctDescsForThisHacker = HACKER_TYPES_CHALLENGE.descriptions.filter(
                    desc => desc.correctHackerId === hacker.id
                );
                const isPerfectlyCorrect =
                    placedDescriptions.length === correctDescsForThisHacker.length &&
                    placedDescriptions.every(desc => desc.correctHackerId === hacker.id);

                if (isPerfectlyCorrect) {
                    dropZoneClass = 'border-green-500 bg-green-900/20';
                } else if (placedDescriptions.length > 0) {
                    dropZoneClass = 'border-red-500 bg-red-900/20';
                }
            }
        }

        if (draggedDescId && !isSubmitted) {
            dropZoneClass = 'border-yellow-400 bg-yellow-900/20';
        }

        return (
            <div
                key={hacker.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, hacker.id)}
                className={`p-4 border-2 rounded-lg min-h-[140px] flex flex-col gap-2 transition-colors duration-200 ${dropZoneClass}`}
            >
                <h3 className={`text-lg font-bold mb-2 ${getHackerTextColor(hacker.id)}`}>
                    {hacker.id === 'white_hat' && '🎩 '}
                    {hacker.id === 'grey_hat' && '🔘 '}
                    {hacker.id === 'black_hat' && '🖤 '}
                    {hacker.name}
                </h3>
                <div className="flex flex-col gap-2">
                    {placedDescriptions.map(desc => renderDescriptionCard(desc))}
                </div>
            </div>
        );
    };

    const unplacedDescriptions = descriptions.filter(desc => desc.currentHackerId === null);

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Drag each description to the correct hacker type.</p>

            {/* Descriptions to drag */}
            <div
                className="mb-8 p-4 bg-black/40 border border-white/10 rounded-lg min-h-[100px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
            >
                <h3 className="text-xl font-bold text-gray-200 mb-4">Descriptions:</h3>
                <div className="flex flex-col gap-3">
                    {unplacedDescriptions.map(desc => renderDescriptionCard(desc))}
                </div>
            </div>

            {/* Hacker type drop zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {HACKER_TYPES_CHALLENGE.hackerTypes.map(hacker => renderHackerDropZone(hacker))}
            </div>

            {!allCorrect && !isSubmitted && (
                <button
                    onClick={handleCheckAnswers}
                    disabled={descriptions.some(desc => desc.currentHackerId === null)}
                    className="mt-4 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Check Answers
                </button>
            )}

            {isSubmitted && !allCorrect && (
                <div className="mt-6">
                    <p className="text-lg font-bold text-red-400 mb-4">{submissionMessage}</p>
                    <button
                        onClick={handleReplay}
                        className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {allCorrect && (
                <div className="mt-6">
                    <p className="text-2xl font-bold text-green-400 mb-4">{submissionMessage}</p>
                </div>
            )}

            <div className="mt-4 text-gray-400">
                Potential points: {Math.max(MINIMUM_SCORE, currentPotentialScore)}
            </div>
        </div>
    );
};

export default HackerTypesChallenge;

