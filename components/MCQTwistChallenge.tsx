import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MCQ_CHALLENGES } from '../challenges/content';

interface MCQTwistChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type GamePhase = 'mcq' | 'getReady' | 'twist' | 'success' | 'failed';

const TWIST_QUESTION = "When was Tennis for Two made?";
const TWIST_ANSWER = "1958";
const GET_READY_TIME = 5;
const TWIST_TIME_LIMIT = 15;
const MCQ_INDEX = 18; // MCQ19 is at index 18 (0-based)

const MCQTwistChallenge: React.FC<MCQTwistChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [phase, setPhase] = useState<GamePhase>('mcq');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [mcqFeedback, setMcqFeedback] = useState<string | null>(null);
    const [getReadyCountdown, setGetReadyCountdown] = useState(GET_READY_TIME);
    const [twistTimeLeft, setTwistTimeLeft] = useState(TWIST_TIME_LIMIT);
    const [twistAnswer, setTwistAnswer] = useState('');
    const [score, setScore] = useState(100);
    const [mistakes, setMistakes] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const PENALTY_PER_MISTAKE = 20;

    // Get MCQ data from content.ts
    const mcqData = MCQ_CHALLENGES[MCQ_INDEX];
    const mcqOptions = useMemo(() => 
        mcqData.options.map((text, index) => ({
            id: index,
            text,
            correct: text === mcqData.correctAnswer
        })), [mcqData]
    );

    // Get Ready countdown
    useEffect(() => {
        if (phase === 'getReady' && getReadyCountdown > 0) {
            const timer = setTimeout(() => {
                setGetReadyCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (phase === 'getReady' && getReadyCountdown === 0) {
            setPhase('twist');
        }
    }, [phase, getReadyCountdown]);

    // Twist phase countdown
    useEffect(() => {
        if (phase === 'twist' && twistTimeLeft > 0) {
            const timer = setTimeout(() => {
                setTwistTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (phase === 'twist' && twistTimeLeft === 0) {
            // Time's up - lose all points
            setScore(0);
            setPhase('failed');
        }
    }, [phase, twistTimeLeft]);

    // Focus input when twist phase starts
    useEffect(() => {
        if (phase === 'twist') {
            inputRef.current?.focus();
        }
    }, [phase]);

    const handleMCQSelect = (optionId: number) => {
        setSelectedOption(optionId);
        const selected = mcqOptions.find(opt => opt.id === optionId);
        
        if (selected?.correct) {
            setMcqFeedback("Correct! But wait...");
            setTimeout(() => {
                setPhase('getReady');
            }, 1500);
        } else {
            // Deduct points for wrong answer
            setMistakes(prev => prev + 1);
            setScore(prev => Math.max(0, prev - PENALTY_PER_MISTAKE));
            setMcqFeedback(`Incorrect! -${PENALTY_PER_MISTAKE} points. Try again.`);
            // Reset selection after a short delay to allow retry
            setTimeout(() => {
                setSelectedOption(null);
                setMcqFeedback(null);
            }, 1000);
        }
    };

    const handleTwistSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!twistAnswer.trim()) return;

        if (twistAnswer.trim() === TWIST_ANSWER) {
            setPhase('success');
        } else {
            setScore(0);
            setPhase('failed');
        }
    };

    const getTimeColor = () => {
        if (twistTimeLeft <= 5) return 'text-red-500';
        if (twistTimeLeft <= 10) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>

            {/* MCQ Phase */}
            {phase === 'mcq' && (
                <>
                    <div className="mb-4">
                        <span className="text-gray-400 text-sm">Score: </span>
                        <span className={`font-bold ${score < 100 ? 'text-yellow-400' : 'text-white'}`}>{score}</span>
                    </div>
                    <p className="text-xl text-gray-200 mb-8">{mcqData.question}</p>
                    
                    <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                        {mcqOptions.map((option) => {
                            let buttonStyle = 'bg-black/40 border-white/20 hover:bg-blue-600/30 hover:border-blue-400';
                            
                            if (selectedOption === option.id) {
                                if (option.correct) {
                                    buttonStyle = 'bg-green-600/40 border-green-400';
                                } else {
                                    buttonStyle = 'bg-red-600/40 border-red-400 shake-animation';
                                }
                            }
                            
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleMCQSelect(option.id)}
                                    disabled={selectedOption !== null && mcqOptions.find(o => o.id === selectedOption)?.correct}
                                    className={`p-4 rounded-lg border-2 text-white font-medium transition-all ${buttonStyle} disabled:cursor-not-allowed`}
                                >
                                    {option.text}
                                </button>
                            );
                        })}
                    </div>

                    {mcqFeedback && (
                        <p className={`mt-6 text-xl font-bold ${mcqOptions.find(o => o.id === selectedOption)?.correct ? 'text-green-400' : 'text-red-400'}`}>
                            {mcqFeedback}
                        </p>
                    )}
                </>
            )}

            {/* Get Ready Phase */}
            {phase === 'getReady' && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-6xl mb-6">⚠️</div>
                    <h3 className="text-3xl font-bold text-yellow-400 mb-4">GET READY!</h3>
                    <p className="text-xl text-gray-300 mb-2">
                        You have <span className="text-red-400 font-bold">15 seconds</span> to search the internet
                    </p>
                    <p className="text-xl text-gray-300 mb-6">
                        and answer the next question to <span className="text-green-400 font-bold">keep your points!</span>
                    </p>
                    <div className="text-8xl font-bold text-yellow-400 animate-pulse">
                        {getReadyCountdown}
                    </div>
                </div>
            )}

            {/* Twist Phase */}
            {phase === 'twist' && (
                <div className="flex flex-col items-center">
                    {/* Timer */}
                    <div className={`text-6xl font-bold mb-6 ${getTimeColor()} ${twistTimeLeft <= 5 ? 'animate-pulse' : ''}`}>
                        {twistTimeLeft}s
                    </div>

                    <p className="text-xl text-gray-200 mb-6">{TWIST_QUESTION}</p>
                    
                    <form onSubmit={handleTwistSubmit} className="w-full max-w-sm">
                        <input
                            ref={inputRef}
                            type="text"
                            value={twistAnswer}
                            onChange={(e) => setTwistAnswer(e.target.value)}
                            placeholder="Enter the year..."
                            className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white text-center text-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={!twistAnswer.trim()}
                            className="mt-4 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                            Submit Answer
                        </button>
                    </form>

                    <p className="mt-6 text-sm text-gray-400">
                        🔍 Search the internet for the answer!
                    </p>
                </div>
            )}

            {/* Success Phase */}
            {phase === 'success' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-3xl font-bold text-green-400">Amazing!</p>
                    <p className="text-gray-300 text-lg">
                        You kept all your points! Tennis for Two was indeed made in <span className="text-yellow-400 font-bold">1958</span>.
                    </p>
                    <p className="text-2xl text-white mt-4">
                        Score: <span className="text-green-400 font-bold">{score}</span>
                    </p>
                    <button
                        onClick={() => onComplete(score)}
                        className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Next Challenge
                    </button>
                </div>
            )}

            {/* Failed Phase */}
            {phase === 'failed' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-6xl mb-4">😔</div>
                    <p className="text-3xl font-bold text-red-400">
                        {twistTimeLeft === 0 ? "Time's Up!" : "Incorrect!"}
                    </p>
                    <p className="text-gray-300 text-lg">
                        The answer was {TWIST_ANSWER}. Tennis for Two was created in 1958!
                    </p>
                    <p className="text-2xl text-white mt-4">
                        Score: <span className="text-red-400 font-bold">0</span>
                    </p>
                    <button
                        onClick={() => onComplete(0)}
                        className="mt-6 px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Next Challenge
                    </button>
                </div>
            )}
        </div>
    );
};

export default MCQTwistChallenge;
