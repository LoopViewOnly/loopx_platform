
import React, { useState, useEffect, useRef } from 'react';
import loopShirt from '../assets/loopersShirt.jpg';
import { LOOPERS_SHIRT} from '../challenges/content';

interface LoopShirtChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const CORRECT_ANSWER = LOOPERS_SHIRT.ans;

const LoopShirtChallenge: React.FC<LoopShirtChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly) return;

        const correct = answer.trim() === CORRECT_ANSWER;

        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError('Not quite. Take another look and count again!');
            setAnswer('');
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">How many Loopers in this image are wearing THE LOOP shirt?</p>

            <div className="mb-6 flex justify-center bg-black/20 p-4 rounded-lg">
                 <img 
                    src = {loopShirt}
                    alt="Placeholder for a crowd of people" 
                    className="rounded-lg max-w-sm w-full h-auto object-contain"
                />
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your count"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim()}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Count
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Great eye!</p>
                )}
            </div>
        </div>
    );
};

export default LoopShirtChallenge;
