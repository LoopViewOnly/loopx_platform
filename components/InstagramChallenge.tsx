
import React, { useState, useEffect, useRef } from 'react';
import { INSTAGRAM_CHALLENGE } from '../challenges/content';
import { LOOPX_QR_CODE_B64 as LOOPX_QR } from '../challenges/assets';

interface InstagramChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const InstagramChallenge: React.FC<InstagramChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        const correct = answer.trim() === INSTAGRAM_CHALLENGE.answer;
        
        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError("❌ Incorrect. Try again after checking the QR code!");
            setAnswer('');
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h1 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h1>
            <p className="text-gray-300 mb-6">Scan the QR code, check Instagram, and enter the following count!</p>
            
            <img 
                src={LOOPX_QR}
                alt="Loop IG QR-Code" 
                className="mx-auto w-48 h-48 rounded-lg border-4 border-indigo-500 mb-6 shadow-md bg-white p-2"
            />

            <p className="text-lg font-semibold text-gray-200 mb-4">
              How many people does <span className="text-pink-500">@loopcs</span> follow?
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="flex gap-2 justify-center mb-4">
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Enter number"
                        disabled={submittedCorrectly}
                        className="w-40 p-2 border rounded-lg text-center text-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-black/40 text-white border-blue-500/50 placeholder-gray-400"
                    />
                    {!submittedCorrectly && (
                         <button 
                            type="submit"
                            disabled={!answer.trim() || hasSubmitted}
                            className="bg-pink-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
            
            <div className="mt-2 text-lg font-bold min-h-6">
                 {error && <p className="text-red-400">{error}</p>}
                 {submittedCorrectly && (
                    <p className="text-green-400">✅ Correct! Great job!</p>
                )}
            </div>
        </div>
    );
};

export default InstagramChallenge;
