import React, { useState } from 'react';

interface StarPatternChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const EXPECTED_OUTPUT = `*
**
***
****
*****`;

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write Python code using <code className="bg-black/40 px-2 py-1 rounded text-yellow-300">print()</code> statements to output this pattern:</p>
        <pre className="bg-black/40 p-4 rounded-lg text-green-400 font-mono text-lg my-4 text-left">
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
    const [result, setResult] = useState<{ passed: boolean; error?: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const runTest = () => {
        if (isChecking) return;
        setIsChecking(true);
        setResult(null);

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

            setResult({ passed });

            if (passed) {
                setTimeout(() => onComplete(true), 1500);
            } else {
                setIsChecking(false);
            }
        } catch (e: any) {
            setResult({ passed: false, error: e.message });
            setIsChecking(false);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">stars.py</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setResult(null); }}
                        className="w-full h-48 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                        placeholder='print("*")'
                        disabled={result?.passed}
                    />
                </div>
            </div>

            {/* Result feedback */}
            {result && (
                <div className={`mt-6 p-4 rounded-lg ${result.passed ? 'bg-green-900/40 border border-green-500' : 'bg-red-900/40 border border-red-500'}`}>
                    {result.error ? (
                        <p className="text-red-400 font-mono text-sm">❌ Error: {result.error}</p>
                    ) : result.passed ? (
                        <div>
                            <p className="text-3xl mb-2">🎉</p>
                            <p className="text-green-400 font-bold text-xl">Pattern matched! Challenge complete!</p>
                        </div>
                    ) : (
                        <p className="text-red-400 font-bold">❌ Output doesn't match. Try again!</p>
                    )}
                </div>
            )}

            {/* Run button */}
            {!result?.passed && (
                <button
                    onClick={runTest}
                    disabled={!code.trim() || isChecking}
                    className="mt-6 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    {isChecking ? '⏳ Checking...' : '▶ Run Code'}
                </button>
            )}
        </div>
    );
};

export default StarPatternChallenge;
