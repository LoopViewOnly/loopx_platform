import React, { useState } from 'react';
import { JS_ARRAY_PRINT_CHALLENGE } from '../challenges/content';

interface JsArrayPrintChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10 select-none" onCopy={(e) => e.preventDefault()}>
        <p className="mb-3">{JS_ARRAY_PRINT_CHALLENGE.description}</p>
        <p className="mb-2 text-sm text-gray-400">Given array:</p>
        <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-cyan-400 overflow-x-auto">
            const arr = {JS_ARRAY_PRINT_CHALLENGE.array};
        </div>
        <p className="mt-4 text-sm text-yellow-400">Hint: Use a for loop or forEach to iterate through the array and console.log() each element.</p>
    </div>
);

const JsArrayPrintChallenge: React.FC<JsArrayPrintChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(JS_ARRAY_PRINT_CHALLENGE.initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Check for loop constructs
        const hasForLoop = /for\s*\(/.test(cleanCode);
        const hasForEach = /\.forEach\s*\(/.test(cleanCode);
        const hasForOf = /for\s*\(\s*(let|const|var)\s+\w+\s+of/.test(cleanCode);
        const hasForIn = /for\s*\(\s*(let|const|var)\s+\w+\s+in/.test(cleanCode);
        const hasWhileLoop = /while\s*\(/.test(cleanCode);
        
        const hasLoop = hasForLoop || hasForEach || hasForOf || hasForIn || hasWhileLoop;
        
        // Check for console.log
        const hasConsoleLog = /console\.log\s*\(/.test(cleanCode);
        
        // Check that they're using the array
        const usesArray = /arr/.test(cleanCode);
        
        // Check for array access pattern (arr[i] or element in forEach/for-of)
        const hasArrayAccess = /arr\s*\[/.test(cleanCode) || hasForEach || hasForOf;

        if (!hasLoop) {
            setStatus("Validation failed: You need to use a loop (for, forEach, for...of, or while) to iterate through the array.");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        if (!hasConsoleLog) {
            setStatus("Validation failed: Use console.log() to print each element.");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        if (!usesArray) {
            setStatus("Validation failed: Make sure you're using the 'arr' array in your code.");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        if (!hasArrayAccess && !hasForEach && !hasForOf) {
            setStatus("Validation failed: Make sure you're accessing elements from the array (e.g., arr[i] or using forEach/for...of).");
            setIsCorrect(false);
            setStage('testing');
            return;
        }

        // All checks passed
        setStatus("Validation successful! Your code correctly prints all array elements.");
        setIsCorrect(true);
        setStage('testing');
        setTimeout(() => onComplete(true), 1500);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">printArray.js</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-64 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                        placeholder="// Write your JavaScript code here..."
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
            <h3 className="text-xl font-bold text-gray-200 mb-4">Simulated Output</h3>
            {isCorrect ? (
                <div className="space-y-2">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10 font-mono text-sm text-green-400 text-left">
                        <p>Elsa</p>
                        <p>Tarzan</p>
                        <p>Simba</p>
                        <p>Mulan</p>
                        <p>Mufasa</p>
                        <p>Olaf</p>
                        <p>Harry Potter</p>
                        <p>John Cena</p>
                        <p>Jerry Bata</p>
                        <p>Snow White</p>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between mt-4">
                        <span className="text-gray-300">All 10 elements printed</span>
                        <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">PASS</span>
                    </div>
                </div>
            ) : (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
                    <p className="text-red-400 font-bold">Validation Failed:</p>
                    <p className="text-red-300 mt-2">{status}</p>
                </div>
            )}
            <div className="mt-6 text-center">
                {isCorrect ? (
                    <p className="text-2xl font-bold text-green-400">🎉 All elements printed! Challenge complete!</p>
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

export default JsArrayPrintChallenge;

