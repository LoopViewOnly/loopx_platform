
import React, { useState, useEffect, useMemo } from 'react';
import TypingChallenge from './TypingChallenge';
import ClickChallenge from './ClickChallenge';
import TriviaChallenge from './TriviaChallenge';
import PromptChallenge from './PromptChallenge';
import CaesarCipherChallenge from './CaesarCipherChallenge';
import TicTacToeChallenge from './TicTacToeChallenge';
import SequenceChallenge from './SequenceChallenge';
import URLChallenge from './UrlChallenge';
import HiddenCodeChallenge from './HiddenCodeChallenge';
import ImageSimilarityChallenge from './ImageSimilarityChallenge';
import JsCodingChallenge from './JavaCodingChallenge';
import HtmlCodingChallenge from './HtmlCodingChallenge';
import HtmlDebugChallenge from './HtmlDebugChallenge';
import MatchstickChallenge from './MatchstickChallenge';
import ImageTriviaChallenge from './ImageTriviaChallenge';
import ConnectionsChallenge from './ConnectionsChallenge';
import DinoGameChallenge from './DinoGameChallenge';
import LoopShirtChallenge from './LoopShirtChallenge';
import RearrangeChallenge from './RearrangeChallenge';
import RealOrFakeChallenge from './RealOrFakeChallenge';
import WordleChallenge from './WordleChallenge';
import MemoryGameChallenge from './MemoryGameChallenge';
import MagicChallenge from './MagicChallenge';
import HiddenPasswordChallenge from './HiddenPasswordChallenge';
import SpanishLoopChallenge from './SpanishLoopChallenge';
import BinaryChallenge from './BinaryChallenge';
import MCQChallenge from './MCQChallenge';
import PythonAverageChallenge from './PythonAverageChallenge';
import PasswordStrengthChallenge from './PasswordStrengthChallenge';
import InstagramChallenge from './InstagramChallenge';
import PersonaChallenge from './PersonaChallenge';
import { UserScore } from '../types';
import { SCORE_WEIGHTS, TYPING_2_MIN_CPM, TYPING_MIN_CPM } from '../constants';
import { MCQ_CHALLENGES, TYPING_CHALLENGE_2_TEXT, TYPING_CHALLENGE_TEXT } from '../challenges/content';

interface UserViewProps {
    onComplete: (newUser: UserScore) => void;
    debugJump?: Challenge | null;
    userName: string | null;
    currentScore: number;
    updateScore: React.Dispatch<React.SetStateAction<number>>;
    currentChallenge: Challenge;
    setCurrentChallenge: React.Dispatch<React.SetStateAction<Challenge>>;
    challengeOrder: Challenge[];
    completedChallenges: Set<Challenge>; // New prop
    onChallengeComplete: (challengeId: Challenge) => void; // New prop for App.tsx to update completed status
}

export type Challenge = 'welcome' | 'typing' | 'typing2' | 'click' | 'trivia' | 'prompt' | 'cipher' | 'tictactoe' | 'sequence' | 'URL' | 'rearrange' | 'matchstick' | 'imageTrivia' | 'similarity' | 'js' | 'html' | 'html_debug' | 'hiddencode' | 'dino' | 'loopshirt' | 'realorfake' | 'connections' | 'wordle' | 'memory' | 'magic' | 'hiddenpassword' | 'spanishloop' | 'binary' | 'python_average' | 'password_strength' | 'instagram' | 'persona' | 'mcq1' | 'mcq2' | 'mcq3' | 'mcq4' | 'mcq5' | 'mcq6' | 'mcq7' | 'mcq8' | 'mcq9' | 'mcq10' | 'mcq11' | 'mcq12' | 'mcq13' | 'done';

