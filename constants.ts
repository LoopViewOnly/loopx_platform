import { LOOPERS_SHIRT } from './challenges/content';
import { UserScore } from './types';

// Challenge thresholds
export const TYPING_MIN_CPM = 100; // Characters Per Minute
export const TYPING_2_MIN_CPM = 120; // CPM for the second typing challenge
export const CLICK_CHALLENGE_DURATION = 10; // in seconds
export const CLICK_MIN_CPS = 5; // Clicks Per Second
export const SIMILARITY_THRESHOLD = 80; // Minimum score to pass the similarity challenge
export const DINO_GOAL_DISTANCE = 1000; // Goal distance for the dino game

// Scoring weights
export const SCORE_WEIGHTS = {
    // Speed-based challenges
    TYPING_CPM_MULTIPLIER: 1.5,
    CLICK_CPS_MULTIPLIER: 50,
    SEQUENCE_BASE_POINTS: 500,
    SEQUENCE_TIME_DEDUCTION_FACTOR: 5,

    // Timed correct/incorrect challenges
    TRIVIA_BASE_POINTS: 250,
    TRIVIA_TIME_DEDUCTION_FACTOR: 8,
    PROMPT_BASE_POINTS: 250,
    PROMPT_TIME_DEDUCTION_FACTOR: 5,
    CIPHER_BASE_POINTS: 300,
    CIPHER_TIME_DEDUCTION_FACTOR: 7,
    HIDDEN_CODE_BASE_POINTS: 350,
    HIDDEN_CODE_TIME_DEDUCTION_FACTOR: 8,
    PERSONA_BASE_POINTS: 350,
    PERSONA_TIME_DEDUCTION_FACTOR: 8,
    MATCHSTICK_BASE_POINTS: 400,
    MATCHSTICK_TIME_DEDUCTION_FACTOR: 10,
    IMAGE_TRIVIA_BASE_POINTS: 280,
    IMAGE_TRIVIA_TIME_DEDUCTION_FACTOR: 7,
    CONNECTIONS_BASE_POINTS: 450,
    CONNECTIONS_TIME_DEDUCTION_FACTOR: 12,
    REARRANGE_BASE_POINTS: 200,
    REARRANGE_TIME_DEDUCTION_FACTOR: 6,
    MEMORY_BASE_POINTS: 300,
    MEMORY_TIME_DEDUCTION_FACTOR: 8,
    
    // Fixed score challenges
    URL_CORRECT: 100,
    TICTACTOE_WIN: 100,
    SIMILARITY_SUCCESS: 100,
    JS_CORRECT: 100,
    HTML_CORRECT: 100,
    LOOPERS_SHIRT: 100,
    WORDLE_CORRECT: 200,
    MAGIC_CORRECT: 100,
    PHISHING_CORRECT: 100,
    HIDDEN_PASSWORD_CORRECT: 100,
    SPANISH_LOOP_CORRECT: 100,
    BINARY_CHALLENGE_CORRECT: 150,
    PYTHON_AVG_CORRECT: 100,
    PYTHON_MENTOR_CORRECT: 100,
    PASSWORD_STRENGTH_CORRECT: 100,
    LOGIC_GATE_SCORE_PER_STEP: 100, // Score per step in the multi-step logic gate challenge

    // Penalties
    ATTEMPT_PENALTY: 0, // Score should only go up, so penalty is 0.
};