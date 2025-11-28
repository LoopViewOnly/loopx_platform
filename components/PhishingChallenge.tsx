import React, { useState } from 'react';

interface PhishingChallengeProps {
    challenge: {
        id: string;
        type: 'Email' | 'SMS' | 'Voice';
        content: string;
        isPhishing: boolean;
        explanation: string;
        source: string;
    };
    challengeTitle: string;
    userName: string;
    onComplete: (score: number) => void;
    advanceChallenge: () => void;
}

const PhishingChallenge: React.FC<PhishingChallengeProps> = ({ challenge, challengeTitle, userName, onComplete, advanceChallenge }) => {
    const [isCorrectlyAnswered, setIsCorrectlyAnswered] = useState(false);
    const [userSelection, setUserSelection] = useState<boolean | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [mistakes, setMistakes] = useState(0);

    const selectOption = (isPhishingGuess: boolean) => {
        if (isCorrectlyAnswered || hasSubmitted) return;
        setHasSubmitted(true);

        setUserSelection(isPhishingGuess);

        const isCorrect = isPhishingGuess === challenge.isPhishing;

        if (isCorrect) {
            setIsCorrectlyAnswered(true);
            const score = mistakes === 0 ? 100 : 50;
            onComplete(score);
        } else {
            setMistakes(prev => prev + 1);
            setHasSubmitted(false);
        }
    };
    
    const formattedContent = challenge.content.replace('{userName}', userName);

    const getButtonClass = (isPhishingButton: boolean) => {
        const basePhishing = 'bg-red-600 hover:bg-red-700';
        const baseSafe = 'bg-green-600 hover:bg-green-700';
        
        if (isCorrectlyAnswered) {
            if (challenge.isPhishing === isPhishingButton) {
                return 'bg-green-700 border-4 border-green-400';
            } else {
                return 'opacity-50 ' + (isPhishingButton ? basePhishing : baseSafe);
            }
        }
        
        if (userSelection === isPhishingButton && userSelection !== challenge.isPhishing) {
             return 'bg-red-700 border-4 border-red-400 shake-animation';
        }

        return isPhishingButton ? basePhishing : baseSafe;
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">{challengeTitle}</h2>
            <p className="text-center text-gray-300 mb-6">
                Decide: Is this content a Phishing attempt or Safe?
            </p>

            <div className="space-y-6">
                <div className="p-4 bg-blue-900/20 border-l-4 border-blue-500 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-blue-300 mb-2">
                        {challenge.type}
                    </h3>
                    <p className="text-sm font-medium text-gray-300 mb-2">{challenge.source}</p>
                    
                    <div className="p-3 bg-black/40 border border-gray-600 rounded-md text-gray-200 whitespace-pre-wrap">
                        {formattedContent}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                        onClick={() => selectOption(true)}
                        disabled={isCorrectlyAnswered || hasSubmitted}
                        className={`w-full py-4 text-white font-bold rounded-lg shadow-md transition-all duration-200 transform disabled:cursor-not-allowed text-lg ${getButtonClass(true)}`}
                    >
                        Phishing
                    </button>
                    <button
                        onClick={() => selectOption(false)}
                        disabled={isCorrectlyAnswered || hasSubmitted}
                        className={`w-full py-4 text-white font-bold rounded-lg shadow-md transition-all duration-200 transform disabled:cursor-not-allowed text-lg ${getButtonClass(false)}`}
                    >
                        Safe
                    </button>
                </div>

                {/* Feedback and Explanation Area */}
                <div className="min-h-[120px]">
                    {isCorrectlyAnswered ? (
                        <div className="mt-6 p-4 rounded-lg transition-all duration-300 shadow-md border bg-green-900/30 border-green-500">
                            <h3 className="font-bold mb-2 flex items-center text-green-400">
                                Correct! This scenario is {challenge.isPhishing ? 'Phishing' : 'Safe'}.
                            </h3>
                            <p className="text-sm text-gray-300">{challenge.explanation}</p>
                        </div>
                    ) : userSelection !== null && userSelection !== challenge.isPhishing ? (
                        <div className="mt-6 p-4 rounded-lg transition-all duration-300 shadow-md border bg-red-900/30 border-red-500">
                             <h3 className="font-bold text-red-400">Incorrect. Please try again.</h3>
                        </div>
                    ) : null }
                </div>


                {isCorrectlyAnswered && (
                    <button
                        onClick={advanceChallenge}
                        className="w-full max-w-sm mx-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Next Challenge
                    </button>
                )}
            </div>
        </div>
    );
};

export default PhishingChallenge;