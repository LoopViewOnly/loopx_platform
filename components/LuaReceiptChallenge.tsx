import React, { useState } from 'react';
import { LUA_RECEIPT_CHALLENGE } from '../challenges/content';

interface LuaReceiptChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'testing';

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10 select-none" onCopy={(e) => e.preventDefault()}>
        <p className="mb-3">Define 3 variables for prices and print them as a receipt:</p>
        <ul className="list-disc list-inside mb-3 space-y-1">
            <li><code className="text-cyan-400">oreo_price = 3</code></li>
            <li><code className="text-cyan-400">kinder_price = 5</code></li>
            <li><code className="text-cyan-400">cola_price = 7</code></li>
        </ul>
        <p className="mb-3">Then print them as a formatted receipt showing each item with its price and a total (15).</p>
        <div className="bg-black/40 p-3 rounded-lg font-mono text-sm text-green-400 whitespace-pre">
{`********************
* Oreo        3    *
* Kinder      5    *
* Cola        7    *
*------------------*
* Total       15   *
********************`}
        </div>
    </div>
);

const LuaReceiptChallenge: React.FC<LuaReceiptChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(LUA_RECEIPT_CHALLENGE.initialCode);
    const [stage, setStage] = useState<Stage>('coding');
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

    const validateCode = () => {
        // Check for all expected keywords (case-insensitive for some)
        const expectedKeywords = LUA_RECEIPT_CHALLENGE.expectedKeywords;
        const missing: string[] = [];

        expectedKeywords.forEach(keyword => {
            // For keywords like variable names and numbers, check case-insensitively
            const lowerCode = code.toLowerCase();
            const lowerKeyword = keyword.toLowerCase();
            
            if (!code.includes(keyword) && !lowerCode.includes(lowerKeyword)) {
                missing.push(keyword);
            }
        });

        // Additional checks
        // Check for variable definitions
        const hasOreoPrice = /oreo_price\s*=\s*3/.test(code);
        const hasKinderPrice = /kinder_price\s*=\s*5/.test(code);
        const hasColaPrice = /cola_price\s*=\s*7/.test(code);
        const hasPrint = /print\s*\(/.test(code);
        const hasAsterisks = /\*/.test(code);
        const hasDashes = /-/.test(code);
        const hasTotal = /[Tt]otal/.test(code);

        // Check for sum equation with all three variables (in any order)
        // Look for a line that contains all three variable names with + signs
        const hasSumEquation = (() => {
            // Remove comments and normalize whitespace
            const cleanCode = code.replace(/--.*$/gm, '').replace(/\s+/g, '');
            
            // Check if there's an expression that adds all three variables
            // Pattern: any combination of the three variables with + between them
            const variables = ['oreo_price', 'kinder_price', 'cola_price'];
            
            // Find all potential sum expressions (looking for patterns with + signs)
            const sumPatterns = cleanCode.match(/[a-z_]+(\+[a-z_]+)+/gi) || [];
            
            // Check if any pattern contains all three variables
            for (const pattern of sumPatterns) {
                const containsAll = variables.every(v => pattern.toLowerCase().includes(v.toLowerCase()));
                if (containsAll) return true;
            }
            
            // Also check for expressions like: total = oreo_price + kinder_price + cola_price
            // or print(oreo_price + kinder_price + cola_price)
            const hasAllInAddition = variables.every(v => {
                // Check if variable appears near a + sign
                const regex = new RegExp(`(${v}\\s*\\+|\\+\\s*${v})`, 'i');
                return regex.test(code);
            });
            
            return hasAllInAddition;
        })();

        if (!hasOreoPrice) missing.push('oreo_price = 3');
        if (!hasKinderPrice) missing.push('kinder_price = 5');
        if (!hasColaPrice) missing.push('cola_price = 7');
        if (!hasSumEquation) missing.push('Sum equation (oreo_price + kinder_price + cola_price)');

        // Remove duplicates
        const uniqueMissing = [...new Set(missing)];
        setMissingKeywords(uniqueMissing);

        // Core validation: must have all 3 prices, print statements, formatting, AND sum equation
        const isValid = hasOreoPrice && hasKinderPrice && hasColaPrice && 
                       hasPrint && hasAsterisks && hasDashes && hasTotal && hasSumEquation;

        if (isValid) {
            setStatus("Validation successful! Your receipt code looks correct.");
            setIsCorrect(true);
            setStage('testing');
            setTimeout(() => onComplete(true), 1500);
        } else {
            let errorMsg = "Validation failed: ";
            if (!hasOreoPrice || !hasKinderPrice || !hasColaPrice) {
                errorMsg += "Make sure you define all three price variables (oreo_price=3, kinder_price=5, cola_price=7). ";
            }
            if (!hasSumEquation) {
                errorMsg += "Calculate the total by adding all three variables (oreo_price + kinder_price + cola_price). ";
            }
            if (!hasPrint) {
                errorMsg += "Use print() to output the receipt. ";
            }
            if (!hasAsterisks || !hasDashes) {
                errorMsg += "Format your receipt with asterisks (*) and dashes (-). ";
            }
            if (!hasTotal) {
                errorMsg += "Include 'Total' in your receipt. ";
            }
            setStatus(errorMsg);
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
                    <span className="ml-auto text-xs text-gray-400 font-semibold">receipt.lua</span>
                </div>
                <div className="p-4">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-80 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        spellCheck="false"
                        placeholder="-- Write your Lua code here..."
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
            <h3 className="text-xl font-bold text-gray-200 mb-4">Validation Results</h3>
            {isCorrect ? (
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300">Variable definitions (oreo_price, kinder_price, cola_price)</span>
                        <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">PASS</span>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300">Print statements</span>
                        <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">PASS</span>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300">Receipt formatting (* and -)</span>
                        <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">PASS</span>
                    </div>
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                        <span className="text-gray-300">Total calculation</span>
                        <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-500/20 text-green-400">PASS</span>
                    </div>
                </div>
            ) : (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
                    <p className="text-red-400 font-bold">Validation Failed:</p>
                    <p className="text-red-300 mt-2">{status}</p>
                    {missingKeywords.length > 0 && (
                        <div className="mt-3">
                            <p className="text-yellow-400 text-sm">Missing or incorrect:</p>
                            <ul className="list-disc list-inside text-yellow-300 text-sm mt-1">
                                {missingKeywords.slice(0, 5).map((kw, idx) => (
                                    <li key={idx}>{kw}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            <div className="mt-6 text-center">
                {isCorrect ? (
                    <p className="text-2xl font-bold text-green-400">🧾 Receipt printed! Challenge complete!</p>
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

export default LuaReceiptChallenge;

