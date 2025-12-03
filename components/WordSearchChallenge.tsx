import React, { useState } from 'react';
import { WORD_SEARCH_CHALLENGE } from '../challenges/content';

interface WordSearchChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const WordSearchChallenge: React.FC<WordSearchChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [currentInput, setCurrentInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleWordSubmit = () => {
    const word = currentInput.trim().toUpperCase();
    const availableWords = WORD_SEARCH_CHALLENGE.availableWords.map(w => w.toUpperCase());

    if (!word) return;

    if (foundWords.has(word)) {
      setFeedback(`"${word}" has already been found!`);
      setCurrentInput('');
      setTimeout(() => setFeedback(null), 2000);
      return;
    }

    if (availableWords.includes(word)) {
      setFoundWords(prev => new Set([...prev, word]));
      setFeedback(`Great! "${word}" found! 🎉`);
      setCurrentInput('');

      // Check if enough words are found (10 words)
      if (foundWords.size + 1 === WORD_SEARCH_CHALLENGE.requiredWordsCount) {
        setTimeout(() => {
          setFeedback('Challenge complete! You found 10 words! 🏆');
          setTimeout(() => onComplete(WORD_SEARCH_CHALLENGE.points), 2000);
        }, 1000);
      } else {
        setTimeout(() => setFeedback(null), 2000);
      }
    } else {
      setFeedback(`"${word}" is not in the available words list. Keep looking!`);
      setCurrentInput('');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleWordSubmit();
    }
  };

  const isCompleted = foundWords.size === WORD_SEARCH_CHALLENGE.requiredWordsCount;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300 mb-4">{WORD_SEARCH_CHALLENGE.instruction}</p>

        <div className="mb-6">
          <a
            href={WORD_SEARCH_CHALLENGE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-semibold"
          >
            🕵️ Open Word Search Game
          </a>
        </div>

        <div className="text-sm text-cyan-400">
          Progress: {foundWords.size} / {WORD_SEARCH_CHALLENGE.requiredWordsCount} words found
        </div>
      </div>

      {isCompleted && (
        <div className="text-center mb-6">
          <div className="inline-block p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <p className="text-2xl font-bold text-green-400 mb-2">🎉 Challenge Complete! 🎉</p>
            <p className="text-gray-300">Excellent detective work! You found 10 words and can continue to the next challenge.</p>
          </div>
        </div>
      )}

      {/* Word Input Section */}
      <div className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a word you found..."
            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            disabled={isCompleted}
          />
          <button
            onClick={handleWordSubmit}
            disabled={!currentInput.trim() || isCompleted}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
          >
            Submit
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            feedback.includes('Great') || feedback.includes('All words') ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
            feedback.includes('already been found') ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400' :
            'bg-red-500/20 border border-red-500/50 text-red-400'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {/* Found Words List */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white text-center mb-4">Found Words</h3>
        {foundWords.size > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from(foundWords).map((word) => (
              <div
                key={word}
                className="p-3 rounded-lg text-center font-semibold bg-green-500/20 border border-green-500/50 text-green-400"
              >
                <span className="flex items-center justify-center">
                  {word} <span className="ml-2">✓</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <p>No words found yet. Start searching in the word search game!</p>
          </div>
        )}
      </div>

      {/* Hint Section */}
      <div className="text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
        >
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>

        {showHint && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg max-w-2xl mx-auto">
            <h4 className="text-blue-400 font-semibold mb-2">💡 Hint:</h4>
            <p className="text-gray-300 text-sm">
              The words can appear horizontally, vertically, or diagonally in the grid.
              Look carefully at each letter and try different directions. Some words might be backwards!
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-green-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${(foundWords.size / WORD_SEARCH_CHALLENGE.requiredWordsCount) * 100}%` }}
          />
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          {foundWords.size} of {WORD_SEARCH_CHALLENGE.requiredWordsCount} words found
        </div>
      </div>
    </div>
  );
};

export default WordSearchChallenge;
