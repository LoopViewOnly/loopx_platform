import React, { useState } from 'react';
import { PYTHON_MENTOR_CHALLENGE } from '../challenges/content';

interface PythonMentorChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const PythonMentorChallenge: React.FC<PythonMentorChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        const correct = answer.trim().toUpperCase() === PYTHON_MENTOR_CHALLENGE.answer.toUpperCase();

        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false);
            setError('That is not the correct password. Check with your mentor again!');
            setAnswer('');
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">{PYTHON_MENTOR_CHALLENGE.question}</p>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <label className="block text-left text-sm font-bold text-gray-400 mb-2 ml-1">
                    Enter Mentor's Password:
                </label>
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="PASSWORD"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-2xl tracking-[0.5em] uppercase"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Verify Password
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Well done.</p>
                )}
            </div>
        </div>
    );
};

export default PythonMentorChallenge;