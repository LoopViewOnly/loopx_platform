
import React, { useState, useEffect } from 'react';
import { WINDOWS_TIMELINE_DATA } from '../challenges/content';

interface WindowsTimelineChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type Item = {
    id: number;
    name: string;
    feedback: 'correct' | 'incorrect' | null;
};

const INITIAL_MAX_SCORE = 100;
const MINIMUM_SCORE = 50;
const DEDUCTION_PER_ERROR = 5;

// Helper to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const WindowsTimelineChallenge: React.FC<WindowsTimelineChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [potentialScore, setPotentialScore] = useState(INITIAL_MAX_SCORE);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    useEffect(() => {
        const shuffledItems = shuffle(WINDOWS_TIMELINE_DATA).map((name, index) => ({
            id: index,
            name,
            feedback: null,
        }));
        setItems(shuffledItems);
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        if (isSubmitted) {
            e.preventDefault();
            return;
        }
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
        if (draggedItemIndex === null) return;

        const draggedItem = items[draggedItemIndex];
        const newItems = [...items];
        newItems.splice(draggedItemIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);

        setItems(newItems);
        setDraggedItemIndex(null);
    };

    const handleCheckOrder = () => {
        if (isComplete || hasSubmitted) return;
        setHasSubmitted(true);

        let incorrectCount = 0;
        const newFeedbackItems = items.map((item, index) => {
            if (item.name === WINDOWS_TIMELINE_DATA[index]) {
                return { ...item, feedback: 'correct' as const };
            } else {
                incorrectCount++;
                return { ...item, feedback: 'incorrect' as const };
            }
        });
        
        setItems(newFeedbackItems);
        setIsSubmitted(true);
        
        if (incorrectCount === 0) {
            const finalScore = Math.max(MINIMUM_SCORE, potentialScore);
            setFeedbackMessage(`Perfect! The timeline is correct. Score: ${finalScore}`);
            setIsComplete(true);
            setTimeout(() => onComplete(finalScore), 2000);
        } else {
            const scoreDeduction = incorrectCount * DEDUCTION_PER_ERROR;
            const newPotentialScore = Math.max(0, potentialScore - scoreDeduction);
            setPotentialScore(newPotentialScore);
            setFeedbackMessage(`${incorrectCount} item(s) are in the wrong position. Score deduction: ${scoreDeduction}.`);
        }
    };
    
    const handleReplay = () => {
        setIsSubmitted(false);
        setHasSubmitted(false);
        setFeedbackMessage(null);
        setItems(prevItems => prevItems.map(item => ({ ...item, feedback: null })));
    };

    const getItemClass = (item: Item, index: number) => {
        let classes = 'p-3 bg-blue-900/40 border border-white/10 rounded-lg text-white font-semibold transition-all duration-300';
        if (!isSubmitted) {
            classes += ' cursor-grab active:cursor-grabbing';
        }
        if (draggedItemIndex === index) {
            classes += ' opacity-50';
        }
        if (isSubmitted) {
            if (item.feedback === 'correct') {
                classes += ' bg-green-800/50 border-green-500';
            } else if (item.feedback === 'incorrect') {
                classes += ' bg-red-800/50 border-red-500';
            }
        }
        return classes;
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Arrange the Windows software releases in chronological order from earliest (top) to most recent (bottom).</p>

            <div className="max-w-md mx-auto">
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            draggable={!isSubmitted}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className={getItemClass(item, index)}
                        >
                            <span className="text-gray-400 mr-2">{index + 1}.</span>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="mt-8">
                {isComplete ? (
                    <p className="text-2xl font-bold text-green-400">{feedbackMessage}</p>
                ) : isSubmitted ? (
                    <div className="flex flex-col items-center gap-4">
                         <p className="text-lg font-bold text-red-400">{feedbackMessage}</p>
                        <button
                            onClick={handleReplay}
                            className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleCheckOrder}
                        disabled={hasSubmitted}
                        className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Order
                    </button>
                )}
                 <div className="mt-4 text-gray-400">
                    Potential points: {isComplete ? Math.max(MINIMUM_SCORE, potentialScore) : potentialScore}
                </div>
            </div>
        </div>
    );
};

export default WindowsTimelineChallenge;
