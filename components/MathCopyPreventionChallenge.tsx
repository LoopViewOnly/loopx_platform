import React, { useState, useRef, useEffect } from 'react';
import { MATH_COPY_PREVENTION_CHALLENGE } from '../challenges/content';

interface MathCopyPreventionChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const MathCopyPreventionChallenge: React.FC<MathCopyPreventionChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [copyAttempted, setCopyAttempted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const correct = userAnswer.trim() === MATH_COPY_PREVENTION_CHALLENGE.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => onComplete(MATH_COPY_PREVENTION_CHALLENGE.points), 2000);
    } else {
      // Allow them to keep trying - hide result after 2 seconds and let them try again
      setTimeout(() => {
        setShowResult(false);
        setUserAnswer(''); // Clear the input for another try
        if (inputRef.current) {
          inputRef.current.focus(); // Refocus the input
        }
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      handleSubmit();
    }
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setCopyAttempted(true);
    // Clear the input when copy is attempted
    setUserAnswer('');
    setTimeout(() => setCopyAttempted(false), 3000);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setCopyAttempted(true);
    setTimeout(() => setCopyAttempted(false), 3000);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">Solve this math problem. Copying is not allowed!</p>
      </div>

      <div className="text-center mb-8">
        <div
          className="text-6xl font-bold text-cyan-400 mb-6 font-mono select-none"
          onCopy={(e) => e.preventDefault()}
          onPaste={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
          style={{ userSelect: 'none' }}
        >
          {MATH_COPY_PREVENTION_CHALLENGE.question}
        </div>

        <div className="max-w-md mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
            onKeyPress={handleKeyPress}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onContextMenu={handleContextMenu}
            placeholder="Enter your answer..."
            className="w-full px-6 py-4 text-center text-2xl font-mono bg-gray-900 border-2 border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            disabled={showResult}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {copyAttempted && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">
                {MATH_COPY_PREVENTION_CHALLENGE.copyPreventionMessage}
              </p>
            </div>
          )}

          {showResult && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
              <p className={`text-xl font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </p>
              {isCorrect ? (
                <p className="text-gray-300 mt-1">Great job! You solved it yourself! 🎉</p>
              ) : (
                <p className="text-gray-300 mt-1">
                  Try again! Keep calculating in your head.
                </p>
              )}
            </div>
          )}

          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="mt-6 w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathCopyPreventionChallenge;
