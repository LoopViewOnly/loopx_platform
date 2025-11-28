
import React, { useState } from 'react';
import { DUAL_TRIVIA_CHALLENGE } from '../challenges/content';

interface DualTriviaChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FeedbackState = 'correct' | 'incorrect' | null;

const DualTriviaChallenge: React.FC<DualTriviaChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [whenAnswer, setWhenAnswer] = useState('');
    const [whereAnswer, setWhereAnswer] = useState('');
    const [feedback, setFeedback] = useState<{ when: FeedbackState, where: FeedbackState }>({ when: null, where: null });
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isComplete || hasSubmitted) return;
        setHasSubmitted(true);

        const isWhenCorrect = whenAnswer.trim().toLowerCase() === DUAL_TRIVIA_CHALLENGE.answers.when.toLowerCase();
        const isWhereCorrect = whereAnswer.trim().toLowerCase() === DUAL_TRIVIA_CHALLENGE.answers.where.toLowerCase();

        const newFeedback = {
            when: isWhenCorrect ? 'correct' : 'incorrect' as FeedbackState,
            where: isWhereCorrect ? 'correct' : 'incorrect' as FeedbackState
        };
        setFeedback(newFeedback);

        if (isWhenCorrect && isWhereCorrect) {
            setIsComplete(true);
            setErrorMessage(null);
            onComplete(true);
        } else {
            setErrorMessage('One or both answers are incorrect. Review the highlighted fields.');
            onComplete(false); // Signal an incorrect attempt
        }
    };

    const getInputClass = (field: 'when' | 'where') => {
        if (isComplete) return 'border-green-500 ring-2 ring-green-500/50';
        switch (feedback[field]) {
            case 'correct':
                return 'border-green-500';
            case 'incorrect':
                return 'border-red-500';
            default:
                return 'border-blue-500/50';
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-8 text-lg">{DUAL_TRIVIA_CHALLENGE.question}</p>
            
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
                <div className="flex items-center justify-center gap-2">
                    {/* When Input */}
                    <div className="flex flex-col items-center">
                         <label className="text-sm font-bold text-gray-400 mb-2">When</label>
                         <input
                            type="text"
                            value={whenAnswer}
                            onChange={(e) => setWhenAnswer(e.target.value)}
                            placeholder="Year"
                            disabled={isComplete}
                            className={`w-32 px-3 py-2 bg-black/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl font-mono ${getInputClass('when')}`}
                        />
                    </div>

                    <span className="text-3xl text-gray-500 pt-8">/</span>
                    
                    {/* Where Input */}
                     <div className="flex flex-col items-center">
                        <label className="text-sm font-bold text-gray-400 mb-2">Where</label>
                        <input
                            type="text"
                            value={whereAnswer}
                            onChange={(e) => setWhereAnswer(e.target.value)}
                            placeholder="Country"
                            disabled={isComplete}
                            className={`w-48 px-3 py-2 bg-black/40 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl capitalize ${getInputClass('where')}`}
                        />
                    </div>
                </div>

                {!isComplete && (
                    <button
                        type="submit"
                        disabled={!whenAnswer.trim() || !whereAnswer.trim() || hasSubmitted}
                        className="mt-6 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Answers
                    </button>
                )}
            </form>

            <div className="mt-6 min-h-[2.5rem]">
                {errorMessage && !isComplete && <p className="text-lg font-bold text-red-400">{errorMessage}</p>}
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">Correct! Proceeding...</p>
                )}
            </div>
        </div>
    );
};

export default DualTriviaChallenge;