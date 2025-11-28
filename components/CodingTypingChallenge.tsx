import React, { useState, useEffect, useRef } from 'react';

interface CodingTypingChallengeProps {
    onComplete: (cpm: number, attempts: number) => void;
    challengeTitle: string;
    codeText: string;
    minCpm: number;
}

const CodingTypingChallenge: React.FC<CodingTypingChallengeProps> = ({ onComplete, challengeTitle, codeText, minCpm }) => {
    const [userInput, setUserInput] = useState('');
    const [cpm, setCpm] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    const startTimeRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const codeLines = codeText.split('\n');

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                onComplete(cpm, attempts);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isComplete, onComplete, cpm, attempts]);
    
    const resetChallenge = () => {
        setAttempts(prev => prev + 1);
        setUserInput('');
        setCpm(0);
        setIsComplete(false);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        startTimeRef.current = null;
        inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isComplete) return;

        const { value } = e.target;
        
        if (!startTimeRef.current && value.length > 0) {
            startTimeRef.current = Date.now();
        }

        setUserInput(value);

        // Calculate current position in the target text
        let tempCharIndex = 0;
        let tempLineIndex = 0;
        let charCount = 0;

        for (let i = 0; i < value.length; i++) {
            if (value[i] === '\n') {
                tempLineIndex++;
                tempCharIndex = 0;
            } else {
                tempCharIndex++;
            }
            charCount++;
        }
        setCurrentLineIndex(tempLineIndex);
        setCurrentCharIndex(tempCharIndex);
        
        // Check for full completion
        if (value === codeText) {
            if (!startTimeRef.current) return;
            const endTime = Date.now();
            const elapsedTime = (endTime - startTimeRef.current) / 1000; // in seconds
            const finalCpm = Math.round((codeText.length / elapsedTime) * 60);
            setCpm(finalCpm);
            setIsComplete(true);
        }
    };
    
    const preventCheating = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
    };

    return (
        <>

            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
                <p className="text-gray-300 mb-1">Type the Python code below exactly as it appears (including indentation).</p>
                <p className="text-sm text-yellow-400 mb-6">Minimum target: {minCpm} CPM</p>

                <div className="p-4 bg-black/40 rounded-lg mb-6 text-left overflow-x-auto">
                    <pre className="text-lg font-mono tracking-wider whitespace-pre-wrap">
                        {codeLines.map((line, lineIdx) => (
                            <React.Fragment key={lineIdx}>
                                {line.split('').map((char, charIdx) => {
                                    const flatIndex = codeLines.slice(0, lineIdx).join('\n').length + lineIdx + charIdx;
                                    const isCurrentChar = lineIdx === currentLineIndex && charIdx === currentCharIndex;
                                    
                                    let colorClass = 'text-gray-400';
                                    if (lineIdx < currentLineIndex || (lineIdx === currentLineIndex && charIdx < currentCharIndex)) {
                                        const userChar = userInput[flatIndex + (lineIdx)]; // Adjust for newlines in userInput
                                        colorClass = userChar === char ? 'text-green-400' : 'text-red-500';
                                    }
                                    
                                    return (
                                        <span 
                                            key={`${lineIdx}-${charIdx}`} 
                                            className={colorClass} // removed highlight-char
                                            aria-current={isCurrentChar && !isComplete ? 'location' : undefined}
                                        >
                                            {char}
                                        </span>

                                    );
                                })}
                                {'\n'} {/* Explicit newline after each line */}
                            </React.Fragment>
                        ))}
                    </pre>
                </div>

                <textarea
                    ref={inputRef}
                    value={userInput}
                    onChange={handleInputChange}
                    onPaste={preventCheating}
                    onCopy={preventCheating}
                    onCut={preventCheating}
                    autoComplete="off"
                    disabled={isComplete}
                    rows={codeLines.length + 2} // Give some extra rows
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 font-mono text-lg tracking-wider resize-none"
                    spellCheck="false"
                    aria-label="Code typing input"
                />
                
                <div className="mt-6 text-center min-h-[80px] flex flex-col justify-center">
                    {isComplete && (
                        <>
                            <p className="text-4xl font-bold text-green-400">
                                {cpm} <span className="text-xl text-gray-300">CPM</span>
                            </p>
                            <p className="text-green-400 font-bold text-lg mt-2">Challenge Complete! Advancing...</p>
                        </>
                    )}
                    {!isComplete && (
                        <p className="text-gray-400">Correctly type the code to see your score.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CodingTypingChallenge;