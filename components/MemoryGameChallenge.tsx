import React, { useState, useEffect, useRef } from 'react';
import { MEMORY_GAME_PAIRS } from '../challenges/content';

interface MemoryGameChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

type CardData = {
    content: string;
    matchId: number;
    uniqueId: number;
};

type CardState = CardData & {
    isFlipped: boolean;
    isMatched: boolean;
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MemoryGameChallenge: React.FC<MemoryGameChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [cards, setCards] = useState<CardState[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    
    const isCheckingRef = useRef(false);
    const startTimeRef = useRef<number | null>(null);
    
    useEffect(() => {
        const gameCards = MEMORY_GAME_PAIRS.map((pair, index) => ({ ...pair, uniqueId: index }));
        setCards(shuffleArray(gameCards).map(card => ({ ...card, isFlipped: false, isMatched: false })));
        startTimeRef.current = Date.now();
    }, []);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            isCheckingRef.current = true;
            const [firstIndex, secondIndex] = flippedIndices;
            setMoves(prev => prev + 1);

            if (cards[firstIndex].matchId === cards[secondIndex].matchId) {
                // It's a match
                setCards(prevCards => prevCards.map((card, index) => {
                    if (index === firstIndex || index === secondIndex) {
                        return { ...card, isMatched: true };
                    }
                    return card;
                }));
                setFlippedIndices([]);
                isCheckingRef.current = false;
            } else {
                // Not a match
                setTimeout(() => {
                    setCards(prevCards => prevCards.map((card, index) => {
                        if (index === firstIndex || index === secondIndex) {
                            return { ...card, isFlipped: false };
                        }
                        return card;
                    }));
                    setFlippedIndices([]);
                    isCheckingRef.current = false;
                }, 1000);
            }
        }
    }, [flippedIndices, cards]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setIsComplete(true);
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
        }
    }, [cards, onComplete]);

    const handleCardClick = (index: number) => {
        if (isCheckingRef.current || cards[index].isFlipped || flippedIndices.length >= 2) {
            return;
        }

        setCards(prev => prev.map((card, i) => i === index ? { ...card, isFlipped: true } : card));
        setFlippedIndices(prev => [...prev, index]);
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Match the programming language with its file extension. Find all pairs to complete the challenge.</p>
            
            <div className="flex justify-center items-center mb-6 p-3 rounded-lg bg-black/40 border border-blue-500/50 max-w-xs mx-auto">
                <p className="text-white text-lg font-medium">
                    Moves: <span className="text-2xl font-extrabold text-blue-400">{moves}</span>
                </p>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto" style={{ perspective: '1000px' }}>
                {cards.map((card, index) => (
                    <div
                        key={card.uniqueId}
                        className={`aspect-square cursor-pointer transition-transform duration-500 [transform-style:preserve-3d] ${card.isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        {/* Card Back */}
                        <div className="absolute w-full h-full rounded-lg bg-blue-900/40 border-2 border-blue-500/50 flex items-center justify-center [backface-visibility:hidden]">
                            <span className="text-3xl text-blue-300 font-bold">?</span>
                        </div>
                        {/* Card Front */}
                        <div className={`absolute w-full h-full rounded-lg flex items-center justify-center p-2 [transform:rotateY(180deg)] [backface-visibility:hidden] ${card.isMatched ? 'bg-green-800/50 border-2 border-green-500' : 'bg-black/50 border-2 border-white/20'}`}>
                            <span className="text-white font-bold text-center text-sm sm:text-base">{card.content}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isComplete && (
                <div className="mt-8">
                    <p className="text-2xl font-bold text-green-400">All pairs found! Challenge complete!</p>
                </div>
            )}
        </div>
    );
};

export default MemoryGameChallenge;
