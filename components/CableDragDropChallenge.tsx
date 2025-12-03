import React, { useState, useEffect } from 'react';
import { CABLE_DRAG_DROP_CHALLENGE } from '../challenges/content';

interface CableDragDropChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

// Color palette for matched pairs
const PAIR_COLORS = [
  { border: 'border-red-500', bg: 'bg-red-900/20', shadow: 'shadow-red-500/50', text: 'text-red-400' },
  { border: 'border-yellow-500', bg: 'bg-yellow-900/20', shadow: 'shadow-yellow-500/50', text: 'text-yellow-400' },
  { border: 'border-purple-500', bg: 'bg-purple-900/20', shadow: 'shadow-purple-500/50', text: 'text-purple-400' },
  { border: 'border-green-500', bg: 'bg-green-900/20', shadow: 'shadow-green-500/50', text: 'text-green-400' },
  { border: 'border-pink-500', bg: 'bg-pink-900/20', shadow: 'shadow-pink-500/50', text: 'text-pink-400' },
  { border: 'border-blue-500', bg: 'bg-blue-900/20', shadow: 'shadow-blue-500/50', text: 'text-blue-400' },
  { border: 'border-indigo-500', bg: 'bg-indigo-900/20', shadow: 'shadow-indigo-500/50', text: 'text-indigo-400' },
  { border: 'border-orange-500', bg: 'bg-orange-900/20', shadow: 'shadow-orange-500/50', text: 'text-orange-400' },
  { border: 'border-teal-500', bg: 'bg-teal-900/20', shadow: 'shadow-teal-500/50', text: 'text-teal-400' },
  { border: 'border-cyan-500', bg: 'bg-cyan-900/20', shadow: 'shadow-cyan-500/50', text: 'text-cyan-400' }
];

interface FeedbackMessage {
  message: string;
  type: 'success' | 'error';
}

