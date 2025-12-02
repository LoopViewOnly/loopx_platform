import React, { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------
// 📌 IMAGE IMPORTS (REAL)
// ----------------------------------------------------------
import r1 from '../assets/fake_or_real/real/r1.jpeg';
import r2 from '../assets/fake_or_real/real/r2.jpeg';
import r3 from '../assets/fake_or_real/real/r3.jpeg';
import r4 from '../assets/fake_or_real/real/r4.jpeg';
import r5 from '../assets/fake_or_real/real/r5.jpeg';

// ----------------------------------------------------------
// 📌 IMAGE IMPORTS (FAKE)
// ----------------------------------------------------------
import f1 from '../assets/fake_or_real/fake/f1.jpg';
import f2 from '../assets/fake_or_real/fake/f2.jpg';
import f3 from '../assets/fake_or_real/fake/f3.jpg';
import f4 from '../assets/fake_or_real/fake/f4.jpg';
import f5 from '../assets/fake_or_real/fake/f5.jpg';

// ----------------------------------------------------------
// 📌 IMAGE COLLECTION
// ----------------------------------------------------------
const REAL_OR_FAKE_IMAGES = {
    real: [r1, r2, r3, r4, r5],
    fake: [f1, f2, f3, f4, f5]
};

interface RealOrFakeChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const STREAK_GOAL = 3;

type ImagePair = {
    left: { src: string; type: 'real' | 'fake' };
    right: { src: string; type: 'real' | 'fake' };
};

// Get random array item
const getRandomItem = <T,>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

// ----------------------------------------------------------
// 📌 FULL REAL OR FAKE COMPONENT
// ----------------------------------------------------------
const RealOrFakeChallenge: React.FC<RealOrFakeChallengeProps> = ({
    onComplete,
    challengeTitle,
}) => {
    const [streak, setStreak] = useState(0);
    const [imagePair, setImagePair] = useState<ImagePair | null>(null);
    const [selection, setSelection] = useState<'left' | 'right' | null>(null);
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [usedRealImages, setUsedRealImages] = useState<Set<string>>(new Set());
    const [usedFakeImages, setUsedFakeImages] = useState<Set<string>>(new Set());

    const setupNewRound = useCallback(() => {
        // Get available images (not yet used)
        const availableReal = REAL_OR_FAKE_IMAGES.real.filter(img => !usedRealImages.has(img));
        const availableFake = REAL_OR_FAKE_IMAGES.fake.filter(img => !usedFakeImages.has(img));

        // If we've used all images, reset the pools
        const realPool = availableReal.length > 0 ? availableReal : REAL_OR_FAKE_IMAGES.real;
        const fakePool = availableFake.length > 0 ? availableFake : REAL_OR_FAKE_IMAGES.fake;

        // Reset used sets if pools were exhausted
        if (availableReal.length === 0) {
            setUsedRealImages(new Set());
        }
        if (availableFake.length === 0) {
            setUsedFakeImages(new Set());
        }

        const realImg = getRandomItem(realPool);
        const fakeImg = getRandomItem(fakePool);

        // Track used images
        setUsedRealImages(prev => new Set([...prev, realImg]));
        setUsedFakeImages(prev => new Set([...prev, fakeImg]));

        const isRealOnLeft = Math.random() > 0.5;

        setImagePair({
            left: {
                src: isRealOnLeft ? realImg : fakeImg,
                type: isRealOnLeft ? 'real' : 'fake',
            },
            right: {
                src: isRealOnLeft ? fakeImg : realImg,
                type: isRealOnLeft ? 'fake' : 'real',
            },
        });

        setSelection(null);
        setIsRoundOver(false);
        setHasSubmitted(false);
    }, [usedRealImages, usedFakeImages]);

    useEffect(() => {
        setupNewRound();
    }, [setupNewRound]);

    const handleImageClick = (chosenSide: 'left' | 'right') => {
        if (isRoundOver || !imagePair || hasSubmitted) return;
        setHasSubmitted(true);

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
        if (!isRoundOver || !imagePair)
            return 'border-blue-500/50 hover:border-yellow-400';

        const isCorrectChoice = imagePair[side].type === 'real';

        if (selection === side) {
            return isCorrectChoice
                ? 'border-green-500 ring-4 ring-green-500/50'
                : 'border-red-500 ring-4 ring-red-500/50';
        } else {
            return isCorrectChoice
                ? 'border-green-500'
                : 'border-gray-600 opacity-60';
        }
    };

    if (!imagePair) return null;

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-2">
                {challengeTitle}
            </h2>
            <p className="text-gray-300 mb-6">
                One of these images is real, the other is AI-generated. Click the
                real one. Get {STREAK_GOAL} in a row to win!
            </p>

            {/* Streak Display */}
            <div className="flex justify-center items-center mb-6 gap-4">
                <span className="text-white text-lg font-bold">Streak:</span>
                <div className="flex gap-2">
                    {Array.from({ length: STREAK_GOAL }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-full transition-all duration-300 ${
                                i < streak
                                    ? 'bg-yellow-400 shadow-[0_0_10px_#facc15]'
                                    : 'bg-black/40'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    className={`p-2 rounded-lg border-4 transition-all duration-300 cursor-pointer ${getBorderStyle(
                        'left'
                    )}`}
                    onClick={() => handleImageClick('left')}
                >
                    <img
                        src={imagePair.left.src}
                        alt="option"
                        className="w-full h-auto object-cover rounded-md aspect-square"
                    />
                </div>

                <div
                    className={`p-2 rounded-lg border-4 transition-all duration-300 cursor-pointer ${getBorderStyle(
                        'right'
                    )}`}
                    onClick={() => handleImageClick('right')}
                >
                    <img
                        src={imagePair.right.src}
                        alt="option"
                        className="w-full h-auto object-cover rounded-md aspect-square"
                    />
                </div>
            </div>

            {/* Result Text */}
            <div className="mt-6 min-h-[3rem] flex items-center justify-center">
                {isRoundOver && (
                    <p
                        className={`text-3xl font-bold transition-opacity duration-500 ${
                            selection &&
                            imagePair[selection].type === 'real'
                                ? 'text-green-400'
                                : 'text-red-400'
                        }`}
                    >
                        {selection &&
                        imagePair[selection].type === 'real'
                            ? 'Correct!'
                            : 'Incorrect! Streak reset.'}
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
