import React, { useState } from 'react';
import { IP_TRIVIA_CHALLENGE } from '../challenges/content';

interface IPTriviaChallenge2Props {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const WRONG_PENALTY = 5;
const MAX_BONUS_ATTEMPTS = 3;

const IPTriviaChallenge2: React.FC<IPTriviaChallenge2Props> = ({ onComplete, challengeTitle }) => {
    const [locationAnswer, setLocationAnswer] = useState('');
    const [ownerAnswer, setOwnerAnswer] = useState('');
    const [locationCorrect, setLocationCorrect] = useState(false);
    const [ownerCorrect, setOwnerCorrect] = useState(false);
    const [locationScore, setLocationScore] = useState(IP_TRIVIA_CHALLENGE.questions.location.points);
    const [ownerScore, setOwnerScore] = useState(IP_TRIVIA_CHALLENGE.questions.owner.points);
    const [bonusAttempts, setBonusAttempts] = useState(0);
    const [bonusLocked, setBonusLocked] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
    const [ownerFeedback, setOwnerFeedback] = useState<string | null>(null);

    const handleLocationSubmit = () => {
        if (locationCorrect || isComplete) return;
        if (!locationAnswer.trim()) return;

        const normalizedLocation = locationAnswer.trim().toLowerCase();
        const isCorrect = normalizedLocation === IP_TRIVIA_CHALLENGE.questions.location.answer;

        if (isCorrect) {
            setLocationCorrect(true);
            setLocationFeedback(`✅ Correct! +${locationScore} points`);
        } else {
            setLocationScore(prev => Math.max(0, prev - WRONG_PENALTY));
            setLocationFeedback(`❌ Wrong! -${WRONG_PENALTY} points. Try again!`);
            setLocationAnswer('');
            setTimeout(() => setLocationFeedback(null), 2000);
        }
    };

    const handleOwnerSubmit = () => {
        if (ownerCorrect || isComplete || bonusLocked) return;
        if (!ownerAnswer.trim()) return;

        const normalizedOwner = ownerAnswer.trim().toLowerCase();
        const isCorrect = normalizedOwner === IP_TRIVIA_CHALLENGE.questions.owner.answer;

        if (isCorrect) {
            setOwnerCorrect(true);
            setOwnerFeedback(`✅ Correct! +${ownerScore} points`);
        } else {
            const newAttempts = bonusAttempts + 1;
            setBonusAttempts(newAttempts);
            setOwnerScore(prev => Math.max(0, prev - WRONG_PENALTY));
            
            if (newAttempts >= MAX_BONUS_ATTEMPTS) {
                setBonusLocked(true);
                setOwnerFeedback(`🔒 Locked! Answer was: Cloudflare`);
            } else {
                setOwnerFeedback(`❌ Wrong! -${WRONG_PENALTY} points. ${MAX_BONUS_ATTEMPTS - newAttempts} tries left`);
                setOwnerAnswer('');
                setTimeout(() => setOwnerFeedback(null), 2000);
            }
        }
    };

    const handleFinish = () => {
        if (isComplete) return;
        
        let finalScore = 0;
        if (locationCorrect) finalScore += locationScore;
        if (ownerCorrect) finalScore += ownerScore;
        
        setIsComplete(true);
        onComplete(finalScore);
    };

    const handleLocationKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleLocationSubmit();
    };

