import React, { useState, useEffect, useMemo, useCallback } from "react";
import TypingChallenge from "./TypingChallenge";
import ClickChallenge from "./ClickChallenge";
import TriviaChallenge from "./TriviaChallenge";
import PromptChallenge from "./PromptChallenge";
import CaesarCipherChallenge from "./CaesarCipherChallenge";
import TicTacToeChallenge from "./TicTacToeChallenge";
import SequenceChallenge from "./SequenceChallenge";
import URLChallenge from "./UrlChallenge";
import HiddenCodeChallenge from "./HiddenCodeChallenge";
import ImageSimilarityChallenge from "./ImageSimilarityChallenge";
import JsCodingChallenge from "./JsCodingChallenge";
import HtmlCodingChallenge from "./HtmlCodingChallenge";
import HtmlDebugChallenge from "./HtmlDebugChallenge";
import MatchstickChallenge from "./MatchstickChallenge";
import ImageTriviaChallenge from "./ImageTriviaChallenge";
import ConnectionsChallenge from "./ConnectionsChallenge";
import DinoGameChallenge from "./DinoGameChallenge";
import LoopShirtChallenge from "./LoopShirtChallenge";
import RearrangeChallenge from "./RearrangeChallenge";
import RealOrFakeChallenge from "./RealOrFakeChallenge";
import WordleChallenge from "./WordleChallenge";
import MemoryGameChallenge from "./MemoryGameChallenge";
import MagicChallenge from "./MagicChallenge";
import HiddenPasswordChallenge from "./HiddenPasswordChallenge";
import SpanishLoopChallenge from "./SpanishLoopChallenge";
import BinaryChallenge from "./BinaryChallenge";
import MCQChallenge from "./MCQChallenge";
import PythonAverageChallenge from "./PythonAverageChallenge";
import PythonMentorChallenge from "./PythonMentorChallenge";
import PasswordStrengthChallenge from "./PasswordStrengthChallenge";
import PersonaChallenge from "./PersonaChallenge";
import PhishingChallenge from "./PhishingChallenge";
import MatchConnectChallenge from "./MatchConnectChallenge"; // Import new challenge
import PinpointChallenge from "./PinpointChallenge"; // Import PinpointChallenge
import HexConversionChallenge from "./HexConversionChallenge"; // Import new challenge
import FizzBuzzChallenge from "./FizzBuzzChallenge"; // Import new challenge
import GuessTheFlagChallenge from "./GuessTheFlagChallenge"; // Import new challenge
import WebsiteCountChallenge from "./WebsiteCountChallenge"; // Import new challenge
import HexToBinaryChallenge from "./HexToBinaryChallenge"; // Import new challenge
import LuaPrimeChallenge from "./LuaPrimeChallenge"; // Import new challenge
import LuaMaxOf3Challenge from "./LuaMaxOf3Challenge"; // Import new challenge
import LogicGateChallenge from "./LogicGateChallenge"; // Import new challenge
import DualTriviaChallenge from "./DualTriviaChallenge"; // Import new challenge
import WindowsTimelineChallenge from "./WindowsTimelineChallenge"; // Import new challenge
import SpotThePatternChallenge from "./SpotThePatternChallenge"; // Import new challenge
import AZSpeedTestChallenge from "./AZSpeedTestChallenge"; // Import new challenge
import JsArraySumChallenge from "./JsArraySumChallenge";
import ColorConfusionChallenge from "./ColorConfusionChallenge";
import PythonCalculatorChallenge from "./PythonCalculatorChallenge";
import ArduinoBlinkChallenge from "./ArduinoBlinkChallenge";
import ConnectionsGridChallenge from "./ConnectionsGridChallenge";
import NumberSpeedTestChallenge from "./NumberSpeedTestChallenge";
import InteractiveBinaryChallenge from "./InteractiveBinaryChallenge";
import MemoryPatternChallenge from "./MemoryPatternChallenge";
import SandboxLoginChallenge from "./SandboxLoginChallenge"; // Import new challenge
import CodingTypingChallenge from "./CodingTypingChallenge"; // Import new CodingTypingChallenge
import HtmlListChallenge from "./HtmlListChallenge";
import { UserScore } from "../types";
import { SCORE_WEIGHTS, TYPING_2_MIN_CPM, TYPING_MIN_CPM } from "../constants";
import {
  MCQ_CHALLENGES,
  PHISHING_CHALLENGES,
  TYPING_CHALLENGE_2_TEXT,
  TYPING_CHALLENGE_TEXT,
  JS_CALCULATOR_CODE_TYPING_CHALLENGE_TEXT,
} from "../challenges/content";

