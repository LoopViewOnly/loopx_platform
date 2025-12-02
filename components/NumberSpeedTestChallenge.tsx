import React, { useState, useEffect, useRef } from 'react';

interface NumberSpeedTestChallengeProps {
    onComplete: (timeElapsed: number) => void;
    challengeTitle: string;
}

const ALL_NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

const NumberSpeedTestChallenge: React.FC<NumberSpeedTestChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [foundNumbers, setFoundNumbers] = useState<Set<number>>(new Set());
    const [currentInput, setCurrentInput] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameState, setGameState] = useState<'waiting' | 'running' | 'success' | 'failed'>('waiting');
    const startTimeRef = useRef<number | null>(null);
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Game timer logic - counts up instead of down
    useEffect(() => {
        if (gameState === 'running') {
            timerRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                    setElapsedTime(elapsed);
                }
            }, 100); // Update every 100ms for smoother display
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    // Check for win condition
    useEffect(() => {
        if (foundNumbers.size === 100 && gameState === 'running') {
            if (timerRef.current) clearInterval(timerRef.current);
            const finalTime = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : elapsedTime;
            setElapsedTime(finalTime);
            setGameState('success');
        }
    }, [foundNumbers, gameState, elapsedTime]);

    const startTimer = () => {
        if (gameState === 'waiting') {
            startTimeRef.current = Date.now();
            setGameState('running');
        }
    };

    // Instant recognition - check when valid number is entered (no debounce)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCurrentInput(value);

        // Start timer on first input
        if (gameState === 'waiting' && value.length > 0) {
            startTimer();
        }

        // Instant check when user types a valid number
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 1 && num <= 100 && !foundNumbers.has(num)) {
            // Add the number and clear input immediately
            setFoundNumbers(prev => {
                const newSet = new Set(prev);
                newSet.add(num);
                return newSet;
            });
            setCurrentInput(''); // Clear input immediately after recognition
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentInput) {
            const num = parseInt(currentInput, 10);
            if (!isNaN(num) && num >= 1 && num <= 100) {
                if (gameState === 'waiting') {
                    startTimer();
                }
                setFoundNumbers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(num);
                    return newSet;
                });
                setCurrentInput('');
            }
        }
    };


    const resetChallenge = () => {
        setFoundNumbers(new Set());
        setCurrentInput('');
        setElapsedTime(0);
        setGameState('waiting');
        startTimeRef.current = null;
        if (timerRef.current) clearInterval(timerRef.current);
        inputRef.current?.focus();
    };
    
    const handleSuccess = () => {
        onComplete(elapsedTime);
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Find and type all numbers from 1 to 100. Numbers are recognized instantly as you type!</p>

            <div className="flex justify-between items-center max-w-md mx-auto mb-6">
                <div className="text-center">
                    <p className="text-5xl font-mono font-bold text-blue-400">{elapsedTime}</p>
                    <p className="text-sm text-gray-400">Seconds</p>
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
                onKeyDown={handleKeyDown}
                autoComplete="off"
                disabled={gameState === 'success'}
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
                        <p className="text-lg text-gray-300 mt-2">You found all numbers in {elapsedTime} seconds!</p>
                        <button onClick={handleSuccess} className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                            Next Challenge
                        </button>
                    </>
                )}
                {gameState === 'waiting' && (
                    <p className="text-gray-400">Start typing a number to begin the timer.</p>
                )}
            </div>
        </div>
    );
};

export default NumberSpeedTestChallenge;