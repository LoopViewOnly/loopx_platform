import React, { useState } from 'react';

interface SQLChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
    task: string;
    expectedKeywords: string[];
    hints: string[];
}

const CUSTOMERS_DATA = [
    { customer_id: 1, first_name: 'Harry', last_name: 'Potter', age: 23, country: 'UK' },
    { customer_id: 2, first_name: 'John', last_name: 'Cena', age: 47, country: 'USA' },
    { customer_id: 3, first_name: 'Lionel', last_name: 'Messi', age: 37, country: 'Argentina' },
    { customer_id: 4, first_name: 'Cristiano', last_name: 'Ronaldo', age: 40, country: 'Portugal' },
    { customer_id: 5, first_name: 'Homer', last_name: 'Simpson', age: 45, country: 'USA' },
    { customer_id: 6, first_name: 'Bart', last_name: 'Simpson', age: 10, country: 'USA' },
    { customer_id: 7, first_name: 'Michael', last_name: 'Jordan', age: 52, country: 'USA' },
    { customer_id: 8, first_name: 'Sheldon', last_name: 'Cooper', age: 32, country: 'USA' },
    { customer_id: 9, first_name: 'Darth', last_name: 'Vader', age: 55, country: 'Galaxy Empire' },
    { customer_id: 10, first_name: 'Jack', last_name: 'Sparrow', age: 38, country: 'Caribbean' },
];

