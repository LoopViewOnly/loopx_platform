import React, { useState, useEffect, useCallback } from 'react';
import logoImage from '../assets/Teach_Learn_Benefit.png';

interface FixTheLogoChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

// Grid configuration - 3x3 puzzle
const GRID_SIZE = 3;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

interface PuzzlePiece {
    id: number;
    currentPosition: number;
    correctPosition: number;
}

const FixTheLogoChallenge: React.FC<FixTheLogoChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
    const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Initialize shuffled puzzle pieces
    const initializePuzzle = useCallback(() => {
        const initialPieces: PuzzlePiece[] = [];
        
        // Create array of positions [0, 1, 2, ..., 8]
        const positions = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
        
        // Shuffle positions using Fisher-Yates algorithm
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [positions[i], positions[j]] = [positions[j], positions[i]];
        }

        // Create puzzle pieces with shuffled positions
        for (let i = 0; i < TOTAL_PIECES; i++) {
            initialPieces.push({
                id: i,
                currentPosition: positions[i],
                correctPosition: i
            });
        }

        setPieces(initialPieces);
        setMoves(0);
        setIsComplete(false);
        setStartTime(Date.now());
        setGameStarted(true);
    }, []);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (gameStarted && !isComplete && startTime) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameStarted, isComplete, startTime]);

    // Check if puzzle is solved
    useEffect(() => {
        if (pieces.length > 0 && gameStarted) {
            const isSolved = pieces.every(piece => piece.currentPosition === piece.correctPosition);
            if (isSolved) {
                setIsComplete(true);
            }
        }
    }, [pieces, gameStarted]);

    const handleDragStart = (pieceId: number) => {
        setDraggedPiece(pieceId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetPosition: number) => {
        if (draggedPiece === null) return;

        const draggedPieceData = pieces.find(p => p.id === draggedPiece);
        if (!draggedPieceData) return;

        const targetPiece = pieces.find(p => p.currentPosition === targetPosition);
        if (!targetPiece) return;

        // Swap positions
        setPieces(prevPieces => 
            prevPieces.map(piece => {
                if (piece.id === draggedPiece) {
                    return { ...piece, currentPosition: targetPosition };
                }
                if (piece.id === targetPiece.id) {
                    return { ...piece, currentPosition: draggedPieceData.currentPosition };
                }
                return piece;
            })
        );

        setMoves(prev => prev + 1);
        setDraggedPiece(null);
    };

    // Touch event handlers for mobile support
    const handleTouchStart = (pieceId: number) => {
        setDraggedPiece(pieceId);
    };

    const handleTouchEnd = (targetPosition: number) => {
        if (draggedPiece !== null) {
            handleDrop(targetPosition);
        }
    };

    // Calculate score based on moves and time
    const calculateScore = () => {
        const baseScore = 100;
        const movesPenalty = Math.min(moves * 2, 40); // Max 40 points deduction for moves
        const timePenalty = Math.min(Math.floor(elapsedTime / 10) * 5, 30); // Max 30 points for time
        return Math.max(30, baseScore - movesPenalty - timePenalty);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get piece at a specific position
    const getPieceAtPosition = (position: number) => {
        return pieces.find(p => p.currentPosition === position);
    };

    // Calculate background position for a piece based on its correct position
    const getBackgroundPosition = (correctPosition: number) => {
        const row = Math.floor(correctPosition / GRID_SIZE);
        const col = correctPosition % GRID_SIZE;
        const xPercent = (col / (GRID_SIZE - 1)) * 100;
        const yPercent = (row / (GRID_SIZE - 1)) * 100;
        return `${xPercent}% ${yPercent}%`;
    };

    const pieceSize = 100; // Size of each piece in pixels

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">
                The LoopX logo has been scrambled! Drag and drop the pieces to reassemble it.
            </p>

            {!gameStarted ? (
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <img 
                            src={logoImage} 
                            alt="LoopX Logo Preview" 
                            className="w-72 h-72 object-contain rounded-lg border border-white/20"
                        />
                        <p className="text-sm text-gray-400 mt-2">This is the completed logo</p>
                    </div>
                    <button
                        onClick={initializePuzzle}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Start Puzzle
                    </button>
                </div>
            ) : isComplete ? (
                <div className="flex flex-col items-center gap-4">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-3xl font-bold text-green-400">Logo Restored!</p>
                    <div className="flex gap-8 my-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">Moves</p>
                            <p className="text-2xl font-bold text-blue-300">{moves}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">Time</p>
                            <p className="text-2xl font-bold text-blue-300">{formatTime(elapsedTime)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">Score</p>
                            <p className="text-2xl font-bold text-green-400">{calculateScore()}</p>
                        </div>
                    </div>
                    <img 
                        src={logoImage} 
                        alt="Completed Logo" 
                        className="w-72 h-72 object-contain rounded-lg border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    />
                    <button
                        onClick={() => onComplete(calculateScore())}
                        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Next Challenge
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6">
                    {/* Stats bar */}
                    <div className="flex justify-between items-center w-full max-w-md bg-black/40 rounded-lg p-4">
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase">Moves</p>
                            <p className="text-xl font-bold text-white">{moves}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase">Time</p>
                            <p className="text-xl font-bold text-white">{formatTime(elapsedTime)}</p>
                        </div>
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                showHint 
                                    ? 'bg-yellow-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                    </div>

                    {/* Hint preview */}
                    {showHint && (
                        <div className="mb-2">
                            <img 
                                src={logoImage} 
                                alt="Hint" 
                                className="w-32 h-32 object-contain rounded-lg border border-yellow-500/50 opacity-80"
                            />
                            <p className="text-xs text-yellow-400 mt-1">Reference image</p>
                        </div>
                    )}

                    {/* Puzzle grid */}
                    <div 
                        className="grid gap-1 p-2 bg-black/60 rounded-xl border border-white/20"
                        style={{ 
                            gridTemplateColumns: `repeat(${GRID_SIZE}, ${pieceSize}px)`,
                            gridTemplateRows: `repeat(${GRID_SIZE}, ${pieceSize}px)`
                        }}
                    >
                        {Array.from({ length: TOTAL_PIECES }).map((_, position) => {
                            const piece = getPieceAtPosition(position);
                            if (!piece) return null;

                            const isCorrect = piece.currentPosition === piece.correctPosition;

                            return (
                                <div
                                    key={position}
                                    className={`
                                        relative cursor-grab active:cursor-grabbing
                                        rounded-md overflow-hidden
                                        transition-all duration-200
                                        ${draggedPiece === piece.id ? 'scale-105 z-10 ring-2 ring-blue-400' : ''}
                                        ${isCorrect ? 'ring-1 ring-green-500/50' : ''}
                                        hover:brightness-110
                                    `}
                                    style={{
                                        width: pieceSize,
                                        height: pieceSize,
                                    }}
                                    draggable
                                    onDragStart={() => handleDragStart(piece.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={() => handleDrop(position)}
                                    onTouchStart={() => handleTouchStart(piece.id)}
                                    onTouchEnd={() => handleTouchEnd(position)}
                                >
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url(${logoImage})`,
                                            backgroundSize: `${GRID_SIZE * 100}%`,
                                            backgroundPosition: getBackgroundPosition(piece.correctPosition),
                                        }}
                                    />
                                    {/* Position indicator for debugging (can be removed) */}
                                    {isCorrect && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <p className="text-sm text-gray-400">
                        Drag pieces to swap their positions
                    </p>

                    {/* Reset button */}
                    <button
                        onClick={initializePuzzle}
                        className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm"
                    >
                        Shuffle Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default FixTheLogoChallenge;
