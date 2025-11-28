
import React, { useState, useEffect, useRef } from 'react';
import { MATCHSTICK_PUZZLES } from '../challenges/content';

// --- Data & Types ---

type HeldStickState = {
    fromDigitIndex: number;
    fromSegmentIndex: number;
};

// --- Segment Definitions & Transformation Logic ---

// Segments: 0:top, 1:topLeft, 2:topRight, 3:middle, 4:btmLeft, 5:btmRight, 6:bottom, 7:plus_vertical
const SEGMENTS: Record<string, number[]> = {
    '0': [1, 1, 1, 0, 1, 1, 1],
    '1': [0, 0, 1, 0, 0, 1, 0],
    '2': [1, 0, 1, 1, 1, 0, 1],
    '3': [1, 0, 1, 1, 0, 1, 1],
    '4': [0, 1, 1, 1, 0, 1, 0],
    '5': [1, 1, 0, 1, 0, 1, 1],
    '6': [1, 1, 0, 1, 1, 1, 1],
    '7': [1, 0, 1, 0, 0, 1, 0],
    '8': [1, 1, 1, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1],
    '+': [0, 0, 0, 1, 0, 0, 0, 1],
    '-': [0, 0, 0, 1, 0, 0, 0, 0],
};

// Updated positioning for clearer numbers (wider container w-20)
const SEGMENT_POSITIONS: Record<string, string> = {
    // Digits
    '0': "w-14 h-2 absolute top-0 left-1/2 -translate-x-1/2 rounded-full",       // Top
    '1': "w-2 h-14 absolute top-2 left-0 rounded-full",                          // Top Left
    '2': "w-2 h-14 absolute top-2 right-0 rounded-full",                         // Top Right
    '3': "w-14 h-2 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full", // Middle
    '4': "w-2 h-14 absolute bottom-2 left-0 rounded-full",                       // Btm Left
    '5': "w-2 h-14 absolute bottom-2 right-0 rounded-full",                      // Btm Right
    '6': "w-14 h-2 absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full",    // Bottom
    '7': "w-2 h-14 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full", // Plus Vertical
    // Equals
    'eq-top': "w-14 h-2 absolute top-[35%] left-1/2 -translate-x-1/2 rounded-full",
    'eq-btm': "w-14 h-2 absolute top-[65%] left-1/2 -translate-x-1/2 rounded-full",
};

const SEGMENT_TO_CHAR_MAP = new Map<string, string>();
(() => {
    for (const char in SEGMENTS) {
        const segments = SEGMENTS[char];
        const normalizedSegments = Array(8).fill(0);
        segments.forEach((s, i) => normalizedSegments[i] = s);
        SEGMENT_TO_CHAR_MAP.set(JSON.stringify(normalizedSegments), char);
    }
})();

const findCharBySegments = (segments: number[]): string | null => {
    const normalized = Array(8).fill(0);
    segments.forEach((s, i) => normalized[i] = s);
    return SEGMENT_TO_CHAR_MAP.get(JSON.stringify(normalized)) || null;
}

// --- Components ---

const Matchstick: React.FC<{ className?: string; ghost?: boolean }> = ({ className, ghost }) => (
    <div className={`bg-yellow-300 shadow-md shadow-black/40 transition-all duration-200 ${ghost ? 'opacity-30' : 'opacity-100'} ${className}`}></div>
);

