
import React, { useState, useEffect } from 'react';
import { SIMILARITY_CHALLENGES, type SimilarityChallenge } from '../challenges/content';
import { SIMILARITY_THRESHOLD } from '../constants';

interface ImageSimilarityChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const STOP_WORDS = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'is', 'are', 'was', 'were', 'be', 'being', 'been', 
    'it', 'that', 'this', 'these', 'those', 'there', 'here', 'while', 'during', 'before', 'after', 'middle', 'next', 'side', 'front', 'back',
    'background', 'foreground', 'left', 'right', 'top', 'bottom'
]);

const getTokens = (text: string) => {
    return text.toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // Remove punctuation
        .replace(/\s{2,}/g, " ") // Remove extra spaces
        .trim()
        .split(" ")
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
};

const ImageSimilarityChallenge: React.FC<ImageSimilarityChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [challenge, setChallenge] = useState<SimilarityChallenge | null>(null);
    const [prompt, setPrompt] = useState('');
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [showRealDescription, setShowRealDescription] = useState(false);

    useEffect(() => {
        const selectedChallenge = SIMILARITY_CHALLENGES[Math.floor(Math.random() * SIMILARITY_CHALLENGES.length)];
        setChallenge(selectedChallenge);
    }, []);

    const handleScorePrompt = () => {
        if (!prompt.trim() || isLoading || !challenge) return;

        setIsLoading(true);
        setStatusMessage('Comparing your words to the image description...');
        setScore(0); // Reset to 0 to trigger animation from start
        setIsSuccess(null);
        setShowRealDescription(false);

        // Delay to allow bar to reset and simulate processing
        setTimeout(() => {
            const descriptionTokens = getTokens(challenge.description);
            const userTokens = new Set(getTokens(prompt));
            
            let matches = 0;
            descriptionTokens.forEach(token => {
                if (userTokens.has(token)) {
                    matches++;
                }
            });

            let calculatedScore = 0;
            if (descriptionTokens.length > 0) {
                // Calculate percentage of description words found in user prompt
                // Multiply by 1.3 to be lenient (approx 60% match passes the 80% threshold)
                calculatedScore = Math.min(100, Math.round((matches / descriptionTokens.length) * 130));
            }

            setScore(calculatedScore);
            
            if (calculatedScore >= SIMILARITY_THRESHOLD) {
                setStatusMessage(`Success! You captured ${matches} key words. Score: ${calculatedScore}%`);
                setIsSuccess(true);
            } else {
                 setStatusMessage(`Score: ${calculatedScore}%. Target: ${SIMILARITY_THRESHOLD}%. You missed some key details.`);
                 setIsSuccess(false);
                 setShowRealDescription(true);
            }
            setIsLoading(false);
        }, 800);
    };

    if (!challenge) {
        return (
            <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass flex items-center justify-center min-h-[400px]">
                <p className="text-white text-lg">Loading challenge...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-2 text-center">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-center">Look at the image below. Describe it in detail. Your words will be compared to the real image description.</p>
            
            {/* Image Display Area */}
            <div className="flex justify-center mb-6">
                <div className="flex flex-col items-center">
                    <div className="aspect-square w-full max-w-md bg-black/20 rounded-lg shadow-lg overflow-hidden border-2 border-blue-500/30 flex items-center justify-center p-4">
                        <img src={challenge.imageUrl} alt="Challenge concept" className="w-full h-full object-contain rounded-md" />
                    </div>
                </div>
            </div>

            {/* Score Bar */}
            <div className="my-6">
                 <h3 className="text-center text-lg font-bold text-gray-200 mb-3">Similarity Score</h3>
                 <div className="w-full max-w-2xl mx-auto bg-black/40 rounded-full h-8 shadow-inner relative overflow-hidden border border-white/10">
                    <div className="absolute h-full w-0.5 bg-red-500 z-20" style={{ left: `${SIMILARITY_THRESHOLD}%` }}>
                         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-red-500"></div>
                    </div>
                    <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000 ease-out flex items-center justify-center" 
                        style={{ width: `${score}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-sm z-10">{score > 0 ? `${score}%` : ''}</span>
                 </div>
            </div>
            
            {/* Input Area */}
            <div className="flex flex-col items-center p-4 bg-black/20 rounded-lg mt-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full max-w-xl p-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-none mb-4"
                    rows={3}
                    placeholder="Describe the image here... (e.g., 'A yellow character riding a unicycle...')"
                    disabled={isSuccess === true}
                />
                <button
                    onClick={handleScorePrompt}
                    disabled={isLoading || !prompt.trim() || isSuccess === true}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02] disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Analyzing...' : 'Check Description'}
                </button>
            </div>
            
            {/* Status & Feedback */}
            <div className="mt-6 text-center min-h-[6rem] flex flex-col items-center justify-center">
                {statusMessage && <p className={`font-medium text-lg ${isSuccess === false ? 'text-red-400' : 'text-green-400'}`}>{statusMessage}</p>}
                
                {isSuccess === true && (
                     <button 
                        onClick={() => onComplete(true)} 
                        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                        Next Challenge
                    </button>
                )}
                
                {showRealDescription && (
                    <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg max-w-xl">
                        <p className="text-xs text-yellow-500 uppercase font-bold mb-1">Target Description</p>
                        <p className="text-gray-300 italic">"{challenge.description}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageSimilarityChallenge;