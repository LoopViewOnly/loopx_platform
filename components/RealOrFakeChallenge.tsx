
import React, { useState, useEffect, useCallback } from 'react';
import { REAL_OR_FAKE_IMAGES } from '../challenges/assets';

interface RealOrFakeChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const STREAK_GOAL = 3;

type ImagePair = {
    left: { src: string; type: 'real' | 'fake' };
    right: { src: string; type: 'real' | 'fake' };
};

// Helper to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const RealOrFakeChallenge: React.FC<RealOrFakeChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [streak, setStreak] = useState(0);
    const [imagePair, setImagePair] = useState<ImagePair | null>(null);
    const [selection, setSelection] = useState<'left' | 'right' | null>(null);
    const [isRoundOver, setIsRoundOver] = useState(false);

    const setupNewRound = useCallback(() => {
        const realImg = getRandomItem(REAL_OR_FAKE_IMAGES.real);
        const fakeImg = getRandomItem(REAL_OR_FAKE_IMAGES.fake);
        
        const isRealOnLeft = Math.random() > 0.5;

        setImagePair({
            left: { src: isRealOnLeft ? realImg : fakeImg, type: isRealOnLeft ? 'real' : 'fake' },
            right: { src: isRealOnLeft ? fakeImg : realImg, type: isRealOnLeft ? 'fake' : 'real' },
        });

        setSelection(null);
        setIsRoundOver(false);
    }, []);

    useEffect(() => {
        setupNewRound();
    }, [setupNewRound]);

    const handleImageClick = (chosenSide: 'left' | 'right') => {
        if (isRoundOver || !imagePair) return;

        setIsRoundOver(true);
        setSelection(chosenSide);

        const chosenType = imagePair[chosenSide].type;
        const isCorrect = chosenType === 'real';

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (newStreak >= STREAK_GOAL) {
                setTimeout(() => onComplete(true), 2000);
            } else {
                setTimeout(setupNewRound, 2000);
            }
        } else {
            setStreak(0);
            setTimeout(setupNewRound, 2000);
        }
    };

    const getBorderStyle = (side: 'left' | 'right') => {
        if (!isRoundOver || !imagePair) {
            return 'border-blue-500/50 hover:border-yellow-400';
        }

        const isCorrectChoice = imagePair[side].type === 'real';

        if (selection === side) { // This is the image the user clicked
            return isCorrectChoice ? 'border-green-500 ring-4 ring-green-500/50' : 'border-red-500 ring-4 ring-red-500/50';
        } else { // This is the other image
            return isCorrectChoice ? 'border-green-500' : 'border-gray-600 opacity-60';
        }
    };
    
    if (!imagePair) return null; // Or a loading state

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6">One of these images is real, the other is AI-generated. Click the real one. Get {STREAK_GOAL} in a row to win!</p>

            <div className="flex justify-center items-center mb-6 gap-4">
                <span className="text-white text-lg font-bold">Streak:</span>
                <div className="flex gap-2">
                    {Array.from({ length: STREAK_GOAL }).map((_, index) => (
                        <div key={index} className={`w-8 h-8 rounded-full transition-all duration-300 ${index < streak ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]' : 'bg-black/40'}`} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    className={`p-2 rounded-lg border-4 transition-all duration-300 cursor-pointer ${getBorderStyle('left')}`}
                    onClick={() => handleImageClick('left')}
                >
                    <img src={imagePair.left.src} alt="Challenge option one" className="w-full h-auto object-cover rounded-md aspect-square" />
                </div>
                 <div
                    className={`p-2 rounded-lg border-4 transition-all duration-300 cursor-pointer ${getBorderStyle('right')}`}
                    onClick={() => handleImageClick('right')}
                >
                    <img src={imagePair.right.src} alt="Challenge option two" className="w-full h-auto object-cover rounded-md aspect-square" />
                </div>
            </div>
            
            <div className="mt-6 min-h-[3rem] flex items-center justify-center">
                {isRoundOver && (
                    <p className={`text-3xl font-bold transition-opacity duration-500 ${selection && imagePair[selection].type === 'real' ? 'text-green-400' : 'text-red-400'}`}>
                        {selection && imagePair[selection].type === 'real' ? 'Correct!' : 'Incorrect! Streak reset.'}
                    </p>
                )}
                 {streak >= STREAK_GOAL && (
                    <p className="text-3xl font-bold text-green-400 animate-pulse">
                        Challenge Passed!
                    </p>
                )}
            </div>
        </div>
    );
};

export default RealOrFakeChallenge;
