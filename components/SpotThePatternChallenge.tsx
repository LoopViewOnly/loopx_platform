
import React, { useState } from 'react';
import { SPOT_THE_PATTERN_DATA } from '../challenges/content';

interface SpotThePatternChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const MINIMUM_SCORE = 50;

const SpotThePatternChallenge: React.FC<SpotThePatternChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [potentialScore, setPotentialScore] = useState(100);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<'correct' | 'incorrect' | 'hint' | null>(null);
    const [hintsUsed, setHintsUsed] = useState<boolean[]>(Array(SPOT_THE_PATTERN_DATA.length).fill(false));
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    
    const currentChallenge = SPOT_THE_PATTERN_DATA[currentQuestionIndex];

    const handleHint = () => {
        if (hintsUsed[currentQuestionIndex] || !currentChallenge.hintCost) return;
        
        const newHintsUsed = [...hintsUsed];
        newHintsUsed[currentQuestionIndex] = true;
        setHintsUsed(newHintsUsed);
        
        const cost = currentChallenge.hintCost;
        setPotentialScore(prev => Math.max(0, prev - cost));
        setFeedbackMessage(`Hint revealed! -${cost} points. ${currentChallenge.hintText}`);
        setFeedbackType('hint');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete || !userAnswer || hasSubmitted) return;
        setHasSubmitted(true);
        
        const answerAsNumber = parseInt(userAnswer, 10);

        if (answerAsNumber === currentChallenge.answer) {
            setFeedbackMessage('Correct! Moving to the next pattern...');
            setFeedbackType('correct');
            setUserAnswer('');
            
            setTimeout(() => {
                if (currentQuestionIndex + 1 < SPOT_THE_PATTERN_DATA.length) {
                    setCurrentQuestionIndex(prev => prev + 1);
                    setFeedbackMessage(null);
                    setFeedbackType(null);
                    setHasSubmitted(false);
                } else {
                    const finalScore = Math.max(MINIMUM_SCORE, potentialScore);
                    setFeedbackMessage(`All patterns solved! Final score: ${finalScore}`);
                    setFeedbackType('correct');
                    setIsComplete(true);
                    onComplete(finalScore);
                }
            }, 1500);
            
        } else {
            setPotentialScore(prev => Math.max(0, prev - 10));
            setFeedbackMessage('Incorrect. -10 points. Try again!');
            setFeedbackType('incorrect');
            setUserAnswer('');
            setHasSubmitted(false);
        }
    };

    const getFeedbackColor = () => {
        switch(feedbackType) {
            case 'correct': return 'text-green-400';
            case 'incorrect': return 'text-red-400';
            case 'hint': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Find the next number in the sequence. ({currentQuestionIndex + 1} of {SPOT_THE_PATTERN_DATA.length})</p>

            <div className="p-4 bg-black/40 rounded-lg mb-6 max-w-md mx-auto">
                <p className="text-4xl font-mono text-blue-300 tracking-widest break-all">
                    {currentChallenge.sequence.join(', ')}, <span className="text-yellow-400">??</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Next number"
                    disabled={isComplete}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-2xl"
                />
                {!isComplete && (
                    <div className="flex gap-4 mt-6">
                        {currentChallenge.hintText && !hintsUsed[currentQuestionIndex] && (
                            <button
                                type="button"
                                onClick={handleHint}
                                className="w-1/3 px-4 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
                            >
                                Hint (-{currentChallenge.hintCost}pts)
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!userAnswer || hasSubmitted}
                            className="flex-grow px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </form>
            
            <div className="mt-6 min-h-[5rem] flex flex-col justify-center items-center">
                {feedbackMessage && <p className={`text-lg font-bold ${getFeedbackColor()}`}>{feedbackMessage}</p>}
                
                {!isComplete && (
                     <div className="mt-2 text-gray-400">
                        Potential points: {potentialScore}
                    </div>
                )}
            </div>

             {isComplete && (
                <div className="mt-4">
                     <button
                        onClick={() => onComplete(0)} // onComplete already received score
                        className="w-full max-w-sm px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Next Challenge
                    </button>
                </div>
            )}
        </div>
    );
};

export default SpotThePatternChallenge;
