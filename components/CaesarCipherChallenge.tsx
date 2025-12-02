
import React, { useState, useEffect, useRef } from 'react';
import { CAESAR_CHALLENGE } from '../challenges/content';

interface CaesarCipherChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const CaesarCipherChallenge: React.FC<CaesarCipherChallengeProps> = ({ onComplete, challengeTitle }) => {
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

        const correct = answer.trim().toLowerCase() === CAESAR_CHALLENGE.answer.toLowerCase();

        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError('Incorrect decryption. Check your cipher and try again!');
            setAnswer('');
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-2 text-lg">{CAESAR_CHALLENGE.question}</p>
            <div className="p-4 bg-black/40 rounded-lg mb-6">
                 <p className="text-lg font-mono text-yellow-300 tracking-wider">
                    {CAESAR_CHALLENGE.cipherText}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter the decrypted message"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-md"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Decryption
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Message decrypted! Proceeding to the next challenge...</p>
                )}
            </div>
        </div>
    );
};

export default CaesarCipherChallenge;
