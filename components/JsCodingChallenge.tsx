import React, { useState } from 'react';

interface JsCodingChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = "Write JavaScript code to print all even numbers between 10 and 100 (inclusive)\n(10, 12, 14, ..., 100)";
const initialCode = `function getEvenNumbers() {
  // Your code here
}`;

const JsCodingChallenge: React.FC<JsCodingChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        if (isCorrect) return;

        // Remove comments for validation (both // and /* */)
        const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

        // --- Common structure checks ---
        const functionSignatureCheck = /function\s+getEvenNumbers\s*\(\s*\)\s*\{/.test(cleanCode);
        if (!functionSignatureCheck) {
            setStatus("Validation failed: Function signature should be 'function getEvenNumbers() {'.");
            return;
        }

        const noReturnCheck = !/return/.test(cleanCode);
        if (!noReturnCheck) {
            setStatus("Validation failed: The function should not have a return statement.");
            return;
        }
        
        // --- Specific Feedback for Common Mistakes (Variable Agnostic) ---
        
        // Check for exclusive loop condition < 100 instead of <= 100
        // Looks for pattern: variable < 100 (excluding cases where it is <=)
        if (/[a-zA-Z_$][a-zA-Z0-9_$]*\s*<\s*100/.test(cleanCode) && !/[a-zA-Z_$][a-zA-Z0-9_$]*\s*<=\s*100/.test(cleanCode)) {
             setStatus("Validation failed: The instructions say 'inclusive' (up to and including 100). Check your loop condition (hint: use <= instead of <).");
             return;
        }

        // Check for incorrect start value (starting at 0 or 1)
        if (/(?:let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*1\s*;/.test(cleanCode) || /(?:let|var)\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*0\s*;/.test(cleanCode)) {
            setStatus("Validation failed: The instructions say to start between 10 and 100. Your loop seems to start at 1 or 0.");
            return;
       }

        // Define regex for a valid JS identifier (variable name)
        // Capture group 1 will be the variable name. We use backreference \1 to ensure consistency.
        const id = "([a-zA-Z_$][a-zA-Z0-9_$]*)";

        // --- Solution 1: Increment by 2 ---
        // Logic: for(let var=10; var<=100; var+=2) { console.log(var); }
        // We use \\1 to ensure the variable name matches the one defined in 'let' or 'var'
        const solution1_regex = new RegExp(
            `for\\s*\\(\\s*(?:let|var)\\s+${id}\\s*=\\s*10\\s*;\\s*\\1\\s*<=\\s*100\\s*;\\s*\\1\\s*\\+=\\s*2\\s*\\)\\s*\\{\\s*console\\.log\\(\\s*\\1\\s*\\)\\s*;?\\s*\\}`,
            's'
        );

        // --- Solution 2: Increment by 1 with if statement ---
        // Logic: for(let var=10; var<=100; var++) { if (var % 2 == 0) { console.log(var); } }
        const solution2_regex = new RegExp(
            `for\\s*\\(\\s*(?:let|var)\\s+${id}\\s*=\\s*10\\s*;\\s*\\1\\s*<=\\s*100\\s*;\\s*\\1\\s*\\+\\+\\s*\\)\\s*\\{\\s*if\\s*\\(\\s*\\1\\s*%\\s*2\\s*===?\\s*0\\s*\\)\\s*\\{\\s*console\\.log\\(\\s*\\1\\s*\\)\\s*;?\\s*\\}\\s*\\}`,
            's'
        );

        const isSolution1 = solution1_regex.test(cleanCode);
        const isSolution2 = solution2_regex.test(cleanCode);

        if (isSolution1 || isSolution2) {
            setStatus("Validation successful! Code structure looks correct. Proceeding...");
            setIsCorrect(true);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setStatus("Validation failed: The code doesn't match one of the valid solutions. Please check your loop structure (start at 10, condition <= 100) and ensure you are logging the loop variable.");
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-md whitespace-pre-line">{challengeDescription}</p>

            <div className="w-full max-w-2xl mx-auto bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                <div className="flex items-center px-4 py-2 bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        disabled={isCorrect}
                        className="w-full h-64 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
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

export default JsCodingChallenge;