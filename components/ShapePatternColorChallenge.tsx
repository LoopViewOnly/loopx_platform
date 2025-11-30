import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SHAPE_PATTERN_COLOR_CHALLENGE } from '../challenges/content';

interface ShapePatternColorChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

type ObjectItem = {
    id: string;
    shape: string;
    pattern: string;
    color: string;
    matchesTarget?: string;
};

type PlacedItem = {
    targetId: string;
    objectId: string | null;
};

const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// SVG patterns for the shapes
const DotPattern = ({ id }: { id: string }) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="10" height="10">
        <circle cx="5" cy="5" r="2" fill="currentColor" opacity="0.7" />
    </pattern>
);

const StripePattern = ({ id }: { id: string }) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    </pattern>
);

const XPattern = ({ id }: { id: string }) => (
    <pattern id={id} patternUnits="userSpaceOnUse" width="12" height="12">
        <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
        <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
    </pattern>
);

// Shape components
const ShapeIcon: React.FC<{ object: ObjectItem; size?: number; uniqueId?: string }> = ({ object, size = 60, uniqueId = '' }) => {
    const colorMap: Record<string, string> = {
        green: '#22c55e',
        blue: '#3b82f6',
        red: '#ef4444',
        purple: '#a855f7',
        orange: '#f97316',
        yellow: '#eab308',
        pink: '#ec4899',
    };
    const fillColor = colorMap[object.color] || '#888';
    const patternId = `${object.pattern}-${uniqueId}`;

    return (
        <svg width={size} height={size} viewBox="0 0 60 60" className="drop-shadow-lg">
            <defs>
                <DotPattern id={`dots-${uniqueId}`} />
                <StripePattern id={`stripes-${uniqueId}`} />
                <XPattern id={`xs-${uniqueId}`} />
            </defs>
            {object.shape === 'triangle' && (
                <>
                    <polygon points="30,5 55,55 5,55" fill={fillColor} stroke={fillColor} strokeWidth="2" />
                    <polygon points="30,5 55,55 5,55" fill={`url(#${patternId})`} style={{ color: 'white' }} />
                </>
            )}
            {object.shape === 'square' && (
                <>
                    <rect x="5" y="5" width="50" height="50" fill={fillColor} stroke={fillColor} strokeWidth="2" rx="4" />
                    <rect x="5" y="5" width="50" height="50" fill={`url(#${patternId})`} style={{ color: 'white' }} rx="4" />
                </>
            )}
            {object.shape === 'circle' && (
                <>
                    <circle cx="30" cy="30" r="25" fill={fillColor} stroke={fillColor} strokeWidth="2" />
                    <circle cx="30" cy="30" r="25" fill={`url(#${patternId})`} style={{ color: 'white' }} />
                </>
            )}
        </svg>
    );
};

