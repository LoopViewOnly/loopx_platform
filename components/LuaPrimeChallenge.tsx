import React, { useState } from 'react';

interface LuaPrimeChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';
type TestResult = {
    input: number;
    expected: string;
    actual: string | null;
    passed: boolean;
};

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Write a Lua function `isPrime` that takes one argument, `num`. The function should return:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li><strong className="text-green-400">true</strong> if `num` is a prime number.</li>
            <li><strong className="text-red-400">false</strong> if `num` is not a prime number.</li>
        </ul>
        <p className="mt-4 text-sm text-yellow-400">Hint: If you don't know Lua, you can write the logic in a language you know and use an online code converter to translate it to Lua!</p>
    </div>
);

const initialCode = `function isPrime(num)
  -- Your code here
end`;

const testCases = [
    { input: 7, expected: 'true' },
    { input: 9, expected: 'false' },
    { input: 2, expected: 'true' },
    { input: 1, expected: 'false' },
];

const LuaPrimeChallenge: React.FC<LuaPrimeChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const runTests = () => {
        const cleanCode = code.replace(/--.*$/gm, '').replace(/\s+/g, ' ');

        // A more flexible regex to check for common valid base cases like 'num <= 1' or 'num < 2'
        const baseCaseRegex = /if\s*\(?\s*num\s*(<=\s*1|<\s*2|==\s*1)\s*\)?\s*then\s*return\s*false\s*end/;
        const hasBaseCase = baseCaseRegex.test(cleanCode);

        const hasLoop = /for\s+i\s*=\s*2,/.test(cleanCode);
        const hasModuloCheck = /if\s+num\s*%\s*i\s*==\s*0\s+then\s+return\s*false\s*end/.test(cleanCode);
        const hasFinalReturn = /return\s+true/.test(cleanCode);

        const coreLogicIsValid = hasLoop && hasModuloCheck && hasFinalReturn;

        const results: TestResult[] = testCases.map(tc => {
            let passed = false;
            let actual: string | null = null;

            if (tc.input === 1) {
                passed = hasBaseCase;
                actual = hasBaseCase ? 'false' : 'true'; // Simulate what the code would do
            } else if (coreLogicIsValid) {
                // Simulate running the core logic for other numbers
                let isPrime = true;
                // This logic is for simulation; the actual validation relies on the regex checks above.
                if (tc.input <= 1) isPrime = false; 
                for (let i = 2; i < tc.input; i++) {
                    if (tc.input % i === 0) {
                        isPrime = false;
                        break;
                    }
                }
                actual = String(isPrime);
                passed = actual === tc.expected;
            }

            return { ...tc, actual, passed };
        });

        setTestResults(results);
        setStage('testing');

        const allPassed = results.every(r => r.passed);
        if (allPassed) {
            setIsCorrect(true);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setIsCorrect(false);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">prime.lua</span>
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
                onClick={runTests}
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
            <div className="space-y-3">
                {testResults.map((result, index) => (
                    <div key={index}>
                        <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                            <div className="font-mono text-gray-300">
                                <span className="text-sm">Input: <strong className="text-white">{result.input}</strong></span>
                                <br />
                                <span className="text-sm">Expected: <strong className="text-white">{result.expected}</strong></span>
                                <br />
                                <span className="text-sm">Your code returned: <strong className={`font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.actual ?? 'N/A'}</strong></span>
                            </div>
                            <div className={`px-3 py-1 rounded-full font-bold text-sm ${result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {result.passed ? 'PASS' : 'FAIL'}
                            </div>
                        </div>
                        {result.input === 1 && !result.passed && (
                             <p className="text-center text-yellow-400 font-semibold mt-2 text-sm">Hint: One is not a prime number!</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-6 text-center">
                {isCorrect ? (
                    <p className="text-2xl font-bold text-green-400">All tests passed! Challenge complete!</p>
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

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            {stage === 'coding' ? renderCodingStage() : renderTestingStage()}
        </div>
    );
};

export default LuaPrimeChallenge;