const CableDragDropChallenge: React.FC<CableDragDropChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [matchedPairs, setMatchedPairs] = useState<Map<string, number>>(new Map()); // id -> colorIndex
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [shuffledCables, setShuffledCables] = useState<any[]>([]);
  const [shuffledDescriptions, setShuffledDescriptions] = useState<any[]>([]);

  // Shuffle the cables and descriptions once on mount
  useEffect(() => {
    setShuffledCables([...CABLE_DRAG_DROP_CHALLENGE.cables].sort(() => Math.random() - 0.5));
    setShuffledDescriptions([...CABLE_DRAG_DROP_CHALLENGE.cables].sort(() => Math.random() - 0.5));
  }, []);

  // Check for completion when matchedPairs changes
  useEffect(() => {
    if (matchedPairs.size === CABLE_DRAG_DROP_CHALLENGE.cables.length && matchedPairs.size > 0) {
      setTimeout(() => onComplete(CABLE_DRAG_DROP_CHALLENGE.totalPoints), 1000);
    }
  }, [matchedPairs.size, onComplete]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleCableClick = (cableId: string) => {
    if (matchedPairs.has(cableId)) {
      setSelectedCableId(null);
      return;
    }

    setSelectedCableId((prev) => (prev === cableId ? null : cableId));
  };

  const handleImageClick = (imageId: string) => {
    if (matchedPairs.has(imageId)) return;

    if (!selectedCableId) {
      setFeedback({ message: 'Select a cable name before picking an image.', type: 'error' });
      return;
    }

    const selectedCable = CABLE_DRAG_DROP_CHALLENGE.cables.find((cable) => cable.id === selectedCableId);
    const clickedCable = CABLE_DRAG_DROP_CHALLENGE.cables.find((cable) => cable.id === imageId);
    const selectedName = selectedCable?.name ?? 'Cable';
    const clickedName = clickedCable?.name ?? 'this image';

    if (selectedCableId === imageId) {
      setMatchedPairs((prev) => {
        const updated = new Map(prev);
        const colorIndex = updated.size % PAIR_COLORS.length;
        updated.set(imageId, colorIndex);
        return updated;
      });
      setFeedback({ message: `${selectedName} matched!`, type: 'success' });
    } else {
      setFeedback({
        message: `${selectedName} does not match ${clickedName}. Try again!`,
        type: 'error',
      });
    }

    setSelectedCableId(null);
  };

  const isCompleted = matchedPairs.size === CABLE_DRAG_DROP_CHALLENGE.cables.length;

  return (
    <div className="max-w-6xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">Select a cable name, then tap its matching image.</p>
        <div className="text-sm text-cyan-400 mt-2">
          Progress: {matchedPairs.size} / {CABLE_DRAG_DROP_CHALLENGE.cables.length} cables found
        </div>
      </div>

      {isCompleted && (
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-2xl font-bold text-green-400 mb-2">🎉 All Cables Found! 🎉</p>
            <p className="text-gray-300">Excellent work! You found all the cable images!</p>
          </div>
        </div>
      )}

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg text-center ${
            feedback.type === 'success' ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'
          }`}
        >
          <p className={`text-xl font-semibold ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback.type === 'success' ? 'Correct Match!' : 'Incorrect Match!'}
          </p>
          <p className="text-gray-300 mt-1">{feedback.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cable Names Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Select Cable Names</h3>
          <div className="space-y-3">
            {shuffledCables.map((cable) => {
              const colorIndex = matchedPairs.get(cable.id);
              const isMatched = colorIndex !== undefined;
              const isSelected = selectedCableId === cable.id;

              const colorStyle = isMatched ? PAIR_COLORS[colorIndex!] : null;
              const matchedClasses = isMatched
                ? `${colorStyle!.border} ${colorStyle!.bg} opacity-50 shadow-lg ${colorStyle!.shadow}`
                : 'border-gray-600 hover:border-cyan-500';
              const selectionClasses = !isMatched && isSelected
                ? 'border-cyan-300 bg-cyan-900/30 shadow-lg shadow-cyan-400/50 scale-105'
                : '';
              const cursorClass = isMatched ? 'cursor-default' : 'cursor-pointer';

              return (
                <div
                  key={`cable-${cable.id}`}
                  onClick={() => handleCableClick(cable.id)}
                  className={`
                    p-4 bg-gray-800/50 border-2 rounded-lg transition-all duration-200
                    ${matchedClasses}
                    ${selectionClasses}
                    ${cursorClass}
                  `}
                >
                  <div className="text-center">
                    <h4 className={`font-semibold text-lg ${isMatched ? colorStyle!.text : 'text-white'}`}>
                      {cable.name}
                    </h4>
                    {isMatched && (
                      <span className={`${colorStyle!.text} text-sm`}>✓ Matched</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cable Drawings Column */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Images to Find</h3>
          <div className="space-y-3">
            {shuffledDescriptions.map((cable) => {
              const colorIndex = matchedPairs.get(cable.id);
              const isMatched = colorIndex !== undefined;

              const colorStyle = isMatched ? PAIR_COLORS[colorIndex!] : null;
              const matchedClasses = isMatched
                ? `${colorStyle!.border} ${colorStyle!.bg} opacity-50 shadow-lg ${colorStyle!.shadow}`
                : 'border-gray-600';
              const cursorClass = isMatched ? 'cursor-default' : 'cursor-pointer';

              return (
                <div
                  key={`desc-${cable.id}`}
                  onClick={() => handleImageClick(cable.id)}
                  className={`
                    p-4 bg-gray-800/50 border-2 border-dashed rounded-lg transition-all duration-200 min-h-[100px] flex items-center justify-center
                    ${matchedClasses}
                    ${cursorClass}
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
                        // Fallback placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = `text-sm ${isMatched ? colorStyle!.text : 'text-gray-300'}`;
                        fallback.textContent = 'Image not available';
                        e.currentTarget.parentNode?.appendChild(fallback);
                      }}
                    />
                    {isMatched && (
                      <span className={`absolute top-1 right-1 ${colorStyle!.text} text-xl`}>✓</span>
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
        <p>💡 Tip: Pick a cable, then click the matching image to lock it in.</p>
      </div>
    </div>
  );
};

export default CableDragDropChallenge;
