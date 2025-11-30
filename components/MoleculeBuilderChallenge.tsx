import React, { useState, useCallback } from 'react';

interface MoleculeBuilderChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

interface Atom {
    id: string;
    element: string;
    symbol: string;
    color: string;
    x: number;
    y: number;
}

interface Level {
    name: string;
    formula: string;
    description: string;
    elements: { symbol: string; name: string; color: string; count: number }[];
    required: { [key: string]: number };
    structure: string;
}

const LEVELS: Level[] = [
    {
        name: 'Water',
        formula: 'H₂O',
        description: 'Combine 2 Hydrogen atoms with 1 Oxygen atom',
        elements: [
            { symbol: 'H', name: 'Hydrogen', color: '#60a5fa', count: 4 },
            { symbol: 'O', name: 'Oxygen', color: '#f87171', count: 2 },
        ],
        required: { H: 2, O: 1 },
        structure: 'H-O-H',
    },
    {
        name: 'Carbon Dioxide',
        formula: 'CO₂',
        description: 'Combine 1 Carbon atom with 2 Oxygen atoms',
        elements: [
            { symbol: 'C', name: 'Carbon', color: '#4b5563', count: 2 },
            { symbol: 'O', name: 'Oxygen', color: '#f87171', count: 4 },
        ],
        required: { C: 1, O: 2 },
        structure: 'O=C=O',
    },
    {
        name: 'Ammonia',
        formula: 'NH₃',
        description: 'Combine 1 Nitrogen atom with 3 Hydrogen atoms',
        elements: [
            { symbol: 'N', name: 'Nitrogen', color: '#a78bfa', count: 2 },
            { symbol: 'H', name: 'Hydrogen', color: '#60a5fa', count: 6 },
        ],
        required: { N: 1, H: 3 },
        structure: 'H-N-H with H below',
    },
    {
        name: 'Methane',
        formula: 'CH₄',
        description: 'Combine 1 Carbon atom with 4 Hydrogen atoms',
        elements: [
            { symbol: 'C', name: 'Carbon', color: '#4b5563', count: 2 },
            { symbol: 'H', name: 'Hydrogen', color: '#60a5fa', count: 6 },
        ],
        required: { C: 1, H: 4 },
        structure: 'Tetrahedral with C at center',
    },
];

