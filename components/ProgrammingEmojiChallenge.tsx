import React, { useState, useEffect } from 'react';
import { PROGRAMMING_EMOJI_CHALLENGE } from '../challenges/content';

interface ProgrammingEmojiChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const ProgrammingEmojiChallenge: React.FC<ProgrammingEmojiChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentEmoji = PROGRAMMING_EMOJI_CHALLENGE.emojis[currentIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === currentEmoji.name;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(prev => prev + PROGRAMMING_EMOJI_CHALLENGE.pointsPerCorrect);
    }

    // Auto-advance after showing result
    setTimeout(() => {
      if (currentIndex < PROGRAMMING_EMOJI_CHALLENGE.emojis.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // All questions answered
        onComplete(score + (correct ? PROGRAMMING_EMOJI_CHALLENGE.pointsPerCorrect : 0));
      }
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">Guess what programming language or tool each emoji represents!</p>
        <div className="text-sm text-cyan-400 mt-2">
          Question {currentIndex + 1} of {PROGRAMMING_EMOJI_CHALLENGE.emojis.length} • Score: {score}/{PROGRAMMING_EMOJI_CHALLENGE.totalPoints}
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-8xl mb-6">{currentEmoji.emoji}</div>

        {showResult && (
          <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-red-500/20 border border-red-500/50'}`}>
            <p className={`text-xl font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="text-gray-300 mt-1">
              The answer is: <span className="font-semibold text-white">{currentEmoji.name}</span>
            </p>
          </div>
        )}

        {!showResult && (
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentEmoji.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded-lg text-white font-medium transition-colors hover:border-cyan-500/50"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgrammingEmojiChallenge;
