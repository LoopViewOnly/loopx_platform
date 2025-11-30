import React, { useState, useEffect, useMemo, useCallback } from "react";
import UserView, { type Challenge } from "./components/UserView";
import WelcomeScreen from "./components/WelcomeScreen";
import { UserScore } from "./types";
import { LOOPX_LOGO_B64 } from "./challenges/assets";
import { db, isFirebaseEnabled } from "./firebase";
import ContinueProgressModal from "./components/ContinueProgressModal"; // Import new modal component
import loopx_logo from "./assets/loopx_logo.png";

interface SavedProgress {
  name: string;
  challenge: Challenge; // The last challenge they were on
  score: number;
  completedChallenges: Set<Challenge>; // Stored as Array in Firestore, converted to Set here
}

const App: React.FC = () => {
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentChallenge, setCurrentChallenge] =
    useState<Challenge>("welcome");
  const [score, setScore] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<
    Set<Challenge>
  >(() => new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for menu

  const [showContinueModal, setShowContinueModal] = useState(false); // New state for continue modal
  const [deferredUserData, setDeferredUserData] =
    useState<SavedProgress | null>(null); // To hold data while modal is open

  const challengeOrder: Challenge[] = useMemo(
    () => [
      "typing",
      "trivia",
      "mcq1",
      "html",
      "html_debug",
      "click",
      "mcq2",
      "js",
      "sequence",
      "star_pattern",
      "mcq3",
      "memory",
      "magic",
      "mcq4",
      "hiddenpassword",
      "python_average",
      "python_mentor",
      "spanishloop",
      "mcq5",
      "binary",
      "phishing1",
      "phishing2",
      "phishing3",
      "realorfake",
      "number_guessing",
      "connections",
      "rearrange",
      "typing2",
      "mcq6",
      "matchstick",
      "mcq7",
      "wordle",
      "mcq8",
      "prompt",
      "password_strength",
      "ip_geolocation",
      "mcq9",
      "tictactoe",
      "mcq10",
      "persona",
      "URL",
      "imageTrivia",
      "mcq11",
      "similarity",
      "hiddencode",
      "console_hack",
      "dino",
      "mcq12",
      "loopshirt",
      "mcq13",
      "match_connect",
      "pinpoint",
      "hex_conversion",
      "fizzbuzz",
      "ball_challenge_1",
      "guess_the_flag",
      "website_count",
      "python_random_loop",
      "mcq14",
      "hex_to_binary",
      "lua_prime",
      "logic_gate",
      "dual_trivia",
      "windows_timeline",
      "spot_the_pattern",
      "az_speed_test",
      "js_array_sum",
      "color_confusion",
      "python_calculator",
      "arduino_blink",
      "ball_challenge_2",
      "connections_grid",
      "number_speed_test",
      "interactive_binary",
      "lua_maxof3",
      "mcq15",
      "ball_challenge_3",
      "memory_pattern",
      "sql_challenge_1",
      "sql_challenge_2",
      "sql_challenge_3",
      "sandbox_login",
      "coding_typing",
      "html_list",
      "ball_challenge_4",
      "cipher",
      "mcq16",
      "secure_or_not",
      "timezone",
    ],
    []
  );

  // Effect to save user progress to Firebase
  useEffect(() => {
    if (
      currentUserName &&
      currentChallenge !== "welcome" &&
      currentChallenge !== "done"
    ) {
      if (db) {
        const updateUserProgress = async () => {
          try {
            await db
              .collection("userScores")
              .doc(currentUserName)
              .update({
                score: Math.round(score),
                lastChallenge: currentChallenge,
                completedChallenges: Array.from(completedChallenges),
              });
          } catch (error) {
            console.error("Error updating score in Firebase:", error);
          }
        };
        updateUserProgress();
      }
    }
  }, [currentUserName, currentChallenge, score, completedChallenges]);

  const handleUserCompletion = (newUser: UserScore) => {
    // Firebase persistence is handled by the useEffect above when currentChallenge becomes 'done'.
    // No additional action needed here for persistence.
  };

  const handleNameSubmit = async (name: string) => {
    setCurrentUserName(name); // Set user name first so it's available for modal

    if (db) {
      try {
        const userDocRef = db.collection("userScores").doc(name);
        const docSnap = await userDocRef.get();

        if (docSnap.exists) {
          // User exists, load their progress
          const data = docSnap.data();
          if (data) {
            const loadedProgress: SavedProgress = {
              name: name,
              challenge: data.lastChallenge || challengeOrder[0],
              score: data.score || 0,
              completedChallenges: new Set(data.completedChallenges || []),
            };
            setDeferredUserData(loadedProgress);
            setShowContinueModal(true); // Show modal to ask user to continue
          } else {
            // Data is empty despite doc existing, treat as new user or error
            setScore(0);
            setCurrentChallenge(challengeOrder[0]);
            setCompletedChallenges(new Set());
            // Optionally, create a new minimal record or log an error
            await userDocRef.set(
              {
                name: name,
                score: 0,
                lastChallenge: challengeOrder[0],
                completedChallenges: [],
              },
              { merge: true }
            );
          }
        } else {
          // New user, create a new record and immediately set state
          setScore(0);
          setCurrentChallenge(challengeOrder[0]);
          setCompletedChallenges(new Set());
          await userDocRef.set(
            {
              name: name,
              score: 0,
              lastChallenge: challengeOrder[0],
              completedChallenges: [],
            },
            { merge: true }
          );
        }
      } catch (error) {
        console.error("Error handling user in Firebase:", error);
        // Fallback to fresh start if Firebase operation fails
        setScore(0);
        setCurrentChallenge(challengeOrder[0]);
        setCompletedChallenges(new Set());
      }
    } else {
      // No Firebase configured, always start fresh
      setScore(0);
      setCurrentChallenge(challengeOrder[0]);
      setCompletedChallenges(new Set());
    }
  };

  const handleAgreeToContinue = useCallback(() => {
    if (deferredUserData) {
      setScore(deferredUserData.score);
      setCurrentChallenge(deferredUserData.challenge);
      setCompletedChallenges(deferredUserData.completedChallenges);
    }
    setShowContinueModal(false);
    setDeferredUserData(null);
  }, [deferredUserData]);

  const handleChallengeCompletion = useCallback((challengeId: Challenge) => {
    setCompletedChallenges((prev) => {
      const newSet = new Set(prev);
      newSet.add(challengeId);
      return newSet;
    });
  }, []);

  const handleJumpToChallenge = useCallback(
    (challengeId: Challenge) => {
      if (completedChallenges.has(challengeId)) {
        // If the clicked challenge is completed, find the next uncompleted one
        const currentChallengeIndex = challengeOrder.indexOf(challengeId);
        let nextUncompletedChallenge: Challenge | null = null;
        for (
          let i = currentChallengeIndex + 1;
          i < challengeOrder.length;
          i++
        ) {
          const nextChallenge = challengeOrder[i];
          if (!completedChallenges.has(nextChallenge)) {
            nextUncompletedChallenge = nextChallenge;
            break;
          }
        }
        if (nextUncompletedChallenge) {
          setCurrentChallenge(nextUncompletedChallenge);
        } else {
          // If all subsequent challenges are completed, or clicked one is last completed, go to 'done'
          setCurrentChallenge("done");
        }
      } else {
        // If the clicked challenge is not completed, go directly to it
        setCurrentChallenge(challengeId);
      }
      setIsMenuOpen(false); // Close menu after selection
    },
    [challengeOrder, completedChallenges, setCurrentChallenge]
  );

  // RAJI REMOVE AFTER PROD
  useEffect(() => {
    globalThis.handleNameSubmit = handleNameSubmit;
  }, handleNameSubmit);

  const renderUserFlow = () => {
    // If modal is open, only render the modal, not the WelcomeScreen or UserView
    if (showContinueModal && currentUserName && deferredUserData) {
      return (
        <ContinueProgressModal
          userName={currentUserName}
          onAgree={handleAgreeToContinue}
        />
      );
    }

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

        {/* Burger Menu Button */}
        {currentUserName && (
          <button
            className="fixed top-[100px] left-4 z-[100] bg-black/50 backdrop-blur-md rounded-md border border-white/10 hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={
              isMenuOpen ? "Close challenge menu" : "Open challenge menu"
            }
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}

        {/* Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {currentUserName && (
          <div
            className={`fixed top-[150px] left-0 w-64 max-h-[calc(100vh-150px)] bg-black/90 backdrop-blur-md p-4 rounded-r-lg border-y border-r border-white/10 z-[60]
                        transform transition-transform duration-300 ease-in-out
                        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
          >
            <div className="flex flex-col gap-1 max-h-[80vh] overflow-y-auto scrollbar-hide">
              <p className="text-xs text-center text-gray-400 mb-1 font-bold sticky top-0 bg-black/80 p-1">
                JUMP
              </p>
              {challengeOrder.map((challenge, index) => (
                <button
                  key={challenge}
                  onClick={() => handleJumpToChallenge(challenge)} // Use new handler
                  className={`text-xs px-2 py-1 rounded transition-colors text-left whitespace-nowrap
                                    ${
                                      completedChallenges.has(challenge)
                                        ? "bg-green-700/30 text-green-400 cursor-not-allowed"
                                        : "hover:bg-blue-600 text-white"
                                    }
                                    ${
                                      currentChallenge === challenge
                                        ? "border border-blue-400"
                                        : ""
                                    }
                                `}
                  title={`Jump to ${challenge} challenge`}
                  disabled={completedChallenges.has(challenge)} // Still disable direct clicks on completed ones
                >
                  <span className="text-gray-400 mr-1">{index + 1}.</span>
                  {challenge.startsWith("mcq")
                    ? `MCQ-${challenge.substring(3)}`
                    : challenge.startsWith("phishing")
                    ? `Phishing-${challenge.substring(8)}`
                    : challenge === "imageTrivia"
                    ? "Campus Trivia"
                    : challenge === "URL"
                    ? "URL"
                    : challenge === "typing2"
                    ? "Typing 2"
                    : challenge === "rearrange"
                    ? "Rearrange"
                    : challenge === "persona"
                    ? "Persona"
                    : challenge === "realorfake"
                    ? "Real/Fake"
                    : challenge === "html_debug"
                    ? "HTML Debugging"
                    : challenge === "pinpoint"
                    ? "Pinpoint"
                    : challenge === "match_connect"
                    ? "Tech Mix & Match"
                    : challenge === "hex_conversion"
                    ? "Hex Conversion"
                    : challenge === "fizzbuzz"
                    ? "FizzBuzz"
                    : challenge === "guess_the_flag"
                    ? "Guess the Flag"
                    : challenge === "ip_geolocation"
                    ? "IP Geolocation"
                    : challenge === "console_hack"
                    ? "Console Hack"
                    : challenge === "star_pattern"
                    ? "Star Pattern"
                    : challenge === "website_count"
                    ? "Website Count"
                    : challenge === "hex_to_binary"
                    ? "Hex to Binary"
                    : challenge === "lua_prime"
                    ? "Lua Prime Coding"
                    : challenge === "lua_maxof3"
                    ? "Lua Max Value"
                    : challenge === "logic_gate"
                    ? "Logic Gate Builder"
                    : challenge === "dual_trivia"
                    ? "World Cup Trivia"
                    : challenge === "windows_timeline"
                    ? "Windows Timeline"
                    : challenge === "spot_the_pattern"
                    ? "Spot the Pattern"
                    : challenge === "az_speed_test"
                    ? "A-Z Speed Test"
                    : challenge === "js_array_sum"
                    ? "JS Array Sum"
                    : challenge === "color_confusion"
                    ? "Color Confusion"
                    : challenge === "python_calculator"
                    ? "Python Calculator"
                    : challenge === "arduino_blink"
                    ? "Arduino Blink"
                    : challenge === "connections_grid"
                    ? "Connections Puzzle"
                    : challenge === "number_speed_test"
                    ? "1-100 Speed Test"
                    : challenge === "interactive_binary"
                    ? "Dec to Binary"
                    : challenge === "memory_pattern"
                    ? "Memory Pattern"
                    : challenge === "sandbox_login"
                    ? "Sandbox Login"
                    : challenge === "coding_typing"
                    ? "Coding Typing"
                    : challenge === "html_list"
                    ? "HTML List"
                    : challenge === "ball_challenge_1"
                    ? "Ball: Move Right"
                    : challenge === "ball_challenge_2"
                    ? "Ball: Draw Square"
                    : challenge === "ball_challenge_3"
                    ? "Ball: Diagonal Move"
: challenge === "ball_challenge_4"
                                    ? "Ball: Zig Zag"
                                    : challenge === "number_guessing"
                                    ? "Number Guessing"
                                    : challenge === "python_random_loop"
                                    ? "Python Random Loop"
                                    : challenge === "sql_challenge_1"
                                    ? "SQL: Select All"
                                    : challenge === "sql_challenge_2"
                                    ? "SQL: Filter Age"
                                    : challenge === "sql_challenge_3"
                                    ? "SQL: Sort & Filter"
                                    : challenge.charAt(0).toUpperCase() + challenge.slice(1)}
                    : challenge === "ball_challenge_4"
                    ? "Ball: Zig Zag"
                    : challenge === "secure_or_not"
                    ? "Secure or Not?"
                    : challenge === "timezone"
                    ? "Time Zones"
                    : challenge.charAt(0).toUpperCase() + challenge.slice(1)}
                  {completedChallenges.has(challenge) && (
                    <span className="ml-2 text-green-400">✅</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <header className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center">
              <img src={loopx_logo} alt="LoopX Logo" className="h-20 w-30" />
              {currentUserName && (
                <span className="text-2xl text-gray-300 font-normal leading-tight ml-4">
                  / {currentUserName}
                </span>
              )}
            </div>
          </div>
          {currentUserName &&
            currentChallenge !== "welcome" &&
            currentChallenge !== "done" && (
              <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Progress
                </p>
                <p className="text-xl font-bold text-blue-300">
                  {completedCount} / {totalChallenges}
                </p>
                <p className="text-sm text-gray-300">Challenges Completed</p>
              </div>
            )}
        </header>

        <main>{renderUserFlow()}</main>
      </div>
    </>
  );
};

export default App;
