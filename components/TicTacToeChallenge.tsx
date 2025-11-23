
import React, { useState, useEffect } from 'react';

interface TicTacToeChallengeProps {
    onComplete: (win: boolean) => void;
    onAttemptFailed: () => void;
    challengeTitle: string;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToeChallenge: React.FC<TicTacToeChallengeProps> = ({ onComplete, onAttemptFailed, challengeTitle }) => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, setWinner] = useState<Player>(null);
    const [isDraw, setIsDraw] = useState(false);
    const [gameCount, setGameCount] = useState(1);

    const checkWinner = (currentBoard: Board): Player => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    };
    
     const getSmartMove = (currentBoard: Board): number => {
        // 1. Check for AI win
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
                const tempBoard = [...currentBoard];
                tempBoard[i] = 'O';
                if (checkWinner(tempBoard) === 'O') {
                    return i;
                }
            }
        }

        // 2. Check for player block
        for (let i = 0; i < 9; i++) {
            if (currentBoard[i] === null) {
                const tempBoard = [...currentBoard];
                tempBoard[i] = 'X';
                if (checkWinner(tempBoard) === 'X') {
                    return i;
                }
            }
        }

        // 3. Take center
        if (currentBoard[4] === null) {
            return 4;
        }

        // 4. Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => currentBoard[i] === null);
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // 5. Take sides (fallback)
        const sides = [1, 3, 5, 7];
        const availableSides = sides.filter(i => currentBoard[i] === null);
        if (availableSides.length > 0) {
            return availableSides[Math.floor(Math.random() * availableSides.length)];
        }

        return -1; // Should not happen if game is not over
    };
    
    const aiMove = (currentBoard: Board) => {
        const availableMoves = currentBoard
            .map((val, idx) => val === null ? idx : null)
            .filter(val => val !== null) as number[];
        
        if (availableMoves.length > 0) {
            let move: number;

            if (gameCount < 3) {
                // Smart AI for first 2 games
                move = getSmartMove(currentBoard);
                 if (move === -1) { // Fallback for the smart AI
                    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
            } else {
                // Easy (random) AI for 3rd game onwards
                move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            }
            
            const newBoard = [...currentBoard];
            newBoard[move] = 'O';
            setBoard(newBoard);
            setIsPlayerTurn(true);
        }
    };
    
    const resetGame = () => {
        onAttemptFailed(); // Apply penalty on retry
        setGameCount(prev => prev + 1);
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setWinner(null);
        setIsDraw(false);
    };

    useEffect(() => {
        if (winner || isDraw) return;

        const gameWinner = checkWinner(board);
        if (gameWinner) {
            setWinner(gameWinner);
        } else if (!board.includes(null)) {
            setIsDraw(true);
        } else if (!isPlayerTurn) {
            setTimeout(() => aiMove(board), 500);
        }
    }, [board, isPlayerTurn, winner, isDraw, gameCount]);


    const handleCellClick = (index: number) => {
        if (board[index] || !isPlayerTurn || winner || isDraw) return;
        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);
    };
    
    const getStatusMessage = () => {
        if (winner) return winner === 'X' ? 'You win!' : 'AI wins!';
        if (isDraw) return `It's a draw!`;
        if (isPlayerTurn) {
            if(gameCount < 3) return `Your turn (X) - AI is focused... (Game ${gameCount})`;
            return `Your turn (X) - AI seems tired... (Game ${gameCount})`;
        }
        return `AI's turn (O)`;
    };
    
    const gameOver = !!winner || isDraw;

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className={`text-xl font-bold mb-6 transition-colors ${gameOver ? (winner === 'X' ? 'text-green-400' : 'text-red-400') : 'text-gray-300'}`}>
                {getStatusMessage()}
            </p>

            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={!!cell || gameOver}
                        className={`w-24 h-24 flex items-center justify-center text-5xl font-bold rounded-lg transition-all duration-200 border-2 border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.2)]
                            ${cell === 'X' ? 'text-blue-400' : 'text-yellow-400'}
                            ${!cell && !gameOver ? 'bg-black/40 hover:bg-white/10 cursor-pointer' : 'bg-black/20 cursor-not-allowed'}`}
                    >
                        {cell}
                    </button>
                ))}
            </div>
             {gameOver && (
                <div className="mt-6">
                    {winner === 'X' ? (
                        <>
                            <p className="text-lg text-green-400">Victory! You outsmarted the AI.</p>
                            <button 
                                onClick={() => onComplete(true)} 
                                className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                                Next Challenge
                            </button>
                        </>
                    ) : (
                         <>
                            <p className="text-lg text-red-400">So close! You must win to proceed.</p>
                             <button 
                                onClick={resetGame} 
                                className="mt-4 px-6 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700 transform hover:scale-105 transition-all duration-300">
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default TicTacToeChallenge;