const SQLChallenge: React.FC<SQLChallengeProps> = ({ 
    onComplete, 
    challengeTitle, 
    task,
    expectedKeywords,
    hints
}) => {
    const [query, setQuery] = useState('');
    const [showError, setShowError] = useState(false);
    const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [showPasteWarning, setShowPasteWarning] = useState(false);

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        setShowPasteWarning(true);
        setTimeout(() => setShowPasteWarning(false), 2000);
    };

    const handleCopy = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const checkQuery = () => {
        // Check for keywords (case-sensitive for "Customers")
        const missing: string[] = [];
        for (const keyword of expectedKeywords) {
            // For "Customers", check case-sensitive
            if (keyword === 'Customers') {
                if (!query.includes('Customers')) {
                    missing.push(keyword);
                }
            } else {
                // For other keywords, check case-insensitive
                const normalizedQuery = query.toLowerCase().replace(/\s+/g, ' ').trim();
                const normalizedKeyword = keyword.toLowerCase();
                if (!normalizedQuery.includes(normalizedKeyword)) {
                    missing.push(keyword);
                }
            }
        }

        if (missing.length > 0) {
            setMissingKeywords(missing);
            setShowError(true);
            setIsCorrect(false);
        } else {
            setMissingKeywords([]);
            setShowError(false);
            setIsCorrect(true);
        }
    };

    const dismissError = () => {
        setShowError(false);
    };

    const handleUseHint = () => {
        setHintUsed(true);
        setShowHint(true);
    };

    return (
        <div 
            className="p-8 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-2 border-blue-500/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] text-center select-none"
            onCopy={handleCopy}
            onCut={handleCopy}
            onContextMenu={handleContextMenu}
        >
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            
            {/* SQL Icon */}
            <div className="text-4xl mb-4">🗃️</div>

            {/* Database Table Display */}
            <div className="mb-6 bg-black/50 border border-blue-500/30 rounded-lg p-4 overflow-x-auto">
                <h3 className="text-left text-cyan-400 font-mono font-bold mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">📊</span> Table: <span className="text-green-400">Customers</span>
                </h3>
                <table className="w-full text-sm font-mono">
                    <thead>
                        <tr className="bg-blue-900/50">
                            <th className="px-3 py-2 text-left text-yellow-400 border-b border-blue-500/30">customer_id</th>
                            <th className="px-3 py-2 text-left text-yellow-400 border-b border-blue-500/30">first_name</th>
                            <th className="px-3 py-2 text-left text-yellow-400 border-b border-blue-500/30">last_name</th>
                            <th className="px-3 py-2 text-left text-yellow-400 border-b border-blue-500/30">age</th>
                            <th className="px-3 py-2 text-left text-yellow-400 border-b border-blue-500/30">country</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CUSTOMERS_DATA.map((row, index) => (
                            <tr key={row.customer_id} className={index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10'}>
                                <td className="px-3 py-2 text-cyan-300 border-b border-blue-500/10">{row.customer_id}</td>
                                <td className="px-3 py-2 text-green-300 border-b border-blue-500/10">{row.first_name}</td>
                                <td className="px-3 py-2 text-green-300 border-b border-blue-500/10">{row.last_name}</td>
                                <td className="px-3 py-2 text-orange-300 border-b border-blue-500/10">{row.age}</td>
                                <td className="px-3 py-2 text-purple-300 border-b border-blue-500/10">{row.country}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Task Description */}
            <div className="mb-6 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold text-indigo-300 mb-2 flex items-center justify-center gap-2">
                    <span>📝</span> YOUR TASK
                </h3>
                <p className="text-white text-lg">{task}</p>
            </div>

            {/* SQL Query Input */}
            <div className="mb-6 relative">
                <div className="bg-slate-800 rounded-t-lg border border-slate-600 border-b-0 px-4 py-2 flex items-center gap-2">
                    <span className="text-blue-400 font-mono text-sm">SQL</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400 font-mono text-sm">Query Editor</span>
                </div>
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onPaste={handlePaste}
                    className="w-full h-32 bg-slate-900 text-cyan-300 font-mono text-sm p-4 border border-slate-600 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none select-text"
                    spellCheck={false}
                    placeholder="Write your SQL query here..."
                />

                {/* Paste Warning */}
                {showPasteWarning && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-900/95 border-2 border-red-500 px-6 py-4 rounded-lg animate-bounce shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                        <p className="text-red-400 font-bold text-lg">⛔ NO PASTE ALLOWED!</p>
                        <p className="text-red-300 text-sm mt-1">Type your query manually</p>
                    </div>
                )}
            </div>

            {/* Hint Section */}
            {!showHint ? (
                <div className="mb-6">
                    <button
                        onClick={handleUseHint}
                        disabled={hintUsed}
                        className={`px-6 py-2 font-mono text-sm border-2 rounded-lg transition-all duration-300 ${
                            hintUsed 
                                ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                        }`}
                    >
                        {hintUsed ? '💡 HINT USED' : '💡 USE HINT (-10 PTS)'}
                    </button>
                </div>
            ) : (
                <div className="mb-6 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 text-left">
                    <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                        <span>💡</span> HINT
                    </h4>
                    <ol className="text-yellow-300 text-sm space-y-1">
                        {hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-cyan-400">{index + 1}.</span> {hint}
                            </li>
                        ))}
                    </ol>
                    <p className="text-red-400 text-xs mt-3">⚠ -10 POINTS</p>
                </div>
            )}

            {/* Error Modal */}
            {showError && missingKeywords.length > 0 && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
                    onClick={dismissError}
                >
                    <div 
                        className="bg-gradient-to-br from-red-950 to-slate-900 border-2 border-red-500 rounded-xl p-6 max-w-md mx-4 shadow-[0_0_30px_rgba(239,68,68,0.5)] animate-bounce"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-5xl mb-4">❌</div>
                        <h3 className="text-2xl font-bold text-red-400 mb-4">Query Incomplete!</h3>
                        <p className="text-gray-300 mb-4">Your SQL query is missing some elements:</p>
                        <div className="space-y-2 mb-6">
                            {missingKeywords.map((keyword, index) => (
                                <div 
                                    key={index}
                                    className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-center gap-3"
                                >
                                    <span className="text-red-500">✗</span>
                                    <code className="text-yellow-400 font-mono">{keyword}</code>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={dismissError}
                            className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Success State */}
            {isCorrect ? (
                <div className="mt-4">
                    <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 rounded-xl p-6 mb-6">
                        <span className="text-5xl">✅</span>
                        <h3 className="text-3xl font-bold text-green-400 mt-4">Query Correct!</h3>
                        <p className="text-gray-300 mt-2">Your SQL query includes all required elements!</p>
                        {hintUsed && <p className="text-yellow-400 text-sm mt-2">⚠ Hint penalty: -10 pts</p>}
                    </div>
                    <button
                        onClick={() => onComplete(true)}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-600/30"
                    >
                        Next Challenge →
                    </button>
                </div>
            ) : (
                <button
                    onClick={checkQuery}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-cyan-500 transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/30"
                >
                    ▶ Run Query
                </button>
            )}
        </div>
    );
};

export default SQLChallenge;
