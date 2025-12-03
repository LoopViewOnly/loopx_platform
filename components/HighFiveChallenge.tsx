import React, { useState, useEffect } from 'react';
import { HIGH_FIVE_CHALLENGE } from '../challenges/content';

interface HighFiveChallengeProps {
  onComplete: (points: number) => void;
  challengeTitle: string;
}

const HighFiveChallenge: React.FC<HighFiveChallengeProps> = ({ onComplete, challengeTitle }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [showContinueButton, setShowContinueButton] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowContinueButton(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
    onComplete(HIGH_FIVE_CHALLENGE.points);
  };

  const progressPercentage = ((15 - timeLeft) / 15) * 100;

  // Calculate progress bar color based on time
  const getProgressBarColor = () => {
    if (progressPercentage < 33) return 'bg-red-500';
    if (progressPercentage < 66) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">{challengeTitle}</h1>
        <p className="text-gray-300">High-five 5 different Loopers before the time runs out!</p>
      </div>

      {/* Timer and Progress Bar */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-white mb-4">
          {timeLeft > 0 ? `${timeLeft}s` : 'Time\'s up!'}
        </div>

        <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-4">
          <div
            className={`${getProgressBarColor()} h-full transition-all duration-1000 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Loopers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {HIGH_FIVE_CHALLENGE.loopers.map((looper) => (
          <div
            key={looper.id}
            className="relative p-4 bg-gray-800/50 border-2 border-gray-600 rounded-lg"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">
                {looper.emoji}
              </div>

              <div className="text-sm font-medium text-gray-300">
                {looper.name}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {looper.greeting}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      {showContinueButton && (
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-300 text-xl shadow-lg hover:shadow-xl"
          >
            Continue
          </button>

          <p className="text-green-400 mt-2">Time's up! You can continue to the next challenge.</p>
        </div>
      )}
    </div>
  );
};

export default HighFiveChallenge;
