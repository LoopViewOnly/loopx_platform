
import React, { useState } from 'react';

interface PasswordStrengthChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write a JavaScript function `checkPassword` that takes one argument, `password`. The function should `console.log` one of three strings: "Strong", "Medium", or "Weak" based on these rules:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>
                <strong className="text-green-400">Strong</strong>: At least 8 characters AND contains uppercase letters, lowercase letters, numbers, and symbols.
            </li>
            <li>
                <strong className="text-yellow-400">Medium</strong>: At least 8 characters AND meets at least two of the other criteria (e.g., lowercase + numbers).
            </li>
             <li>
                <strong className="text-red-400">Weak</strong>: Anything else (e.g., less than 8 characters, or only one character type).
            </li>
        </ul>
    </div>
);


const initialCode = `function checkPassword(password) {
  // Your code here. Use console.log() to print the result.
}`;

const PasswordStrengthChallenge: React.FC<PasswordStrengthChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        if (isCorrect) return;

        const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        const errors = [];

        // Check for key components of a valid solution
        if (!/password\.length\s*(>=|>)\s*8/.test(cleanCode)) {
             errors.push("Missing a check for password length (e.g., `password.length >= 8`).");
        }
        if (!/\.test\(password\)/.test(cleanCode) && !/\.match\(/.test(cleanCode)) {
            errors.push("Missing character type checks. (Hint: use regex like `/[A-Z]/.test(password)`).");
        }
        if ((cleanCode.match(/if/g) || []).length < 2) {
             errors.push("Your logic seems too simple. You'll likely need `if`, `else if`, and `else` statements.");
        }
        if (!/console\.log\(\s*['"]Strong['"]\s*\)/.test(cleanCode)) {
            errors.push("Missing a `console.log('Strong')` statement.");
        }
        if (!/console\.log\(\s*['"]Medium['"]\s*\)/.test(cleanCode)) {
            errors.push("Missing a `console.log('Medium')` statement.");
        }
        if (!/console\.log\(\s*['"]Weak['"]\s*\)/.test(cleanCode)) {
            errors.push("Missing a `console.log('Weak')` statement.");
        }

        if (errors.length > 0) {
            setStatus(`Validation failed: ${errors[0]}`); // Show one error at a time
        } else {
            setStatus("Validation successful! The code includes all the necessary checks. Proceeding...");
            setIsCorrect(true);
            setTimeout(() => onComplete(true), 1500);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <div className="text-gray-300 mb-6 text-md">{challengeDescription}</div>

            <div className="w-full max-w-2xl mx-auto bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                <div className="flex items-center px-4 py-2 bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-auto text-xs text-gray-400 font-semibold">validator.js</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isCorrect}
                        className="w-full h-80 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                    />
                </div>
            </div>
            
             {!isCorrect && (
                <button
                    onClick={validateCode}
                    disabled={!code.trim()}
                    className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Run Checks
                </button>
            )}

             <div className="mt-6 min-h-[2.5rem]">
                {status && <p className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{status}</p>}
            </div>
        </div>
    );
};

export default PasswordStrengthChallenge;
