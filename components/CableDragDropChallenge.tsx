import React, { useState, useRef } from 'react';
import { CABLE_DRAG_DROP_CHALLENGE } from '../challenges/content';

interface CableDragDropChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

interface DraggedItem {
  id: string;
  type: 'cable' | 'description';
}

const CableDragDropChallenge: React.FC<CableDragDropChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lastAttemptedPair, setLastAttemptedPair] = useState<{cable: string, description: string} | null>(null);

  // Shuffle the cables and descriptions for randomness
  const shuffledCables = [...CABLE_DRAG_DROP_CHALLENGE.cables].sort(() => Math.random() - 0.5);
  const shuffledDescriptions = [...CABLE_DRAG_DROP_CHALLENGE.cables].sort(() => Math.random() - 0.5);

  const handleDragStart = (e: React.DragEvent, item: DraggedItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setDragOverTarget(targetId);
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string, targetType: 'cable' | 'description') => {
    e.preventDefault();
    setDragOverTarget(null);

    if (!draggedItem) return;

    // Only allow dropping if types are different (cable on description or vice versa)
    if (draggedItem.type === targetType) return;

    const cableId = draggedItem.type === 'cable' ? draggedItem.id : targetId;
    const descriptionId = draggedItem.type === 'description' ? draggedItem.id : targetId;

    // Check if this is a correct match
    const cable = CABLE_DRAG_DROP_CHALLENGE.cables.find(c => c.id === cableId);
    const isMatch = cableId === descriptionId;

    setLastAttemptedPair({ cable: cableId, description: descriptionId });
    setIsCorrect(isMatch);
    setShowResult(true);

    if (isMatch) {
      setMatchedPairs(prev => new Set([...prev, cableId]));
    }

    // Hide result after 2 seconds
    setTimeout(() => {
      setShowResult(false);
      setLastAttemptedPair(null);

      // Check if all pairs are matched
      if (matchedPairs.size + (isMatch ? 1 : 0) === CABLE_DRAG_DROP_CHALLENGE.cables.length) {
        setTimeout(() => onComplete(CABLE_DRAG_DROP_CHALLENGE.totalPoints), 1000);
      }
    }, 2000);
  };

  const isCompleted = matchedPairs.size === CABLE_DRAG_DROP_CHALLENGE.cables.length;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">{CABLE_DRAG_DROP_CHALLENGE.instruction}</p>
        <div className="text-sm text-cyan-400 mt-2">
          Progress: {matchedPairs.size} / {CABLE_DRAG_DROP_CHALLENGE.cables.length} cables matched
        </div>
      </div>

      {isCompleted && (
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-2xl font-bold text-green-400 mb-2">🎉 All Cables Matched! 🎉</p>
            <p className="text-gray-300">Excellent work! You know your cables!</p>
          </div>
        </div>
      )}

      {showResult && lastAttemptedPair && (
        <div className={`mb-6 p-4 rounded-lg text-center ${
          isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
        }`}>
          <p className={`text-xl font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct Match!' : 'Incorrect Match!'}
          </p>
          <p className="text-gray-300 mt-1">
            {isCorrect ? 'Great job!' : 'Try again with a different combination.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cable Names Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Cable Types</h3>
          <div className="space-y-3">
            {shuffledCables.map((cable) => {
              const isMatched = matchedPairs.has(cable.id);
              const isDraggingOver = dragOverTarget === cable.id;

              return (
                <div
                  key={`cable-${cable.id}`}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, { id: cable.id, type: 'cable' })}
                  onDragOver={(e) => handleDragOver(e, cable.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cable.id, 'cable')}
                  className={`
                    p-4 bg-gray-800/50 border-2 rounded-lg cursor-move transition-all duration-200
                    ${isMatched ? 'border-green-500 bg-green-900/20 opacity-50' : 'border-gray-600 hover:border-cyan-500'}
                    ${isDraggingOver ? 'border-cyan-400 bg-cyan-900/20 scale-105' : ''}
                    ${isMatched ? 'cursor-default' : 'cursor-move'}
                  `}
                >
                  <div className="text-center">
                    <h4 className={`font-semibold text-lg ${isMatched ? 'text-green-400' : 'text-white'}`}>
                      {cable.name}
                    </h4>
                    {isMatched && (
                      <span className="text-green-400 text-sm">✓ Matched</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cable Drawings Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Cable Drawings</h3>
          <div className="space-y-3">
            {shuffledDescriptions.map((cable) => {
              const isMatched = matchedPairs.has(cable.id);
              const isDraggingOver = dragOverTarget === cable.id;

              return (
                <div
                  key={`desc-${cable.id}`}
                  onDragOver={(e) => handleDragOver(e, cable.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, cable.id, 'description')}
                  className={`
                    p-4 bg-gray-800/50 border-2 border-dashed rounded-lg transition-all duration-200 min-h-[100px] flex items-center justify-center
                    ${isMatched ? 'border-green-500 bg-green-900/20 opacity-50' : 'border-gray-600'}
                    ${isDraggingOver ? 'border-cyan-400 bg-cyan-900/20 scale-105' : ''}
                  `}
                >
                  <div className="text-center relative">
                    <img
                      src={cable.image}
                      alt={cable.name}
                      className={`w-16 h-16 object-contain mx-auto ${
                        isMatched ? 'opacity-75' : ''
                      }`}
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = `text-sm ${isMatched ? 'text-green-400' : 'text-gray-300'}`;
                        fallback.textContent = cable.name;
                        e.currentTarget.parentNode?.appendChild(fallback);
                      }}
                    />
                    {isMatched && (
                      <span className="absolute top-1 right-1 text-green-400 text-xl">✓</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-green-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(matchedPairs.size / CABLE_DRAG_DROP_CHALLENGE.cables.length) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          {matchedPairs.size} of {CABLE_DRAG_DROP_CHALLENGE.cables.length} matched
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-400">
        <p>💡 Tip: Drag cable names to their matching descriptions!</p>
      </div>
    </div>
  );
};

export default CableDragDropChallenge;