const ShapePatternColorChallenge: React.FC<ShapePatternColorChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [currentStage, setCurrentStage] = useState(0);
    const [shuffledObjects, setShuffledObjects] = useState<ObjectItem[]>([]);
    const [placements, setPlacements] = useState<PlacedItem[]>([]);
    const [availableObjects, setAvailableObjects] = useState<string[]>([]);
    const [draggedObjectId, setDraggedObjectId] = useState<string | null>(null);
    const [totalScore, setTotalScore] = useState(0);
    const [feedback, setFeedback] = useState<{ targetId: string; correct: boolean }[]>([]);
    const [isStageComplete, setIsStageComplete] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [stageMessage, setStageMessage] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(SHAPE_PATTERN_COLOR_CHALLENGE.timePerStage);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const targets = SHAPE_PATTERN_COLOR_CHALLENGE.targets as ObjectItem[];
    const stage = SHAPE_PATTERN_COLOR_CHALLENGE.stages[currentStage];

    const initializeStage = useCallback(() => {
        const stageObjects = stage.objects as ObjectItem[];
        const shuffled = shuffle([...stageObjects]);
        setShuffledObjects(shuffled);
        setAvailableObjects(shuffled.map(o => o.id));
        setPlacements(targets.map(t => ({ targetId: t.id, objectId: null })));
        setFeedback([]);
        setIsStageComplete(false);
        setStageMessage(null);
        setTimeLeft(SHAPE_PATTERN_COLOR_CHALLENGE.timePerStage);
    }, [stage, targets]);

    useEffect(() => {
        initializeStage();
    }, [currentStage, initializeStage]);

    // Timer effect
    useEffect(() => {
        if (!hasStarted || isStageComplete || isComplete) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up - auto submit
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [hasStarted, isStageComplete, isComplete, currentStage]);

    // Auto-submit when timer hits 0
    useEffect(() => {
        if (timeLeft === 0 && !isStageComplete && !isComplete) {
            handleSubmitStage();
        }
    }, [timeLeft, isStageComplete, isComplete]);

    const handleDragStart = (objectId: string) => {
        if (isStageComplete) return;
        setDraggedObjectId(objectId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetId: string) => {
        if (!draggedObjectId || isStageComplete) return;

        // Check if this target already has an object
        const existingPlacement = placements.find(p => p.targetId === targetId);
        if (existingPlacement?.objectId) {
            // Put the existing object back
            setAvailableObjects(prev => [...prev, existingPlacement.objectId!]);
        }

        // Place the dragged object
        setPlacements(prev => prev.map(p => 
            p.targetId === targetId ? { ...p, objectId: draggedObjectId } : p
        ));
        setAvailableObjects(prev => prev.filter(id => id !== draggedObjectId));
        setDraggedObjectId(null);
    };

    const handleRemoveFromTarget = (targetId: string) => {
        if (isStageComplete) return;
        const placement = placements.find(p => p.targetId === targetId);
        if (placement?.objectId) {
            setAvailableObjects(prev => [...prev, placement.objectId!]);
            setPlacements(prev => prev.map(p => 
                p.targetId === targetId ? { ...p, objectId: null } : p
            ));
        }
    };

    const handleSubmitStage = () => {
        if (isStageComplete) return;
        if (timerRef.current) clearInterval(timerRef.current);

        const stageObjects = stage.objects as ObjectItem[];
        let wrongCount = 0;
        const newFeedback: { targetId: string; correct: boolean }[] = [];

        placements.forEach(placement => {
            if (!placement.objectId) {
                newFeedback.push({ targetId: placement.targetId, correct: false });
                wrongCount++;
                return;
            }

            const object = stageObjects.find(o => o.id === placement.objectId);
            if (object && object.matchesTarget === placement.targetId) {
                newFeedback.push({ targetId: placement.targetId, correct: true });
            } else {
                newFeedback.push({ targetId: placement.targetId, correct: false });
                wrongCount++;
            }
        });

        setFeedback(newFeedback);

        const penalty = wrongCount * SHAPE_PATTERN_COLOR_CHALLENGE.penaltyPerWrong;
        const earnedScore = Math.max(0, SHAPE_PATTERN_COLOR_CHALLENGE.pointsPerStage - penalty);

        if (wrongCount === 0) {
            setStageMessage(`Perfect! +${earnedScore} points`);
        } else {
            setStageMessage(`${wrongCount} wrong. -${penalty} points. Earned: ${earnedScore} points`);
        }

        setTotalScore(prev => prev + earnedScore);
        setIsStageComplete(true);
    };

    const handleNextStage = () => {
        if (currentStage < SHAPE_PATTERN_COLOR_CHALLENGE.stages.length - 1) {
            setCurrentStage(prev => prev + 1);
        } else {
            setIsComplete(true);
            setTimeout(() => onComplete(totalScore), 2000);
        }
    };

    const allPlaced = placements.every(p => p.objectId !== null);

    const getTargetClass = (targetId: string) => {
        const feedbackItem = feedback.find(f => f.targetId === targetId);
        if (feedbackItem) {
            return feedbackItem.correct 
                ? 'border-green-500 bg-green-500/20' 
                : 'border-red-500 bg-red-500/20';
        }
        return 'border-white/30 bg-gray-800/40';
    };

    const getTimerColor = () => {
        if (timeLeft <= 5) return 'text-red-400';
        if (timeLeft <= 10) return 'text-yellow-400';
        return 'text-green-400';
    };

    if (isComplete) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                <h2 className="text-2xl font-bold text-green-400 mb-4">Challenge Complete!</h2>
                <p className="text-gray-300 mb-4">Great job sorting by shape, pattern, and color!</p>
                <p className="text-4xl font-bold text-blue-300">Total Score: {totalScore}</p>
            </div>
        );
    }

    // Start screen
    if (!hasStarted) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                <h2 className="text-2xl font-bold text-purple-300 mb-4">{challengeTitle}</h2>
                
                <div className="mb-6">
                    <p className="text-gray-300 mb-4">
                        Sort objects by matching their <span className="text-yellow-400 font-bold">Shape</span>, <span className="text-yellow-400 font-bold">Pattern</span>, or <span className="text-yellow-400 font-bold">Color</span> to the targets.
                    </p>
                    
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-400 mb-3">The three target objects:</p>
                        <div className="flex justify-center gap-6">
                            {targets.map(target => (
                                <div key={target.id} className="flex flex-col items-center">
                                    <ShapeIcon object={target} size={60} uniqueId={`start-${target.id}`} />
                                    <span className="text-xs text-gray-400 mt-1 capitalize">
                                        {target.color} {target.pattern} {target.shape}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-300">
                        <p>📋 <strong>3 Stages:</strong> Shape → Pattern → Color</p>
                        <p>⏱️ <strong>15 seconds</strong> per stage</p>
                        <p>🎯 <strong>30 points</strong> per stage, -5 for each wrong match</p>
                        <p>🖱️ <strong>Drag</strong> objects to matching targets</p>
                    </div>
                </div>

                <button
                    onClick={() => setHasStarted(true)}
                    className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/30"
                >
                    Start Challenge
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-purple-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-1">
                Stage {currentStage + 1}/3: <span className="font-bold text-yellow-400">{stage.instruction}</span>
            </p>
            <p className="text-gray-400 text-sm mb-4">
                Drag each object to the target with the matching {stage.name.toLowerCase()}
            </p>

            {/* Timer */}
            <div className={`text-3xl font-bold mb-6 ${getTimerColor()}`}>
                ⏱️ {timeLeft}s
            </div>

            {/* Target objects (constant) */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Targets:</p>
                <div className="flex justify-center gap-6">
                    {targets.map(target => {
                        const placement = placements.find(p => p.targetId === target.id);
                        const stageObjects = stage.objects as ObjectItem[];
                        const placedObject = placement?.objectId 
                            ? stageObjects.find(o => o.id === placement.objectId) 
                            : null;

                        return (
                            <div
                                key={target.id}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(target.id)}
                                onClick={() => handleRemoveFromTarget(target.id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${getTargetClass(target.id)} ${!isStageComplete && placedObject ? 'cursor-pointer hover:opacity-80' : ''}`}
                            >
                                <ShapeIcon object={target} size={70} uniqueId={target.id} />
                                
                                <div className="h-[70px] w-[70px] flex items-center justify-center border-2 border-dashed border-white/30 rounded-lg mt-2 bg-black/20">
                                    {placedObject ? (
                                        <ShapeIcon object={placedObject} size={55} uniqueId={`placed-${placedObject.id}`} />
                                    ) : (
                                        <span className="text-gray-500 text-xs">Drop here</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Objects to drag */}
            <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3">Objects to sort:</p>
                <div className="flex justify-center gap-4 min-h-[80px]">
                    {availableObjects.map(objectId => {
                        const stageObjects = stage.objects as ObjectItem[];
                        const object = stageObjects.find(o => o.id === objectId)!;
                        return (
                            <div
                                key={objectId}
                                draggable={!isStageComplete}
                                onDragStart={() => handleDragStart(objectId)}
                                className={`p-2 bg-gray-700/50 rounded-lg border border-white/20 transition-all ${!isStageComplete ? 'cursor-grab active:cursor-grabbing hover:border-white/50 hover:scale-110' : 'opacity-50'}`}
                            >
                                <ShapeIcon object={object} uniqueId={`drag-${object.id}`} />
                            </div>
                        );
                    })}
                    {availableObjects.length === 0 && !isStageComplete && (
                        <p className="text-gray-500 italic">All objects placed</p>
                    )}
                </div>
            </div>

            {/* Stage message */}
            {stageMessage && (
                <p className={`text-lg font-bold mb-4 ${stageMessage.includes('Perfect') ? 'text-green-400' : 'text-yellow-400'}`}>
                    {stageMessage}
                </p>
            )}

            {/* Score display */}
            <div className="mb-4 text-gray-400">
                <span>Total Score: <span className="text-blue-300 font-bold">{totalScore}</span></span>
            </div>

            {/* Action button */}
            {isStageComplete ? (
                <button
                    onClick={handleNextStage}
                    className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    {currentStage < SHAPE_PATTERN_COLOR_CHALLENGE.stages.length - 1 ? 'Next Stage →' : 'Finish Challenge'}
                </button>
            ) : (
                <button
                    onClick={handleSubmitStage}
                    disabled={!allPlaced}
                    className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Check Sorting
                </button>
            )}
        </div>
    );
};

export default ShapePatternColorChallenge;
