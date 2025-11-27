import React, { useState, useEffect, useRef } from 'react';

interface AZSpeedTestChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const TARGET_TEXT = "abcdefghijklmnopqrstuvwxyz";
const TIME_LIMIT = 15; // seconds

const AZSpeedTestChallenge: React.FC<AZSpeedTestChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [gameState, setGameState] = useState<'waiting' | 'running' | 'success' | 'failed'>('waiting');
    
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the input on mount
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (gameState === 'running' && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (gameState === 'running' && timeLeft === 0) {
            setGameState('failed');
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [gameState, timeLeft]);
    
    const startTimer = () => {
        if (gameState === 'waiting') {
            setGameState('running');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (gameState === 'success' || gameState === 'failed') return;
        
        startTimer();
        const { value } = e.target;
        setUserInput(value.toLowerCase());

        if (value.toLowerCase() === TARGET_TEXT) {
            if (timerRef.current) clearTimeout(timerRef.current);
            setGameState('success');
        }
    };
    
    const resetChallenge = () => {
        setUserInput('');
        setTimeLeft(TIME_LIMIT);
        setGameState('waiting');
        if (timerRef.current) clearTimeout(timerRef.current);
        inputRef.current?.focus();
    };
    
    const handleSuccess = () => {
        onComplete(true);
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Type the alphabet from A to Z as fast as you can. You have {TIME_LIMIT} seconds!</p>

            <div className="flex justify-center items-center gap-6 mb-6">
                <div className="text-center">
                    <p className="text-5xl font-mono font-bold text-blue-400">{timeLeft}</p>
                    <p className="text-sm text-gray-400">Seconds Left</p>
                </div>
            </div>

            <div className="p-4 bg-black/40 rounded-lg mb-6 text-center">
                <p className="text-2xl font-mono text-gray-200 tracking-widest">
                    {TARGET_TEXT.split('').map((char, index) => {
                        let color = 'text-gray-500';
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
                autoComplete="off"
                disabled={gameState === 'success' || gameState === 'failed'}
                className="w-full max-w-lg px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 font-mono text-2xl tracking-widest text-center"
            />
            
            <div className="mt-8 text-center min-h-[80px] flex flex-col justify-center items-center">
                {gameState === 'success' && (
                     <>
                        <p className="text-3xl font-bold text-green-400">Success!</p>
                        <p className="text-lg text-gray-300 mt-2">You completed the challenge with {timeLeft} second(s) to spare.</p>
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
                    <p className="text-gray-400">Start typing in the box to begin the timer.</p>
                )}
            </div>
        </div>
    );
};

export default AZSpeedTestChallenge;
