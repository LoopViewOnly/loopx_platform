import React, { useState, useCallback } from 'react';

interface FillBlankChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

interface BlankSlot {
    id: string;
    correctAnswer: string;
    filledAnswer: string | null;
}

interface DragOption {
    id: string;
    text: string;
    used: boolean;
}

const FillBlankChallenge: React.FC<FillBlankChallengeProps> = ({ 
    onComplete, 
    challengeTitle 
}) => {
    const [blanks, setBlanks] = useState<BlankSlot[]>([
        { id: 'blank1', correctAnswer: 'Wasim Abu Salem', filledAnswer: null },
        { id: 'blank2', correctAnswer: '2015', filledAnswer: null },
    ]);

    const [options, setOptions] = useState<DragOption[]>([
        { id: 'opt1', text: '2015', used: false },
        { id: 'opt2', text: '2017', used: false },
        { id: 'opt3', text: '2010', used: false },
        { id: 'opt4', text: 'Wisam Abu Slm', used: false },
        { id: 'opt5', text: 'Wasim Abu Salem', used: false },
        { id: 'opt6', text: 'Saleem Salem', used: false },
    ]);

    const [draggedOption, setDraggedOption] = useState<DragOption | null>(null);
    const [hoveredBlank, setHoveredBlank] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleDragStart = useCallback((option: DragOption) => {
        if (!option.used) {
            setDraggedOption(option);
        }
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedOption(null);
        setHoveredBlank(null);
    }, []);

    const handleBlankDragOver = useCallback((blankId: string, e: React.DragEvent) => {
        e.preventDefault();
        setHoveredBlank(blankId);
    }, []);

    const handleBlankDragLeave = useCallback(() => {
        setHoveredBlank(null);
    }, []);

    const handleBlankDrop = useCallback((blankId: string) => {
        if (!draggedOption) return;

        // Find the blank
        const blankIndex = blanks.findIndex(b => b.id === blankId);
        if (blankIndex === -1) return;

        // If blank already has an answer, return that option to pool
        const currentAnswer = blanks[blankIndex].filledAnswer;
        if (currentAnswer) {
            setOptions(prev => prev.map(opt => 
                opt.text === currentAnswer ? { ...opt, used: false } : opt
            ));
        }

        // Fill the blank
        setBlanks(prev => prev.map(b => 
            b.id === blankId ? { ...b, filledAnswer: draggedOption.text } : b
        ));

        // Mark option as used
        setOptions(prev => prev.map(opt => 
            opt.id === draggedOption.id ? { ...opt, used: true } : opt
        ));

        setDraggedOption(null);
        setHoveredBlank(null);
        setIsChecked(false);
    }, [draggedOption, blanks]);

    const handleOptionClick = useCallback((option: DragOption) => {
        if (option.used) return;

        // Find first empty blank
        const emptyBlankIndex = blanks.findIndex(b => b.filledAnswer === null);
        if (emptyBlankIndex === -1) return;

        // Fill the blank
        setBlanks(prev => prev.map((b, i) => 
            i === emptyBlankIndex ? { ...b, filledAnswer: option.text } : b
        ));

        // Mark option as used
        setOptions(prev => prev.map(opt => 
            opt.id === option.id ? { ...opt, used: true } : opt
        ));

        setIsChecked(false);
    }, [blanks]);

    const handleBlankClick = useCallback((blankId: string) => {
        const blank = blanks.find(b => b.id === blankId);
        if (!blank?.filledAnswer) return;

        // Return option to pool
        setOptions(prev => prev.map(opt => 
            opt.text === blank.filledAnswer ? { ...opt, used: false } : opt
        ));

        // Clear the blank
        setBlanks(prev => prev.map(b => 
            b.id === blankId ? { ...b, filledAnswer: null } : b
        ));

        setIsChecked(false);
    }, [blanks]);

    const checkAnswer = () => {
        const allCorrect = blanks.every(b => b.filledAnswer === b.correctAnswer);
        setIsChecked(true);
        setIsCorrect(allCorrect);

        if (!allCorrect) {
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
        }
    };

    const allFilled = blanks.every(b => b.filledAnswer !== null);

    const renderSentence = () => {
        return (
            <div className="text-2xl md:text-3xl font-medium text-white leading-relaxed flex flex-wrap items-center justify-center gap-2">
                <span>Loop was founded by</span>
                {/* First blank - founder name */}
                <div
                    className={`inline-flex items-center justify-center min-w-[180px] h-12 px-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${
                        blanks[0].filledAnswer
                            ? isChecked
                                ? blanks[0].filledAnswer === blanks[0].correctAnswer
                                    ? 'bg-green-600/30 border-green-400 text-green-300'
                                    : 'bg-red-600/30 border-red-400 text-red-300'
                                : 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
                            : hoveredBlank === 'blank1'
                                ? 'bg-cyan-400/20 border-cyan-400'
                                : 'bg-slate-800/50 border-slate-500'
                    }`}
                    onDragOver={(e) => handleBlankDragOver('blank1', e)}
                    onDragLeave={handleBlankDragLeave}
                    onDrop={() => handleBlankDrop('blank1')}
                    onClick={() => handleBlankClick('blank1')}
                >
                    {blanks[0].filledAnswer ? (
                        <span className="font-bold">{blanks[0].filledAnswer}</span>
                    ) : (
                        <span className="text-slate-500">_______</span>
                    )}
                </div>
                <span>in</span>
                {/* Second blank - year */}
                <div
                    className={`inline-flex items-center justify-center min-w-[100px] h-12 px-4 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer ${
                        blanks[1].filledAnswer
                            ? isChecked
                                ? blanks[1].filledAnswer === blanks[1].correctAnswer
                                    ? 'bg-green-600/30 border-green-400 text-green-300'
                                    : 'bg-red-600/30 border-red-400 text-red-300'
                                : 'bg-cyan-600/30 border-cyan-400 text-cyan-300'
                            : hoveredBlank === 'blank2'
                                ? 'bg-cyan-400/20 border-cyan-400'
                                : 'bg-slate-800/50 border-slate-500'
                    }`}
                    onDragOver={(e) => handleBlankDragOver('blank2', e)}
                    onDragLeave={handleBlankDragLeave}
                    onDrop={() => handleBlankDrop('blank2')}
                    onClick={() => handleBlankClick('blank2')}
                >
                    {blanks[1].filledAnswer ? (
                        <span className="font-bold">{blanks[1].filledAnswer}</span>
                    ) : (
                        <span className="text-slate-500">_______</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/40 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] select-none">
            <h2 className="text-2xl font-bold text-emerald-300 mb-2 text-center">{challengeTitle}</h2>
            
            {/* Duolingo-style header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-emerald-600/20 px-4 py-2 rounded-full border border-emerald-500/30">
                    <span className="text-2xl">🦉</span>
                    <span className="text-emerald-400 font-bold">Complete the sentence!</span>
                </div>
            </div>

            {/* Sentence with blanks */}
            <div className="bg-black/30 rounded-xl p-8 mb-8 border border-white/10">
                {renderSentence()}
            </div>

            {/* Drag options */}
            <div className="mb-8">
                <p className="text-center text-gray-400 text-sm mb-4">
                    {draggedOption ? '📍 Drop on a blank!' : '👆 Drag or click an option to fill the blanks'}
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            draggable={!option.used}
                            onDragStart={() => handleDragStart(option)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleOptionClick(option)}
                            className={`px-5 py-3 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${
                                option.used
                                    ? 'bg-slate-800/30 border-slate-700 text-slate-600 cursor-not-allowed opacity-50'
                                    : draggedOption?.id === option.id
                                        ? 'bg-emerald-600 border-emerald-400 text-white scale-105 shadow-lg shadow-emerald-500/30'
                                        : 'bg-slate-800 border-slate-600 text-white cursor-grab hover:border-emerald-400 hover:bg-slate-700 hover:scale-105 active:cursor-grabbing'
                            }`}
                        >
                            {option.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Error shake */}
            {showError && (
                <div className="mb-4 bg-red-900/50 border border-red-500 rounded-lg p-3 text-center animate-shake">
                    <span className="text-red-400 font-bold">❌ Not quite right! Try again.</span>
                </div>
            )}

            {/* Success */}
            {isChecked && isCorrect && (
                <div className="mb-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Perfect!</h3>
                    <p className="text-gray-300">Loop was founded by <span className="text-emerald-400 font-bold">Wasim Abu Salem</span> in <span className="text-emerald-400 font-bold">2015</span>!</p>
                </div>
            )}

            {/* Action buttons */}
            <div className="text-center">
                {isChecked && isCorrect ? (
                    <button
                        onClick={() => onComplete(true)}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-600/30"
                    >
                        Continue → 100 pts
                    </button>
                ) : (
                    <button
                        onClick={checkAnswer}
                        disabled={!allFilled}
                        className={`px-8 py-4 font-bold rounded-xl transition-all duration-200 ${
                            allFilled
                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 transform hover:scale-105 shadow-lg shadow-emerald-600/30'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        Check Answer
                    </button>
                )}
            </div>

            {/* Hint */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">💡 Click on a filled blank to remove the answer</p>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.3s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default FillBlankChallenge;

