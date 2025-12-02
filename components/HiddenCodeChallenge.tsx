import React, { useState, useEffect, useRef } from 'react';
import { HIDDEN_CODE_CHALLENGE } from '../challenges/content';
import SteaganImg from '../assets/stegan.png';

interface HiddenCodeChallengeProps {
    onComplete: (time: number | null, username?: string) => void;
}

const HiddenCodeChallenge: React.FC<HiddenCodeChallengeProps> = ({ onComplete }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        startTimeRef.current = Date.now();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim() || submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        const correct =
            username.trim() === HIDDEN_CODE_CHALLENGE.username &&
            password.trim() === HIDDEN_CODE_CHALLENGE.pass;

        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime, username.trim());
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError('Incorrect username or code. Try again!');
            setPassword('');
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">Challenge: Hidden Code 🕵️‍♂️</h2>
            <p className="text-gray-300 mb-6 text-md">{HIDDEN_CODE_CHALLENGE.question}</p>

            <div className="mb-6 flex justify-center bg-black/20 p-4 rounded-lg">
                <img
                    src={SteaganImg}
                    alt="Hidden Code"
                    className="rounded-lg max-w-xs w-full h-auto object-contain"
                    title="Right-click and 'Save image as...' to inspect the file"
                />
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter hidden code"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400
                               focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />

                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!username.trim() || !password.trim() || hasSubmitted}
                        className="mt-4 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700
                                   disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300
                                   shadow-lg shadow-blue-600/30"
                    >
                        Submit
                    </button>
                )}
            </form>

            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Code found! Proceeding to the next challenge...</p>
                )}
            </div>
        </div>
    );
};

export default HiddenCodeChallenge;
