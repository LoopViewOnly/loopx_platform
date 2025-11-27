import React, { useState, useEffect, useMemo } from 'react';
import { CONNECTIONS_GRID_DATA } from '../challenges/content';

interface ConnectionsGridChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type FoundCategory = {
    title: string;
    items: string[];
    color: string;
};

const MINIMUM_SCORE = 80;
const INITIAL_SCORE = 160;
const MISTAKE_PENALTY = 10;

// Helper to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const ConnectionsGridChallenge: React.FC<ConnectionsGridChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [gridItems, setGridItems] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [foundCategories, setFoundCategories] = useState<FoundCategory[]>([]);
    const [potentialScore, setPotentialScore] = useState(INITIAL_SCORE);
    const [isShaking, setIsShaking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const remainingCategories = useMemo(() => {
        const foundTitles = new Set(foundCategories.map(fc => fc.title));
        return CONNECTIONS_GRID_DATA.filter(c => !foundTitles.has(c.title));
    }, [foundCategories]);

    useEffect(() => {
        const allItems = CONNECTIONS_GRID_DATA.flatMap(category => category.items);
        setGridItems(shuffle(allItems));
    }, []);

    // Effect to handle automatic advancement after a delay
    useEffect(() => {
        if (isComplete) {
            const finalScore = Math.max(MINIMUM_SCORE, potentialScore);
            const timer = setTimeout(() => {
                onComplete(finalScore);
            }, 2500); // 2.5 second delay

            return () => clearTimeout(timer); // Cleanup on unmount
        }
    }, [isComplete, potentialScore, onComplete]);

    const handleItemClick = (item: string) => {
        if (isComplete) return;

        setSelectedItems(prev => {
            if (prev.includes(item)) {
                return prev.filter(i => i !== item);
            }
            if (prev.length < 4) {
                return [...prev, item];
            }
            return prev;
        });
    };
    
    const handleSubmit = () => {
        if (selectedItems.length !== 4) return;

        const selectedSet = new Set(selectedItems);
        const matchedCategory = remainingCategories.find(category => {
            const categorySet = new Set(category.items);
            return selectedSet.size === categorySet.size && [...selectedSet].every(item => categorySet.has(item));
        });

        if (matchedCategory) {
            const newFoundCategory: FoundCategory = {
                title: matchedCategory.title,
                items: matchedCategory.items, // Keep original order for display
                color: matchedCategory.color,
            };
            
            const newFoundCategories = [...foundCategories, newFoundCategory];
            setFoundCategories(newFoundCategories);
            setGridItems(prev => prev.filter(item => !selectedSet.has(item)));
            setSelectedItems([]);

            if (newFoundCategories.length === CONNECTIONS_GRID_DATA.length) {
                setIsComplete(true); // Trigger the completion effect
            }

        } else {
            setPotentialScore(prev => Math.max(0, prev - MISTAKE_PENALTY));
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setSelectedItems([]);
            }, 500);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Find four groups of four related items.</p>
            
            <div className={`max-w-xl mx-auto flex flex-col gap-2 mb-4 ${isShaking ? 'shake-animation' : ''}`}>
                {/* Found Categories */}
                {foundCategories.map(cat => (
                    <div key={cat.title} className={`p-4 rounded-lg text-white font-bold ${cat.color}`}>
                        <p className="text-lg">{cat.title}</p>
                        <p className="text-sm font-normal">{cat.items.join(', ')}</p>
                    </div>
                ))}

                {/* Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {gridItems.map(item => (
                        <button
                            key={item}
                            onClick={() => handleItemClick(item)}
                            className={`h-20 flex items-center justify-center p-2 text-center text-xs md:text-sm font-semibold rounded-lg transition-all duration-200
                                ${selectedItems.includes(item)
                                    ? 'bg-blue-500 text-white scale-105 border-2 border-blue-300'
                                    : 'bg-black/40 text-gray-200 hover:bg-white/10'
                                }
                            `}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4">
                {!isComplete && (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedItems.length !== 4}
                        className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit
                    </button>
                )}
                 <div className="text-gray-400">
                    Potential points: {potentialScore}
                </div>
                 {isComplete && (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-2xl font-bold text-green-400">Congratulations! You found all connections.</p>
                        {/* Button is removed for automatic advancement */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConnectionsGridChallenge;