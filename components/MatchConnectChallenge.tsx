import React, { useState, useEffect, useRef } from 'react';
import { MATCH_CONNECT_DATA } from '../challenges/content';

interface MatchConnectChallengeProps {
    onComplete: (scoreChange: number, allCorrect: boolean) => void;
    challengeTitle: string;
}

type Item = {
    id: string;
    name: string;
    correctCompanyId: string;
    currentCompanyId: string | null;
};

type Company = {
    id: string;
    name: string;
};

const TOTAL_ITEMS = MATCH_CONNECT_DATA.items.length;
const INITIAL_MAX_SCORE = TOTAL_ITEMS * 10;
const MINIMUM_SCORE = 50;

const MatchConnectChallenge: React.FC<MatchConnectChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [items, setItems] = useState<Item[]>(() => 
        MATCH_CONNECT_DATA.items.map(item => ({ ...item, currentCompanyId: null }))
    );
    const [companies] = useState<Company[]>(MATCH_CONNECT_DATA.companies);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false); // True after Check Answers is pressed
    const [allCorrect, setAllCorrect] = useState(false); // True only if all are correct
    
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

    const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, itemId: string) => {
        if (isSubmitted) {
            e.preventDefault();
            return;
        }
        setDraggedItemId(itemId);
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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, companyId: string | null) => {
        if (!draggedItemId || isSubmitted) return;

        setItems(prevItems => prevItems.map(item =>
            item.id === draggedItemId ? { ...item, currentCompanyId: companyId } : item
        ));
        setDraggedItemId(null);
    };

    const handleCheckAnswers = () => {
        if (isSubmitted && allCorrect) return;

        let incorrectMatches = 0;
        items.forEach(item => {
            if (item.currentCompanyId !== item.correctCompanyId) {
                incorrectMatches++;
            }
        });

        const allItemsAreCorrect = incorrectMatches === 0;
        
        if (allItemsAreCorrect) {
            setAllCorrect(true);
        } else {
            const scoreDeduction = incorrectMatches * 10;
            const newPotentialScore = Math.max(0, currentPotentialScore - scoreDeduction);
            setCurrentPotentialScore(newPotentialScore);
            setSubmissionMessage(`You have ${incorrectMatches} incorrectly sorted blocks. Please try again!`);
            onComplete(0, false);
        }
        setIsSubmitted(true);
    };

    const handleReplay = () => {
        resetAfterIncorrectAttempt();
    };

    const renderItemButton = (item: Item) => {
        const buttonClass = (isSubmitted) 
            ? 'bg-gray-600 opacity-70 cursor-default' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800';

        return (
            <button
                key={item.id}
                draggable={!isSubmitted}
                onDragStart={(e) => handleDragStart(e, item.id)}
                className={`px-4 py-2 rounded-lg text-white font-bold text-sm shadow-md transition-all duration-200
                    ${!isSubmitted ? 'cursor-grab' : 'cursor-default'} ${buttonClass}`}
            >
                {item.name}
            </button>
        );
    };

    const renderCompanyDropZone = (company: Company) => {
        const placedItems = items.filter(item => item.currentCompanyId === company.id);
        
        let dropZoneClass = 'border-blue-500/50';

        if (isSubmitted) {
            if (allCorrect) {
                dropZoneClass = 'border-green-500 bg-green-900/20';
            } else {
                const correctItemsForThisCompany = MATCH_CONNECT_DATA.items.filter(item => item.correctCompanyId === company.id);
                const isPerfectlyCorrect = 
                    placedItems.length === correctItemsForThisCompany.length &&
                    placedItems.every(item => item.correctCompanyId === company.id);

                if (isPerfectlyCorrect) {
                    dropZoneClass = 'border-green-500 bg-green-900/20';
                } else if (placedItems.length > 0 || correctItemsForThisCompany.length > 0) {
                    dropZoneClass = 'border-red-500 bg-red-900/20';
                }
            }
        }
        
        if (draggedItemId && !isSubmitted) {
            dropZoneClass = 'border-yellow-400 bg-yellow-900/20';
        }

        return (
            <div
                key={company.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, company.id)}
                className={`p-4 bg-black/40 border-2 rounded-lg min-h-[160px] flex flex-col items-center gap-2 transition-colors duration-200 ${dropZoneClass}`}
            >
                <h3 className="text-xl font-bold text-blue-300 mb-2">{company.name}</h3>
                <div className="flex flex-wrap justify-center gap-2">
                    {placedItems.map(item => renderItemButton(item))}
                </div>
            </div>
        );
    };

    const unplacedItems = items.filter(item => item.currentCompanyId === null);

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Drag and drop each tech item to its correct company group.</p>

            <div 
                className="mb-8 p-4 bg-black/40 border border-white/10 rounded-lg min-h-[80px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, null)}
            >
                <h3 className="text-xl font-bold text-gray-200 mb-4">Items to Match:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {unplacedItems.map(item => renderItemButton(item))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {companies.map(company => renderCompanyDropZone(company))}
            </div>

            {!allCorrect && !isSubmitted && (
                <button
                    onClick={handleCheckAnswers}
                    disabled={items.some(item => item.currentCompanyId === null)}
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
                        Replay
                    </button>
                </div>
            )}

            {allCorrect && (
                <div className="mt-6">
                    <p className="text-2xl font-bold text-green-400 mb-4">{submissionMessage}</p>
                    <button
                        onClick={() => onComplete(0, true)}
                        className="w-full max-w-sm px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Next Challenge
                    </button>
                </div>
            )}

            <div className="mt-4 text-gray-400">
                Potential points: {Math.max(MINIMUM_SCORE, currentPotentialScore)}
            </div>
        </div>
    );
};

export default MatchConnectChallenge;