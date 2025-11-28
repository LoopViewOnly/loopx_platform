import React, { useState, useEffect, useRef } from 'react';

interface RearrangeChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const originalWord = 'LoopBirthday#10';
const staticScrambledWord = 'ao0rt1iphL#Boyd';


const RearrangeChallenge: React.FC<RearrangeChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [scrambledWord] = useState(staticScrambledWord);
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

        const correct = answer.trim().replace(/\s/g, '').toLowerCase() === originalWord.toLowerCase();

        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError('Not quite right. Try rearranging the letters again!');
            setAnswer('');
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">Unscramble the letters below to reveal a secret phrase.</p>

            <div className="p-4 bg-black/40 rounded-lg mb-6">
                <p className="text-3xl font-mono text-yellow-300 tracking-widest break-all">
                    {scrambledWord}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type here ..."
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Answer
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Great job unscrambling!</p>
                )}
            </div>
        </div>
    );
};

export default RearrangeChallenge;