import React, { useState } from 'react';
import { KEYBOARD_SHORTCUTS_CHALLENGE } from '../challenges/content';

interface KeyboardShortcutsChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const KeyboardShortcutsChallenge: React.FC<KeyboardShortcutsChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentShortcutIndex, setCurrentShortcutIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentLevel = KEYBOARD_SHORTCUTS_CHALLENGE.levels[currentLevelIndex];
  const currentShortcut = currentLevel.shortcuts[currentShortcutIndex];

  // Generate multiple choice options for the current shortcut
  const generateOptions = () => {
    const correctAnswer = currentShortcut.action;
    const allActions = KEYBOARD_SHORTCUTS_CHALLENGE.levels.flatMap(level =>
      level.shortcuts.map(shortcut => shortcut.action)
    );

    // Remove duplicates and the correct answer
    const otherActions = [...new Set(allActions)].filter(action => action !== correctAnswer);

    // Select 3 random wrong answers
    const wrongAnswers = otherActions.sort(() => Math.random() - 0.5).slice(0, 3);

    // Combine and shuffle all options
    const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return allOptions;
  };

  const options = generateOptions();

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentShortcut.action;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + currentLevel.pointsPerCorrect);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);

      if (currentShortcutIndex < currentLevel.shortcuts.length - 1) {
        setCurrentShortcutIndex(prev => prev + 1);
      } else {
        // All shortcuts completed
        onComplete(score + (correct ? currentLevel.pointsPerCorrect : 0));
      }
    }, 2000);
  };

  const renderKeys = (keys: string[]) => {
    return keys.map((key, index) => (
      <span
        key={index}
        className="inline-flex items-center justify-center min-w-[40px] h-10 px-2 mx-1 bg-gray-700 border border-gray-600 rounded text-sm font-mono text-white"
      >
        {key}
      </span>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">What does this keyboard shortcut do?</p>
        <div className="text-sm text-cyan-400 mt-2">
          Question {currentShortcutIndex + 1} of {currentLevel.shortcuts.length} • Score: {score}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="mb-6">
          <div className="text-gray-400 mb-4">Shortcut Keys:</div>
          <div className="flex justify-center items-center mb-8">
            {renderKeys(currentShortcut.keys)}
          </div>
        </div>

        {showResult && (
          <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
            <p className={`text-xl font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="text-gray-300 mt-1">
              The correct answer is: <span className="font-semibold text-white">{currentShortcut.action}</span>
            </p>
          </div>
        )}

        {!showResult && (
          <div>
            <div className="text-gray-400 mb-4">Choose the correct action:</div>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg text-white font-medium transition-colors hover:border-cyan-500/50"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-4">
        {KEYBOARD_SHORTCUTS_CHALLENGE.levels.map((level, levelIdx) => (
          <div key={levelIdx} className="flex items-center">
            <div className={`w-3 h-3 rounded-full mx-1 ${
              levelIdx < currentLevelIndex ? 'bg-green-500' :
              levelIdx === currentLevelIndex ? 'bg-cyan-500' : 'bg-gray-600'
            }`} />
            {levelIdx < KEYBOARD_SHORTCUTS_CHALLENGE.levels.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-600 mx-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyboardShortcutsChallenge;