const MatchstickDisplay: React.FC<{
    isEqualsSign: boolean;
    segments: number[];
    digitIndex: number;
    onStickPickup: (digitIndex: number, segmentIndex: number) => void;
    onSlotPlacement: (digitIndex: number, segmentIndex: number) => void;
    heldStick: HeldStickState | null;
    isFrozen: boolean;
    hasMoved: boolean;
}> = ({ isEqualsSign, segments, digitIndex, onStickPickup, onSlotPlacement, heldStick, isFrozen, hasMoved }) => {
    
    if (isEqualsSign) {
        return (
            <div className="relative w-20 h-36 flex items-center justify-center mx-1">
                <Matchstick className={SEGMENT_POSITIONS['eq-top']} />
                <Matchstick className={SEGMENT_POSITIONS['eq-btm']} />
            </div>
        );
    }

    if (!segments) return <div className="relative w-20 h-36 mx-1" />;

    return (
        <div className="relative w-20 h-36 mx-1 bg-black/10 rounded-lg border border-white/5">
            {Array.from({ length: 8 }).map((_, index) => {
                const isVisible = segments[index] === 1;
                const positionClass = SEGMENT_POSITIONS[index];
                if (!positionClass) return null;

                const isHeld = heldStick?.fromDigitIndex === digitIndex && heldStick?.fromSegmentIndex === index;
                
                // Render visible stick
                if (isVisible && !isHeld) {
                    const canPickup = !isFrozen && !heldStick && !hasMoved;
                    return (
                        <div key={`stick-${digitIndex}-${index}`} className="absolute inset-0">
                            <Matchstick className={positionClass} />
                            {canPickup && (
                                <div
                                    title="Pick up"
                                    onClick={(e) => { e.stopPropagation(); onStickPickup(digitIndex, index); }}
                                    className={`${positionClass} cursor-grab z-20 hover:bg-red-500/40 rounded-full transition-colors`}
                                />
                            )}
                            {!canPickup && !isFrozen && !hasMoved && (
                                 <div className={`${positionClass} cursor-not-allowed z-10 opacity-0`} />
                            )}
                        </div>
                    );
                }
                
                // Render ghost slot for placement
                if (!isVisible && !!heldStick && !isFrozen) {
                     return (
                        <div key={`slot-${digitIndex}-${index}`} className="absolute inset-0">
                             <div className={`${positionClass} bg-white/5 rounded-full`}></div>
                             <div
                                title="Place here"
                                onClick={(e) => { e.stopPropagation(); onSlotPlacement(digitIndex, index); }}
                                className={`${positionClass} cursor-crosshair z-20 hover:bg-green-500/40 rounded-full transition-colors`}
                            />
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};


const MatchstickChallenge: React.FC<{ onComplete: (time: number | null) => void, challengeTitle: string }> = ({ onComplete, challengeTitle }) => {
    const [puzzle, setPuzzle] = useState(MATCHSTICK_PUZZLES[0]);
    const [boardSegments, setBoardSegments] = useState<number[][]>([]);
    const [heldStick, setHeldStick] = useState<HeldStickState | null>(null);
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hasMoved, setHasMoved] = useState(false);
    
    const startTimeRef = useRef<number | null>(null);
    
    const initializeBoard = (p: typeof MATCHSTICK_PUZZLES[0]) => {
        const initialSegments = p.initialState.map(char => {
            if (char === '=') return []; 
            const layout = SEGMENTS[char] || [];
            const normalized = Array(8).fill(0); 
            layout.forEach((s, i) => normalized[i] = s);
            return normalized;
        });
        setBoardSegments(initialSegments);
        startTimeRef.current = Date.now();
        setHasMoved(false);
        setHeldStick(null);
    };

    useEffect(() => {
        const randomPuzzle = MATCHSTICK_PUZZLES[Math.floor(Math.random() * MATCHSTICK_PUZZLES.length)];
        setPuzzle(randomPuzzle);
        initializeBoard(randomPuzzle);
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePos({ x: event.clientX, y: event.clientY });
        };
        if (heldStick) {
            window.addEventListener('mousemove', handleMouseMove);
        }
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [heldStick]);

    const handleStickPickup = (digitIndex: number, segmentIndex: number) => {
        if (heldStick || submittedCorrectly || hasMoved) return; 
        setHeldStick({ fromDigitIndex: digitIndex, fromSegmentIndex: segmentIndex });
        setError(null);
    };

    const handleSlotPlacement = (digitIndex: number, segmentIndex: number) => {
        if (!heldStick || submittedCorrectly) return; 

        const { fromDigitIndex, fromSegmentIndex } = heldStick;
        
        // Check if placed back in the same spot
        if(fromDigitIndex === digitIndex && fromSegmentIndex === segmentIndex) {
            setHeldStick(null);
            return; // No move counted
        }

        const newSegments = boardSegments.map(s => [...s]);
        
        // Remove from old
        if(newSegments[fromDigitIndex]) newSegments[fromDigitIndex][fromSegmentIndex] = 0;
        
        // Add to new
        if(newSegments[digitIndex]) newSegments[digitIndex][segmentIndex] = 1;
        
        setBoardSegments(newSegments);
        setHeldStick(null);
        setHasMoved(true); // LOCK THE BOARD
        setError(null);
    };

    const resetMove = () => {
        initializeBoard(puzzle);
        setError(null);
        setSubmittedCorrectly(false);
    }

    const handleSubmit = () => {
        if (submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);
        
        const derivedBoardState = boardSegments.map((segments, index) => {
            if (puzzle.initialState[index] === '=') return '=';
            return findCharBySegments(segments);
        });

        if (derivedBoardState.some(char => char === null)) {
            onComplete(null);
            setError("Invalid number shape detected. Reset and try again.");
            return;
        }

        const derivedString = JSON.stringify(derivedBoardState);
        const isCorrect = derivedString === JSON.stringify(puzzle.correctState) ||
            (puzzle.alternateCorrectStates?.some(alt => derivedString === JSON.stringify(alt)) ?? false);

        if (isCorrect) {
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
            setSubmittedCorrectly(true);
            setError(null);
        } else {
            onComplete(null);
            setError("Incorrect equation. Click Reset to try again.");
        }
    };
    
    return (
         <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center min-h-[600px] flex flex-col justify-center">
            {heldStick && (
                <div
                    style={{
                        position: 'fixed',
                        top: mousePos.y,
                        left: mousePos.x,
                        transform: 'translate(-50%, -100%) rotate(-10deg)', // Offset to be above cursor
                        pointerEvents: 'none',
                        zIndex: 9999,
                    }}
                >
                    <Matchstick className="w-2 h-14 shadow-2xl ring-2 ring-white/50" />
                </div>
            )}
            
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-2 text-lg">{puzzle.question}</p>
            <p className="text-gray-400 text-sm mb-8 italic">Rule: You can only move ONE matchstick per attempt.</p>

            <div className="flex justify-center items-center gap-1 md:gap-2 my-8 scale-90 md:scale-100 select-none">
                {boardSegments.map((segments, index) => (
                    <MatchstickDisplay
                        key={`${puzzle.id}-digit-${index}`}
                        isEqualsSign={puzzle.initialState[index] === '='}
                        segments={segments}
                        digitIndex={index}
                        onStickPickup={handleStickPickup}
                        onSlotPlacement={handleSlotPlacement}
                        heldStick={heldStick}
                        isFrozen={submittedCorrectly}
                        hasMoved={hasMoved}
                    />
                ))}
            </div>
            
            <div className="min-h-[1.5rem] mb-6">
                {heldStick && <p className="text-yellow-300 animate-pulse">Place the stick in an empty slot...</p>}
                {hasMoved && !submittedCorrectly && <p className="text-blue-300 font-bold">Move made. Submit or Reset.</p>}
            </div>

            {!submittedCorrectly && (
                 <div className="flex justify-center gap-4">
                    <button 
                        onClick={resetMove} 
                        disabled={!!heldStick}
                        className="px-8 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Reset
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!hasMoved || !!heldStick || hasSubmitted}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600/50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Answer
                    </button>
                </div>
            )}
           
            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Puzzle solved!</p>
                )}
            </div>
        </div>
    );
};

export default MatchstickChallenge;