const MoleculeBuilderChallenge: React.FC<MoleculeBuilderChallengeProps> = ({
    onComplete,
    challengeTitle,
}) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [placedAtoms, setPlacedAtoms] = useState<Atom[]>([]);
    const [draggedElement, setDraggedElement] = useState<{ symbol: string; color: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);

    const level = LEVELS[currentLevel];

    const handleDragStart = useCallback((symbol: string, color: string) => {
        setDraggedElement({ symbol, color });
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedElement(null);
    }, []);

    const handleCanvasDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggedElement) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newAtom: Atom = {
            id: `atom-${Date.now()}-${Math.random()}`,
            element: draggedElement.symbol,
            symbol: draggedElement.symbol,
            color: draggedElement.color,
            x: Math.max(25, Math.min(x, rect.width - 25)),
            y: Math.max(25, Math.min(y, rect.height - 25)),
        };

        setPlacedAtoms(prev => [...prev, newAtom]);
        setDraggedElement(null);
        setFeedback({ type: null, message: '' });
    }, [draggedElement]);

    const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const removeAtom = useCallback((atomId: string) => {
        setPlacedAtoms(prev => prev.filter(a => a.id !== atomId));
        setFeedback({ type: null, message: '' });
    }, []);

    const clearCanvas = useCallback(() => {
        setPlacedAtoms([]);
        setFeedback({ type: null, message: '' });
    }, []);

    const checkMolecule = useCallback(() => {
        setIsChecking(true);

        // Count placed atoms
        const atomCounts: { [key: string]: number } = {};
        placedAtoms.forEach(atom => {
            atomCounts[atom.symbol] = (atomCounts[atom.symbol] || 0) + 1;
        });

        // Check if matches required
        const required = level.required;
        let isCorrect = true;

        // Check all required elements are present with correct counts
        for (const [element, count] of Object.entries(required)) {
            if (atomCounts[element] !== count) {
                isCorrect = false;
                break;
            }
        }

        // Check no extra elements
        for (const [element, count] of Object.entries(atomCounts)) {
            if (required[element] !== count) {
                isCorrect = false;
                break;
            }
        }

        setTimeout(() => {
            if (isCorrect) {
                setFeedback({ type: 'success', message: `🎉 Correct! You built ${level.name} (${level.formula})!` });
                if (!completedLevels.includes(currentLevel)) {
                    setCompletedLevels(prev => [...prev, currentLevel]);
                }
            } else {
                // Give hint about what's wrong
                const hints: string[] = [];
                for (const [element, count] of Object.entries(required)) {
                    const placed = atomCounts[element] || 0;
                    if (placed < count) {
                        hints.push(`Need ${count - placed} more ${element}`);
                    } else if (placed > count) {
                        hints.push(`Remove ${placed - count} ${element}`);
                    }
                }
                for (const element of Object.keys(atomCounts)) {
                    if (!required[element]) {
                        hints.push(`Remove all ${element} (not needed)`);
                    }
                }
                setFeedback({ type: 'error', message: hints.length > 0 ? hints.join(', ') : 'Check your molecule!' });
            }
            setIsChecking(false);
        }, 500);
    }, [placedAtoms, level, currentLevel, completedLevels]);

    const nextLevel = useCallback(() => {
        if (currentLevel < LEVELS.length - 1) {
            setCurrentLevel(prev => prev + 1);
            setPlacedAtoms([]);
            setFeedback({ type: null, message: '' });
        }
    }, [currentLevel]);

    const allLevelsComplete = completedLevels.length === LEVELS.length;

    // Render bonds between atoms (simplified - just draw lines to nearby atoms)
    const renderBonds = () => {
        const bonds: JSX.Element[] = [];
        for (let i = 0; i < placedAtoms.length; i++) {
            for (let j = i + 1; j < placedAtoms.length; j++) {
                const a1 = placedAtoms[i];
                const a2 = placedAtoms[j];
                const dist = Math.sqrt((a1.x - a2.x) ** 2 + (a1.y - a2.y) ** 2);
                if (dist < 100) { // Draw bond if atoms are close
                    bonds.push(
                        <line
                            key={`bond-${i}-${j}`}
                            x1={a1.x}
                            y1={a1.y}
                            x2={a2.x}
                            y2={a2.y}
                            stroke="#94a3b8"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    );
                }
            }
        }
        return bonds;
    };

    return (
        <div className="p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-purple-500/40 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.2)] select-none">
            <h2 className="text-2xl font-bold text-purple-300 mb-2 text-center">{challengeTitle}</h2>

            {/* Header */}
            <div className="text-center mb-4">
                <span className="text-3xl">⚗️</span>
                <p className="text-gray-400 text-sm mt-1">Build molecules by dragging atoms!</p>
            </div>

            {/* Level Progress */}
            <div className="flex justify-center gap-2 mb-4">
                {LEVELS.map((l, i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            completedLevels.includes(i)
                                ? 'bg-green-600 border-green-400 text-white'
                                : i === currentLevel
                                    ? 'bg-purple-600 border-purple-400 text-white animate-pulse'
                                    : 'bg-slate-800 border-slate-600 text-slate-400'
                        }`}
                    >
                        {completedLevels.includes(i) ? '✓' : i + 1}
                    </div>
                ))}
            </div>

            {/* Current Level Info */}
            <div className="bg-black/30 rounded-lg p-3 mb-4 text-center border border-white/10">
                <h3 className="text-xl font-bold text-white">
                    Level {currentLevel + 1}: <span className="text-purple-400">{level.name}</span>
                    <span className="text-2xl ml-2">{level.formula}</span>
                </h3>
                <p className="text-gray-400 text-sm">{level.description}</p>
            </div>

            {/* Main Game Area */}
            <div className="flex gap-4">
                {/* Element Containers - Left */}
                <div className="w-32 bg-black/40 rounded-xl p-3 border border-white/10">
                    <h4 className="text-xs font-bold text-gray-400 mb-3 text-center">ELEMENTS</h4>
                    <div className="space-y-3">
                        {level.elements.map((el) => (
                            <div key={el.symbol} className="text-center">
                                <p className="text-[10px] text-gray-500 mb-1">{el.name}</p>
                                <div className="flex flex-wrap justify-center gap-1">
                                    {[...Array(el.count)].map((_, i) => (
                                        <div
                                            key={`${el.symbol}-${i}`}
                                            draggable
                                            onDragStart={() => handleDragStart(el.symbol, el.color)}
                                            onDragEnd={handleDragEnd}
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-grab active:cursor-grabbing hover:scale-110 transition-transform shadow-lg border-2 border-white/30"
                                            style={{ backgroundColor: el.color }}
                                        >
                                            {el.symbol}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Canvas - Center */}
                <div className="flex-1">
                    <div
                        className={`relative h-64 bg-slate-900/80 rounded-xl border-2 transition-all ${
                            draggedElement
                                ? 'border-purple-400 border-dashed bg-purple-400/10'
                                : 'border-slate-700'
                        }`}
                        onDrop={handleCanvasDrop}
                        onDragOver={handleCanvasDragOver}
                    >
                        {/* Background grid */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }} />

                        {/* Bonds SVG */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {renderBonds()}
                        </svg>

                        {/* Placed Atoms */}
                        {placedAtoms.map((atom) => (
                            <div
                                key={atom.id}
                                className="absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-white/40 group"
                                style={{
                                    backgroundColor: atom.color,
                                    left: atom.x - 24,
                                    top: atom.y - 24,
                                }}
                                onClick={() => removeAtom(atom.id)}
                            >
                                {atom.symbol}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    ×
                                </div>
                            </div>
                        ))}

                        {/* Empty state */}
                        {placedAtoms.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                    <span className="text-4xl opacity-30">🧪</span>
                                    <p className="text-sm mt-2">Drag atoms here</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Canvas controls */}
                    <div className="flex justify-between mt-2">
                        <button
                            onClick={clearCanvas}
                            className="px-3 py-1 bg-slate-700 text-slate-300 rounded text-xs hover:bg-slate-600 transition-colors"
                        >
                            🗑️ Clear
                        </button>
                        <p className="text-xs text-gray-500">Click atom to remove</p>
                    </div>
                </div>

                {/* Target Molecule - Right */}
                <div className="w-36 bg-black/40 rounded-xl p-3 border border-white/10">
                    <h4 className="text-xs font-bold text-gray-400 mb-2 text-center">TARGET</h4>
                    <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <p className="text-3xl font-bold text-white mb-1">{level.formula}</p>
                        <p className="text-sm text-purple-400 font-medium">{level.name}</p>
                        <div className="mt-2 text-[10px] text-gray-500">
                            {Object.entries(level.required).map(([el, count]) => (
                                <span key={el} className="inline-block mx-1">
                                    {count}×{el}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mt-3 text-[10px] text-gray-500 text-center">
                        <p className="font-bold text-gray-400 mb-1">Structure:</p>
                        <p>{level.structure}</p>
                    </div>
                </div>
            </div>

            {/* Feedback */}
            {feedback.type && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                    feedback.type === 'success'
                        ? 'bg-green-900/50 border border-green-500 text-green-400'
                        : 'bg-red-900/50 border border-red-500 text-red-400'
                }`}>
                    <span className="font-bold">{feedback.message}</span>
                </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 text-center">
                {feedback.type === 'success' ? (
                    currentLevel < LEVELS.length - 1 ? (
                        <button
                            onClick={nextLevel}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-indigo-500 transform hover:scale-105 transition-all"
                        >
                            Next Molecule →
                        </button>
                    ) : allLevelsComplete ? (
                        <button
                            onClick={() => onComplete(true)}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transform hover:scale-105 transition-all shadow-lg shadow-green-600/30"
                        >
                            Complete Challenge → 100 pts
                        </button>
                    ) : null
                ) : (
                    <button
                        onClick={checkMolecule}
                        disabled={placedAtoms.length === 0 || isChecking}
                        className={`px-8 py-3 font-bold rounded-xl transition-all ${
                            placedAtoms.length === 0 || isChecking
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
                        }`}
                    >
                        {isChecking ? '⏳ Checking...' : '🔬 Check Molecule'}
                    </button>
                )}
            </div>

            {/* Completed all levels celebration */}
            {allLevelsComplete && feedback.type === 'success' && (
                <div className="mt-4 text-center">
                    <div className="text-4xl mb-2">🎊🧬🎊</div>
                    <p className="text-green-400 font-bold">All molecules built! You're a chemistry master!</p>
                </div>
            )}
        </div>
    );
};

export default MoleculeBuilderChallenge;