    const handleOwnerKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleOwnerSubmit();
    };

    const canFinish = locationCorrect && (ownerCorrect || bonusLocked);
    const totalPotentialScore = (locationCorrect ? locationScore : 0) + (ownerCorrect ? ownerScore : 0);

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">{challengeTitle}</h2>

            {/* IP Display */}
            <div className="mb-8 p-6 bg-black/40 rounded-lg border border-cyan-500/30 max-w-md mx-auto">
                <p className="text-gray-400 text-sm mb-2">IP Address</p>
                <p className="text-cyan-400 font-mono text-4xl font-bold">
                    {IP_TRIVIA_CHALLENGE.ip}
                </p>
            </div>

            {/* Question 1: Location */}
            <div className={`mb-6 p-5 rounded-lg border max-w-lg mx-auto transition-all duration-300 ${
                locationCorrect ? 'bg-green-900/20 border-green-500/50' : 'bg-black/20 border-white/10'
            }`}>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-300 text-left">
                        {IP_TRIVIA_CHALLENGE.questions.location.question}
                    </p>
                    <span className={`text-sm font-bold ${locationCorrect ? 'text-green-400' : 'text-yellow-400'}`}>
                        {locationScore} pts
                    </span>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={locationAnswer}
                        onChange={(e) => setLocationAnswer(e.target.value)}
                        onKeyPress={handleLocationKeyPress}
                        disabled={locationCorrect || isComplete}
                        placeholder="Enter country..."
                        className="flex-1 px-4 py-3 bg-black/40 border-2 border-white/30 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-center text-lg"
                    />
                    {!locationCorrect && !isComplete && (
                        <button
                            onClick={handleLocationSubmit}
                            disabled={!locationAnswer.trim()}
                            className="px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Check
                        </button>
                    )}
                </div>
                {locationFeedback && (
                    <p className={`mt-2 font-bold ${locationCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {locationFeedback}
                    </p>
                )}
            </div>

            {/* Question 2: Owner (Bonus) */}
            <div className={`mb-6 p-5 rounded-lg border max-w-lg mx-auto transition-all duration-300 ${
                ownerCorrect ? 'bg-green-900/20 border-green-500/50' :
                bonusLocked ? 'bg-gray-900/20 border-gray-500/50' :
                'bg-black/20 border-orange-500/20'
            }`}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-orange-400 text-xs font-bold uppercase">
                        Bonus Question {bonusLocked && '(Locked)'}
                    </span>
                    <span className={`text-sm font-bold ${ownerCorrect ? 'text-green-400' : bonusLocked ? 'text-gray-500' : 'text-orange-400'}`}>
                        +{ownerScore} pts
                    </span>
                </div>
                <p className="text-gray-300 text-left mb-3">
                    {IP_TRIVIA_CHALLENGE.questions.owner.question}
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={ownerAnswer}
                        onChange={(e) => setOwnerAnswer(e.target.value)}
                        onKeyPress={handleOwnerKeyPress}
                        disabled={ownerCorrect || isComplete || bonusLocked}
                        placeholder={bonusLocked ? "Locked" : "Enter company name..."}
                        className="flex-1 px-4 py-3 bg-black/40 border-2 border-white/30 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed text-center text-lg"
                    />
                    {!ownerCorrect && !isComplete && !bonusLocked && (
                        <button
                            onClick={handleOwnerSubmit}
                            disabled={!ownerAnswer.trim()}
                            className="px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Check
                        </button>
                    )}
                </div>
                {ownerFeedback && (
                    <p className={`mt-2 font-bold ${ownerCorrect ? 'text-green-400' : bonusLocked ? 'text-gray-400' : 'text-red-400'}`}>
                        {ownerFeedback}
                    </p>
                )}
                {!bonusLocked && !ownerCorrect && bonusAttempts > 0 && (
                    <p className="mt-2 text-gray-500 text-sm">
                        Attempts: {bonusAttempts}/{MAX_BONUS_ATTEMPTS}
                    </p>
                )}
            </div>

            {/* Finish Button */}
            {locationCorrect && !isComplete && (
                <button
                    onClick={handleFinish}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                    {canFinish ? 'Finish Challenge' : 'Skip Bonus & Finish'}
                </button>
            )}

            {/* Current Score Display */}
            {locationCorrect && (
                <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/10 max-w-sm mx-auto">
                    <p className="text-gray-400 text-sm">Current Score</p>
                    <p className="text-3xl font-bold text-green-400">
                        {totalPotentialScore}
                    </p>
                </div>
            )}
        </div>
    );
};

export default IPTriviaChallenge2;

