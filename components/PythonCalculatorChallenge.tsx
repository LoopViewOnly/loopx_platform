
import React, { useState } from 'react';

interface PythonCalculatorChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write a Python function `calc` that takes two arguments, `a` and `b`. The function should `print` the results of all 5 basic mathematical operations in any order:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200 font-mono">
            <li>Addition (+)</li>
            <li>Subtraction (-)</li>
            <li>Multiplication (*)</li>
            <li>Division (/)</li>
            <li>Modulo (%)</li>
        </ul>
    </div>
);

const initialCode = `def calc(a, b):
  # Your code here
  # Use 5 separate print() statements
`;

const testCases = [
    { operation: '9 + 3', expected: 12 },
    { operation: '9 - 3', expected: 6 },
    { operation: '9 * 3', expected: 27 },
    { operation: '9 / 3', expected: 3 },
    { operation: '9 % 3', expected: 0 },
];

const PythonCalculatorChallenge: React.FC<PythonCalculatorChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        const cleanCode = code.replace(/#.*$/gm, '').replace(/\s+/g, '');

        // 1. Check for function definition
        const functionRegex = /defcalc\(([^,]+),([^)]+)\):/;
        const functionMatch = cleanCode.match(functionRegex);

        if (!functionMatch) {
            setStatus("Validation failed: Function signature is incorrect. It should be 'def calc(a, b):'.");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        const param1 = functionMatch[1].trim();
        const param2 = functionMatch[2].trim();

        // 2. Check for all 5 print statements
        const checks = [
            new RegExp(`print\\(${param1}\\+${param2}\\)`),
            new RegExp(`print\\(${param1}-${param2}\\)`),
            new RegExp(`print\\(${param1}\\*${param2}\\)`),
            new RegExp(`print\\(${param1}/${param2}\\)`),
            new RegExp(`print\\(${param1}%${param2}\\)`),
        ];

        const missingChecks = checks.filter(regex => !regex.test(cleanCode));

        if (missingChecks.length === 0) {
            setStatus("Validation successful! Code structure looks correct.");
            setIsCorrect(true);
            setStage('testing');
            setTimeout(() => onComplete(true), 1500);
        } else {
            setStatus(`Validation failed: Your code seems to be missing one or more required print() statements. Ensure all 5 operations (+, -, *, /, %) are printed.`);
            setIsCorrect(false);
            setStage('testing');
        }
    };
    
    const goBackToEditor = () => {
        setStage('coding');
        setStatus(null);
    };

    const renderCodingStage = () => (
        <>
            <div className="text-gray-300 mb-6 text-md">{challengeDescription}</div>
            <div className="w-full max-w-2xl mx-auto bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                <div className="flex items-center px-4 py-2 bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-auto text-xs text-gray-400 font-semibold">calculator.py</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                    />
                </div>
            </div>
            <button
                onClick={validateCode}
                disabled={!code.trim()}
                className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
            >
                Test My Code
            </button>
        </>
    );

    const renderTestingStage = () => (
        <div className="max-w-xl mx-auto">
            <h3 className="text-xl font-bold text-gray-200 mb-4">Simulated Test Results</h3>
            {isCorrect ? (
                <div className="space-y-3">
                    {testCases.map((tc, index) => (
                        <div key={index} className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                            <div className="font-mono text-gray-300">
                                <span className="text-sm">Operation: <strong className="text-white">{tc.operation}</strong></span>
                                <br />
                                <span className="text-sm">Expected Output: <strong className="text-white">{tc.expected}</strong></span>
                            </div>
                            <div className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">
                                PASS
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
                    <p className="text-red-400 font-bold">Validation Failed:</p>
                    <p className="text-red-300 font-mono mt-2">{status}</p>
                </div>
            )}
            <div className="mt-6 text-center">
                {isCorrect ? (
                    <p className="text-2xl font-bold text-green-400">All tests passed! Challenge complete!</p>
                ) : (
                    <button
                        onClick={goBackToEditor}
                        className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Back to Editor
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            {stage === 'coding' ? renderCodingStage() : renderTestingStage()}
        </div>
    );
};

export default PythonCalculatorChallenge;
