import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FixTheBugsChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

interface Creature {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: number;
    type: 'bug' | 'ladybug' | 'beetle' | 'ant' | 'spider' | 'apple';
}

const GAME_DURATION = 60;
const BUGS_TO_CATCH = 10;
const MAX_CREATURES_ON_SCREEN = 10;
const SPAWN_INTERVAL = 600;

const EMOJIS: Record<string, string> = {
    bug: '🐛',
    ladybug: '🐞',
    beetle: '🪲',
    ant: '🐜',
    spider: '🕷️',
    apple: '🍎',
};

const BUG_TYPES: Creature['type'][] = ['bug', 'ladybug', 'beetle', 'ant', 'spider'];

const FixTheBugsChallenge: React.FC<FixTheBugsChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
    const [creatures, setCreatures] = useState<Creature[]>([]);
    const [bugsClicked, setBugsClicked] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [appleHitFlash, setAppleHitFlash] = useState(false);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const creatureIdCounter = useRef(0);
    const animationFrameRef = useRef<number>();

    // Spawn a new creature (bug or apple)
    const spawnCreature = useCallback(() => {
        if (!gameAreaRef.current) return;
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        const padding = 50;
        
        // 20% chance to spawn an apple, 80% chance for a bug
        const isApple = Math.random() < 0.2;
        const type: Creature['type'] = isApple 
            ? 'apple' 
            : BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
        
        const newCreature: Creature = {
            id: creatureIdCounter.current++,
            x: padding + Math.random() * (rect.width - padding * 2),
            y: padding + Math.random() * (rect.height - padding * 2),
            size: isApple ? 35 + Math.random() * 10 : 30 + Math.random() * 20,
            speed: isApple ? 0.5 + Math.random() * 1 : 1 + Math.random() * 2,
            direction: Math.random() * Math.PI * 2,
            type,
        };

        setCreatures(prev => {
            if (prev.length >= MAX_CREATURES_ON_SCREEN) {
                return [...prev.slice(1), newCreature];
            }
            return [...prev, newCreature];
        });
    }, []);

    // Move creatures around
    const moveCreatures = useCallback(() => {
        if (!gameAreaRef.current) return;
        
        const rect = gameAreaRef.current.getBoundingClientRect();
        const padding = 20;

        setCreatures(prev => prev.map(creature => {
            let newX = creature.x + Math.cos(creature.direction) * creature.speed;
            let newY = creature.y + Math.sin(creature.direction) * creature.speed;
            let newDirection = creature.direction;

            // Bounce off walls
            if (newX < padding || newX > rect.width - padding) {
                newDirection = Math.PI - newDirection;
                newX = Math.max(padding, Math.min(rect.width - padding, newX));
            }
            if (newY < padding || newY > rect.height - padding) {
                newDirection = -newDirection;
                newY = Math.max(padding, Math.min(rect.height - padding, newY));
            }

            // Occasionally change direction randomly
            if (Math.random() < 0.02) {
                newDirection += (Math.random() - 0.5) * Math.PI / 2;
            }

            return {
                ...creature,
                x: newX,
                y: newY,
                direction: newDirection,
            };
        }));
    }, []);

    // Game loop for creature movement
    useEffect(() => {
        if (gameState !== 'playing') return;

        const animate = () => {
            moveCreatures();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, moveCreatures]);

    // Spawn creatures periodically
    useEffect(() => {
        if (gameState !== 'playing') return;

        const spawnInterval = setInterval(spawnCreature, SPAWN_INTERVAL);
        
        // Spawn initial creatures
        for (let i = 0; i < 4; i++) {
            setTimeout(spawnCreature, i * 150);
        }

        return () => clearInterval(spawnInterval);
    }, [gameState, spawnCreature]);

    // Timer countdown
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setGameState('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // Check win condition
    useEffect(() => {
        if (bugsClicked >= BUGS_TO_CATCH && gameState === 'playing') {
            const timeBonus = Math.floor(timeLeft * 3);
            setScore(100 + timeBonus);
            setGameState('won');
        }
    }, [bugsClicked, gameState, timeLeft]);

    const handleCreatureClick = (creature: Creature, e: React.MouseEvent) => {
        e.stopPropagation();
        if (gameState !== 'playing') return;

        setCreatures(prev => prev.filter(c => c.id !== creature.id));

        if (creature.type === 'apple') {
            // Apple hit - subtract from bugs clicked
            setBugsClicked(prev => Math.max(0, prev - 1));
            setAppleHitFlash(true);
            setTimeout(() => setAppleHitFlash(false), 300);
        } else {
            // Bug hit - add to bugs clicked
            setBugsClicked(prev => prev + 1);
        }
    };

    const startGame = () => {
        setCreatures([]);
        setBugsClicked(0);
        setTimeLeft(GAME_DURATION);
        setScore(0);
        creatureIdCounter.current = 0;
        setGameState('playing');
    };

    const getTimeColor = () => {
        if (timeLeft <= 5) return 'text-red-500';
        if (timeLeft <= 10) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            
            {gameState === 'ready' && (
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="text-8xl animate-bounce">🐛🐜🐞
                    🕷️</div>
                    <p className="text-xl text-gray-300">
                        Click <span className="text-yellow-400 font-bold">{BUGS_TO_CATCH} bugs</span> in <span className="text-red-400 font-bold">{GAME_DURATION} seconds</span> to fix all the bugs!
                    </p>
                    
                    {/* Rules */}
                    <div className="bg-black/40 rounded-lg p-4 text-left max-w-md">
dsfds                        <p className="text-green-400 font-bold mb-2">🐛  Bugs = +1</p>
                        <div className="flex gap-2 text-2xl mb-3">
                            <span>🐛</span>
                            <span>🐞</span>
                            <span>🪲</span>
                            <span>🐜</span>
                            <span>🕷️</span>
                        </div>
                        <p className="text-red-400 font-bold mb-2">🍎 Apples = -1 (Don't click!)</p>
                        <p className="text-gray-400 text-sm">Watch out for apples! Clicking them will reduce your bug count.</p>
                    </div>

                    <button
                        onClick={startGame}
                        className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
                    >
                        Start Debugging! 🔧
                    </button>
                </div>
            )}

            {gameState === 'playing' && (
                <>
                    {/* Stats bar */}
                    <div className="flex justify-between items-center mb-4 px-4">
                        <div className="text-left">
                            <p className="text-gray-400 text-xs uppercase">Bugs Fixed</p>
                            <p className={`text-2xl font-bold transition-colors ${appleHitFlash ? 'text-red-500' : 'text-white'}`}>
                                {bugsClicked} <span className="text-gray-400">/ {BUGS_TO_CATCH}</span>
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-400 text-xs uppercase">Time Left</p>
                            <p className={`text-3xl font-bold ${getTimeColor()} ${timeLeft <= 5 ? 'animate-pulse' : ''}`}>
                                {timeLeft}s
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-xs uppercase">Progress</p>
                            <div className="w-24 h-3 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${appleHitFlash ? 'bg-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-400'}`}
                                    style={{ width: `${Math.min(100, (bugsClicked / BUGS_TO_CATCH) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Apple warning flash */}
                    {appleHitFlash && (
                        <div className="mb-2 text-red-400 font-bold animate-pulse">
                            🍎 Oops! -1 bug!
                        </div>
                    )}

                    {/* Game area */}
                    <div 
                        ref={gameAreaRef}
                        className={`relative w-full h-96 bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl border-2 overflow-hidden cursor-crosshair transition-colors ${appleHitFlash ? 'border-red-500' : 'border-white/10'}`}
                        style={{ minHeight: '400px' }}
                    >
                        {/* Grid pattern background */}
                        <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        />
                        
                        {/* Creatures */}
                        {creatures.map(creature => (
                            <div
                                key={creature.id}
                                onClick={(e) => handleCreatureClick(creature, e)}
                                className={`absolute cursor-pointer transform hover:scale-125 transition-transform duration-100 select-none ${creature.type === 'apple' ? 'hover:rotate-12' : ''}`}
                                style={{
                                    left: creature.x,
                                    top: creature.y,
                                    fontSize: creature.size,
                                    transform: creature.type === 'apple' 
                                        ? `translate(-50%, -50%)` 
                                        : `translate(-50%, -50%) rotate(${creature.direction * (180 / Math.PI) + 90}deg)`,
                                    filter: creature.type === 'apple' 
                                        ? 'drop-shadow(0 0 10px rgba(255,0,0,0.3))' 
                                        : 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
                                    zIndex: creature.type === 'apple' ? 5 : 10,
                                }}
                            >
                                {EMOJIS[creature.type]}
                            </div>
                        ))}

                        {/* Click hint */}
                        {creatures.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-gray-500 animate-pulse">Bugs incoming...</p>
                            </div>
                        )}
                    </div>

                    <p className="mt-4 text-sm text-gray-400">
                        🐛 Click bugs (+1) | 🍎 Avoid apples (-1)
                    </p>
                </>
            )}

            {gameState === 'won' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-3xl font-bold text-green-400">All Bugs Fixed!</p>
                    <p className="text-gray-300 text-lg">
                        You squashed {BUGS_TO_CATCH} bugs with {timeLeft} seconds to spare!
                    </p>
                    <p className="text-2xl text-white mt-4">
                        Score: <span className="text-green-400 font-bold">{score}</span>
                        {timeLeft > 0 && <span className="text-sm text-gray-400 ml-2">(+{Math.floor(timeLeft * 3)} time bonus!)</span>}
                    </p>
                    <button
                        onClick={() => onComplete(score)}
                        className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Next Challenge
                    </button>
                </div>
            )}

            {gameState === 'lost' && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <div className="text-6xl mb-4">⏰</div>
                    <p className="text-3xl font-bold text-red-400">Time's Up!</p>
                    <p className="text-gray-300 text-lg">
                        You only fixed {bugsClicked} out of {BUGS_TO_CATCH} bugs.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={startGame}
                            className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => onComplete(0)}
                            className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Skip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixTheBugsChallenge;