interface UserViewProps {
  onComplete: (newUser: UserScore) => void;
  userName: string | null;
  currentScore: number;
  updateScore: React.Dispatch<React.SetStateAction<number>>;
  currentChallenge: Challenge;
  setCurrentChallenge: React.Dispatch<React.SetStateAction<Challenge>>;
  challengeOrder: Challenge[];
  completedChallenges: Set<Challenge>; // New prop
  onChallengeComplete: (challengeId: Challenge) => void; // New prop for App.tsx to update completed status
}

export type Challenge =
  | "welcome"
  | "typing"
  | "typing2"
  | "click"
  | "trivia"
  | "prompt"
  | "cipher"
  | "tictactoe"
  | "sequence"
  | "URL"
  | "rearrange"
  | "matchstick"
  | "imageTrivia"
  | "similarity"
  | "js"
  | "html"
  | "html_debug"
  | "hiddencode"
  | "dino"
  | "loopshirt"
  | "realorfake"
  | "connections"
  | "wordle"
  | "memory"
  | "magic"
  | "hiddenpassword"
  | "spanishloop"
  | "binary"
  | "python_average"
  | "python_mentor"
  | "password_strength"
  | "persona"
  | "phishing1"
  | "phishing2"
  | "phishing3"
  | "mcq1"
  | "mcq2"
  | "mcq3"
  | "mcq4"
  | "mcq5"
  | "mcq6"
  | "mcq7"
  | "mcq8"
  | "mcq9"
  | "mcq10"
  | "mcq11"
  | "mcq12"
  | "mcq13"
  | "mcq14"
  | "mcq15"
  | "match_connect"
  | "pinpoint"
  | "hex_conversion"
  | "fizzbuzz"
  | "guess_the_flag"
  | "website_count"
  | "hex_to_binary"
  | "lua_prime"
  | "lua_maxof3"
  | "logic_gate"
  | "dual_trivia"
  | "windows_timeline"
  | "spot_the_pattern"
  | "az_speed_test"
  | "js_array_sum"
  | "color_confusion"
  | "python_calculator"
  | "arduino_blink"
  | "connections_grid"
  | "number_speed_test"
  | "interactive_binary"
  | "memory_pattern"
  | "done";

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
  python_mentor: "Python Mentor 👨‍🏫",
  password_strength: "Password Validator 🔐",
  persona: "Persona Password 🆔",
  phishing1: "Phishing Detector 🎣",
  phishing2: "Phishing Detector 🎣",
  phishing3: "Phishing Detector 🎣",
  match_connect: "Tech Mix & Match 🔗",
  pinpoint: "LinkedIn Pinpoint 🎯",
  hex_conversion: "Hex Conversion 🔢",
  fizzbuzz: "FizzBuzz Coding 🧑‍💻",
  guess_the_flag: "Guess the Flag 🌎",
  website_count: "Website Word Count 🔎",
  hex_to_binary: "Hex to Binary 🔢",
  lua_prime: "Lua Prime Coding 💻",
  lua_maxof3: "Lua Max Value 💻",
  logic_gate: "Logic Gate Builder 🧠",
  dual_trivia: "World Cup Trivia ⚽",
  windows_timeline: "Windows Timeline ⏳",
  spot_the_pattern: "Spot the Pattern 🧠",
  az_speed_test: "A-Z Speed Test ⏱️",
  js_array_sum: "JS Array Sum 💻",
  color_confusion: "Color Confusion 🎨",
  python_calculator: "Python Calculator 🐍",
  arduino_blink: "Arduino Blink 💡",
  connections_grid: "Connections Puzzle 🧩",
  number_speed_test: "1-100 Speed Test ⏱️",
  interactive_binary: "Dec to Binary 💡",
  memory_pattern: "Memory Pattern 🧠",
  sandbox_login: "Sandbox Login 🕵️‍♂️",
  coding_typing: "Coding Typing 💻",
  html_list: "HTML List 📄",
};

