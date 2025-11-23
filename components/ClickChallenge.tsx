
import React, { useState, useEffect, useRef } from 'react';
import { CLICK_CHALLENGE_DURATION, CLICK_MIN_CPS } from '../constants';

interface ClickChallengeProps {
    onComplete: (cps: number, attempts: number) => void;
    challengeTitle: string;
}

const ClickChallenge: React.FC<ClickChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(CLICK_CHALLENGE_DURATION);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (gameStarted && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameStarted) {
            setGameOver(true);
            setGameStarted(false);
            if (timerRef.current) clearTimeout(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [gameStarted, timeLeft]);

    const startGame = (isRetry = false) => {
        if (isRetry) {
            setAttempts(prev => prev + 1);
        } else {
            setAttempts(1);
        }
        setClicks(0);
        setTimeLeft(CLICK_CHALLENGE_DURATION);
        setGameOver(false);
        setGameStarted(true);
    };
    
    const handleClick = () => {
        if (gameStarted && !gameOver) {
            setClicks(prev => prev + 1);
        }
    };
    
    const cps = parseFloat((clicks / CLICK_CHALLENGE_DURATION).toFixed(2));

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-1">Click the button as many times as you can in {CLICK_CHALLENGE_DURATION} seconds.</p>
            <p className="text-sm text-yellow-400 mb-6">Minimum target: {CLICK_MIN_CPS} CPS</p>


            <div className="my-8">
                <p className="text-4xl font-bold text-blue-400">{timeLeft}</p>
                <p className="text-gray-400">Seconds Remaining</p>
            </div>
            
            {!gameStarted && !gameOver && (
                 <button onClick={() => startGame(false)} className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30">
                    Start
                </button>
            )}

            {gameStarted && (
                 <button onClick={handleClick} className="w-full h-48 bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold rounded-lg active:scale-95 transition-transform duration-100 flex items-center justify-center text-5xl">
                    {clicks}
                </button>
            )}
            
            {gameOver && (
                <div className="mt-8">
                    <h3 className="text-3xl font-bold text-green-400">Challenge Complete!</h3>
                    <p className="text-5xl font-bold my-4 text-green-400">{cps} <span className="text-2xl text-gray-300">CPS</span></p>
                    <button onClick={() => onComplete(cps, attempts)} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                        Next Challenge
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClickChallenge;
