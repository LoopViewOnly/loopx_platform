import React, { useState } from 'react';
import { LOGIC_GATES_VISUAL_CHALLENGE } from '../challenges/content';

interface LogicGatesVisualChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const POINTS_PER_STAGE = LOGIC_GATES_VISUAL_CHALLENGE.pointsPerStage;
const HINT_COST = LOGIC_GATES_VISUAL_CHALLENGE.hintCost;
const WRONG_PENALTY = LOGIC_GATES_VISUAL_CHALLENGE.wrongPenalty;

// SVG Gate Components
const AndGate: React.FC<{ label?: string }> = ({ label = "AND" }) => (
    <svg width="80" height="50" viewBox="0 0 80 50">
        <path d="M10 5 L40 5 Q70 5 70 25 Q70 45 40 45 L10 45 Z" 
              fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
        <text x="40" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{label}</text>
        {/* Input lines */}
        <line x1="0" y1="15" x2="10" y2="15" stroke="#60a5fa" strokeWidth="2"/>
        <line x1="0" y1="35" x2="10" y2="35" stroke="#60a5fa" strokeWidth="2"/>
        {/* Output line */}
        <line x1="70" y1="25" x2="80" y2="25" stroke="#60a5fa" strokeWidth="2"/>
    </svg>
);

const OrGate: React.FC<{ label?: string }> = ({ label = "OR" }) => (
    <svg width="80" height="50" viewBox="0 0 80 50">
        <path d="M10 5 Q25 25 10 45 Q40 45 70 25 Q40 5 10 5 Z" 
              fill="#22c55e" stroke="#4ade80" strokeWidth="2"/>
        <text x="38" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{label}</text>
        {/* Input lines */}
        <line x1="0" y1="15" x2="15" y2="15" stroke="#4ade80" strokeWidth="2"/>
        <line x1="0" y1="35" x2="15" y2="35" stroke="#4ade80" strokeWidth="2"/>
        {/* Output line */}
        <line x1="70" y1="25" x2="80" y2="25" stroke="#4ade80" strokeWidth="2"/>
    </svg>
);

const XorGate: React.FC<{ label?: string }> = ({ label = "XOR" }) => (
    <svg width="85" height="50" viewBox="0 0 85 50">
        <path d="M15 5 Q30 25 15 45 Q45 45 75 25 Q45 5 15 5 Z" 
              fill="#a855f7" stroke="#c084fc" strokeWidth="2"/>
        <path d="M10 5 Q25 25 10 45" fill="none" stroke="#c084fc" strokeWidth="2"/>
        <text x="42" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{label}</text>
        {/* Input lines */}
        <line x1="0" y1="15" x2="13" y2="15" stroke="#c084fc" strokeWidth="2"/>
        <line x1="0" y1="35" x2="13" y2="35" stroke="#c084fc" strokeWidth="2"/>
        {/* Output line */}
        <line x1="75" y1="25" x2="85" y2="25" stroke="#c084fc" strokeWidth="2"/>
    </svg>
);

const NotGate: React.FC<{ label?: string }> = ({ label = "NOT" }) => (
    <svg width="70" height="40" viewBox="0 0 70 40">
        <polygon points="10,5 50,20 10,35" fill="#ef4444" stroke="#f87171" strokeWidth="2"/>
        <circle cx="55" cy="20" r="5" fill="#ef4444" stroke="#f87171" strokeWidth="2"/>
        <text x="25" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{label}</text>
        {/* Input line */}
        <line x1="0" y1="20" x2="10" y2="20" stroke="#f87171" strokeWidth="2"/>
        {/* Output line */}
        <line x1="60" y1="20" x2="70" y2="20" stroke="#f87171" strokeWidth="2"/>
    </svg>
);

// Input/Output labels
const InputLabel: React.FC<{ name: string; value: number }> = ({ name, value }) => (
    <div className="flex items-center gap-2">
        <span className="text-gray-400 font-mono">{name} =</span>
        <span className={`font-bold font-mono text-lg ${value === 1 ? 'text-green-400' : 'text-red-400'}`}>
            {value}
        </span>
    </div>
);

const OutputLabel: React.FC<{ value: string }> = ({ value }) => (
    <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-mono font-bold text-lg">? = {value}</span>
    </div>
);