const UserView: React.FC<UserViewProps> = ({
  onComplete,
  userName,
  currentScore,
  updateScore,
  currentChallenge,
  setCurrentChallenge,
  challengeOrder,
  onChallengeComplete, // Destructure new prop
  completedChallenges, // Destructure new prop
}) => {
  const currentChallengeIndex = useMemo(() => {
    return challengeOrder.indexOf(currentChallenge);
  }, [challengeOrder, currentChallenge]);

  const advanceChallenge = useCallback(() => {
    onChallengeComplete(currentChallenge); // Mark current challenge as completed

    let nextUncompletedChallenge: Challenge | null = null;
    // Start searching from the challenge *after* the current one
    for (let i = currentChallengeIndex + 1; i < challengeOrder.length; i++) {
      const nextChallenge = challengeOrder[i];
      if (!completedChallenges.has(nextChallenge)) {
        nextUncompletedChallenge = nextChallenge;
        break;
      }
    }

    if (nextUncompletedChallenge) {
      setCurrentChallenge(nextUncompletedChallenge);
    } else {
      setCurrentChallenge("done");
    }
  }, [
    onChallengeComplete,
    currentChallenge,
    currentChallengeIndex,
    challengeOrder,
    completedChallenges,
    setCurrentChallenge,
  ]);

  useEffect(() => {
    if (currentChallenge === "done" && userName) {
      const finalScore = Math.round(currentScore);
      onComplete({ name: userName, score: finalScore });
    }
  }, [currentChallenge, onComplete, currentScore, userName]);

  const getChallengeTitle = (key: string, index: number) => {
    const challengeNum = index + 1;
    if (key.startsWith("mcq")) {
      // Extract the number from the key (e.g., mcq5 -> 5)
      const mcqNum = key.replace("mcq", "");
      return `Challenge ${challengeNum}: MCQ-${mcqNum}`;
    }
    if (key.startsWith("phishing")) {
      const phishingNum = key.replace("phishing", "");
      return `Challenge ${challengeNum}: Phishing Detector #${phishingNum}`;
    }
    return `Challenge ${challengeNum}: ${CHALLENGE_NAMES[key] || "Unknown"}`;
  };

  const currentTitle = getChallengeTitle(
    currentChallenge,
    currentChallengeIndex
  );

  const handleTypingComplete = useCallback(
    (cpm: number, attempts: number) => {
      let points = 10;
      if (cpm >= 300) points = 100;
      else if (cpm >= 200) points = 90;
      else if (cpm >= 100) points = 80;
      else if (cpm >= 50) points = 70;
      else if (cpm >= 20) points = 60;

      updateScore((prev) => prev + points);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handleTyping2Complete = useCallback(
    (cpm: number, attempts: number) => {
      let points = 10;
      if (cpm >= 350) points = 100;
      else if (cpm >= 250) points = 90;
      else if (cpm >= 150) points = 80;
      else if (cpm >= 120) points = 70; // Goal for typing 2
      else if (cpm >= 80) points = 60;

      updateScore((prev) => prev + points);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handleClicksComplete = useCallback(
    (cps: number, attempts: number) => {
      let points = 10;
      if (cps >= 10) points = 100;
      else if (cps >= 8) points = 90;
      else if (cps >= 6) points = 80;
      else if (cps >= 5) points = 70;
      else if (cps >= 3) points = 60;

      updateScore((prev) => prev + points);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handleSimpleChallengeComplete = useCallback(
    (time: number | null, basePoints: number, timeFactor: number) => {
      if (time !== null) {
        const points = 100;
        updateScore((prev) => prev + points);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleMCQComplete = useCallback(
    (mistakes: number) => {
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
      updateScore((prev) => prev + points);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handlePhishingComplete = useCallback(
    (points: number) => {
      updateScore((prev) => prev + points);
      setTimeout(() => advanceChallenge(), 1500); // Phishing also needs to advance
    },
    [updateScore, advanceChallenge]
  );

  const handleTicTacToeComplete = useCallback(
    (win: boolean) => {
      if (win) {
        updateScore((prev) => prev + SCORE_WEIGHTS.TICTACTOE_WIN);
        advanceChallenge();
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleTicTacToeRetry = useCallback(() => {}, []);

  const handleSequenceComplete = useCallback(
    (finalTime: number) => {
      const points = Math.max(10, 100 - finalTime);
      updateScore((prev) => prev + points);
      advanceChallenge();
    },
    [updateScore, advanceChallenge]
  );

  const handleURLComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.URL_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleMagicComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.MAGIC_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleSpanishLoopComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.SPANISH_LOOP_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleBinaryComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.BINARY_CHALLENGE_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleHiddenPasswordComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.HIDDEN_PASSWORD_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handlePythonMentorComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.PYTHON_MENTOR_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleSimilarityComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + SCORE_WEIGHTS.SIMILARITY_SUCCESS);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleJsComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.JS_CORRECT);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleHtmlComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.HTML_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleHtmlDebugComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        // Reusing HTML_CORRECT score for debug challenge as well
        updateScore((prev) => prev + SCORE_WEIGHTS.HTML_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handlePythonAvgComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.PYTHON_AVG_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handlePasswordStrengthComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + SCORE_WEIGHTS.PASSWORD_STRENGTH_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleDinoComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + 100);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handleRealOrFakeComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleWordleComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + SCORE_WEIGHTS.WORDLE_CORRECT);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handlePinpointComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100); // Or a specific SCORE_WEIGHT for Pinpoint
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleMatchConnectComplete = useCallback(
    (scoreChange: number, allCorrect: boolean) => {
      updateScore((prev) => prev + scoreChange);
      if (allCorrect) {
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleHexConversionComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleFizzBuzzComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleGuessTheFlagComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleWebsiteCountComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleHexToBinaryComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleLuaPrimeComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleLuaMaxOf3Complete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleLogicGateComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleDualTriviaComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleWindowsTimelineComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleSpotThePatternComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleAZSpeedTestComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleJsArraySumComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleColorConfusionComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handlePythonCalculatorComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleArduinoBlinkComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 150);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleConnectionsGridComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleNumberSpeedTestComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleInteractiveBinaryComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleMemoryPatternComplete = useCallback(
    (score: number) => {
      updateScore((prev) => prev + score);
      setTimeout(() => advanceChallenge(), 1500); // Added delay for consistency
    },
    [updateScore, advanceChallenge]
  );

  const handleSandboxLoginComplete = useCallback(
    (success: boolean) => {
      if (success) {
        updateScore((prev) => prev + 100); // Award points for successful login
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const handleCodingTypingComplete = useCallback(
    (cpm: number, attempts: number) => {
      updateScore((prev) => prev + 100);
      setTimeout(() => advanceChallenge(), 1500);
    },
    [updateScore, advanceChallenge]
  );

  const handleHtmlListComplete = useCallback(
    (correct: boolean) => {
      if (correct) {
        updateScore((prev) => prev + 100);
        setTimeout(() => advanceChallenge(), 1500);
      }
    },
    [updateScore, advanceChallenge]
  );

  const renderChallenge = () => {
    if (currentChallenge.startsWith("mcq")) {
      const index = parseInt(currentChallenge.replace("mcq", ""), 10) - 1;
      const challengeData = MCQ_CHALLENGES[index];
      return (
        <MCQChallenge
          key={currentChallenge}
          onComplete={handleMCQComplete}
          {...challengeData}
          challengeTitle={currentTitle}
        />
      );
    }

    if (currentChallenge.startsWith("phishing")) {
      const index = parseInt(currentChallenge.replace("phishing", ""), 10) - 1;
      const challengeData = PHISHING_CHALLENGES[index];
      if (!userName) return <div>Loading...</div>; // Should not happen
      return (
        <PhishingChallenge
          key={currentChallenge}
          onComplete={handlePhishingComplete}
          advanceChallenge={advanceChallenge}
          challenge={challengeData}
          userName={userName}
          challengeTitle={currentTitle}
        />
      );
    }

    switch (currentChallenge) {
      case "typing":
        return (
          <TypingChallenge
            key="typing"
            onComplete={handleTypingComplete}
            challengeTitle={currentTitle}
            challengeText={TYPING_CHALLENGE_TEXT}
            minCpm={TYPING_MIN_CPM}
          />
        );
      case "typing2":
        return (
          <TypingChallenge
            key="typing2"
            onComplete={handleTyping2Complete}
            challengeTitle={currentTitle}
            challengeText={TYPING_CHALLENGE_2_TEXT}
            minCpm={TYPING_2_MIN_CPM}
          />
        );
      case "coding_typing":
        return (
          <CodingTypingChallenge
            key="coding_typing"
            onComplete={handleCodingTypingComplete}
            challengeTitle={currentTitle}
            codeText={JS_CALCULATOR_CODE_TYPING_CHALLENGE_TEXT}
            minCpm={50}
          />
        ); // Render new challenge
      case "click":
        return (
          <ClickChallenge
            key="click"
            onComplete={handleClicksComplete}
            challengeTitle={currentTitle}
          />
        );
      case "trivia":
        return (
          <TriviaChallenge
            key="trivia"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.TRIVIA_BASE_POINTS,
                SCORE_WEIGHTS.TRIVIA_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "prompt":
        return (
          <PromptChallenge
            key="prompt"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.PROMPT_BASE_POINTS,
                SCORE_WEIGHTS.PROMPT_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "cipher":
        return (
          <CaesarCipherChallenge
            key="cipher"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.CIPHER_BASE_POINTS,
                SCORE_WEIGHTS.CIPHER_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "tictactoe":
        return (
          <TicTacToeChallenge
            key="tictactoe"
            onComplete={handleTicTacToeComplete}
            onAttemptFailed={handleTicTacToeRetry}
            challengeTitle={currentTitle}
          />
        );
      case "sequence":
        return (
          <SequenceChallenge
            key="sequence"
            onComplete={handleSequenceComplete}
            challengeTitle={currentTitle}
          />
        );
      case "URL":
        return (
          <URLChallenge
            key="URL"
            onComplete={handleURLComplete}
            challengeTitle={currentTitle}
          />
        );
      case "rearrange":
        return (
          <RearrangeChallenge
            key="rearrange"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.REARRANGE_BASE_POINTS,
                SCORE_WEIGHTS.REARRANGE_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "matchstick":
        return (
          <MatchstickChallenge
            key="matchstick"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.MATCHSTICK_BASE_POINTS,
                SCORE_WEIGHTS.MATCHSTICK_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "imageTrivia":
        return (
          <ImageTriviaChallenge
            key="imageTrivia"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.IMAGE_TRIVIA_BASE_POINTS,
                SCORE_WEIGHTS.IMAGE_TRIVIA_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "similarity":
        return (
          <ImageSimilarityChallenge
            key="similarity"
            onComplete={handleSimilarityComplete}
            challengeTitle={currentTitle}
          />
        );
      case "js":
        return (
          <JsCodingChallenge
            key="js"
            onComplete={handleJsComplete}
            challengeTitle={currentTitle}
          />
        );
      case "html":
        return (
          <HtmlCodingChallenge
            key="html"
            onComplete={handleHtmlComplete}
            challengeTitle={currentTitle}
          />
        );
      case "html_debug":
        return (
          <HtmlDebugChallenge
            key="html_debug"
            onComplete={handleHtmlDebugComplete}
            challengeTitle={currentTitle}
          />
        );
      case "python_average":
        return (
          <PythonAverageChallenge
            key="python_average"
            onComplete={handlePythonAvgComplete}
            challengeTitle={currentTitle}
          />
        );
      case "python_mentor":
        return (
          <PythonMentorChallenge
            key="python_mentor"
            onComplete={handlePythonMentorComplete}
            challengeTitle={currentTitle}
          />
        );
      case "password_strength":
        return (
          <PasswordStrengthChallenge
            key="password_strength"
            onComplete={handlePasswordStrengthComplete}
            challengeTitle={currentTitle}
          />
        );
      case "hiddencode":
        return (
          <HiddenCodeChallenge
            key="hiddencode"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.HIDDEN_CODE_BASE_POINTS,
                SCORE_WEIGHTS.HIDDEN_CODE_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "persona":
        return (
          <PersonaChallenge
            key="persona"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.PERSONA_BASE_POINTS,
                SCORE_WEIGHTS.PERSONA_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "dino":
        return (
          <DinoGameChallenge
            key="dino"
            onComplete={handleDinoComplete}
            challengeTitle={currentTitle}
          />
        );
      case "loopshirt":
        return (
          <LoopShirtChallenge
            key="loopshirt"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.LOOP_SHIRT_CORRECT,
                0
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "realorfake":
        return (
          <RealOrFakeChallenge
            key="realorfake"
            onComplete={handleRealOrFakeComplete}
            challengeTitle={currentTitle}
          />
        );
      case "connections":
        return (
          <ConnectionsChallenge
            key="connections"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.CONNECTIONS_BASE_POINTS,
                SCORE_WEIGHTS.CONNECTIONS_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "wordle":
        return (
          <WordleChallenge
            key="wordle"
            onComplete={handleWordleComplete}
            challengeTitle={currentTitle}
          />
        );
      case "memory":
        return (
          <MemoryGameChallenge
            key="memory"
            onComplete={(time) =>
              handleSimpleChallengeComplete(
                time,
                SCORE_WEIGHTS.MEMORY_BASE_POINTS,
                SCORE_WEIGHTS.MEMORY_TIME_DEDUCTION_FACTOR
              )
            }
            challengeTitle={currentTitle}
          />
        );
      case "magic":
        return (
          <MagicChallenge
            key="magic"
            onComplete={handleMagicComplete}
            challengeTitle={currentTitle}
          />
        );
      case "hiddenpassword":
        return (
          <HiddenPasswordChallenge
            key="hiddenpassword"
            onComplete={handleHiddenPasswordComplete}
            challengeTitle={currentTitle}
          />
        );
      case "spanishloop":
        return (
          <SpanishLoopChallenge
            key="spanishloop"
            onComplete={handleSpanishLoopComplete}
            challengeTitle={currentTitle}
          />
        );
      case "binary":
        return (
          <BinaryChallenge
            key="binary"
            onComplete={handleBinaryComplete}
            challengeTitle={currentTitle}
          />
        );
      case "match_connect":
        return (
          <MatchConnectChallenge
            key="match_connect"
            onComplete={handleMatchConnectComplete}
            challengeTitle={currentTitle}
          />
        ); // Render new challenge
      case "pinpoint":
        return (
          <PinpointChallenge
            key="pinpoint"
            onComplete={handlePinpointComplete}
            challengeTitle={currentTitle}
          />
        ); // Render PinpointChallenge
      case "hex_conversion":
        return (
          <HexConversionChallenge
            key="hex_conversion"
            onComplete={handleHexConversionComplete}
            challengeTitle={currentTitle}
          />
        );
      case "fizzbuzz":
        return (
          <FizzBuzzChallenge
            key="fizzbuzz"
            onComplete={handleFizzBuzzComplete}
            challengeTitle={currentTitle}
          />
        );
      case "guess_the_flag":
        return (
          <GuessTheFlagChallenge
            key="guess_the_flag"
            onComplete={handleGuessTheFlagComplete}
            challengeTitle={currentTitle}
          />
        );
      case "website_count":
        return (
          <WebsiteCountChallenge
            key="website_count"
            onComplete={handleWebsiteCountComplete}
            challengeTitle={currentTitle}
          />
        );
      case "hex_to_binary":
        return (
          <HexToBinaryChallenge
            key="hex_to_binary"
            onComplete={handleHexToBinaryComplete}
            challengeTitle={currentTitle}
          />
        );
      case "lua_prime":
        return (
          <LuaPrimeChallenge
            key="lua_prime"
            onComplete={handleLuaPrimeComplete}
            challengeTitle={currentTitle}
          />
        );
      case "lua_maxof3":
        return (
          <LuaMaxOf3Challenge
            key="lua_maxof3"
            onComplete={handleLuaMaxOf3Complete}
            challengeTitle={currentTitle}
          />
        );
      case "logic_gate":
        return (
          <LogicGateChallenge
            key="logic_gate"
            onComplete={handleLogicGateComplete}
            challengeTitle={currentTitle}
          />
        );
      case "dual_trivia":
        return (
          <DualTriviaChallenge
            key="dual_trivia"
            onComplete={handleDualTriviaComplete}
            challengeTitle={currentTitle}
          />
        );
      case "windows_timeline":
        return (
          <WindowsTimelineChallenge
            key="windows_timeline"
            onComplete={handleWindowsTimelineComplete}
            challengeTitle={currentTitle}
          />
        );
      case "spot_the_pattern":
        return (
          <SpotThePatternChallenge
            key="spot_the_pattern"
            onComplete={handleSpotThePatternComplete}
            challengeTitle={currentTitle}
          />
        );
      case "az_speed_test":
        return (
          <AZSpeedTestChallenge
            key="az_speed_test"
            onComplete={handleAZSpeedTestComplete}
            challengeTitle={currentTitle}
          />
        );
      case "js_array_sum":
        return (
          <JsArraySumChallenge
            key="js_array_sum"
            onComplete={handleJsArraySumComplete}
            challengeTitle={currentTitle}
          />
        );
      case "color_confusion":
        return (
          <ColorConfusionChallenge
            key="color_confusion"
            onComplete={handleColorConfusionComplete}
            challengeTitle={currentTitle}
          />
        );
      case "python_calculator":
        return (
          <PythonCalculatorChallenge
            key="python_calculator"
            onComplete={handlePythonCalculatorComplete}
            challengeTitle={currentTitle}
          />
        );
      case "arduino_blink":
        return (
          <ArduinoBlinkChallenge
            key="arduino_blink"
            onComplete={handleArduinoBlinkComplete}
            challengeTitle={currentTitle}
          />
        );
      case "connections_grid":
        return (
          <ConnectionsGridChallenge
            key="connections_grid"
            onComplete={handleConnectionsGridComplete}
            challengeTitle={currentTitle}
          />
        );
      case "number_speed_test":
        return (
          <NumberSpeedTestChallenge
            key="number_speed_test"
            onComplete={handleNumberSpeedTestComplete}
            challengeTitle={currentTitle}
          />
        );
      case "interactive_binary":
        return (
          <InteractiveBinaryChallenge
            key="interactive_binary"
            onComplete={handleInteractiveBinaryComplete}
            challengeTitle={currentTitle}
          />
        );
      case "memory_pattern":
        return (
          <MemoryPatternChallenge
            key="memory_pattern"
            onComplete={handleMemoryPatternComplete}
            challengeTitle={currentTitle}
          />
        );
      case "sandbox_login":
        return (
          <SandboxLoginChallenge
            key="sandbox_login"
            onComplete={handleSandboxLoginComplete}
            challengeTitle={currentTitle}
          />
        );
      case "html_list":
        return (
          <HtmlListChallenge
            key="html_list"
            onComplete={handleHtmlListComplete}
            challengeTitle={currentTitle}
          />
        );

      case "done":
        return (
          <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Congratulations, {userName}!
            </h2>
            <p className="text-gray-200 text-xl mb-2">
              You have completed all the challenges.
            </p>
            <p className="text-gray-300 mb-6">Your final score is:</p>
            <p className="text-5xl font-bold my-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {Math.round(currentScore)}
            </p>
          </div>
        );
      default:
        return <div>Loading challenge...</div>;
    }
  };

  return <div className="w-full max-w-6xl mx-auto">{renderChallenge()}</div>;
};

export default UserView;
