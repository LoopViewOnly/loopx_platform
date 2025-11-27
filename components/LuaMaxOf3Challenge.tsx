
import React, { useState } from 'react';

interface LuaMaxOf3ChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write a Lua function `maxOf3` that takes three arguments, `a`, `b`, and `c`. The function should return the maximum value among the three.</p>
        <p className="mt-4 text-sm text-yellow-400">Hint: You can use nested if/else statements or look for a built-in Lua math function!</p>
    </div>
);

const initialCode = `function maxOf3(a, b, c)
  -- Your code here
end`;

const testCases = [
    { input: "3, 7, 11", expected: 11 },
    { input: "16, 8, -1", expected: 16 },
    { input: "-5, 3, 2", expected: 3 },
];

const LuaMaxOf3Challenge: React.FC<LuaMaxOf3ChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        const cleanCode = code.replace(/--.*$/gm, '').replace(/\s+/g, '');

        // 1. Check for function definition and capture parameter names
        const functionRegex = /functionmaxOf3\(([^,]+),([^,]+),([^)]+)\)/;
        const functionMatch = cleanCode.match(functionRegex);

        if (!functionMatch) {
            setStatus("Validation failed: Function signature is incorrect. It should be 'function maxOf3(a, b, c)'.");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        const p1 = functionMatch[1].trim();
        const p2 = functionMatch[2].trim();
        const p3 = functionMatch[3].trim();

        // 2. Check for math.max() solution
        const mathMaxRegex = new RegExp(`returnmath\\.max\\(${p1},${p2},${p3}\\)`);
        const isMathMaxSolution = mathMaxRegex.test(cleanCode);

        // 3. Check for if/else solution (heuristic check for keywords and structure)
        const hasIf = /if/.test(cleanCode);
        const hasElseIf = /elseif/.test(cleanCode);
        const hasElse = /else/.test(cleanCode);
        const hasReturn1 = new RegExp(`return${p1}`).test(cleanCode);
        const hasReturn2 = new RegExp(`return${p2}`).test(cleanCode);
        const hasReturn3 = new RegExp(`return${p3}`).test(cleanCode);
        const hasComparisons = />/.test(cleanCode) && /and/.test(cleanCode);

        const isIfElseSolution = hasIf && (hasElseIf || hasElse) && hasReturn1 && hasReturn2 && hasReturn3 && hasComparisons;

        if (isMathMaxSolution || isIfElseSolution) {
            setStatus("Validation successful! Code structure looks correct.");
            setIsCorrect(true);
            setStage('testing');
            setTimeout(() => onComplete(true), 1500);
        } else {
            setStatus(`Validation failed: Your code doesn't seem to correctly find the maximum value. Ensure you are comparing all three inputs and returning the correct one, or use a built-in math function.`);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">max.lua</span>
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
                            <div className="font-mono text-gray-300 text-left">
                                <span className="text-sm">Input: <strong className="text-white">maxOf3({tc.input})</strong></span>
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

export default LuaMaxOf3Challenge;
