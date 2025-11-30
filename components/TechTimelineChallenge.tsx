import React, { useState, useEffect } from 'react';
import { TECH_TIMELINE_DATA } from '../challenges/content';

interface TechTimelineChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type CompanyItem = {
    id: number;
    name: string;
    year: number;
    feedback: 'correct' | 'incorrect' | null;
};

type YearInput = {
    name: string;
    correctYear: number;
    enteredYear: string;
    feedback: 'correct' | 'incorrect' | null;
};

const { stage1MaxScore, stage2MaxScore, minimumScore, deductionPerError } = TECH_TIMELINE_DATA;

// Helper to shuffle an array
const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const TechTimelineChallenge: React.FC<TechTimelineChallengeProps> = ({ onComplete, challengeTitle }) => {
    // Stage 1 state
    const [items, setItems] = useState<CompanyItem[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [isStage1Submitted, setIsStage1Submitted] = useState(false);
    const [isStage1Complete, setIsStage1Complete] = useState(false);
    const [hasStage1Submitted, setHasStage1Submitted] = useState(false);
    const [stage1Score, setStage1Score] = useState(stage1MaxScore);
    const [stage1Message, setStage1Message] = useState<string | null>(null);

    // Stage 2 state
    const [showStage2, setShowStage2] = useState(false);
    const [yearInputs, setYearInputs] = useState<YearInput[]>([]);
    const [isStage2Submitted, setIsStage2Submitted] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [stage2Score, setStage2Score] = useState(stage2MaxScore);
    const [stage2Message, setStage2Message] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [stage2AttemptsLeft, setStage2AttemptsLeft] = useState(2);

    const correctOrder = TECH_TIMELINE_DATA.companies.map(c => c.name);

    useEffect(() => {
        const shuffledItems = shuffle(TECH_TIMELINE_DATA.companies).map((company, index) => ({
            id: index,
            name: company.name,
            year: company.year,
            feedback: null,
        }));
        setItems(shuffledItems);
    }, []);

    // Stage 1 handlers
    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        if (isStage1Submitted) {
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
        if (isStage1Complete || hasStage1Submitted) return;
        setHasStage1Submitted(true);

        let incorrectCount = 0;
        const newFeedbackItems = items.map((item, index) => {
            if (item.name === correctOrder[index]) {
                return { ...item, feedback: 'correct' as const };
            } else {
                incorrectCount++;
                return { ...item, feedback: 'incorrect' as const };
            }
        });

        setItems(newFeedbackItems);
        setIsStage1Submitted(true);

        if (incorrectCount === 0) {
            setStage1Message(`Perfect order! Stage 1 Score: ${stage1Score}`);
            setIsStage1Complete(true);
        } else {
            const scoreDeduction = incorrectCount * deductionPerError;
            const newScore = Math.max(0, stage1Score - scoreDeduction);
            setStage1Score(newScore);
            setStage1Message(`${incorrectCount} item(s) in wrong position. -${scoreDeduction} points.`);
        }
    };

    const handleStage1Retry = () => {
        setIsStage1Submitted(false);
        setHasStage1Submitted(false);
        setStage1Message(null);
        setItems(prevItems => prevItems.map(item => ({ ...item, feedback: null })));
    };

    const handleContinueToStage2 = () => {
        // Initialize year inputs with correct order
        const inputs = TECH_TIMELINE_DATA.companies.map(company => ({
            name: company.name,
            correctYear: company.year,
            enteredYear: '',
            feedback: null,
        }));
        setYearInputs(inputs);
        setShowStage2(true);
    };

    // Stage 2 handlers
    const handleYearChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d*$/.test(value)) return;
        
        setYearInputs(prev => prev.map((input, i) => 
            i === index ? { ...input, enteredYear: value } : input
        ));
    };

    const handleCheckYears = () => {
        let incorrectCount = 0;
        const newInputs = yearInputs.map(input => {
            const enteredYear = parseInt(input.enteredYear, 10);
            if (enteredYear === input.correctYear) {
                return { ...input, feedback: 'correct' as const };
            } else {
                incorrectCount++;
                return { ...input, feedback: 'incorrect' as const };
            }
        });

        setYearInputs(newInputs);
        setIsStage2Submitted(true);

        const scoreDeduction = incorrectCount * deductionPerError;
        const newStage2Score = Math.max(0, stage2Score - scoreDeduction);
        setStage2Score(newStage2Score);

        if (incorrectCount === 0) {
            // Perfect - complete the challenge
            const finalTotal = Math.max(minimumScore, stage1Score + newStage2Score);
            setTotalScore(finalTotal);
            setStage2Message(`Perfect! All years correct! Stage 2 Score: ${newStage2Score}`);
            setIsComplete(true);
            setTimeout(() => onComplete(finalTotal), 2500);
        } else {
            const newAttemptsLeft = stage2AttemptsLeft - 1;
            setStage2AttemptsLeft(newAttemptsLeft);

            if (newAttemptsLeft === 0) {
                // Out of attempts - complete with current score
                const finalTotal = Math.max(minimumScore, stage1Score + newStage2Score);
                setTotalScore(finalTotal);
                setStage2Message(`Out of attempts! ${incorrectCount} year(s) incorrect. Stage 2 Score: ${newStage2Score}`);
                setIsComplete(true);
                setTimeout(() => onComplete(finalTotal), 2500);
            } else {
                // Still have attempts left
                setStage2Message(`${incorrectCount} year(s) incorrect. -${scoreDeduction} points. ${newAttemptsLeft} attempt remaining.`);
            }
        }
    };

    const handleStage2Retry = () => {
        setIsStage2Submitted(false);
        setStage2Message(null);
        // Keep the correct answers, only reset feedback for incorrect ones
        setYearInputs(prev => prev.map(input => ({
            ...input,
            feedback: null,
            // Keep correct answers, clear incorrect ones
            enteredYear: input.feedback === 'correct' ? input.enteredYear : ''
        })));
    };

    const allYearsFilled = yearInputs.every(input => input.enteredYear.length === 4);

    const getItemClass = (item: CompanyItem, index: number) => {
        let classes = 'p-3 bg-purple-900/40 border border-white/10 rounded-lg text-white font-semibold transition-all duration-300';
        if (!isStage1Submitted) {
            classes += ' cursor-grab active:cursor-grabbing';
        }
        if (draggedItemIndex === index) {
            classes += ' opacity-50';
        }
        if (isStage1Submitted) {
            if (item.feedback === 'correct') {
                classes += ' bg-green-800/50 border-green-500';
            } else if (item.feedback === 'incorrect') {
                classes += ' bg-red-800/50 border-red-500';
            }
        }
        return classes;
    };

    const getYearInputClass = (input: YearInput) => {
        let classes = 'w-20 p-2 text-center rounded-lg border-2 font-bold bg-gray-800 ';
        if (isStage2Submitted) {
            if (input.feedback === 'correct') {
                classes += 'border-green-500 text-green-400';
            } else {
                classes += 'border-red-500 text-red-400';
            }
        } else {
            classes += 'border-white/30 text-white focus:border-purple-500 focus:outline-none';
        }
        return classes;
    };

    // Stage 2 UI
    if (showStage2) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                <h2 className="text-2xl font-bold text-purple-300 mb-2">{challengeTitle}</h2>
                <p className="text-yellow-400 font-bold mb-2">🎉 Stage 2: Guess the Years!</p>
                <p className="text-gray-300 mb-2">Enter the founding year for each company.</p>
                {!isComplete && (
                    <p className="text-gray-400 text-sm mb-6">
                        Attempts remaining: <span className="font-bold text-yellow-400">{stage2AttemptsLeft}</span>
                    </p>
                )}

                <div className="max-w-md mx-auto mb-6">
                    <div className="space-y-3">
                        {yearInputs.map((input, index) => (
                            <div 
                                key={input.name}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                    isStage2Submitted 
                                        ? input.feedback === 'correct' 
                                            ? 'bg-green-800/30 border-green-500/50' 
                                            : 'bg-red-800/30 border-red-500/50'
                                        : 'bg-gray-800/40 border-white/10'
                                }`}
                            >
                                <span className="text-white font-semibold">
                                    <span className="text-gray-400 mr-2">{index + 1}.</span>
                                    {input.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={input.enteredYear}
                                        onChange={(e) => handleYearChange(index, e.target.value)}
                                        disabled={isStage2Submitted || input.feedback === 'correct'}
                                        placeholder="YYYY"
                                        className={getYearInputClass(input)}
                                    />
                                    {isComplete && input.feedback === 'incorrect' && (
                                        <span className="text-green-400 text-sm">({input.correctYear})</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {stage2Message && (
                    <p className={`text-lg font-bold mb-4 ${stage2Message.includes('Perfect') ? 'text-green-400' : stage2Message.includes('Out of') ? 'text-red-400' : 'text-yellow-400'}`}>
                        {stage2Message}
                    </p>
                )}

                {isComplete ? (
                    <div className="mt-6">
                        <p className="text-gray-400 mb-2">Stage 1: {stage1Score} pts + Stage 2: {stage2Score} pts</p>
                        <p className="text-3xl font-bold text-green-400">Total Score: {totalScore}</p>
                    </div>
                ) : isStage2Submitted ? (
                    <button
                        onClick={handleStage2Retry}
                        className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Try Again
                    </button>
                ) : (
                    <button
                        onClick={handleCheckYears}
                        disabled={!allYearsFilled}
                        className="w-full max-w-sm px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/30"
                    >
                        Check Years
                    </button>
                )}

                <div className="mt-4 text-gray-400">
                    Stage 1 Score: {stage1Score} | Stage 2 Potential: {stage2Score}
                </div>
            </div>
        );
    }

    // Stage 1 UI
    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Arrange these tech companies in chronological order from first founded (top) to last founded (bottom).</p>

            <div className="max-w-md mx-auto">
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={item.id}
                            draggable={!isStage1Submitted}
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
                {isStage1Complete ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-2xl font-bold text-green-400">{stage1Message}</p>
                        <button
                            onClick={handleContinueToStage2}
                            className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Continue to Stage 2 →
                        </button>
                    </div>
                ) : isStage1Submitted ? (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg font-bold text-red-400">{stage1Message}</p>
                        <button
                            onClick={handleStage1Retry}
                            className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleCheckOrder}
                        disabled={hasStage1Submitted}
                        className="w-full max-w-sm px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/30"
                    >
                        Check Order
                    </button>
                )}
                <div className="mt-4 text-gray-400">
                    Stage 1 Potential: {isStage1Complete ? stage1Score : stage1Score}
                </div>
            </div>
        </div>
    );
};

export default TechTimelineChallenge;

