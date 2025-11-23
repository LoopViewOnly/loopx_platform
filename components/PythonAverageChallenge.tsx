
import React, { useState } from 'react';

interface PythonAverageChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = "Write a Python function `calculate_average` that takes 5 arguments (e.g., g1, g2, g3, g4, g5) representing grades. The function should calculate and print the average of these grades.";
const initialCode = `def calculate_average(g1, g2, g3, g4, g5):
  # Your code here
  pass`;

const PythonAverageChallenge: React.FC<PythonAverageChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        if (isCorrect) return;

        const cleanCode = code.replace(/#.*$/gm, '').trim();

        // 1. Check for function definition
        const functionRegex = /def\s+calculate_average\s*\(([^)]+)\)\s*:/;
        const functionMatch = cleanCode.match(functionRegex);
        if (!functionMatch) {
            setStatus("Validation failed: Function signature is incorrect. It should be 'def calculate_average(...)'.");
            return;
        }

        // 2. Check for 5 parameters
        const params = functionMatch[1].split(',').map(p => p.trim());
        if (params.length !== 5) {
            setStatus(`Validation failed: The function must accept exactly 5 arguments (you have ${params.length}).`);
            return;
        }

        // 3. Check for the print and calculation logic
        // This regex is flexible, allowing for an intermediate 'total' variable or direct calculation in print.
        // It looks for print((p1 + p2 + p3 + p4 + p5) / 5)
        const paramSum = params.join('\\s*\\+\\s*');
        const calculationRegex = new RegExp(`print\\s*\\(\\s*\\(\\s*${paramSum}\\s*\\)\\s*/\\s*5\\s*\\)`);
        
        // Alternative: check if a variable is assigned the sum, and that variable is then used in print.
        // e.g., total = p1 + ...; print(total / 5)
        const variableAssignmentRegex = new RegExp(`([a-zA-Z_][a-zA-Z0-9_]*)\\s*=\\s*${paramSum}`);
        const assignmentMatch = cleanCode.match(variableAssignmentRegex);
        let isCorrectLogic = calculationRegex.test(cleanCode);

        if (!isCorrectLogic && assignmentMatch) {
            const varName = assignmentMatch[1];
            const printWithVarRegex = new RegExp(`print\\s*\\(\\s*${varName}\\s*/\\s*5\\s*\\)`);
            if (printWithVarRegex.test(cleanCode)) {
                isCorrectLogic = true;
            }
        }
        
        if (isCorrectLogic) {
            setStatus("Validation successful! Code logic appears correct. Proceeding...");
            setIsCorrect(true);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setStatus("Validation failed: The calculation or print statement is incorrect. Ensure you are summing all 5 arguments and dividing by 5 inside a print() call.");
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
                     <span className="ml-auto text-xs text-gray-400 font-semibold">editor.py</span>
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

export default PythonAverageChallenge;
