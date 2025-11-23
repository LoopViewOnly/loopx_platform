
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DINO_GOAL_DISTANCE } from '../constants';

// --- Game Constants ---
const GRAVITY = -0.5; // Negative because we're styling with 'bottom'
const JUMP_FORCE = 12;   // Positive because we're styling with 'bottom'
const PLAYER_DIAMETER = 30;
const PLAYER_BOTTOM_POS = 20; // Positioned 20px from the bottom
const OBSTACLE_MIN_GAP = 300;
const OBSTACLE_MAX_GAP = 700;
const INITIAL_SPEED = 5;
const SPEED_ACCELERATION = 0.001;
const PLAYER_X_POS = 50;

// --- Types ---
type Obstacle = {
    id: number;
    x: number;
    width: number;
    height: number;
};
type GameState = 'waiting' | 'running' | 'completed' | 'gameOver';

// --- Component ---
interface DinoGameChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

let obstacleIdCounter = 0;

const DinoGameChallenge: React.FC<DinoGameChallengeProps> = ({ onComplete, challengeTitle }) => {
    // State for rendering
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [distance, setDistance] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);
    const [playerY, setPlayerY] = useState(PLAYER_BOTTOM_POS);
    
    // Refs for game logic to avoid re-renders inside the loop
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const playerYRef = useRef(PLAYER_BOTTOM_POS);
    const playerVelYRef = useRef(0);
    const gameSpeedRef = useRef(INITIAL_SPEED);
    const distanceRef = useRef(0);
    const obstaclesRef = useRef<Obstacle[]>([]);
    const nextObstacleSpawnPosRef = useRef(0);
    const gameLoopIdRef = useRef<number | null>(null);
    const jumpCountRef = useRef(0);
    const specialObstacleSpawnedRef = useRef(false);

    const resetGame = useCallback(() => {
        // Reset refs
        playerYRef.current = PLAYER_BOTTOM_POS;
        playerVelYRef.current = 0;
        obstaclesRef.current = [];
        gameSpeedRef.current = INITIAL_SPEED;
        distanceRef.current = 0;
        jumpCountRef.current = 0;
        specialObstacleSpawnedRef.current = false;
        if (gameContainerRef.current) {
            nextObstacleSpawnPosRef.current = gameContainerRef.current.clientWidth;
        }

        // Reset state for rendering
        setPlayerY(PLAYER_BOTTOM_POS);
        setObstacles([]);
        setDistance(0);
    }, []);

    const startGame = useCallback(() => {
        resetGame();
        setGameState('running');
    }, [resetGame]);

    const handleJump = useCallback(() => {
        if (gameState === 'waiting' || gameState === 'gameOver') {
            startGame();
        } else if (gameState === 'running' && jumpCountRef.current < 2) {
            playerVelYRef.current = JUMP_FORCE;
            jumpCountRef.current++;
        }
    }, [gameState, startGame]);

    const gameLoop = useCallback(() => {
        if (!gameContainerRef.current) {
            gameLoopIdRef.current = requestAnimationFrame(gameLoop);
            return;
        }
        
        const containerWidth = gameContainerRef.current.clientWidth;
        
        // --- Player Physics (using refs) ---
        playerVelYRef.current += GRAVITY;
        playerYRef.current += playerVelYRef.current;
        
        if (playerYRef.current < PLAYER_BOTTOM_POS) {
            playerYRef.current = PLAYER_BOTTOM_POS;
            playerVelYRef.current = 0;
            jumpCountRef.current = 0;
        }
        
        // --- Speed & Distance (using refs) ---
        gameSpeedRef.current += SPEED_ACCELERATION;
        distanceRef.current += 1;
        const currentDistance = Math.floor(distanceRef.current);

        if (currentDistance >= DINO_GOAL_DISTANCE) {
            setGameState('completed');
            setDistance(currentDistance);
            return;
        }
        
        // --- Obstacles (using refs) ---
        let collision = false;
        const currentObstacles = obstaclesRef.current.reduce((acc, obs) => {
            obs.x -= gameSpeedRef.current;
            if (obs.x > -obs.width) {
                acc.push(obs);
                
                const playerRect = { x: PLAYER_X_POS, y: playerYRef.current, width: PLAYER_DIAMETER, height: PLAYER_DIAMETER };
                const obstacleRect = { x: obs.x, y: PLAYER_BOTTOM_POS, width: obs.width, height: obs.height };

                if (playerRect.x < obstacleRect.x + obstacleRect.width &&
                    playerRect.x + playerRect.width > obstacleRect.x &&
                    playerRect.y < obstacleRect.y + obstacleRect.height &&
                    playerRect.y + playerRect.height > obstacleRect.y) {
                    collision = true;
                }
            }
            return acc;
        }, [] as Obstacle[]);
        obstaclesRef.current = currentObstacles;

        // Spawn new obstacle
        if (obstaclesRef.current.length === 0 || obstaclesRef.current[obstaclesRef.current.length - 1].x < nextObstacleSpawnPosRef.current) {
            let newObstacle: Obstacle;
            const spawnDistance = Math.floor(distanceRef.current);

            if (spawnDistance > 700 && spawnDistance < 750 && !specialObstacleSpawnedRef.current) {
                // Special wide obstacle that needs a double jump
                newObstacle = { id: obstacleIdCounter++, x: containerWidth, width: 90, height: 40 };
                specialObstacleSpawnedRef.current = true;
            } else {
                 newObstacle = { id: obstacleIdCounter++, x: containerWidth, width: 20 + Math.random() * 30, height: 30 + Math.random() * 40 };
            }
            obstaclesRef.current.push(newObstacle);
            nextObstacleSpawnPosRef.current = containerWidth - (OBSTACLE_MIN_GAP + Math.random() * (OBSTACLE_MAX_GAP - OBSTACLE_MIN_GAP));
        }
        
        // Sync refs to state for rendering
        setPlayerY(playerYRef.current);
        setDistance(currentDistance);
        setObstacles([...obstaclesRef.current]);

        if (collision) {
            setGameState('gameOver');
            return;
        }
        
        gameLoopIdRef.current = requestAnimationFrame(gameLoop);
    }, []); // Empty dependency array makes the loop function stable

    useEffect(() => {
        if (gameState === 'running') {
            gameLoopIdRef.current = requestAnimationFrame(gameLoop);
        }
        return () => {
            if (gameLoopIdRef.current) {
                cancelAnimationFrame(gameLoopIdRef.current);
            }
        };
    }, [gameState, gameLoop]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                handleJump();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleJump]);
    
    return (
        <div 
            className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center"
        >
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-4">Jump over obstacles! Use Space, Up Arrow, or click. You can perform a <span className="text-yellow-400 font-bold">double jump</span> while in the air. Reach {DINO_GOAL_DISTANCE} to pass. If you hit an obstacle, you lose!</p>

            <div 
                ref={gameContainerRef} 
                onClick={handleJump}
                className="relative w-full h-64 bg-black/50 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-500/50"
                tabIndex={0}
            >
                {/* Game Info */}
                <div className="absolute inset-0 flex items-start pt-10 justify-center text-white font-mono z-0 text-7xl opacity-30 pointer-events-none">
                    {distance}
                </div>
                
                {/* Ground */}
                <div className="absolute bottom-0 left-0 w-full h-5 bg-gray-600" style={{ bottom: `${PLAYER_BOTTOM_POS - 5}px` }} />

                {/* Player */}
                <div 
                    className="player absolute bg-red-500 rounded-full"
                    style={{ 
                        width: PLAYER_DIAMETER, 
                        height: PLAYER_DIAMETER, 
                        left: `${PLAYER_X_POS}px`,
                        bottom: `${playerY}px`
                    }} 
                />

                {/* Obstacles */}
                {obstacles.map((obs) => (
                    <div
                        key={obs.id}
                        className="obstacle absolute bg-green-500"
                        style={{
                            left: `${obs.x}px`,
                            width: `${obs.width}px`,
                            height: `${obs.height}px`,
                            bottom: `${PLAYER_BOTTOM_POS}px`,
                        }}
                    />
                ))}

                {/* Overlays */}
                {gameState === 'waiting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                        <p className="text-2xl font-bold text-white">Click or Press Space to Start</p>
                    </div>
                )}
                {gameState === 'gameOver' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                        <p className="text-4xl font-extrabold text-red-500">GAME OVER</p>
                        <p className="text-xl text-gray-300 mt-2">You hit an obstacle!</p>
                        <button 
                            onClick={startGame} 
                            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300">
                            Try Again
                        </button>
                    </div>
                )}
                {gameState === 'completed' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-800/50 z-10">
                        <p className="text-4xl font-extrabold text-white">GOAL REACHED!</p>
                        <p className="text-xl text-gray-200 mt-2">Distance: {distance}</p>
                        
                        <p className="text-green-300 font-bold mt-4">Challenge Passed!</p>
                        <button 
                            onClick={() => onComplete(100)} 
                            className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                            Next Challenge
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DinoGameChallenge;
