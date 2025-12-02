import React, { useState, useRef, useEffect } from 'react';
import { BIGBEN_WALKING_CHALLENGE } from '../challenges/content';

interface WheelPickerChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

const WheelPickerChallenge: React.FC<WheelPickerChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wheelRef = useRef<HTMLDivElement>(null);

    const { minValue, maxValue, answer } = BIGBEN_WALKING_CHALLENGE;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (submittedCorrectly) return;
        setIsDragging(true);
        setStartY(e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (submittedCorrectly) return;
        setIsDragging(true);
        setStartY(e.touches[0].clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || submittedCorrectly) return;
        const deltaY = startY - e.clientY;
        if (Math.abs(deltaY) > 20) {
            if (deltaY > 0 && currentValue < maxValue) {
                setCurrentValue(prev => prev + 1);
            } else if (deltaY < 0 && currentValue > minValue) {
                setCurrentValue(prev => prev - 1);
            }
            setStartY(e.clientY);
        }
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || submittedCorrectly) return;
        const deltaY = startY - e.touches[0].clientY;
        if (Math.abs(deltaY) > 20) {
            if (deltaY > 0 && currentValue < maxValue) {
                setCurrentValue(prev => prev + 1);
            } else if (deltaY < 0 && currentValue > minValue) {
                setCurrentValue(prev => prev - 1);
            }
            setStartY(e.touches[0].clientY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, startY, currentValue]);

    const handleSubmit = () => {
        if (submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        if (currentValue === answer) {
            setSubmittedCorrectly(true);
            setError(null);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setError(`${currentValue} minutes? That's not quite right. Try again! 🚶`);
            setHasSubmitted(false);
        }
    };

    const getDisplayValue = (offset: number) => {
        const value = currentValue + offset;
        if (value < minValue || value > maxValue) return null;
        return value;
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            
            {/* Landmarks visual */}
            <div className="flex justify-center items-center gap-4 mb-4 text-6xl">
                <span title="Big Ben">🕐</span>
                <span className="text-2xl text-gray-400">→ 🚶 →</span>
                <span title="London Eye">🎡</span>
            </div>
            
            <p className="text-gray-300 mb-2 text-lg">{BIGBEN_WALKING_CHALLENGE.question}</p>
            <p className="text-gray-500 text-sm mb-6">Drag the wheel up or down to select your answer</p>

            {/* Wheel Picker */}
            <div className="flex justify-center mb-8">
                <div 
                    ref={wheelRef}
                    className={`relative w-32 h-48 bg-gradient-to-b from-black/60 via-black/20 to-black/60 rounded-2xl border-2 ${isDragging ? 'border-cyan-400' : 'border-blue-500/50'} overflow-hidden cursor-grab active:cursor-grabbing select-none transition-colors`}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                >
                    {/* Top fade overlay */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
                    
                    {/* Bottom fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

                    {/* Selection indicator */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 border-y-2 border-cyan-400/50 bg-cyan-400/10 z-5 pointer-events-none" />

                    {/* Numbers */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Value above (peek) */}
                        <div className="h-14 flex items-center justify-center text-3xl font-bold text-gray-600 opacity-50">
                            {getDisplayValue(-1) !== null ? getDisplayValue(-1) : ''}
                        </div>
                        
                        {/* Current value */}
                        <div className="h-14 flex items-center justify-center text-5xl font-bold text-white">
                            {currentValue}
                        </div>
                        
                        {/* Value below (peek) */}
                        <div className="h-14 flex items-center justify-center text-3xl font-bold text-gray-600 opacity-50">
                            {getDisplayValue(1) !== null ? getDisplayValue(1) : ''}
                        </div>
                    </div>

                    {/* Drag hint arrows */}
                    {!submittedCorrectly && (
                        <>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-cyan-400/60 text-sm animate-bounce z-20">
                                ▲
                            </div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-cyan-400/60 text-sm animate-bounce z-20">
                                ▼
                            </div>
                        </>
                    )}
                </div>
                
                <div className="flex items-center ml-4">
                    <span className="text-2xl text-gray-400 font-semibold">minutes</span>
                </div>
            </div>

            {!submittedCorrectly && (
                <button
                    onClick={handleSubmit}
                    disabled={hasSubmitted}
                    className="w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Submit Answer
                </button>
            )}

            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">
                        ✅ Correct! It's about a 9-minute walk along the Thames!
                    </p>
                )}
            </div>
        </div>
    );
};

export default WheelPickerChallenge;