const CHALLENGE_NAMES: Record<string, string> = {
    typing: "Speed Typing ⌨️",
    typing2: "Speed Typing 2 ⌨️",
    click: "Clicks Per Second 🖱️",
    trivia: "Trivia 🧠",
    prompt: "AI Prompting 🤖",
    cipher: "Cryptography 🔒",
    tictactoe: "Tic-Tac-Toe vs AI ⭕❌",
    sequence: "Sequence Search ⏱️",
    URL: "URL Analysis 🌐",
    rearrange: "Rearrange Letters 🔄",
    matchstick: "Matchstick Puzzle 🧩",
    imageTrivia: "Campus Trivia 🌍",
    similarity: "Image Description ✍️",
    js: "JavaScript Coding 💻",
    html: "HTML Coding 📄",
    html_debug: "HTML Debugging 🐛",
    hiddencode: "Hidden Code 🕵️‍♂️",
    dino: "Obstacle Run 🔴",
    loopshirt: "Spot the Looper 👀",
    realorfake: "Real or Fake? 🔎",
    connections: "AI Connections 🔗",
    wordle: "Daily Wordle 🔤",
    memory: "Memory Match 🧠",
    magic: "Magic Word Count ✨",
    hiddenpassword: "Hidden Password 🕵️‍♀️",
    spanishloop: "Spanish Translation 🇪🇸",
    binary: "Binary Code 🧑‍💻",
    python_average: "Python Coding 🐍",
    password_strength: "Password Validator 🔐",
    instagram: "Instagram Hunt 📸",
    persona: "Persona Password 🆔",
};

