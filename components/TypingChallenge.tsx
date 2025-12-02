
import React, { useState, useEffect, useRef } from 'react';

interface TypingChallengeProps {
    onComplete: (cpm: number, attempts: number) => void;
    challengeTitle: string;
    challengeText: string;
    minCpm: number;
}

const MAX_ATTEMPTS = 3;

const TypingChallenge: React.FC<TypingChallengeProps> = ({ onComplete, challengeTitle, challengeText, minCpm }) => {
    const [userInput, setUserInput] = useState('');
    const [cpm, setCpm] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isPassing, setIsPassing] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [outOfAttempts, setOutOfAttempts] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (isComplete && (isPassing || outOfAttempts)) {
            // Automatically advance after showing the score for a moment.
            const timer = setTimeout(() => {
                onComplete(cpm, attempts);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, isPassing, outOfAttempts, onComplete, cpm, attempts]);
    
    const resetChallenge = () => {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts > MAX_ATTEMPTS) {
            // Out of attempts - auto-advance with current (low) score
            setOutOfAttempts(true);
            return;
        }
        
        setUserInput('');
        setCpm(0);
        setIsComplete(false);
        setIsPassing(false);
        startTimeRef.current = null;
        inputRef.current?.focus();
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isComplete) return;

        const { value } = e.target;
        
        if (!startTimeRef.current && value.length > 0) {
            startTimeRef.current = Date.now();
        }

        setUserInput(value);
        
        if (value === challengeText) {
            if (!startTimeRef.current) return;
            const endTime = Date.now();
            const elapsedTime = (endTime - startTimeRef.current) / 1000; // in seconds
            const finalCpm = Math.round((challengeText.length / elapsedTime) * 60);
            setCpm(finalCpm);
            setIsComplete(true);
            setIsPassing(finalCpm >= minCpm);
        }
    };
    
    const preventCheating = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-1">Type the sentence below exactly as it appears.</p>
            <p className="text-sm text-yellow-400 mb-6">Minimum target: {minCpm} CPM</p>

            <div className="p-4 bg-black/40 rounded-lg mb-6 text-center">
                <p className="text-lg font-mono text-gray-200 tracking-wider">
                    {challengeText.split('').map((char, index) => {
                        let color = 'text-gray-400';
                        if (index < userInput.length) {
                            color = char === userInput[index] ? 'text-green-400' : 'text-red-500';
                        }
                        return <span key={index} className={color}>{char}</span>;
                    })}
                </p>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onPaste={preventCheating}
                onCopy={preventCheating}
                onCut={preventCheating}
                autoComplete="off"
                disabled={isComplete}
                className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 font-mono text-lg tracking-wider"
            />
            
            <div className="mt-6 text-center min-h-[80px] flex flex-col justify-center">
                {isComplete && isPassing && (
                     <>
                        <p className="text-4xl font-bold text-green-400">
                            {cpm} <span className="text-xl text-gray-300">CPM</span>
                        </p>
                        <p className="text-green-400 font-bold text-lg mt-2">Challenge Complete! Advancing...</p>
                    </>
                )}
                {isComplete && !isPassing && !outOfAttempts && (
                    <>
                        <p className="text-4xl font-bold text-red-400">
                            {cpm} <span className="text-xl text-gray-300">CPM</span>
                        </p>
                        <p className="text-red-400 font-bold text-lg mt-2">Too slow! You need at least {minCpm} CPM.</p>
                        <p className="text-gray-400 text-sm mt-1">Attempt {attempts} of {MAX_ATTEMPTS}</p>
                        <button
                            onClick={resetChallenge}
                            className="mt-4 px-6 py-2 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Try Again ({MAX_ATTEMPTS - attempts} left)
                        </button>
                    </>
                )}
                {isComplete && outOfAttempts && (
                    <>
                        <p className="text-4xl font-bold text-orange-400">
                            {cpm} <span className="text-xl text-gray-300">CPM</span>
                        </p>
                        <p className="text-orange-400 font-bold text-lg mt-2">Out of attempts! Moving on...</p>
                    </>
                )}
                {!isComplete && (
                    <p className="text-gray-400">Correctly type the sentence to see your score.</p>
                )}
            </div>
        </div>
    );
};

export default TypingChallenge;