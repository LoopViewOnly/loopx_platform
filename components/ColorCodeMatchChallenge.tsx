import React, { useState, useMemo, useEffect } from 'react';

interface ColorCodeMatchChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const COLOR_PAIRS = [
    { hex: '#3264a8', rgb: '50, 100, 168' },
    { hex: '#a86132', rgb: '168, 97, 50' },
    { hex: '#264703', rgb: '38, 71, 3' },
    { hex: '#ab225b', rgb: '171, 34, 91' },
    { hex: '#3eb5ab', rgb: '62, 181, 171' },
];

const TIME_LIMIT = 100;

const ColorCodeMatchChallenge: React.FC<ColorCodeMatchChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [selectedHex, setSelectedHex] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
    const [wrongAttempts, setWrongAttempts] = useState(0);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
    const [gameStarted, setGameStarted] = useState(false);

    // Shuffle RGB values for display
    const shuffledRGBs = useMemo(() => {
        return [...COLOR_PAIRS]
            .map(p => ({ rgb: p.rgb, hex: p.hex }))
            .sort(() => Math.random() - 0.5);
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!gameStarted || isComplete) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsComplete(true);
                    const score = Math.max(0, Math.floor((matchedPairs.size / COLOR_PAIRS.length) * 50) - (wrongAttempts * 5));
                    setTimeout(() => {
                        setFeedback({ message: `⏰ Time's up! Score: ${score}`, color: 'text-red-400' });
                        onComplete(score);
                    }, 500);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, isComplete, matchedPairs.size, wrongAttempts, onComplete]);

    const handleHexClick = (hex: string) => {
        if (isComplete || matchedPairs.has(hex)) return;
        setSelectedHex(hex);
        setFeedback(null);
    };

    const handleRGBClick = (rgb: string, correctHex: string) => {
        if (isComplete || !selectedHex || matchedPairs.has(correctHex)) return;

        if (selectedHex === correctHex) {
            // Correct match!
            const newMatched = new Set(matchedPairs);
            newMatched.add(correctHex);
            setMatchedPairs(newMatched);
            setFeedback({ message: `✅ ${correctHex} = RGB(${rgb})`, color: 'text-green-400' });
            setSelectedHex(null);

            // Check if all matched
            if (newMatched.size === COLOR_PAIRS.length) {
                setIsComplete(true);
                const score = Math.max(0, 100 - (wrongAttempts * 5));
                setTimeout(() => {
                    setFeedback({ message: `🎉 All matched! Score: ${score}`, color: 'text-green-400' });
                    onComplete(score);
                }, 500);
            }
        } else {
            // Wrong match
            setWrongAttempts(prev => prev + 1);
            setFeedback({ message: '❌ Wrong match! Try again.', color: 'text-red-400' });
            setSelectedHex(null);
        }
    };

    const getHexStyle = (hex: string) => {
        if (matchedPairs.has(hex)) {
            return 'bg-green-600/30 border-green-500 cursor-default opacity-60';
        }
        if (selectedHex === hex) {
            return 'border-white ring-2 ring-white scale-105';
        }
        return 'border-white/30 hover:border-white hover:scale-105 cursor-pointer';
    };

    const getRGBStyle = (correctHex: string) => {
        if (matchedPairs.has(correctHex)) {
            return 'bg-green-600/30 border-green-500 cursor-default opacity-60';
        }
        if (!selectedHex) {
            return 'border-white/30 text-gray-500 cursor-not-allowed';
        }
        return 'border-white/30 hover:border-purple-400 hover:bg-purple-600/20 cursor-pointer';
    };

    const getTimeColor = () => {
        if (timeLeft <= 15) return 'text-red-500';
        if (timeLeft <= 30) return 'text-yellow-400';
        return 'text-green-400';
    };

    const startGame = () => {
        setGameStarted(true);
    };

    if (!gameStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
                
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="text-6xl">🎨</div>
                    <p className="text-xl text-gray-300 max-w-md">
                        Match each <span className="text-blue-400 font-bold">HEX color code</span> with its corresponding <span className="text-purple-400 font-bold">RGB value</span>!
                    </p>
                    
                    <p className="text-yellow-400 font-bold">
                        ⏱️ You have {TIME_LIMIT} seconds!
                    </p>

                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Start Matching! 🎨
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>

            {/* Instructions */}
            <div className="mb-4 p-3 bg-black/20 rounded-lg border border-white/10 max-w-xl mx-auto">
                <p className="text-gray-300 text-sm">
                    Match each <strong className="text-blue-400">HEX code</strong> with its <strong className="text-purple-400">RGB value</strong>
                </p>
            </div>

            {/* Progress & Timer */}
            <div className="mb-6 flex justify-center gap-8">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Matched</p>
                    <p className="text-2xl font-bold text-green-400">{matchedPairs.size} / {COLOR_PAIRS.length}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Time Left</p>
                    <p className={`text-2xl font-bold ${getTimeColor()} ${timeLeft <= 15 ? 'animate-pulse' : ''}`}>
                        {timeLeft}s
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Wrong</p>
                    <p className="text-2xl font-bold text-red-400">{wrongAttempts}</p>
                </div>
            </div>

            {/* Matching Game Grid */}
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-6 max-w-4xl mx-auto">
                {/* HEX Codes Column */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">HEX Codes</h3>
                    <div className="flex flex-col gap-3">
                        {COLOR_PAIRS.map((pair) => (
                            <button
                                key={pair.hex}
                                onClick={() => handleHexClick(pair.hex)}
                                disabled={matchedPairs.has(pair.hex) || isComplete}
                                className={`px-6 py-3 rounded-lg border-2 font-mono text-lg font-bold transition-all duration-200 ${getHexStyle(pair.hex)}`}
                            >
                                <span className="text-white">{pair.hex}</span>
                                {matchedPairs.has(pair.hex) && <span className="ml-2 text-green-400">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Arrow indicator */}
                <div className="hidden md:flex items-center justify-center text-4xl text-gray-500">
                    →
                </div>

                {/* RGB Values Column */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-purple-400 mb-3">RGB Values</h3>
                    <div className="flex flex-col gap-3">
                        {shuffledRGBs.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleRGBClick(item.rgb, item.hex)}
                                disabled={matchedPairs.has(item.hex) || isComplete || !selectedHex}
                                className={`px-6 py-3 rounded-lg border-2 text-lg font-medium transition-all duration-200 ${getRGBStyle(item.hex)}`}
                            >
                                <span className="font-mono text-white">RGB({item.rgb})</span>
                                {matchedPairs.has(item.hex) && <span className="ml-2 text-green-400">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
            </div>

            {/* Hint */}
            {!selectedHex && !isComplete && matchedPairs.size === 0 && (
                <p className="text-gray-500 text-sm">
                    👆 Start by clicking a HEX code on the left
                </p>
            )}
        </div>
    );
};

export default ColorCodeMatchChallenge;

