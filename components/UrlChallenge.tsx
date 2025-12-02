
import React, { useState } from 'react';

interface URLChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const URLChallenge: React.FC<URLChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCorrect || hasSubmitted) return;
        setHasSubmitted(true);

        const correctUsername = "John Cena";
        const correctPassword = "bata";

        const success = username.trim() === correctUsername && password.trim() === correctPassword;

        if (success) {
            onComplete(true);
            setIsCorrect(true);
            setError(null);
        } else {
            onComplete(false);
            setError("Incorrect username or password. Check the URL carefully!");
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Extract the username and password from the following URL's query parameters.</p>

            <div className="my-6 p-4 bg-black/40 rounded-lg border border-blue-500/50">
                <p className="text-md font-mono text-yellow-300 break-all">
                    https://loop.org.il/?username=John%20Cena&password=bata
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    disabled={isCorrect}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center"
                    aria-label="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={isCorrect}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center"
                    aria-label="Password"
                />

                {!isCorrect && (
                    <button
                        type="submit"
                        disabled={!username.trim() || !password.trim() || hasSubmitted}
                        className="mt-4 w-full px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Credentials
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {isCorrect && (
                    <p className="text-2xl font-bold text-green-400">Success! Credentials extracted.</p>
                )}
            </div>
        </div>
    );
};

export default URLChallenge;
