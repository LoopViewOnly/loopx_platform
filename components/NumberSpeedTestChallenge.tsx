import React, { useState, useEffect, useRef } from 'react';

interface NumberSpeedTestChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const TIME_LIMIT = 50; // seconds
const ALL_NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

const NumberSpeedTestChallenge: React.FC<NumberSpeedTestChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [foundNumbers, setFoundNumbers] = useState<Set<number>>(new Set());
    const [currentInput, setCurrentInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [gameState, setGameState] = useState<'waiting' | 'running' | 'success' | 'failed'>('waiting');
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Game timer logic
    useEffect(() => {
        if (gameState === 'running' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (gameState === 'running' && timeLeft === 0) {
            setGameState('failed');
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, timeLeft]);

    // Check for win condition
    useEffect(() => {
        if (foundNumbers.size === 100 && gameState === 'running') {
            if (timerRef.current) clearInterval(timerRef.current);
            setGameState('success');
        }
    }, [foundNumbers, gameState]);

    const startTimer = () => {
        if (gameState === 'waiting') {
            setGameState('running');
        }
    };

    // Debounce logic for auto-submitting the number
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (currentInput) {
            debounceTimeoutRef.current = setTimeout(() => {
                const num = parseInt(currentInput, 10);
                if (!isNaN(num) && num >= 1 && num <= 100) {
                    startTimer(); // Start timer on the first valid submission
                    setFoundNumbers(prev => {
                        const newSet = new Set(prev);
                        newSet.add(num);
                        return newSet;
                    });
                    setCurrentInput(''); // Clear input after submission
                }
            }, 250); // Reduced delay for a faster, more "immediate" feel
        }

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [currentInput]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers in the input
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCurrentInput(value);
    };

    const resetChallenge = () => {
        setFoundNumbers(new Set());
        setCurrentInput('');
        setTimeLeft(TIME_LIMIT);
        setGameState('waiting');
        if (timerRef.current) clearInterval(timerRef.current);
        inputRef.current?.focus();
    };
    
    const handleSuccess = () => {
        onComplete(true);
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Find and type all numbers from 1 to 100. Numbers are submitted automatically after a brief pause. You have {TIME_LIMIT} seconds!</p>

            <div className="flex justify-between items-center max-w-md mx-auto mb-6">
                <div className="text-center">
                    <p className="text-5xl font-mono font-bold text-blue-400">{timeLeft}</p>
                    <p className="text-sm text-gray-400">Seconds Left</p>
                </div>
                 <div className="text-center">
                    <p className="text-5xl font-mono font-bold text-green-400">{foundNumbers.size}</p>
                    <p className="text-sm text-gray-400">/ 100 Found</p>
                </div>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                autoComplete="off"
                disabled={gameState === 'success' || gameState === 'failed'}
                className="w-full max-w-xs mx-auto mb-6 px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 font-mono text-2xl tracking-widest text-center"
                placeholder="Type a number..."
            />
            
            <div className="grid grid-cols-10 gap-1 max-w-lg mx-auto bg-black/20 p-2 rounded-lg">
                {ALL_NUMBERS.map(num => (
                    <div
                        key={num}
                        className={`aspect-square flex items-center justify-center rounded-md font-mono text-sm sm:text-base font-bold transition-colors duration-300
                            ${foundNumbers.has(num) ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'}
                        `}
                    >
                        {num}
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center min-h-[80px] flex flex-col justify-center items-center">
                {gameState === 'success' && (
                     <>
                        <p className="text-3xl font-bold text-green-400">Success!</p>
                        <p className="text-lg text-gray-300 mt-2">You found all numbers with {timeLeft} second(s) to spare.</p>
                        <button onClick={handleSuccess} className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                            Next Challenge
                        </button>
                    </>
                )}
                {gameState === 'failed' && (
                     <>
                        <p className="text-3xl font-bold text-red-500">Time's Up!</p>
                        <button onClick={resetChallenge} className="mt-4 px-6 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300">
                            Try Again
                        </button>
                    </>
                )}
                {gameState === 'waiting' && (
                    <p className="text-gray-400">Start typing a number to begin.</p>
                )}
            </div>
        </div>
    );
};

export default NumberSpeedTestChallenge;