import React, { useState } from 'react';
import { profanityList } from '../utils/profanityList';

interface WelcomeScreenProps {
    onStart: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const validateAndStart = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError('Please enter your name.');
            return;
        }
        if (trimmedName.length < 3) {
            setError('Name must be at least 3 characters long.');
            return;
        }
        if (trimmedName.length > 30) {
            setError('Name must be 30 characters or less.');
            return;
        }
        if (profanityList.some(word => trimmedName.toLowerCase().includes(word))) {
            setError('Please choose a more appropriate name.');
            return;
        }
        
        setError(null);
        onStart(trimmedName);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-lg p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                 <div className="mb-8">
                    <h2 className="text-3xl font-bold text-blue-300 mb-2">Welcome to the LoopX Challenge!</h2>
                </div>

                <div className="w-full max-w-sm mx-auto">
                    <label htmlFor="username" className="block text-xl font-bold text-gray-200 mb-3 text-center">Enter Your Full Name</label>
                    <input
                        id="username"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            const newName = e.target.value;
                            setName(newName);
                            if(error) setError(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && validateAndStart()}
                        placeholder="Full Name"
                        maxLength={30}
                        autoFocus
                        className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center"
                    />
                    {error && <p className="text-red-400 mt-2 text-center">{error}</p>}
                </div>

                 <button
                    onClick={validateAndStart}
                    disabled={!name.trim()}
                    className="w-full max-w-sm px-8 py-3 mt-8 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Start Challenges
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;