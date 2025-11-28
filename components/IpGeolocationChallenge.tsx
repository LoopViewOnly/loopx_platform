import React, { useState } from 'react';
import { USER_PROVIDED_FLAGS } from '../challenges/assets';

interface IpGeolocationChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const IP_ADDRESS = "90.43.109.28";
const CORRECT_ANSWER = "france";

const OPTIONS = [
    { key: 'france', name: 'France' },
    { key: 'germany', name: 'Germany' },
    { key: 'italy', name: 'Italy' },
    { key: 'japan', name: 'Japan' },
];

const IpGeolocationChallenge: React.FC<IpGeolocationChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptionClick = (key: string) => {
        if (isCorrect || hasSubmitted) return;
        setSelectedOption(key);
        setError(null);
    };

    const handleSubmit = () => {
        if (!selectedOption || isCorrect || hasSubmitted) return;
        setHasSubmitted(true);

        if (selectedOption === CORRECT_ANSWER) {
            setIsCorrect(true);
            setError(null);
            onComplete(true);
        } else {
            setError("Incorrect! That's not the right country for this IP.");
            onComplete(false);
            setHasSubmitted(false);
        }
    };

    const getOptionClass = (key: string) => {
        if (isCorrect) {
            if (key === CORRECT_ANSWER) {
                return 'border-green-500 ring-4 ring-green-500/50 bg-green-900/30';
            }
            return 'border-gray-600 opacity-50';
        }
        if (selectedOption === key) {
            return 'border-blue-400 ring-2 ring-blue-400/50 bg-blue-900/30';
        }
        return 'border-blue-500/50 hover:border-yellow-400 hover:bg-white/5';
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">Which country does this IP address belong to?</p>

            <div className="p-4 bg-black/40 rounded-lg mb-8 max-w-md mx-auto">
                <p className="text-4xl font-mono text-yellow-300 tracking-wider">
                    {IP_ADDRESS}
                </p>
            </div>

            <p className="text-gray-400 mb-6">Select the correct country flag:</p>

            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                {OPTIONS.map((option) => (
                    <button
                        key={option.key}
                        onClick={() => handleOptionClick(option.key)}
                        disabled={isCorrect}
                        className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${getOptionClass(option.key)}`}
                    >
                        <img
                            src={USER_PROVIDED_FLAGS[option.key]}
                            alt={`Flag of ${option.name}`}
                            className="w-24 h-16 object-contain rounded shadow-lg"
                        />
                        <span className="text-white font-semibold">{option.name}</span>
                    </button>
                ))}
            </div>

            {!isCorrect && (
                <button
                    onClick={handleSubmit}
                    disabled={!selectedOption || hasSubmitted}
                    className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Submit Answer
                </button>
            )}

            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {isCorrect && (
                    <p className="text-2xl font-bold text-green-400">Correct! The IP is from France 🇫🇷</p>
                )}
            </div>
        </div>
    );
};

export default IpGeolocationChallenge;

