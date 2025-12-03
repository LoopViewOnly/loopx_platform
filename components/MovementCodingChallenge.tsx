import React, { useState, useRef, useEffect } from 'react';
import { MOVEMENT_CODING_CHALLENGE } from '../challenges/content';

interface MovementCodingChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const MovementCodingChallenge: React.FC<MovementCodingChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [userCode, setUserCode] = useState(MOVEMENT_CODING_CHALLENGE.initialCode);
  const [playerPosition, setPlayerPosition] = useState({ x: 200, y: 150 });
  const [showHints, setShowHints] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const testCode = () => {
    try {
      // Create a mock player object for testing
      const mockPlayer = {
        position: { x: 200, y: 150 },
        moveForward: () => {
          mockPlayer.position.y -= 10;
          setPlayerPosition(prev => ({ ...prev, y: prev.y - 10 }));
        },
        moveBackward: () => {
          mockPlayer.position.y += 10;
          setPlayerPosition(prev => ({ ...prev, y: prev.y + 10 }));
        },
        moveLeft: () => {
          mockPlayer.position.x -= 10;
          setPlayerPosition(prev => ({ ...prev, x: prev.x - 10 }));
        },
        moveRight: () => {
          mockPlayer.position.x += 10;
          setPlayerPosition(prev => ({ ...prev, x: prev.x + 10 }));
        }
      };

      // Test each direction by creating a function from the user's code
      const directions = [
        { key: 'W', method: 'moveForward', name: 'W (forward)' },
        { key: 'A', method: 'moveLeft', name: 'A (left)' },
        { key: 'S', method: 'moveBackward', name: 'S (backward)' },
        { key: 'D', method: 'moveRight', name: 'D (right)' }
      ];

      let allCorrect = true;
      const results: string[] = [];

      directions.forEach(({ key, method, name }) => {
        const startPos = { ...mockPlayer.position };

        // Create a mock event object
        const mockEvent = { key };

        // Execute the user's code with the mock event and player
        try {
          // Create a function from the user's code
          const userFunction = new Function('event', 'player', userCode);
          userFunction(mockEvent, mockPlayer);
        } catch (error) {
          allCorrect = false;
          results.push(`✗ ${name}: Error in code`);
          return;
        }

        const moved = mockPlayer.position.x !== startPos.x || mockPlayer.position.y !== startPos.y;
        if (moved) {
          results.push(`✓ ${name}: Working`);
        } else {
          results.push(`✗ ${name}: Not working`);
          allCorrect = false;
        }

        // Reset position
        mockPlayer.position = { ...startPos };
      });

      if (allCorrect) {
        setFeedback(`Perfect! All movements are working correctly:\n${results.join('\n')}`);
        setIsCompleted(true);
        setTimeout(() => onComplete(MOVEMENT_CODING_CHALLENGE.points), 2000);
      } else {
        setFeedback(`Some movements aren't working yet:\n${results.join('\n')}\n\nCheck your code and try again!`);
      }

    } catch (error) {
      setFeedback(`Error in your code: ${error.message}\n\nPlease check your syntax and try again.`);
    }
  };

  const resetCode = () => {
    setUserCode(MOVEMENT_CODING_CHALLENGE.initialCode);
    setPlayerPosition({ x: 200, y: 150 });
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">{MOVEMENT_CODING_CHALLENGE.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Your Code</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHints(!showHints)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>
              <button
                onClick={resetCode}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {showHints && (
            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Hints:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {MOVEMENT_CODING_CHALLENGE.hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </div>
          )}

          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-80 bg-gray-900 border border-gray-600 rounded-lg p-4 text-green-400 font-mono text-sm resize-none focus:border-cyan-500 focus:outline-none"
            spellCheck={false}
          />

          <button
            onClick={testCode}
            disabled={isCompleted}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
          >
            {isCompleted ? 'Completed!' : 'Test Your Code'}
          </button>

          {feedback && (
            <div className={`p-4 rounded-lg border ${
              feedback.includes('Perfect') ? 'bg-green-900/30 border-green-500/50 text-green-400' :
              feedback.includes('Error') ? 'bg-red-900/30 border-red-500/50 text-red-400' :
              'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
            }`}>
              <pre className="whitespace-pre-wrap text-sm font-mono">{feedback}</pre>
            </div>
          )}
        </div>

        {/* Game Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Game Preview</h3>
          <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
            <div className="relative w-full h-64 bg-gray-800 rounded border-2 border-gray-700 overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-gray-600" style={{ top: `${i * 5}%` }} />
                ))}
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-gray-600" style={{ left: `${i * 5}%` }} />
                ))}
              </div>

              {/* Player */}
              <div
                className="absolute w-6 h-6 bg-cyan-500 rounded-full border-2 border-white shadow-lg transition-all duration-200"
                style={{
                  left: playerPosition.x - 12,
                  top: playerPosition.y - 12,
                }}
              />

              {/* Instructions */}
              <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                Use W,A,S,D keys in your code to move the player
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-cyan-400 font-bold">W</div>
              <div className="text-gray-400">Forward</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-cyan-400 font-bold">A</div>
              <div className="text-gray-400">Left</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-cyan-400 font-bold">S</div>
              <div className="text-gray-400">Backward</div>
            </div>
            <div className="bg-gray-800 p-3 rounded text-center">
              <div className="text-cyan-400 font-bold">D</div>
              <div className="text-gray-400">Right</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementCodingChallenge;
