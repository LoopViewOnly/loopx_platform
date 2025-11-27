
import React, { useState } from 'react';

interface JsArraySumChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write a JavaScript function `arraySum` that takes one argument, `arr` (an array of numbers). The function should return the sum of all the numbers in the array.</p>
    </div>
);

const initialCode = `function arraySum(arr) {
  // Your code here
  
}`;

const testCase = {
    input: [4, 6, 0, 1, -9, 5],
    expected: 7
};

const JsArraySumChallenge: React.FC<JsArraySumChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [testResult, setTestResult] = useState<{ actual: number | string | null, passed: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runTest = () => {
        setError(null);
        setTestResult(null);
        let userFunction;

        try {
            // Safely create the function from the user's code string
            userFunction = new Function('return ' + code)();
            if (typeof userFunction !== 'function') {
                throw new Error("Provided code is not a function.");
            }
        } catch (e: any) {
            setError(`Syntax Error: ${e.message}`);
            setStage('testing');
            return;
        }

        let actual: number | string | null = null;
        let passed = false;
        try {
            actual = userFunction(testCase.input);
            passed = actual === testCase.expected;
        } catch (e: any) {
            actual = `Error: ${e.message}`;
            passed = false;
        }

        setTestResult({ actual, passed });
        setStage('testing');

        if (passed) {
            setTimeout(() => onComplete(true), 1500);
        }
    };

    const renderCodingStage = () => (
        <>
            <div className="text-gray-300 mb-6 text-md">{challengeDescription}</div>
            <div className="w-full max-w-2xl mx-auto bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                <div className="flex items-center px-4 py-2 bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-auto text-xs text-gray-400 font-semibold">arraysum.js</span>
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
                onClick={runTest}
                disabled={!code.trim()}
                className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
            >
                Test My Code
            </button>
        </>
    );

    const renderTestingStage = () => {
        const allPassed = testResult?.passed;

        return (
            <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-gray-200 mb-4">Test Result</h3>
                {error ? (
                    <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
                        <p className="text-red-400 font-bold">Error during execution:</p>
                        <p className="text-red-300 font-mono mt-2">{error}</p>
                    </div>
                ) : testResult && (
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <div className="font-mono text-gray-300 text-left">
                            <span className="text-sm">Input: <strong className="text-white">{`[${testCase.input.join(', ')}]`}</strong></span>
                            <br />
                            <span className="text-sm">Expected: <strong className="text-white">{String(testCase.expected)}</strong></span>
                            <br />
                            <span className="text-sm">Your code returned: <strong className={`font-bold ${testResult.passed ? 'text-green-400' : 'text-red-400'}`}>{String(testResult.actual)}</strong></span>
                        </div>
                        <div className={`px-3 py-1 rounded-full font-bold text-sm ${testResult.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {testResult.passed ? 'PASS' : 'FAIL'}
                        </div>
                    </div>
                )}
                <div className="mt-6 text-center">
                    {allPassed ? (
                        <p className="text-2xl font-bold text-green-400">Test passed! Challenge complete!</p>
                    ) : (
                        <button
                            onClick={() => setStage('coding')}
                            className="w-full max-w-sm px-8 py-4 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Back to Editor
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            {stage === 'coding' ? renderCodingStage() : renderTestingStage()}
        </div>
    );
};

export default JsArraySumChallenge;