// Stage circuit diagrams with proper connections
const Stage1Circuit: React.FC<{ x: number; y: number; z: number }> = ({ x, y, z }) => (
    <div className="p-6 bg-black/40 rounded-lg border border-white/20">
        <svg width="400" height="140" viewBox="0 0 400 140">
            {/* Input labels */}
            <text x="10" y="35" fill="#9ca3af" fontSize="14" fontFamily="monospace">x = <tspan fill={x === 1 ? "#4ade80" : "#f87171"}>{x}</tspan></text>
            <text x="10" y="75" fill="#9ca3af" fontSize="14" fontFamily="monospace">y = <tspan fill={y === 1 ? "#4ade80" : "#f87171"}>{y}</tspan></text>
            <text x="10" y="115" fill="#9ca3af" fontSize="14" fontFamily="monospace">z = <tspan fill={z === 1 ? "#4ade80" : "#f87171"}>{z}</tspan></text>
            
            {/* Input lines to AND gate */}
            <line x1="55" y1="30" x2="100" y2="30" stroke="#60a5fa" strokeWidth="2"/>
            <line x1="55" y1="70" x2="100" y2="70" stroke="#60a5fa" strokeWidth="2"/>
            
            {/* AND Gate */}
            <g transform="translate(100, 25)">
                <path d="M0 0 L30 0 Q60 0 60 25 Q60 50 30 50 L0 50 Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
                <text x="30" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AND</text>
            </g>
            
            {/* Connection from AND to OR (top input) */}
            <line x1="160" y1="50" x2="200" y2="50" stroke="#4ade80" strokeWidth="2"/>
            <line x1="200" y1="50" x2="200" y2="45" stroke="#4ade80" strokeWidth="2"/>
            <line x1="200" y1="45" x2="230" y2="45" stroke="#4ade80" strokeWidth="2"/>
            
            {/* Z input line to OR (bottom input) */}
            <line x1="55" y1="110" x2="200" y2="110" stroke="#4ade80" strokeWidth="2"/>
            <line x1="200" y1="110" x2="200" y2="85" stroke="#4ade80" strokeWidth="2"/>
            <line x1="200" y1="85" x2="230" y2="85" stroke="#4ade80" strokeWidth="2"/>
            
            {/* OR Gate */}
            <g transform="translate(225, 40)">
                <path d="M0 0 Q15 25 0 50 Q35 50 70 25 Q35 0 0 0 Z" fill="#22c55e" stroke="#4ade80" strokeWidth="2"/>
                <text x="30" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OR</text>
            </g>
            
            {/* Output line */}
            <line x1="295" y1="65" x2="340" y2="65" stroke="#4ade80" strokeWidth="2"/>
            
            {/* Output label */}
            <text x="350" y="70" fill="#facc15" fontSize="16" fontWeight="bold" fontFamily="monospace">? = ?</text>
        </svg>
    </div>
);

const Stage2Circuit: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <div className="p-6 bg-black/40 rounded-lg border border-white/20">
        <svg width="280" height="100" viewBox="0 0 280 100">
            {/* Input labels */}
            <text x="10" y="35" fill="#9ca3af" fontSize="14" fontFamily="monospace">x = <tspan fill={x === 1 ? "#4ade80" : "#f87171"}>{x}</tspan></text>
            <text x="10" y="75" fill="#9ca3af" fontSize="14" fontFamily="monospace">y = <tspan fill={y === 1 ? "#4ade80" : "#f87171"}>{y}</tspan></text>
            
            {/* Input lines to XOR gate */}
            <line x1="55" y1="30" x2="100" y2="30" stroke="#c084fc" strokeWidth="2"/>
            <line x1="55" y1="70" x2="100" y2="70" stroke="#c084fc" strokeWidth="2"/>
            
            {/* XOR Gate */}
            <g transform="translate(95, 25)">
                <path d="M10 0 Q25 25 10 50 Q45 50 80 25 Q45 0 10 0 Z" fill="#a855f7" stroke="#c084fc" strokeWidth="2"/>
                <path d="M5 0 Q20 25 5 50" fill="none" stroke="#c084fc" strokeWidth="2"/>
                <text x="42" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">XOR</text>
            </g>
            
            {/* Output line */}
            <line x1="175" y1="50" x2="220" y2="50" stroke="#c084fc" strokeWidth="2"/>
            
            {/* Output label */}
            <text x="230" y="55" fill="#facc15" fontSize="16" fontWeight="bold" fontFamily="monospace">? = ?</text>
        </svg>
    </div>
);

