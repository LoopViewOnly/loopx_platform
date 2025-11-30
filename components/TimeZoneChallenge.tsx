import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TIMEZONE_CHALLENGE } from '../challenges/content';

interface TimeZoneChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const WRONG_PENALTY = 5;

const TimeZoneChallenge: React.FC<TimeZoneChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [stageScore, setStageScore] = useState(TIMEZONE_CHALLENGE.pointsPerStage); // Points available for current stage
    const [timeLeft, setTimeLeft] = useState(TIMEZONE_CHALLENGE.timePerStage);
    const [selectedSign, setSelectedSign] = useState<'+' | '-'>('+');
    const [selectedNumber, setSelectedNumber] = useState<string>('');
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [stageComplete, setStageComplete] = useState(false);
    
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentStage = TIMEZONE_CHALLENGE.stages[stageIndex];
    const totalStages = TIMEZONE_CHALLENGE.stages.length;

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        clearTimer();
        setTimeLeft(TIMEZONE_CHALLENGE.timePerStage);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearTimer();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearTimer]);

    // Handle timeout - lose all points for stage, move to next
    useEffect(() => {
        if (gameHasStarted && !isComplete && !stageComplete && timeLeft === 0) {
            const correctAnswer = currentStage.answer;
            setFeedback({ message: `⏱️ Time's up! The answer was GMT ${correctAnswer.sign}${correctAnswer.number}`, color: 'text-red-400' });
            setStageComplete(true);
            
            setTimeout(() => {
                if (stageIndex + 1 < totalStages) {
                    setStageIndex(prev => prev + 1);
                    setStageScore(TIMEZONE_CHALLENGE.pointsPerStage); // Reset stage score
                    setSelectedSign('+');
                    setSelectedNumber('');
                    setFeedback(null);
                    setStageComplete(false);
                    startTimer();
                } else {
                    setIsComplete(true);
                    setFeedback({ 
                        message: `Challenge Complete! Final Score: ${totalScore}`, 
                        color: 'text-green-400' 
                    });
                    onComplete(totalScore);
                }
            }, 2000);
        }
    }, [timeLeft, gameHasStarted, isComplete, stageComplete, stageIndex, totalStages, totalScore, onComplete, startTimer, currentStage]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    // Focus input when stage starts
    useEffect(() => {
        if (gameHasStarted && !isComplete && !stageComplete && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameHasStarted, stageIndex, isComplete, stageComplete]);

    const handleStartGame = () => {
        setGameHasStarted(true);
        startTimer();
    };

    const toggleSign = () => {
        if (stageComplete || isComplete) return;
        setSelectedSign(prev => prev === '+' ? '-' : '+');
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Only digits
        if (value.length <= 2) {
            setSelectedNumber(value);
        }
    };

    const handleSubmit = () => {
        if (stageComplete || isComplete || !selectedNumber) return;

        const userAnswer = {
            sign: selectedSign,
            number: parseInt(selectedNumber, 10)
        };

        const correctAnswer = currentStage.answer;

        if (userAnswer.sign === correctAnswer.sign && userAnswer.number === correctAnswer.number) {
            // Correct!
            clearTimer();
            const earnedPoints = Math.max(0, stageScore);
            setTotalScore(prev => prev + earnedPoints);
            setFeedback({ message: `✅ Correct! +${earnedPoints} points`, color: 'text-green-400' });
            setStageComplete(true);

            setTimeout(() => {
                if (stageIndex + 1 < totalStages) {
                    setStageIndex(prev => prev + 1);
                    setStageScore(TIMEZONE_CHALLENGE.pointsPerStage); // Reset stage score
                    setSelectedSign('+');
                    setSelectedNumber('');
                    setFeedback(null);
                    setStageComplete(false);
                    startTimer();
                } else {
                    const finalScore = totalScore + earnedPoints;
                    setIsComplete(true);
                    setFeedback({ 
                        message: `🎉 Challenge Complete! Final Score: ${finalScore}`, 
                        color: 'text-green-400' 
                    });
                    onComplete(finalScore);
                }
            }, 1500);
        } else {
            // Wrong answer - deduct points and let them try again
            setStageScore(prev => Math.max(0, prev - WRONG_PENALTY));
            setFeedback({ message: `❌ Wrong! -${WRONG_PENALTY} points. Try again!`, color: 'text-red-400' });
            setSelectedNumber(''); // Clear the number input
            
            // Clear feedback after a moment
            setTimeout(() => {
                if (!stageComplete && !isComplete) {
                    setFeedback(null);
                }
            }, 1500);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    // Start screen
    if (!gameHasStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center flex flex-col items-center justify-center min-h-[500px]">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
                <div className="max-w-lg text-left space-y-4 mb-8 p-6 bg-black/20 rounded-lg border border-white/10">
                    <h3 className="text-xl font-bold text-white text-center">🌍 Time Zones Challenge</h3>
                    <p className="text-gray-300 text-center mb-4">
                        How well do you know world time zones?
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                        <li>You will see <strong className="text-blue-400">3 locations</strong> one after another.</li>
                        <li>Enter the <strong className="text-green-400">GMT offset</strong> for each location.</li>
                        <li>You have <strong className="text-yellow-400">15 seconds</strong> per stage.</li>
                        <li>Click the <strong className="text-purple-400">+/−</strong> button to toggle the sign.</li>
                        <li>Each correct answer is worth <strong className="text-green-400">25 points</strong>.</li>
                        <li>Wrong answers cost <strong className="text-red-400">-5 points</strong> but you can try again!</li>
                        <li>If time runs out, you lose <strong className="text-red-400">all points</strong> for that stage.</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300 text-sm text-center">
                            <strong>Example:</strong> If the timezone is GMT+5, click to set <strong>+</strong> and type <strong>5</strong>
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleStartGame}
                    className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Start Challenge
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>

            {/* Progress and Score Bar */}
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-6 p-4 bg-black/40 rounded-lg border border-white/10">
                <div className="text-left">
                    <p className="text-sm text-gray-400">Stage</p>
                    <p className="text-2xl font-bold text-blue-400">{stageIndex + 1} / {totalStages}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Time Left</p>
                    <p className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
                        {timeLeft}s
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Stage Points</p>
                    <p className={`text-2xl font-bold ${stageScore < TIMEZONE_CHALLENGE.pointsPerStage ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {stageScore}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Score</p>
                    <p className="text-2xl font-bold text-green-400">{totalScore}</p>
                </div>
            </div>

            {/* Stage Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
                {TIMEZONE_CHALLENGE.stages.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index < stageIndex 
                                ? 'bg-green-500' 
                                : index === stageIndex 
                                    ? 'bg-blue-500 scale-125' 
                                    : 'bg-gray-600'
                        }`}
                    />
                ))}
            </div>

            {/* Question */}
            <div className="mb-8">
                <p className="text-lg text-gray-400 mb-2">What is the timezone in...</p>
                <div className="flex items-center justify-center gap-4">
                    <span className="text-6xl">{currentStage.flag}</span>
                    <h3 className="text-4xl font-bold text-white">{currentStage.location}</h3>
                </div>
            </div>

            {/* Answer Input */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-2xl font-bold text-gray-300">GMT</span>
                
                {/* Sign Toggle Button */}
                <button
                    onClick={toggleSign}
                    disabled={stageComplete || isComplete}
                    className={`w-16 h-16 text-3xl font-bold rounded-lg border-2 transition-all duration-200 
                        ${selectedSign === '+' 
                            ? 'bg-green-600/30 border-green-500 text-green-300' 
                            : 'bg-red-600/30 border-red-500 text-red-300'
                        }
                        ${!stageComplete && !isComplete ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
                    `}
                >
                    {selectedSign}
                </button>

                {/* Number Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={selectedNumber}
                    onChange={handleNumberChange}
                    onKeyPress={handleKeyPress}
                    disabled={stageComplete || isComplete}
                    placeholder="?"
                    className="w-20 h-16 text-3xl font-bold text-center bg-black/40 border-2 border-white/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                    maxLength={2}
                />

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={stageComplete || isComplete || !selectedNumber}
                    className="px-6 h-16 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Submit
                </button>
            </div>

            {/* Preview of Answer */}
            <div className="mb-6">
                <p className="text-gray-500 text-sm">Your answer:</p>
                <p className="text-2xl font-mono text-white">
                    GMT {selectedSign}{selectedNumber || '?'}
                </p>
            </div>

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
            </div>
        </div>
    );
};

export default TimeZoneChallenge;

