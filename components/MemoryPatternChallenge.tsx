import React, { useState, useEffect, useCallback } from 'react';

interface MemoryPatternChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const GRID_SIZE = 16;
const STAGES = [4, 5, 6]; // Number of blocks to flash per stage
const FLASH_DURATION = 1000; // 1 second

type GameState = 'idle' | 'showing' | 'input' | 'failed' | 'stageSuccess';

const MemoryPatternChallenge: React.FC<MemoryPatternChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [stageIndex, setStageIndex] = useState(0);
    const [gameState, setGameState] = useState<GameState>('idle');
    const [pattern, setPattern] = useState<number[]>([]);
    const [userSelection, setUserSelection] = useState<Set<number>>(new Set());
    const [isComplete, setIsComplete] = useState(false);
    const [potentialScore, setPotentialScore] = useState(100);
    const [feedback, setFeedback] = useState<string | null>(null);

    const generatePattern = useCallback(() => {
        const newPattern: number[] = [];
        const itemsToFlash = STAGES[stageIndex];
        while (newPattern.length < itemsToFlash) {
            const randomIndex = Math.floor(Math.random() * GRID_SIZE);
            if (!newPattern.includes(randomIndex)) {
                newPattern.push(randomIndex);
            }
        }
        setPattern(newPattern);
    }, [stageIndex]);

    const startStage = () => {
        setUserSelection(new Set());
        generatePattern();
        setGameState('showing');
        setFeedback(null);
        setTimeout(() => {
            setGameState('input');
        }, FLASH_DURATION);
    };
    
    const handleBlockClick = (index: number) => {
        if (gameState !== 'input' || userSelection.has(index)) return;

        const newSelection = new Set(userSelection);
        newSelection.add(index);
        setUserSelection(newSelection);
        
        if (!pattern.includes(index)) {
            // Incorrect click
            setPotentialScore(prev => Math.max(0, prev - 5));
            setFeedback("Incorrect! -5 points.");
            setGameState('failed');
            return;
        }

        // Check if stage is complete
        if (newSelection.size === STAGES[stageIndex]) {
            const allCorrect = [...newSelection].every(item => pattern.includes(item));
            if (allCorrect) {
                setGameState('stageSuccess');
                setFeedback(null);
            } else {
                 setGameState('failed');
                 if(!feedback) { // only deduct if we haven't already
                    setPotentialScore(prev => Math.max(0, prev - 5));
                    setFeedback("Incorrect! -5 points.");
                 }
            }
        }
    };
    
    const handleNextStage = () => {
        if (stageIndex + 1 < STAGES.length) {
            setStageIndex(prev => prev + 1);
            setGameState('idle');
        } else {
            setIsComplete(true);
        }
    };

    const handleRetry = () => {
        setUserSelection(new Set());
        setGameState('idle');
        setFeedback(null);
    };

    const getBlockClass = (index: number) => {
        let baseClass = 'aspect-square rounded-lg transition-all duration-200';
        
        if (gameState === 'showing' && pattern.includes(index)) {
            return `${baseClass} bg-yellow-400 scale-110 shadow-[0_0_20px_#facc15]`;
        }

        if (gameState === 'input' || gameState === 'failed') {
            if (userSelection.has(index)) {
                return pattern.includes(index)
                    ? `${baseClass} bg-green-500` // Correctly selected
                    : `${baseClass} bg-red-500 shake-animation`; // Incorrectly selected
            }
            return `${baseClass} bg-blue-900/40 hover:bg-white/10 cursor-pointer`;
        }
        
        return `${baseClass} bg-blue-900/40`;
    };

    const renderMessage = () => {
        if (isComplete) {
            return (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-3xl font-bold text-green-400">Challenge Complete!</p>
                    <p className="text-xl text-gray-300">Final Score: {potentialScore}</p>
                    <button onClick={() => onComplete(potentialScore)} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
                        Next Challenge
                    </button>
                </div>
            );
        }
        
        switch (gameState) {
            case 'idle':
                return (
                    <button onClick={startStage} className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all">
                        Start Stage {stageIndex + 1}
                    </button>
                );
            case 'showing':
                return <p className="text-2xl font-bold text-yellow-400 animate-pulse">Memorize...</p>;
            case 'input':
                return <p className="text-xl font-bold text-gray-300">Your turn! Select the {STAGES[stageIndex]} blocks.</p>;
            case 'failed':
                 return (
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-2xl font-bold text-red-500">{feedback || 'Incorrect! Try again.'}</p>
                        <button onClick={handleRetry} className="px-8 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700">
                            Retry Stage
                        </button>
                    </div>
                );
            case 'stageSuccess':
                return (
                     <div className="flex flex-col items-center gap-4">
                        <p className="text-2xl font-bold text-green-400">Stage {stageIndex + 1} Cleared!</p>
                        <button onClick={handleNextStage} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">
                           {stageIndex + 1 < STAGES.length ? 'Next Stage' : 'Finish Challenge'}
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Memorize the flashing pattern, then repeat it. The pattern gets longer each stage.</p>

            <div className="flex justify-between items-center max-w-sm mx-auto mb-6">
                <div className="flex items-center gap-4">
                    <span className="text-white text-lg font-bold">Stage:</span>
                    <div className="flex gap-2">
                        {STAGES.map((_, index) => (
                            <div key={index} className={`w-8 h-4 rounded-full transition-all duration-300 ${index < stageIndex ? 'bg-green-500' : index === stageIndex ? 'bg-blue-500' : 'bg-black/40'}`} />
                        ))}
                    </div>
                </div>
                {!isComplete && (
                     <div>
                        <span className="text-white text-lg font-bold">Potential Score: {potentialScore}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mb-8">
                {Array.from({ length: GRID_SIZE }).map((_, index) => (
                    <div
                        key={index}
                        onClick={() => handleBlockClick(index)}
                        className={getBlockClass(index)}
                    />
                ))}
            </div>

            <div className="min-h-[5rem] flex items-center justify-center">
                {renderMessage()}
            </div>
        </div>
    );
};

export default MemoryPatternChallenge;