const Stage3Circuit: React.FC<{ x: number; y: number; z: number }> = ({ x, y, z }) => (
    <div className="p-6 bg-black/40 rounded-lg border border-white/20">
        <svg width="450" height="160" viewBox="0 0 450 160">
            {/* Input labels */}
            <text x="10" y="35" fill="#9ca3af" fontSize="14" fontFamily="monospace">x = <tspan fill={x === 1 ? "#4ade80" : "#f87171"}>{x}</tspan></text>
            <text x="10" y="75" fill="#9ca3af" fontSize="14" fontFamily="monospace">y = <tspan fill={y === 1 ? "#4ade80" : "#f87171"}>{y}</tspan></text>
            <text x="10" y="135" fill="#9ca3af" fontSize="14" fontFamily="monospace">z = <tspan fill={z === 1 ? "#4ade80" : "#f87171"}>{z}</tspan></text>
            
            {/* Input lines to AND gate */}
            <line x1="55" y1="30" x2="100" y2="30" stroke="#60a5fa" strokeWidth="2"/>
            <line x1="55" y1="70" x2="100" y2="70" stroke="#60a5fa" strokeWidth="2"/>
            
            {/* AND Gate */}
            <g transform="translate(100, 25)">
                <path d="M0 0 L30 0 Q60 0 60 25 Q60 50 30 50 L0 50 Z" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2"/>
                <text x="30" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">AND</text>
            </g>
            
            {/* Z input line to NOT gate */}
            <line x1="55" y1="130" x2="110" y2="130" stroke="#f87171" strokeWidth="2"/>
            
            {/* NOT Gate */}
            <g transform="translate(110, 110)">
                <polygon points="0,0 40,20 0,40" fill="#ef4444" stroke="#f87171" strokeWidth="2"/>
                <circle cx="47" cy="20" r="6" fill="#ef4444" stroke="#f87171" strokeWidth="2"/>
                <text x="13" y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">NOT</text>
            </g>
            
            {/* Connection from AND to OR (top input) */}
            <line x1="160" y1="50" x2="220" y2="50" stroke="#4ade80" strokeWidth="2"/>
            <line x1="220" y1="50" x2="220" y2="55" stroke="#4ade80" strokeWidth="2"/>
            <line x1="220" y1="55" x2="260" y2="55" stroke="#4ade80" strokeWidth="2"/>
            
            {/* Connection from NOT to OR (bottom input) */}
            <line x1="163" y1="130" x2="220" y2="130" stroke="#4ade80" strokeWidth="2"/>
            <line x1="220" y1="130" x2="220" y2="95" stroke="#4ade80" strokeWidth="2"/>
            <line x1="220" y1="95" x2="260" y2="95" stroke="#4ade80" strokeWidth="2"/>
            
            {/* OR Gate */}
            <g transform="translate(255, 50)">
                <path d="M0 0 Q15 25 0 50 Q35 50 70 25 Q35 0 0 0 Z" fill="#22c55e" stroke="#4ade80" strokeWidth="2"/>
                <text x="30" y="30" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">OR</text>
            </g>
            
            {/* Output line */}
            <line x1="325" y1="75" x2="370" y2="75" stroke="#4ade80" strokeWidth="2"/>
            
            {/* Output label */}
            <text x="380" y="80" fill="#facc15" fontSize="16" fontWeight="bold" fontFamily="monospace">? = ?</text>
        </svg>
    </div>
);

