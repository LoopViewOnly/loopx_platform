
import React, { useState, useEffect, useRef } from 'react';

interface SequenceChallengeProps {
    onComplete: (finalTime: number) => void;
    challengeTitle: string;
}

const GRID_SIZE = 30;

const shuffle = (array: number[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const SequenceChallenge: React.FC<SequenceChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [numbersState, setNumbersState] = useState<{ value: number | string, clicked: boolean }[]>([]);
    const [currentGoal, setCurrentGoal] = useState(1);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [time, setTime] = useState(0.0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };
    
    const startTimer = () => {
        stopTimer();
        startTimeRef.current = performance.now();
        timerIntervalRef.current = setInterval(() => {
            if (startTimeRef.current) {
                const elapsed = (performance.now() - startTimeRef.current) / 1000;
                setTime(parseFloat(elapsed.toFixed(1)));
            }
        }, 100);
    };

    const initGame = () => {
        if (!hasStarted) {
            setHasStarted(true);
        }
        stopTimer();
        setIsGameOver(false);
        setCurrentGoal(1);
        const initialNumbers = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
        const shuffled = shuffle(initialNumbers);
        setNumbersState(shuffled.map(value => ({ value, clicked: false })));
        setIsGameRunning(true);
        setTime(0.0);
        startTimer();
    };

    const handleClick = (clickedNumber: number) => {
        if (!isGameRunning || numbersState.find(n => n.value === clickedNumber)?.clicked) {
            return;
        }

        if (clickedNumber === currentGoal) {
            setNumbersState(prevState =>
                prevState.map(item =>
                    item.value === clickedNumber ? { ...item, clicked: true } : item
                )
            );

            if (currentGoal === GRID_SIZE) {
                stopTimer();
                const finalTime = (performance.now() - (startTimeRef.current || performance.now())) / 1000;
                setTime(parseFloat(finalTime.toFixed(2))); // show more precision at the end
                setIsGameRunning(false);
                setIsGameOver(true);
                return;
            }
            setCurrentGoal(prev => prev + 1);
        }
    };
    
    useEffect(() => {
        return () => stopTimer(); // Cleanup on unmount
    }, []);

    const getCellClass = (item: { value: number | string, clicked: boolean }) => {
        let classes = 'aspect-square flex justify-center items-center rounded-md text-white text-xl font-bold transition duration-150 select-none';

        if (item.clicked) {
            classes += ' bg-black/50 text-gray-600 opacity-50 scale-95 cursor-default';
        } else if (isGameRunning) {
            classes += ' bg-blue-900/20 border border-white/10 backdrop-blur-sm hover:bg-blue-500/30 hover:scale-105 cursor-pointer';
        } else {
            // Placeholder style
            classes += ' bg-blue-900/20 border border-white/10 text-white/50';
        }
        return classes;
    };
    
    const finalTimeValue = parseFloat(time.toFixed(2));

    if (!hasStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center flex flex-col items-center justify-center min-h-[500px]">
                <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
                <p className="text-gray-300 mb-6 max-w-md">Find and click the numbers from 1 to 30 in the correct order as fast as you can.</p>
                <button
                    onClick={initGame}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30 text-lg"
                >
                    Start Game
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Find and click the numbers from 1 to 30 in the correct order as fast as you can.</p>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 rounded-lg bg-black/40 border border-blue-500/50">
                <div className="text-white text-lg font-medium">
                    Next: <span className="text-3xl font-extrabold text-blue-400">{isGameOver ? '🎉' : currentGoal}</span>
                </div>
                <div className="text-white text-lg font-medium mt-2 sm:mt-0">
                    Time: <span className="text-3xl font-extrabold text-blue-400">{time.toFixed(1)}</span>s
                </div>
                 <button 
                    onClick={initGame} 
                    className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 shadow-lg"
                 >
                    Restart Game
                </button>
            </div>
            
            <div className="grid grid-cols-6 gap-1 sm:gap-2 max-w-lg mx-auto">
                {numbersState.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => isGameRunning && typeof item.value === 'number' && handleClick(item.value)}
                        className={getCellClass(item)}
                    >
                        {item.value}
                    </div>
                ))}
            </div>

            {isGameOver && (
                 <div className="mt-8">
                    <h3 className="text-3xl font-bold text-green-400">Congratulations!</h3>
                    <p className="text-lg text-gray-200 mt-2">You finished in <span className="text-2xl font-bold text-blue-400">{finalTimeValue}s</span>.</p>
                     <button onClick={() => onComplete(finalTimeValue)} className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                        Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default SequenceChallenge;
