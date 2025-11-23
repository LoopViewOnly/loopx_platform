
import React, { useState, useRef } from 'react';
import { WORDLE_CHALLENGE } from '../challenges/content';

interface WordleChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const WordleChallenge: React.FC<WordleChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly) return;

        const correct = answer.trim().toLowerCase() === WORDLE_CHALLENGE.targetWord.toLowerCase();

        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false); // Optional, depends on if you want to punish guessing
            setError('That is not the correct word. Check your Wordle solution and try again!');
            setAnswer('');
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">{WORDLE_CHALLENGE.question}</p>

            <div className="mb-8">
                <a 
                    href={WORDLE_CHALLENGE.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
                >
                    Open Wordle
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
                <p className="text-sm text-gray-400 mt-2">Link opens in a new tab</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <label className="block text-left text-sm font-bold text-gray-400 mb-2 ml-1">
                    Enter Today's Word:
                </label>
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="5-letter word"
                    disabled={submittedCorrectly}
                    maxLength={5}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-2xl tracking-widest uppercase"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim()}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Verify Word
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Well played.</p>
                )}
            </div>
        </div>
    );
};

export default WordleChallenge;
