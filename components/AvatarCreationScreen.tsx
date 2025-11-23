
import React, { useState } from 'react';
import { EmojiConfig } from '../types';
import EmojiBuilder, { generateEmojiSvg, svgToDataUrl } from './AvatarBuilder';

interface AvatarCreationScreenProps {
    userName: string;
    onComplete: (avatarUrl: string, config: EmojiConfig) => void;
}

const defaultEmojiConfig: EmojiConfig = {
    backgroundColor: '#3B82F6',
    eyebrowStyle: 'default',
    eyeStyle: 'default',
    noseStyle: 'curve',
    mouthStyle: 'neutral',
};

const AvatarCreationScreen: React.FC<AvatarCreationScreenProps> = ({ userName, onComplete }) => {
    const [emojiConfig, setEmojiConfig] = useState<EmojiConfig>(defaultEmojiConfig);

    const handleStart = () => {
        const emojiSvg = generateEmojiSvg(emojiConfig);
        const emojiUrl = svgToDataUrl(emojiSvg);
        onComplete(emojiUrl, emojiConfig);
    };

    return (
        <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-4xl p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-300 mb-2">Welcome, {userName}!</h2>
                </div>

                <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-gray-200 text-center">Design Your Emoji</h3>
                    <EmojiBuilder config={emojiConfig} setConfig={setEmojiConfig} />
                </div>

                <div className="text-center mt-8">
                     <button
                        onClick={handleStart}
                        className="w-full max-w-sm px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Start Challenges
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarCreationScreen;
