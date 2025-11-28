import React, { useState, useEffect, useRef } from 'react';
import { COLOR_CONFUSION_DATA } from '../challenges/content';

interface ColorConfusionChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const TOTAL_TIME = 30;
const MINIMUM_SCORE = 50;

const ColorConfusionChallenge: React.FC<ColorConfusionChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);
    const [potentialScore, setPotentialScore] = useState(100);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    };

    useEffect(() => {
        if (gameHasStarted) {
            startTimer();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameHasStarted]);

    const resetForTimeout = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStageIndex(0);
        setTimeLeft(TOTAL_TIME);
        setPotentialScore(prev => Math.max(0, prev - 10)); // Penalty for timeout
        setFeedback({ message: "Time's up! -10 points. Starting over...", color: 'text-red-500' });
        startTimer();
    };

    useEffect(() => {
        if (timeLeft <= 0 && !isComplete && gameHasStarted) {
            resetForTimeout();
        }
    }, [timeLeft, isComplete, gameHasStarted]);

    const handleOptionClick = (optionText: string) => {
        if (isComplete || hasSubmitted) return;
        setHasSubmitted(true);

        const currentStage = COLOR_CONFUSION_DATA[stageIndex];
        if (optionText === currentStage.correctAnswer) {
            setFeedback({ message: 'Correct!', color: 'text-green-400' });
            setTimeout(() => {
                if (stageIndex + 1 < COLOR_CONFUSION_DATA.length) {
                    setStageIndex(prev => prev + 1);
                    setFeedback(null);
                    setHasSubmitted(false);
                } else {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setIsComplete(true);
                    const finalScore = Math.max(MINIMUM_SCORE, potentialScore);
                    setFeedback({ message: `Challenge Complete! Final Score: ${finalScore}`, color: 'text-green-400' });
                    onComplete(finalScore);
                }
            }, 500);
        } else {
            setPotentialScore(prev => Math.max(0, prev - 10));
            setFeedback({ message: 'Incorrect! -10 points.', color: 'text-red-500' });
            setHasSubmitted(false);
        }
    };

    if (!gameHasStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center flex flex-col items-center justify-center min-h-[500px]">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
                <div className="max-w-lg text-left space-y-4 mb-8 p-6 bg-black/20 rounded-lg border border-white/10">
                    <h3 className="text-xl font-bold text-white text-center">Instructions</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>You will be shown 3 questions one after another.</li>
                        <li>For each question, you must click the button with the correct <strong className="text-yellow-400">TEXT</strong>, ignoring the color of the text.</li>
                        <li>You have a total of <strong className="text-blue-400">30 seconds</strong> to complete all 3 stages.</li>
                    </ul>
                </div>
                <button
                    onClick={() => setGameHasStarted(true)}
                    className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Start Challenge
                </button>
            </div>
        );
    }
    
    const currentStageData = COLOR_CONFUSION_DATA[stageIndex];

    const colorMap: { [key: string]: string } = {
        red: 'text-red-500',
        green: 'text-green-500',
        blue: 'text-blue-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        pink: 'text-pink-500',
        orange: 'text-orange-500',
        black: 'text-black',
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            
            <div className="flex justify-between items-center max-w-lg mx-auto mb-6 p-3 bg-black/40 rounded-lg border border-white/10">
                <div>
                    <p className="text-sm text-gray-400">Time Left</p>
                    <p className="text-3xl font-bold text-blue-400">{timeLeft}s</p>
                </div>
                <div>
                    <p className="text-sm text-gray-400">Potential Score</p>
                    <p className="text-3xl font-bold text-blue-400">{Math.max(MINIMUM_SCORE, potentialScore)}</p>
                </div>
            </div>

            <p className="text-4xl font-extrabold text-white mb-8">{currentStageData.question}</p>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {currentStageData.options.map((option, index) => {
                    const textColorClass = colorMap[option.color] || 'text-white';

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionClick(option.text)}
                            disabled={isComplete || hasSubmitted}
                            className={`p-6 rounded-lg text-2xl font-bold border-2 border-transparent transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${textColorClass}`}
                        >
                            {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 min-h-[3rem] flex items-center justify-center">
                {feedback && !isComplete && (
                    <p className={`text-2xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
                 {isComplete && feedback && (
                    <div className="flex flex-col items-center gap-4">
                        <p className={`text-2xl font-bold ${feedback.color}`}>{feedback.message}</p>
                        <button
                            onClick={() => onComplete(0)} // Score already sent
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                        >
                            Next Challenge
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorConfusionChallenge;