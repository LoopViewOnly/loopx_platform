import React, { useState } from 'react';

interface StarPatternChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const EXPECTED_OUTPUT = `*
**
***
****
*****`;

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write Python code using <code className="bg-black/40 px-2 py-1 rounded text-yellow-300">print()</code> statements to output the following star pattern:</p>
        <pre className="bg-black/40 p-4 rounded-lg text-green-400 font-mono text-lg my-4">
{`*
**
***
****
*****`}
        </pre>
    </div>
);

const initialCode = `print("Hello Loop!")`;

const StarPatternChallenge: React.FC<StarPatternChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [testResult, setTestResult] = useState<{ actual: string | null, passed: boolean } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const runTest = () => {
        if (hasSubmitted) return;
        setHasSubmitted(true);
        setError(null);
        setTestResult(null);

        try {
            // Create a mock print function that captures output
            const outputs: string[] = [];
            const mockPrint = (...args: any[]) => {
                outputs.push(args.join(' '));
            };

            // Create a safe evaluation context with only print available
            const safeEval = new Function('print', code);
            safeEval(mockPrint);

            const actual = outputs.join('\n');
            const normalizedActual = actual.trim();
            const normalizedExpected = EXPECTED_OUTPUT.trim();
            const passed = normalizedActual === normalizedExpected;

            setTestResult({ actual, passed });
            setStage('testing');

            if (passed) {
                setTimeout(() => onComplete(true), 1500);
            } else {
                setHasSubmitted(false);
            }
        } catch (e: any) {
            setError(`Error: ${e.message}`);
            setStage('testing');
            setHasSubmitted(false);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">stars.py</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-48 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                        placeholder='print("*")'
                    />
                </div>
            </div>
            <button
                onClick={runTest}
                disabled={!code.trim() || hasSubmitted}
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
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Expected Output:</p>
                                <pre className="bg-black/40 p-3 rounded text-green-400 font-mono text-sm whitespace-pre">
{EXPECTED_OUTPUT}
                                </pre>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Your Output:</p>
                                <pre className={`bg-black/40 p-3 rounded font-mono text-sm whitespace-pre ${testResult.passed ? 'text-green-400' : 'text-red-400'}`}>
{testResult.actual || '(empty)'}
                                </pre>
                            </div>
                        </div>
                        <div className={`mt-4 px-3 py-2 rounded-full font-bold text-center ${testResult.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {testResult.passed ? '✓ PASS' : '✗ FAIL'}
                        </div>
                    </div>
                )}
                <div className="mt-6 text-center">
                    {allPassed ? (
                        <p className="text-2xl font-bold text-green-400">Pattern matched! Challenge complete!</p>
                    ) : (
                        <button
                            onClick={() => { setStage('coding'); setHasSubmitted(false); }}
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

export default StarPatternChallenge;
