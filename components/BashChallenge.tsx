import React, { useState } from 'react';

interface BashChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

interface Stage {
    id: number;
    title: string;
    description: string;
    hint: string;
    validate: (input: string, context: StageContext) => { valid: boolean; message: string; extract?: string };
}

interface StageContext {
    folderName?: string;
    fileName?: string;
}

const HINT_COST = 5;

const BashChallenge: React.FC<BashChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [currentStage, setCurrentStage] = useState(0);
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set()); // Track which stages used hints
    const [isComplete, setIsComplete] = useState(false);
    const [context, setContext] = useState<StageContext>({});
    const [terminalHistory, setTerminalHistory] = useState<string[]>([
        '$ Welcome to the Bash Challenge!',
        '$ Complete each task using bash commands.',
        ''
    ]);

    const stages: Stage[] = [
        {
            id: 1,
            title: 'Stage 1: Create a Folder',
            description: 'Create a new folder using a bash command. You can name it anything you like!',
            hint: 'Use: mkdir',
            validate: (input, ctx) => {
                const trimmed = input.trim();
                const match = trimmed.match(/^mkdir\s+([a-zA-Z0-9_-]+)$/);
                if (match) {
                    return { 
                        valid: true, 
                        message: `Folder "${match[1]}" created successfully!`,
                        extract: match[1]
                    };
                }
                if (trimmed.startsWith('mkdir')) {
                    return { valid: false, message: 'Check your folder name format.' };
                }
                return { valid: false, message: 'That command won\'t create a folder. Try again!' };
            }
        },
        {
            id: 2,
            title: 'Stage 2: Create a Text File',
            description: `Create a new text file (.txt) inside your folder "${context.folderName || '<folder>'}" without changing the directory!`,
            hint: 'Use: touch',
            validate: (input, ctx) => {
                const trimmed = input.trim();
                const pattern = new RegExp(`^touch\\s+${ctx.folderName}\\/([a-zA-Z0-9_-]+\\.txt)$`);
                const match = trimmed.match(pattern);
                if (match) {
                    return { 
                        valid: true, 
                        message: `File "${match[1]}" created in ${ctx.folderName}!`,
                        extract: match[1]
                    };
                }
                if (trimmed.startsWith('cd')) {
                    return { valid: false, message: 'You cannot change directories! Create the file from here.' };
                }
                if (trimmed.startsWith('touch')) {
                    if (!trimmed.endsWith('.txt')) {
                        return { valid: false, message: 'Remember: the file must be a text file (.txt).' };
                    }
                    return { valid: false, message: 'Check your path and file name format.' };
                }
                return { valid: false, message: 'That command won\'t create a file. Try again!' };
            }
        },
        {
            id: 3,
            title: 'Stage 3: Write to the File',
            description: `Write the text "I love Loop!" into the file you created.`,
            hint: 'Use: echo',
            validate: (input, ctx) => {
                const trimmed = input.trim();
                // Match various valid formats for echo
                const patterns = [
                    new RegExp(`^echo\\s+['"]?I love Loop!?['"]?\\s*>\\s*${ctx.folderName}\\/${ctx.fileName}$`, 'i'),
                    new RegExp(`^echo\\s+['"]I love Loop!['"]\\s*>\\s*${ctx.folderName}\\/${ctx.fileName}$`, 'i'),
                ];
                
                for (const pattern of patterns) {
                    if (pattern.test(trimmed)) {
                        return { 
                            valid: true, 
                            message: `Successfully wrote "I love Loop!" to ${ctx.folderName}/${ctx.fileName}!`
                        };
                    }
                }
                
                if (trimmed.startsWith('echo')) {
                    if (!trimmed.includes('>')) {
                        return { valid: false, message: 'How do you redirect output to a file in bash?' };
                    }
                    if (!trimmed.toLowerCase().includes('i love loop')) {
                        return { valid: false, message: 'Check what text you\'re writing - it should say "I love Loop!"' };
                    }
                    return { valid: false, message: 'Almost there! Check your file path.' };
                }
                return { valid: false, message: 'That command won\'t write to a file. Try again!' };
            }
        }
    ];

    const calculateScore = () => {
        return 100 - (hintsUsed.size * HINT_COST);
    };

    const handleShowHint = () => {
        if (!showHint && !hintsUsed.has(currentStage)) {
            // First time showing hint for this stage - deduct points
            setHintsUsed(prev => new Set([...prev, currentStage]));
        }
        setShowHint(!showHint);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isComplete) return;

        const stage = stages[currentStage];
        const result = stage.validate(input, context);

        // Add command to terminal history
        setTerminalHistory(prev => [...prev, `$ ${input}`]);

        if (result.valid) {
            setTerminalHistory(prev => [...prev, `✓ ${result.message}`, '']);
            setFeedback({ type: 'success', message: result.message });
            
            // Update context based on stage
            if (currentStage === 0 && result.extract) {
                setContext(prev => ({ ...prev, folderName: result.extract }));
            } else if (currentStage === 1 && result.extract) {
                setContext(prev => ({ ...prev, fileName: result.extract }));
            }

            // Move to next stage or complete
            setTimeout(() => {
                if (currentStage < stages.length - 1) {
                    setCurrentStage(prev => prev + 1);
                    setInput('');
                    setFeedback(null);
                    setShowHint(false);
                } else {
                    setIsComplete(true);
                }
            }, 1000);
        } else {
            setTerminalHistory(prev => [...prev, `✗ Error: ${result.message}`, '']);
            setFeedback({ type: 'error', message: result.message });
        }
        
        setInput('');
    };

    const currentStageData = stages[currentStage];
    const finalScore = calculateScore();

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-4">
                Learn basic Bash commands! Complete all 3 stages to finish the challenge.
            </p>

            {/* Progress indicator */}
            <div className="flex justify-center gap-2 mb-6">
                {stages.map((stage, index) => (
                    <div
                        key={stage.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            isComplete || index < currentStage
                                ? 'bg-green-500 text-white'
                                : index === currentStage
                                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                                : 'bg-gray-700 text-gray-400'
                        }`}
                    >
                        {isComplete || index < currentStage ? '✓' : index + 1}
                    </div>
                ))}
            </div>

            {!isComplete ? (
                <>
                    {/* Score display */}
                    <div className="mb-4">
                        <span className="text-gray-400 text-sm">Potential Score: </span>
                        <span className="text-white font-bold">{calculateScore()}</span>
                    </div>

                    {/* Current stage info */}
                    <div className="bg-black/40 rounded-lg p-4 mb-4 text-left">
                        <h3 className="text-lg font-bold text-yellow-400 mb-2">{currentStageData.title}</h3>
                        <p className="text-gray-300">{currentStageData.description}</p>
                        
                        <button
                            onClick={handleShowHint}
                            className={`mt-3 text-sm px-3 py-1 rounded transition-colors ${
                                hintsUsed.has(currentStage)
                                    ? 'text-yellow-400 hover:text-yellow-300'
                                    : 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30'
                            }`}
                        >
                            {showHint ? 'Hide Hint' : hintsUsed.has(currentStage) ? 'Show Hint' : `Show Hint (-${HINT_COST} points)`}
                        </button>
                        
                        {showHint && (
                            <p className="mt-2 text-sm text-yellow-300 font-mono bg-black/40 p-2 rounded">
                                💡 {currentStageData.hint}
                            </p>
                        )}
                    </div>

                    {/* Terminal */}
                    <div className="w-full max-w-2xl mx-auto bg-[#1a1a2e] rounded-lg shadow-lg overflow-hidden border border-white/10">
                        <div className="flex items-center px-4 py-2 bg-gray-800">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span className="text-gray-400 text-sm ml-2">bash</span>
                        </div>
                        
                        {/* Terminal history */}
                        <div className="p-4 h-40 overflow-y-auto text-left font-mono text-sm">
                            {terminalHistory.map((line, index) => (
                                <p 
                                    key={index} 
                                    className={`${
                                        line.startsWith('✓') ? 'text-green-400' : 
                                        line.startsWith('✗') ? 'text-red-400' : 
                                        'text-gray-300'
                                    }`}
                                >
                                    {line || '\u00A0'}
                                </p>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="border-t border-white/10">
                            <div className="flex items-center p-2 bg-black/40">
                                <span className="text-green-400 font-mono mr-2">$</span>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your command here..."
                                    className="flex-1 bg-transparent text-white font-mono focus:outline-none placeholder-gray-500"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="px-4 py-1 bg-blue-600 text-white text-sm font-bold rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    Run
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Feedback */}
                    {feedback && (
                        <p className={`mt-4 font-bold ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {feedback.message}
                        </p>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-3xl font-bold text-green-400">Challenge Complete!</p>
                    <p className="text-gray-300">
                        You successfully created a folder, added a file, and wrote "I love Loop!" to it!
                    </p>
                    <p className="text-xl text-white mt-2">
                        Score: <span className="text-green-400 font-bold">{finalScore}</span>
                    </p>
                    <div className="bg-black/40 rounded-lg p-4 font-mono text-left text-sm text-gray-300 mt-4">
                        <p className="text-green-400">$ cat {context.folderName}/{context.fileName}</p>
                        <p className="text-white">I love Loop!</p>
                    </div>
                    <button
                        onClick={() => onComplete(finalScore)}
                        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Next Challenge
                    </button>
                </div>
            )}
        </div>
    );
};

export default BashChallenge;