const UserView: React.FC<UserViewProps> = ({ 
    onComplete, 
    debugJump, 
    userName,
    currentScore, 
    updateScore,
    currentChallenge,
    setCurrentChallenge,
    challengeOrder,
    onChallengeComplete, // Destructure new prop
    completedChallenges // Destructure new prop
}) => {

    const currentChallengeIndex = useMemo(() => {
        return challengeOrder.indexOf(currentChallenge);
    }, [challengeOrder, currentChallenge]);

    useEffect(() => {
        if (debugJump) {
            setCurrentChallenge(debugJump);
        }
    }, [debugJump, setCurrentChallenge]);

    const advanceChallenge = () => {
        onChallengeComplete(currentChallenge); // Mark current challenge as completed
        const nextIndex = currentChallengeIndex + 1;
        if (nextIndex < challengeOrder.length) {
            setCurrentChallenge(challengeOrder[nextIndex]);
        } else {
            setCurrentChallenge('done');
        }
    };

    useEffect(() => {
        if (currentChallenge === 'done' && userName) {
            const finalScore = Math.round(currentScore);
            onComplete({ name: userName, score: finalScore });
        }
    }, [currentChallenge, onComplete, currentScore, userName]);

    const getChallengeTitle = (key: string, index: number) => {
        const challengeNum = index + 1;
        if (key.startsWith('mcq')) {
            // Extract the number from the key (e.g., mcq5 -> 5)
            const mcqNum = key.replace('mcq', '');
            return `Challenge ${challengeNum}: MCQ-${mcqNum}`;
        }
        return `Challenge ${challengeNum}: ${CHALLENGE_NAMES[key] || 'Unknown'}`;
    };

    const currentTitle = getChallengeTitle(currentChallenge, currentChallengeIndex);

    const handleTypingComplete = (cpm: number, attempts: number) => {
        let points = 10;
        if (cpm >= 300) points = 100;
        else if (cpm >= 200) points = 90;
        else if (cpm >= 100) points = 80;
        else if (cpm >= 50) points = 70;
        else if (cpm >= 20) points = 60;
        
        updateScore(prev => prev + points);
        advanceChallenge();
    };
    
    const handleTyping2Complete = (cpm: number, attempts: number) => {
        let points = 10;
        if (cpm >= 350) points = 100;
        else if (cpm >= 250) points = 90;
        else if (cpm >= 150) points = 80;
        else if (cpm >= 120) points = 70; // Goal for typing 2
        else if (cpm >= 80) points = 60;
        
        updateScore(prev => prev + points);
        advanceChallenge();
    };

    const handleClicksComplete = (cps: number, attempts: number) => {
        let points = 10;
        if (cps >= 10) points = 100;
        else if (cps >= 8) points = 90;
        else if (cps >= 6) points = 80;
        else if (cps >= 5) points = 70;
        else if (cps >= 3) points = 60;

        updateScore(prev => prev + points);
        advanceChallenge();
    };

    const handleSimpleChallengeComplete = (time: number | null, basePoints: number, timeFactor: number) => {
         if (time !== null) { 
            const points = 100; 
            updateScore(prev => prev + points);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };
    
    const handleMCQComplete = (mistakes: number) => {
        let points = 0;
        if (mistakes === 0) {
            points = 100;
        } else if (mistakes === 1) {
            points = 80;
        } else if (mistakes === 2) {
            points = 60;
        } else if (mistakes === 3) {
            points = 40;
        }
        // For 4+ mistakes, points will be 0.
        updateScore(prev => prev + points);
        setTimeout(() => advanceChallenge(), 1500);
    };

    const handleTicTacToeComplete = (win: boolean) => {
        if (win) {
            updateScore(prev => prev + SCORE_WEIGHTS.TICTACTOE_WIN);
            advanceChallenge();
        }
    };
    
    const handleTicTacToeRetry = () => {};

    const handleSequenceComplete = (finalTime: number) => {
        const points = Math.max(10, 100 - finalTime);
        updateScore(prev => prev + points);
        advanceChallenge();
    };
    
    const handleURLComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.URL_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleMagicComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.MAGIC_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleSpanishLoopComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.SPANISH_LOOP_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleBinaryComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.BINARY_CHALLENGE_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleHiddenPasswordComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.HIDDEN_PASSWORD_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleSimilarityComplete = (success: boolean) => {
        if (success) {
            updateScore(prev => prev + SCORE_WEIGHTS.SIMILARITY_SUCCESS);
            advanceChallenge();
        }
    };

    const handleJsComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.JS_CORRECT);
            advanceChallenge();
        }
    };

    const handleHtmlComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.HTML_CORRECT);
            advanceChallenge();
        }
    };

    const handleHtmlDebugComplete = (correct: boolean) => {
        if (correct) {
            // Reusing HTML_CORRECT score for debug challenge as well
            updateScore(prev => prev + SCORE_WEIGHTS.HTML_CORRECT);
            advanceChallenge();
        }
    };

    const handlePythonAvgComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.PYTHON_AVG_CORRECT);
            advanceChallenge();
        }
    };

    const handlePasswordStrengthComplete = (correct: boolean) => {
        if (correct) {
            updateScore(prev => prev + SCORE_WEIGHTS.PASSWORD_STRENGTH_CORRECT);
            advanceChallenge();
        }
    };

    const handleDinoComplete = (score: number) => {
        updateScore(prev => prev + 100); 
        setTimeout(() => advanceChallenge(), 1500);
    };

    const handleRealOrFakeComplete = (success: boolean) => {
        if (success) {
            updateScore(prev => prev + 100);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };

    const handleWordleComplete = (success: boolean) => {
        if (success) {
            updateScore(prev => prev + SCORE_WEIGHTS.WORDLE_CORRECT);
            setTimeout(() => advanceChallenge(), 1500);
        }
    };
    
    const renderChallenge = () => {
        if (currentChallenge.startsWith('mcq')) {
            const index = parseInt(currentChallenge.replace('mcq', ''), 10) - 1;
            const challengeData = MCQ_CHALLENGES[index];
            return <MCQChallenge key={currentChallenge} onComplete={handleMCQComplete} {...challengeData} challengeTitle={currentTitle} />;
        }

        switch (currentChallenge) {
            case 'typing': return <TypingChallenge key="typing" onComplete={handleTypingComplete} challengeTitle={currentTitle} challengeText={TYPING_CHALLENGE_TEXT} minCpm={TYPING_MIN_CPM} />;
            case 'typing2': return <TypingChallenge key="typing2" onComplete={handleTyping2Complete} challengeTitle={currentTitle} challengeText={TYPING_CHALLENGE_2_TEXT} minCpm={TYPING_2_MIN_CPM} />;
            case 'click': return <ClickChallenge key="click" onComplete={handleClicksComplete} challengeTitle={currentTitle} />;
            case 'trivia': return <TriviaChallenge key="trivia" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.TRIVIA_BASE_POINTS, SCORE_WEIGHTS.TRIVIA_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'prompt': return <PromptChallenge key="prompt" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.PROMPT_BASE_POINTS, SCORE_WEIGHTS.PROMPT_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'cipher': return <CaesarCipherChallenge key="cipher" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.CIPHER_BASE_POINTS, SCORE_WEIGHTS.CIPHER_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'tictactoe': return <TicTacToeChallenge key="tictactoe" onComplete={handleTicTacToeComplete} onAttemptFailed={handleTicTacToeRetry} challengeTitle={currentTitle} />;
            case 'sequence': return <SequenceChallenge key="sequence" onComplete={handleSequenceComplete} challengeTitle={currentTitle} />;
            case 'URL': return <URLChallenge key="URL" onComplete={handleURLComplete} challengeTitle={currentTitle} />;
            case 'rearrange': return <RearrangeChallenge key="rearrange" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.REARRANGE_BASE_POINTS, SCORE_WEIGHTS.REARRANGE_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'matchstick': return <MatchstickChallenge key="matchstick" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.MATCHSTICK_BASE_POINTS, SCORE_WEIGHTS.MATCHSTICK_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'imageTrivia': return <ImageTriviaChallenge key="imageTrivia" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.IMAGE_TRIVIA_BASE_POINTS, SCORE_WEIGHTS.IMAGE_TRIVIA_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'similarity': return <ImageSimilarityChallenge key="similarity" onComplete={handleSimilarityComplete} challengeTitle={currentTitle} />;
            case 'js': return <JsCodingChallenge key="js" onComplete={handleJsComplete} challengeTitle={currentTitle} />;
            case 'html': return <HtmlCodingChallenge key="html" onComplete={handleHtmlComplete} challengeTitle={currentTitle} />;
            case 'html_debug': return <HtmlDebugChallenge key="html_debug" onComplete={handleHtmlDebugComplete} challengeTitle={currentTitle} />;
            case 'python_average': return <PythonAverageChallenge key="python_average" onComplete={handlePythonAvgComplete} challengeTitle={currentTitle} />;
            case 'password_strength': return <PasswordStrengthChallenge key="password_strength" onComplete={handlePasswordStrengthComplete} challengeTitle={currentTitle} />;
            case 'hiddencode': return <HiddenCodeChallenge key="hiddencode" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.HIDDEN_CODE_BASE_POINTS, SCORE_WEIGHTS.HIDDEN_CODE_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'persona': return <PersonaChallenge key="persona" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.PERSONA_BASE_POINTS, SCORE_WEIGHTS.PERSONA_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'dino': return <DinoGameChallenge key="dino" onComplete={handleDinoComplete} challengeTitle={currentTitle} />;
            case 'loopshirt': return <LoopShirtChallenge key="loopshirt" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.LOOP_SHIRT_CORRECT, 0)} challengeTitle={currentTitle} />;
            case 'realorfake': return <RealOrFakeChallenge key="realorfake" onComplete={handleRealOrFakeComplete} challengeTitle={currentTitle} />;
            case 'connections': return <ConnectionsChallenge key="connections" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.CONNECTIONS_BASE_POINTS, SCORE_WEIGHTS.CONNECTIONS_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'wordle': return <WordleChallenge key="wordle" onComplete={handleWordleComplete} challengeTitle={currentTitle} />;
            case 'memory': return <MemoryGameChallenge key="memory" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.MEMORY_BASE_POINTS, SCORE_WEIGHTS.MEMORY_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            case 'magic': return <MagicChallenge key="magic" onComplete={handleMagicComplete} challengeTitle={currentTitle} />;
            case 'hiddenpassword': return <HiddenPasswordChallenge key="hiddenpassword" onComplete={handleHiddenPasswordComplete} challengeTitle={currentTitle} />;
            case 'spanishloop': return <SpanishLoopChallenge key="spanishloop" onComplete={handleSpanishLoopComplete} challengeTitle={currentTitle} />;
            case 'binary': return <BinaryChallenge key="binary" onComplete={handleBinaryComplete} challengeTitle={currentTitle} />;
            case 'instagram': return <InstagramChallenge key="instagram" onComplete={(time) => handleSimpleChallengeComplete(time, SCORE_WEIGHTS.INSTAGRAM_BASE_POINTS, SCORE_WEIGHTS.INSTAGRAM_TIME_DEDUCTION_FACTOR)} challengeTitle={currentTitle} />;
            
            case 'done':
                return (
                    <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
                        <h2 className="text-3xl font-bold text-green-400 mb-4">Congratulations, {userName}!</h2>
                        <p className="text-gray-200 text-xl mb-2">You have completed all the challenges.</p>
                        <p className="text-gray-300 mb-6">Your final score is:</p>
                        <p className="text-5xl font-bold my-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{Math.round(currentScore)}</p>
                    </div>
                );
            default:
                return <div>Loading challenge...</div>;
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            {renderChallenge()}
        </div>
    );
};

export default UserView;
