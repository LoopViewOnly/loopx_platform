
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { PERSONA_CHALLENGE } from '../challenges/content';

interface PersonaChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

const PersonaChallenge: React.FC<PersonaChallengeProps> = ({ onComplete, challengeTitle }) => {
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

        const correct = answer.trim() === PERSONA_CHALLENGE.answer;

        if (correct) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setError(null);
            setSubmittedCorrectly(true);
        } else {
            onComplete(null);
            setError('Incorrect password. Combine clues from the ID card!');
            setAnswer('');
            setHasSubmitted(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">{PERSONA_CHALLENGE.question}</p>

            {/* Persona ID Card */}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-8 border border-gray-300">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-center">
                    <h3 className="text-2xl font-bold text-white tracking-wider">PERSONA ID</h3>
                </div>
                <div className="p-6">
                    <div className="text-center mb-4">
                        <p className="text-2xl font-bold text-gray-800">Michael Chen</p>
                        <p className="text-md text-gray-500">"Mike"</p>
                    </div>
                    <hr className="my-4"/>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left">
                        <div>
                            <p className="text-sm font-bold text-gray-500">Phone</p>
                            <p className="text-lg text-gray-800 font-semibold">046776977</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Birth Date</p>
                            <p className="text-lg text-gray-800 font-semibold">10/12/2015</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Pet Name</p>
                            <p className="text-lg text-gray-800 font-semibold">Rex</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Best Friend</p>
                            <p className="text-lg text-gray-800 font-semibold">Kevin</p>
                        </div>
                         <div className="col-span-2">
                            <p className="text-sm font-bold text-gray-500">Favorite Singer</p>
                            <p className="text-lg text-gray-800 font-semibold">The Weeknd</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Guess the password"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!answer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Password
                    </button>
                )}
            </form>
            
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Access Granted! Correct Password.</p>
                )}
            </div>
        </div>
    );
};

export default PersonaChallenge;
