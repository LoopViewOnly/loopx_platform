import React, { useState, useEffect, useMemo, useCallback } from 'react';
import UserView, { type Challenge } from './components/UserView';
import WelcomeScreen from './components/WelcomeScreen';
import { UserScore } from './types';
import { LOOPX_LOGO_B64 } from './challenges/assets';
import { db, isFirebaseEnabled } from './firebase';


interface SavedProgress {
    name: string;
    challenge: Challenge;
    score: number;
    completedChallenges: Challenge[];
}

const App: React.FC = () => {
    const initialUserName = localStorage.getItem('loopx-last-user');
    const [currentUserName, setCurrentUserName] = useState<string | null>(initialUserName);
    const [currentChallenge, setCurrentChallenge] = useState<Challenge>('welcome');
    const [score, setScore] = useState(0);
    const [completedChallenges, setCompletedChallenges] = useState<Set<Challenge>>(() => new Set());

    const challengeOrder: Challenge[] = useMemo(() => [
        'typing', 'trivia', 'mcq1', 'html', 'html_debug', 'click', 'mcq2', 'js', 
        'sequence', 'mcq3', 'memory', 'magic', 'mcq4', 'hiddenpassword', 'python_average', 'python_mentor',
        'spanishloop', 'mcq14', 'binary', 'phishing1', 'phishing2', 'phishing3', 'mcq5', 'connections', 'rearrange', 
        'typing2', 'mcq6', 'matchstick', 'mcq12', 'wordle', 'mcq7', 'prompt', 
        'password_strength', 'cipher', 'mcq8', 'tictactoe', 'mcq13', 'persona', 
        'URL', 'imageTrivia', 'mcq9', 'similarity', 'hiddencode', 'dino', 
        'mcq10', 'loopshirt', 'realorfake', 'match_connect', 'pinpoint', 'hex_conversion',
        'fizzbuzz', 'guess_the_flag', 'website_count', 'hex_to_binary', 'lua_prime',
        'logic_gate', 'dual_trivia', 'windows_timeline', 'spot_the_pattern', 'az_speed_test',
        'js_array_sum', 'color_confusion', 'python_calculator', 'arduino_blink', 'connections_grid',
        'number_speed_test', 'interactive_binary', 'lua_maxof3', 'mcq15', 'memory_pattern'
    ], []);

    useEffect(() => {
        if (initialUserName) {
            const storageKey = `loopx-progress-${initialUserName}`;
            const savedDataJSON = localStorage.getItem(storageKey);
            if (savedDataJSON) {
                try {
                    const savedData: SavedProgress = JSON.parse(savedDataJSON);
                    setCurrentUserName(savedData.name);
                    setCurrentChallenge(savedData.challenge);
                    setScore(savedData.score);
                    setCompletedChallenges(new Set(savedData.completedChallenges));
                } catch (e) {
                    console.error("Failed to parse saved progress, starting new session.", e);
                    localStorage.removeItem(storageKey);
                    localStorage.removeItem('loopx-last-user');
                    setCurrentUserName(null);
                    setScore(0);
                    setCurrentChallenge('welcome');
                    setCompletedChallenges(new Set());
                }
            } else {
                localStorage.removeItem('loopx-last-user');
                setCurrentUserName(null);
                setScore(0);
                setCurrentChallenge('welcome');
                setCompletedChallenges(new Set());
            }
        }
    }, [initialUserName]);

    useEffect(() => {
        if (currentUserName && currentChallenge !== 'welcome' && currentChallenge !== 'done') {
            const progress: SavedProgress = {
                name: currentUserName,
                challenge: currentChallenge,
                score: score,
                completedChallenges: Array.from(completedChallenges)
            };
            localStorage.setItem(`loopx-progress-${currentUserName}`, JSON.stringify(progress));
            localStorage.setItem('loopx-last-user', currentUserName);

            // FIX: Use v8 compatibility API directly from the 'db' object.
            if(db) {
                const updateUserScore = async () => {
                    try {
                        await db.collection('userScores').doc(currentUserName).update({
                            score: Math.round(score),
                            lastChallenge: currentChallenge,
                            completedChallenges: Array.from(completedChallenges)
                        });
                    } catch (error) {
                        console.error("Error updating score in Firebase:", error);
                    }
                };
                updateUserScore();
            }
        } else if (currentUserName && (currentChallenge === 'welcome' || currentChallenge === 'done')) {
            localStorage.removeItem('loopx-last-user');
        }
    }, [currentUserName, currentChallenge, score, completedChallenges]);


    const handleUserCompletion = (newUser: UserScore) => {
        localStorage.removeItem(`loopx-progress-${newUser.name}`);
        localStorage.removeItem('loopx-last-user');
    };
    
    const handleNameSubmit = async (name: string) => {
        const storageKey = `loopx-progress-${name}`;
        const savedDataJSON = localStorage.getItem(storageKey);

        if (savedDataJSON) {
            try {
                const savedData: SavedProgress = JSON.parse(savedDataJSON);
                setCurrentUserName(savedData.name);
                setCurrentChallenge(savedData.challenge);
                setScore(savedData.score);
                setCompletedChallenges(new Set(savedData.completedChallenges));
            } catch (e) {
                console.error("Failed to parse saved progress, starting new session.", e);
                localStorage.removeItem(storageKey);
                localStorage.removeItem('loopx-last-user');
                setCurrentUserName(name);
                setScore(0);
                setCurrentChallenge(challengeOrder[0]);
                setCompletedChallenges(new Set());
            }
        } else {
            setCurrentUserName(name);
            setScore(0);
            setCurrentChallenge(challengeOrder[0]);
            setCompletedChallenges(new Set());
            
            // FIX: Use v8 compatibility API directly from the 'db' object.
            if (db) {
                try {
                    await db.collection('userScores').doc(name).set({
                        name: name,
                        score: 0,
                        lastChallenge: challengeOrder[0],
                        completedChallenges: []
                    }, { merge: true });
                } catch (error) {
                    console.error("Error creating user in Firebase:", error);
                }
            }
        }
    };

    const handleChallengeCompletion = useCallback((challengeId: Challenge) => {
        setCompletedChallenges(prev => {
            const newSet = new Set(prev);
            newSet.add(challengeId);
            return newSet;
        });
    }, []);

    const handleJumpToChallenge = useCallback((challengeId: Challenge) => {
        if (completedChallenges.has(challengeId)) {
            // If the clicked challenge is completed, find the next uncompleted one
            const nextUncompletedIndex = challengeOrder.findIndex(c => !completedChallenges.has(c) && challengeOrder.indexOf(c) > challengeOrder.indexOf(challengeId));
            if (nextUncompletedIndex !== -1) {
                setCurrentChallenge(challengeOrder[nextUncompletedIndex]);
            } else {
                // If all subsequent challenges are completed, or clicked one is last completed, go to 'done'
                setCurrentChallenge('done');
            }
        } else {
            // If the clicked challenge is not completed, go directly to it
            setCurrentChallenge(challengeId);
        }
    }, [challengeOrder, completedChallenges, setCurrentChallenge]);


    const renderUserFlow = () => {
        if (!currentUserName) {
            return <WelcomeScreen onStart={handleNameSubmit} />;
        }
        
        return (
            <UserView 
                onComplete={handleUserCompletion}
                userName={currentUserName}
                currentScore={score}
                updateScore={setScore}
                currentChallenge={currentChallenge}
                setCurrentChallenge={setCurrentChallenge}
                challengeOrder={challengeOrder}
                completedChallenges={completedChallenges}
                onChallengeComplete={handleChallengeCompletion}
            />
        );
    };

    const completedCount = completedChallenges.size;
    const totalChallenges = challengeOrder.length;

    return (
        <>
        <style>{`
            @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 50% { transform: translateX(6px); } 75% { translateX(-6px); } }
            .shake-animation { animation: shake 0.3s ease-in-out; }
        `}</style>
        <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/50 to-black p-4 sm:p-6 lg:p-8 font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(29,78,216,0.15)_0,_transparent_50%)] -z-10"></div>
            
            {currentUserName && (
                <div className="fixed top-1/2 -translate-y-1/2 left-0 bg-black/50 backdrop-blur-md p-2 rounded-r-lg border-y border-r border-white/10 z-50">
                    <div className="flex flex-col gap-1 max-h-[80vh] overflow-y-auto scrollbar-hide">
                        <p className="text-xs text-center text-gray-400 mb-1 font-bold sticky top-0 bg-black/80 p-1">JUMP</p>
                        {challengeOrder.map((challenge, index) => (
                            <button
                                key={challenge}
                                onClick={() => handleJumpToChallenge(challenge)} // Use new handler
                                className={`text-xs px-2 py-1 rounded transition-colors text-left whitespace-nowrap
                                    ${completedChallenges.has(challenge) ? 'bg-green-700/30 text-green-400 cursor-not-allowed' : 'hover:bg-blue-600 text-white'}
                                    ${currentChallenge === challenge ? 'border border-blue-400' : ''}
                                `}
                                title={`Jump to ${challenge} challenge`}
                                disabled={completedChallenges.has(challenge)} // Still disable direct clicks on completed ones
                            >
                                <span className="text-gray-400 mr-1">{index + 1}.</span>
                                {
                                    challenge.startsWith('mcq') ? `MCQ-${challenge.substring(3)}` :
                                    challenge.startsWith('phishing') ? `Phishing-${challenge.substring(8)}` :
                                    challenge === 'imageTrivia' ? 'Campus Trivia' :
                                    challenge === 'URL' ? 'URL' :
                                    challenge === 'typing2' ? 'Typing 2' :
                                    challenge === 'rearrange' ? 'Rearrange' :
                                    challenge === 'persona' ? 'Persona' :
                                    challenge === 'realorfake' ? 'Real/Fake' :
                                    challenge === 'html_debug' ? 'HTML Debugging' :
                                    challenge === 'pinpoint' ? 'Pinpoint' :
                                    challenge === 'match_connect' ? 'Tech Mix & Match' :
                                    challenge === 'hex_conversion' ? 'Hex Conversion' :
                                    challenge === 'hex_to_binary' ? 'Hex to Binary' :
                                    challenge === 'fizzbuzz' ? 'FizzBuzz' :
                                    challenge === 'guess_the_flag' ? 'Guess the Flag' :
                                    challenge === 'website_count' ? 'Website Count' :
                                    challenge === 'lua_prime' ? 'Lua Prime Coding' :
                                    challenge === 'lua_maxof3' ? 'Lua Max Value' :
                                    challenge === 'logic_gate' ? 'Logic Gate Builder' :
                                    challenge === 'dual_trivia' ? 'World Cup Trivia' :
                                    challenge === 'windows_timeline' ? 'Windows Timeline' :
                                    challenge === 'spot_the_pattern' ? 'Spot the Pattern' :
                                    challenge === 'az_speed_test' ? 'A-Z Speed Test' :
                                    challenge === 'js_array_sum' ? 'JS Array Sum' :
                                    challenge === 'color_confusion' ? 'Color Confusion' :
                                    challenge === 'python_calculator' ? 'Python Calculator' :
                                    challenge === 'arduino_blink' ? 'Arduino Blink' :
                                    challenge === 'connections_grid' ? 'Connections Puzzle' :
                                    challenge === 'number_speed_test' ? '1-100 Speed Test' :
                                    challenge === 'interactive_binary' ? 'Dec to Binary' :
                                    challenge === 'memory_pattern' ? 'Memory Pattern' :
                                    challenge.charAt(0).toUpperCase() + challenge.slice(1)
                                }
                                {completedChallenges.has(challenge) && <span className="ml-2 text-green-400">✅</span>}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <header className="flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center">
                        <img src={LOOPX_LOGO_B64} alt="LoopX Logo" className="h-10" />
                        {currentUserName && (
                            <span className="text-2xl text-gray-300 font-normal leading-tight ml-4">/ {currentUserName}</span>
                        )}
                    </div>
                </div>
                {currentUserName && currentChallenge !== 'welcome' && currentChallenge !== 'done' && (
                    <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold">Progress</p>
                        <p className="text-xl font-bold text-blue-300">{completedCount} / {totalChallenges}</p>
                        <p className="text-sm text-gray-300">Challenges Completed</p>
                    </div>
                )}
            </header>

            <main>
                {renderUserFlow()}
            </main>
        </div>
        </>
    );
};

export default App;