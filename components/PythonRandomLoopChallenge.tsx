import React, { useState, useEffect } from 'react';

interface PythonRandomLoopChallengeProps {
    onComplete: (success: boolean, pointsDeducted?: number) => void;
    challengeTitle: string;
}

interface MissingKeyword {
    keyword: string;
    hint: string;
}

const REQUIRED_KEYWORDS = [
    { keyword: 'import random', hint: 'Missing the random module import' },
    { keyword: 'for', hint: 'Missing a loop structure' },
    { keyword: 'print', hint: 'Missing output function' },
    { keyword: 'random.randint', hint: 'Missing random number generator' },
    { keyword: '1', hint: 'Check your number range' },
    { keyword: '100', hint: 'Check your number range' },
];

const PythonRandomLoopChallenge: React.FC<PythonRandomLoopChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(`# Write your Python code here\n`);
    const [missingKeywords, setMissingKeywords] = useState<MissingKeyword[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [shake, setShake] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [scanLines] = useState(true);
    const [showPasteWarning, setShowPasteWarning] = useState(false);

    // Prevent paste in code editor
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        setShowPasteWarning(true);
        setTimeout(() => setShowPasteWarning(false), 2000);
    };

    // Prevent copy on the entire component
    const handleCopy = (e: React.ClipboardEvent) => {
        e.preventDefault();
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        if (showAlert) {
            setShake(true);
            const timer = setTimeout(() => setShake(false), 600);
            return () => clearTimeout(timer);
        }
    }, [showAlert, missingKeywords]);

    const checkCode = () => {
        const normalizedCode = code.toLowerCase().replace(/\s+/g, ' ');
        const missing: MissingKeyword[] = [];

        for (const { keyword, hint } of REQUIRED_KEYWORDS) {
            const normalizedKeyword = keyword.toLowerCase();
            if (!normalizedCode.includes(normalizedKeyword)) {
                missing.push({ keyword, hint });
            }
        }

        if (missing.length > 0) {
            setMissingKeywords(missing);
            setShowAlert(true);
            setIsCorrect(false);
        } else {
            setMissingKeywords([]);
            setShowAlert(false);
            setIsCorrect(true);
        }
    };

    const dismissAlert = () => {
        setShowAlert(false);
    };

    const handleUseHint = () => {
        setHintUsed(true);
        setShowHint(true);
    };

    const handleComplete = () => {
        onComplete(true, hintUsed ? 10 : 0);
    };

    return (
        <div 
            className="relative p-8 bg-black border-4 border-fuchsia-500 rounded-none shadow-[0_0_30px_rgba(236,72,153,0.5),inset_0_0_30px_rgba(0,0,0,0.8)] text-center overflow-hidden select-none"
            onCopy={handleCopy}
            onCut={handleCopy}
            onContextMenu={handleContextMenu}
        >
            {/* Scanlines overlay */}
            {scanLines && (
                <div className="absolute inset-0 pointer-events-none z-10 opacity-20"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                    }}
                />
            )}
            
            {/* Retro grid background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(236,72,153,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(236,72,153,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Glowing title */}
            <h2 className="text-3xl font-bold mb-2 relative z-20"
                style={{
                    fontFamily: '"Press Start 2P", monospace',
                    color: '#00ffff',
                    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #0099ff'
                }}>
                {challengeTitle}
            </h2>
            
            {/* Subtitle with neon effect */}
            <div className="mb-6 relative z-20">
                <p className="text-lg" style={{
                    fontFamily: 'monospace',
                    color: '#ff00ff',
                    textShadow: '0 0 5px #ff00ff, 0 0 10px #ff00ff'
                }}>
                    ══════════════════════════
                </p>
            </div>

            {/* Task description - 80s style */}
            <div className="relative z-20 bg-black/80 border-2 border-cyan-400 p-4 mb-6 text-left"
                style={{ boxShadow: '0 0 15px rgba(0,255,255,0.3), inset 0 0 15px rgba(0,255,255,0.1)' }}>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2"
                    style={{ 
                        fontFamily: 'monospace',
                        color: '#ffff00',
                        textShadow: '0 0 5px #ffff00'
                    }}>
                    <span className="animate-pulse">▶</span> MISSION OBJECTIVE
                </h3>
                <p className="text-cyan-300 font-mono">
                    Write a Python program that prints <span className="text-yellow-400 font-bold animate-pulse">20 random numbers</span> between <span className="text-green-400 font-bold">1</span> and <span className="text-green-400 font-bold">100</span>.
                </p>
            </div>

            {/* Code Editor - Retro terminal style */}
            <div className="mb-6 relative z-20">
                <div className="bg-black border-2 border-green-500 px-4 py-2 flex items-center gap-2"
                    style={{ boxShadow: '0 0 10px rgba(0,255,0,0.3)' }}>
                    <span className="text-green-500 font-mono text-sm animate-pulse">█</span>
                    <span className="text-green-400 font-mono text-sm">PYTHON_TERMINAL.exe</span>
                    <span className="ml-auto text-xs bg-green-900/50 text-green-400 px-2 py-0.5 border border-green-500 font-mono">v3.x</span>
                </div>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onPaste={handlePaste}
                    className="w-full h-64 bg-black text-green-400 font-mono text-sm p-4 border-2 border-green-500 border-t-0 focus:outline-none resize-none select-text"
                    style={{ 
                        boxShadow: '0 0 10px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.05)',
                        caretColor: '#00ff00'
                    }}
                    spellCheck={false}
                    placeholder="> START CODING..."
                />
                
                {/* Paste Warning */}
                {showPasteWarning && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-900/95 border-2 border-red-500 px-6 py-4 animate-bounce"
                        style={{ boxShadow: '0 0 30px rgba(239,68,68,0.8)' }}>
                        <p className="text-red-400 font-mono font-bold text-lg" style={{ textShadow: '0 0 10px #ef4444' }}>
                            ⛔ NO PASTE ALLOWED! ⛔
                        </p>
                        <p className="text-red-300 font-mono text-sm mt-1">
                            Type your code manually
                        </p>
                    </div>
                )}
            </div>

            {/* Hint section - costs points */}
            {!showHint ? (
                <div className="mb-6 relative z-20">
                    <button
                        onClick={handleUseHint}
                        disabled={hintUsed}
                        className={`px-6 py-2 font-mono text-sm border-2 transition-all duration-300 ${
                            hintUsed 
                                ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                                : 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 hover:shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                        }`}
                        style={{ textShadow: hintUsed ? 'none' : '0 0 5px #eab308' }}
                    >
                        {hintUsed ? '💡 HINT ACTIVATED' : '💡 USE HINT (-10 PTS)'}
                    </button>
                </div>
            ) : (
                <div className="mb-6 relative z-20 bg-black/80 border-2 border-yellow-500 p-4 text-left animate-pulse"
                    style={{ boxShadow: '0 0 15px rgba(234,179,8,0.3)' }}>
                    <h4 className="text-yellow-400 font-mono font-bold mb-3" style={{ textShadow: '0 0 5px #eab308' }}>
                        ⚡ HINT ACTIVATED ⚡
                    </h4>
                    <ol className="text-yellow-300 font-mono text-sm space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400">1.</span> Import the random library
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400">2.</span> Use a for loop to repeat 20 times
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-cyan-400">3.</span> Print random numbers between 1-100
                        </li>
                    </ol>
                    <p className="text-red-400 text-xs mt-3 font-mono">⚠ -10 POINTS DEDUCTED</p>
                </div>
            )}

            {/* Alert for missing keywords - 80s arcade style */}
            {showAlert && missingKeywords.length > 0 && (
                <div 
                    className={`fixed inset-0 flex items-center justify-center z-50 bg-black/90 transition-all duration-300`}
                    onClick={dismissAlert}
                >
                    <div 
                        className={`bg-black border-4 border-red-500 p-6 max-w-md mx-4 transform transition-all duration-300 ${shake ? 'animate-bounce' : 'scale-100'}`}
                        style={{ boxShadow: '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.3)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Scanlines on alert */}
                        <div className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)'
                            }}
                        />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <span className="text-5xl animate-pulse">⛔</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center font-mono"
                                style={{ 
                                    color: '#ff0000',
                                    textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000',
                                    animation: 'flicker 0.5s infinite'
                                }}>
                                SYSTEM ERROR
                            </h3>
                            <p className="text-cyan-400 text-center mb-4 font-mono text-sm">
                                CODE INCOMPLETE - MISSING ELEMENTS:
                            </p>
                            <div className="space-y-2 mb-6">
                                {missingKeywords.map((item, index) => (
                                    <div 
                                        key={index}
                                        className="bg-red-900/30 border border-red-500 p-3 flex items-center gap-3 animate-fadeIn font-mono"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <span className="text-red-500 text-lg">✗</span>
                                        <span className="text-red-300 text-sm">{item.hint}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={dismissAlert}
                                className="w-full px-6 py-3 bg-red-900/50 border-2 border-red-500 text-red-400 font-mono font-bold hover:bg-red-500 hover:text-white transition-all duration-200"
                                style={{ textShadow: '0 0 5px currentColor' }}
                            >
                                [ RETRY ]
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success State - 80s victory screen */}
            {isCorrect ? (
                <div className="mt-4 relative z-20">
                    <div className="bg-black border-4 border-green-400 p-6 mb-6"
                        style={{ boxShadow: '0 0 30px rgba(74,222,128,0.5), 0 0 60px rgba(74,222,128,0.3)' }}>
                        <span className="text-5xl block mb-4">🏆</span>
                        <h3 className="text-3xl font-bold font-mono"
                            style={{ 
                                color: '#00ff00',
                                textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00'
                            }}>
                            MISSION COMPLETE!
                        </h3>
                        <p className="text-cyan-400 mt-2 font-mono">
                            CODE VERIFIED SUCCESSFULLY
                        </p>
                        {hintUsed && (
                            <p className="text-yellow-400 text-sm mt-2 font-mono">
                                ⚠ HINT PENALTY: -10 PTS
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleComplete}
                        className="px-8 py-3 bg-black border-2 border-cyan-400 text-cyan-400 font-mono font-bold hover:bg-cyan-400 hover:text-black transition-all duration-200"
                        style={{ 
                            boxShadow: '0 0 15px rgba(0,255,255,0.5)',
                            textShadow: '0 0 5px currentColor'
                        }}
                    >
                        [ NEXT LEVEL → ]
                    </button>
                </div>
            ) : (
                <button
                    onClick={checkCode}
                    className="relative z-20 px-8 py-3 bg-black border-2 border-fuchsia-500 text-fuchsia-400 font-mono font-bold hover:bg-fuchsia-500 hover:text-white transition-all duration-200"
                    style={{ 
                        boxShadow: '0 0 15px rgba(236,72,153,0.5)',
                        textShadow: '0 0 5px currentColor'
                    }}
                >
                    ▶ EXECUTE CODE
                </button>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                    opacity: 0;
                }
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
            `}</style>
        </div>
    );
};

export default PythonRandomLoopChallenge;
