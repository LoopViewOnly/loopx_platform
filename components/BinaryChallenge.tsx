import React, { useState } from 'react';
import { BINARY_CHALLENGE } from '../challenges/content';

interface BinaryChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const BinaryChallenge: React.FC<BinaryChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [answer, setAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        // Normalize whitespace for comparison
        const normalizedUserAnswer = answer.trim().replace(/\s+/g, ' ');
        const normalizedCorrectAnswer = BINARY_CHALLENGE.answer.trim().replace(/\s+/g, ' ');

        const correct = normalizedUserAnswer === normalizedCorrectAnswer;
        
        if (correct) {
            onComplete(true);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(false);
            setError("Incorrect binary sequence. Check your conversion and spacing!");
            setHasSubmitted(false);
            // Don't clear the answer so the user can edit it
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h1 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h1>
            <p className="text-lg font-semibold text-gray-200 mb-4">{BINARY_CHALLENGE.question}</p>
            
            <div className="text-left max-w-lg mx-auto bg-black/20 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm text-gray-400 mb-2">Example: <code className="text-yellow-300">"I am"</code> would be:</p>
                <code className="text-green-400 font-mono break-words">{BINARY_CHALLENGE.example}</code>
                <div className="mt-4 text-sm font-mono text-gray-300 space-y-1">
                    <div className="flex">
                        <span className="text-yellow-300 w-20">I:</span>
                        <span className="text-green-400">01001001</span>
                    </div>
                    <div className="flex">
                        <span className="text-yellow-300 w-20">space:</span>
                        <span className="text-green-400">00100000</span>
                    </div>
                    <div className="flex">
                        <span className="text-yellow-300 w-20">a:</span>
                        <span className="text-green-400">01100001</span>
                    </div>
                    <div className="flex">
                        <span className="text-yellow-300 w-20">m:</span>
                        <span className="text-green-400">01101101</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter the binary code here..."
                    disabled={submittedCorrectly}
                    rows={4}
                    className="w-full max-w-lg p-3 border rounded-lg text-center text-lg font-mono focus:ring-2 focus:ring-green-500 outline-none bg-black/40 text-white border-blue-500/50 placeholder-gray-400 resize-none"
                />
                {!submittedCorrectly && (
                    <button 
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Verify Code
                    </button>
                )}
            </form>
            
            <div className="mt-4 text-lg font-bold min-h-6">
                 {error && <p className="text-red-400">{error}</p>}
                 {submittedCorrectly && (
                    <p className="text-green-400">✅ 01000011 01101111 01110010 01110010 01100101 01100011 01110100!</p>
                )}
            </div>
        </div>
    );
};

export default BinaryChallenge;