const LogicGatesVisualChallenge: React.FC<LogicGatesVisualChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [stageIndex, setStageIndex] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [stageScore, setStageScore] = useState(POINTS_PER_STAGE);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const [hintUsedThisStage, setHintUsedThisStage] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [stageComplete, setStageComplete] = useState(false);

    const currentStage = LOGIC_GATES_VISUAL_CHALLENGE.stages[stageIndex];
    const totalStages = LOGIC_GATES_VISUAL_CHALLENGE.stages.length;

    const handleUseHint = () => {
        if (!hintUsedThisStage && !stageComplete) {
            setShowHint(true);
            setHintUsedThisStage(true);
            setStageScore(prev => Math.max(0, prev - HINT_COST));
            setFeedback({ message: `Hint used! -${HINT_COST} points`, color: 'text-yellow-400' });
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const handleAnswer = (answer: number) => {
        if (stageComplete || isComplete) return;
        setSelectedAnswer(answer);

        if (answer === currentStage.answer) {
            // Correct!
            const earnedPoints = Math.max(0, stageScore);
            setTotalScore(prev => prev + earnedPoints);
            setFeedback({ message: `✅ Correct! +${earnedPoints} points`, color: 'text-green-400' });
            setStageComplete(true);

            setTimeout(() => {
                if (stageIndex + 1 < totalStages) {
                    setStageIndex(prev => prev + 1);
                    setStageScore(POINTS_PER_STAGE);
                    setSelectedAnswer(null);
                    setShowHint(false);
                    setHintUsedThisStage(false);
                    setFeedback(null);
                    setStageComplete(false);
                } else {
                    const finalScore = totalScore + earnedPoints;
                    setIsComplete(true);
                    setFeedback({ 
                        message: `🎉 Challenge Complete! Score: ${finalScore}`, 
                        color: 'text-green-400' 
                    });
                    onComplete(finalScore);
                }
            }, 1500);
        } else {
            // Wrong
            setStageScore(prev => Math.max(0, prev - WRONG_PENALTY));
            setFeedback({ message: `❌ Wrong! -${WRONG_PENALTY} points`, color: 'text-red-400' });
            setSelectedAnswer(null);
            setTimeout(() => setFeedback(null), 1500);
        }
    };

    const renderCircuit = () => {
        const inputs = currentStage.inputs as { x: number; y: number; z?: number };
        
        switch (stageIndex) {
            case 0:
                return <Stage1Circuit x={inputs.x} y={inputs.y} z={inputs.z!} />;
            case 1:
                return <Stage2Circuit x={inputs.x} y={inputs.y} />;
            case 2:
                return <Stage3Circuit x={inputs.x} y={inputs.y} z={inputs.z!} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>

            {/* Progress and Score */}
            <div className="flex justify-between items-center max-w-xl mx-auto mb-6 p-4 bg-black/40 rounded-lg border border-white/10">
                <div className="text-left">
                    <p className="text-sm text-gray-400">Stage</p>
                    <p className="text-2xl font-bold text-blue-400">{stageIndex + 1} / {totalStages}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-400">Stage Points</p>
                    <p className={`text-2xl font-bold ${stageScore < POINTS_PER_STAGE ? 'text-orange-400' : 'text-yellow-400'}`}>
                        {stageScore}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Score</p>
                    <p className="text-2xl font-bold text-green-400">{totalScore}</p>
                </div>
            </div>

            {/* Stage Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
                {LOGIC_GATES_VISUAL_CHALLENGE.stages.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index < stageIndex 
                                ? 'bg-green-500' 
                                : index === stageIndex 
                                    ? 'bg-blue-500 scale-125' 
                                    : 'bg-gray-600'
                        }`}
                    />
                ))}
            </div>

            {/* Question */}
            <p className="text-gray-300 mb-4">What is the output of this circuit?</p>

            {/* Circuit Diagram */}
            <div className="mb-6 flex justify-center overflow-x-auto">
                {renderCircuit()}
            </div>

            {/* Answer Buttons */}
            <div className="flex justify-center gap-6 mb-6">
                <button
                    onClick={() => handleAnswer(0)}
                    disabled={stageComplete || isComplete}
                    className={`w-24 h-24 text-4xl font-bold rounded-xl border-4 transition-all duration-200 
                        ${selectedAnswer === 0 
                            ? 'bg-red-600/50 border-red-400' 
                            : 'bg-black/40 border-white/30 hover:bg-red-600/30 hover:border-red-400'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-white`}
                >
                    0
                </button>
                <button
                    onClick={() => handleAnswer(1)}
                    disabled={stageComplete || isComplete}
                    className={`w-24 h-24 text-4xl font-bold rounded-xl border-4 transition-all duration-200 
                        ${selectedAnswer === 1 
                            ? 'bg-green-600/50 border-green-400' 
                            : 'bg-black/40 border-white/30 hover:bg-green-600/30 hover:border-green-400'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-white`}
                >
                    1
                </button>
            </div>

            {/* Hint Button / Display */}
            {!showHint && !hintUsedThisStage && !stageComplete && (
                <div className="mb-4">
                    <button
                        onClick={handleUseHint}
                        className="px-4 py-2 bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded-lg hover:bg-orange-600/50 transition-all duration-200"
                    >
                        💡 Use Hint (-{HINT_COST} points)
                    </button>
                </div>
            )}
            
            {showHint && (
                <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg max-w-md mx-auto">
                    <p className="text-orange-300 text-sm">
                        <strong>💡 Hint:</strong> {currentStage.hint}
                    </p>
                </div>
            )}

            {/* Feedback */}
            <div className="min-h-[3rem] flex items-center justify-center">
                {feedback && (
                    <p className={`text-xl font-bold ${feedback.color}`}>{feedback.message}</p>
                )}
            </div>

            {/* Gate Legend */}
            <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10 max-w-lg mx-auto">
                <p className="text-gray-500 text-xs mb-2">Gate Reference:</p>
                <div className="flex justify-center gap-4 flex-wrap">
                    <span className="text-blue-400 text-xs">AND: both inputs = 1</span>
                    <span className="text-green-400 text-xs">OR: any input = 1</span>
                    <span className="text-purple-400 text-xs">XOR: inputs differ</span>
                    <span className="text-red-400 text-xs">NOT: inverts input</span>
                </div>
            </div>
        </div>
    );
};

export default LogicGatesVisualChallenge;

