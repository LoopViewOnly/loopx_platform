import React, { useState, useRef, useEffect } from 'react';

interface ConsoleHackChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const HINT_COST = 10;
const BASE_SCORE = 100;

const ConsoleHackChallenge: React.FC<ConsoleHackChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [hintUsed, setHintUsed] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Check if the button's disabled attribute has been removed
    useEffect(() => {
        if (isComplete) return;

        const checkDisabled = () => {
            if (buttonRef.current && !buttonRef.current.disabled) {
                // User removed the disabled attribute!
                setIsComplete(true);
                const finalScore = hintUsed ? BASE_SCORE - HINT_COST : BASE_SCORE;
                onComplete(finalScore);
            }
        };

        // Use MutationObserver to detect attribute changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    checkDisabled();
                }
            });
        });

        if (buttonRef.current) {
            observer.observe(buttonRef.current, { attributes: true });
        }

        // Also check periodically in case MutationObserver doesn't catch it
        const interval = setInterval(checkDisabled, 500);

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, [isComplete, hintUsed, onComplete]);

    const handleUseHint = () => {
        if (hintUsed) return;
        setHintUsed(true);
        setShowHint(true);
    };

    const handleButtonClick = () => {
        // This will only fire if the user successfully removed disabled
        if (!isComplete) {
            setIsComplete(true);
            const finalScore = hintUsed ? BASE_SCORE - HINT_COST : BASE_SCORE;
            onComplete(finalScore);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            
            <div className="max-w-lg mx-auto mb-8">
                <p className="text-gray-300 mb-4">
                    The button below is disabled. Your mission is to enable it using your browser's developer tools.
                </p>
    
            </div>

            <div className="p-6 bg-black/40 rounded-lg border border-white/10 mb-8 max-w-md mx-auto">
                
                <button
                    ref={buttonRef}
                    id="hackable-button"
                    onClick={handleButtonClick}
                    disabled={!isComplete}
                    className="w-full px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    {isComplete ? "✓ Button Enabled!" : "Next Challenge"}
                </button>
                
    
            </div>

            {!isComplete && (
                <div className="flex flex-col items-center gap-4">
                    {!hintUsed ? (
                        <button
                            onClick={handleUseHint}
                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                        >
                            💡 Use Hint (-{HINT_COST} pts)
                        </button>
                    ) : null}

                    {showHint && (
                        <div className="p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg max-w-md">
                            <p className="text-purple-300 font-semibold mb-2">💡 Hint:</p>
                            <p className="text-purple-200 text-sm">
                                Right-click the button → <strong>Inspect</strong> → Find the <code className="bg-black/30 px-1 rounded">disabled</code> attribute → Delete it!
                            </p>
                        </div>
                    )}

           
                </div>
            )}

            {isComplete && (
                <div className="mt-6">
                    <p className="text-2xl font-bold text-green-400 mb-2">
                        🎉 Congratulations, Hacker!
                    </p>
                    <p className="text-gray-300">
                        You successfully enabled the button using developer tools!
                    </p>
                    <p className="text-gray-400 mt-2">
                        Score: <span className="text-yellow-400 font-bold">{hintUsed ? BASE_SCORE - HINT_COST : BASE_SCORE}</span> pts
                    </p>
                </div>
            )}
        </div>
    );
};

export default ConsoleHackChallenge;
//test comment
