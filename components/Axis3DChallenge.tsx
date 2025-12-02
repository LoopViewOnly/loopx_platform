import React, { useState, useEffect, useRef } from 'react';
import { AXIS_3D_CHALLENGE } from '../challenges/content';

interface Axis3DChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type FeedbackState = 'correct' | 'incorrect' | null;

const Axis3DChallenge: React.FC<Axis3DChallengeProps> = ({ onComplete, challengeTitle }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({
        up: '',
        right: '',
        towards: ''
    });
    const [feedback, setFeedback] = useState<{ [key: string]: FeedbackState }>({
        up: null,
        right: null,
        towards: null
    });
    const [isComplete, setIsComplete] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Draw the 3D axes on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2 + 30;
        const axisLength = 120;

        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Draw grid (optional background effect)
        ctx.strokeStyle = '#2a2a4e';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 20) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        // Helper function to draw arrow
        const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
            const headLength = 15;
            const angle = Math.atan2(toY - fromY, toX - fromX);

            // Draw line
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            // Draw arrowhead
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(toX, toY);
            ctx.lineTo(
                toX - headLength * Math.cos(angle - Math.PI / 6),
                toY - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                toX - headLength * Math.cos(angle + Math.PI / 6),
                toY - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();

            // Draw label
            ctx.fillStyle = color;
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const labelOffset = 25;
            const labelX = toX + labelOffset * Math.cos(angle);
            const labelY = toY + labelOffset * Math.sin(angle);
            ctx.fillText(label, labelX, labelY);
        };

        // Draw origin point
        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Y-axis (pointing UP) - Green
        drawArrow(centerX, centerY, centerX, centerY - axisLength, '#4ade80', '?');

        // X-axis (pointing RIGHT) - Red
        drawArrow(centerX, centerY, centerX + axisLength, centerY, '#f87171', '?');

        // Z-axis (pointing towards user - diagonal to simulate depth) - Blue
        // We'll draw it coming towards the viewer (down-left diagonal represents "towards")
        const zEndX = centerX - axisLength * 0.6;
        const zEndY = centerY + axisLength * 0.6;
        drawArrow(centerX, centerY, zEndX, zEndY, '#60a5fa', '?');

        // Draw a circle at the Z endpoint to indicate "towards you"
        ctx.beginPath();
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.arc(zEndX - 15, zEndY + 15, 12, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = '#60a5fa';
        ctx.arc(zEndX - 15, zEndY + 15, 5, 0, Math.PI * 2);
        ctx.fill();

        // Add legend
        ctx.font = '14px Arial';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'left';
        ctx.fillText('Origin (0, 0, 0)', centerX + 10, centerY + 15);

    }, []);

    const handleInputChange = (axisId: string, value: string) => {
        if (isComplete) return;
        setAnswers(prev => ({ ...prev, [axisId]: value.toUpperCase() }));
        
        // Clear feedback when typing
        if (feedback[axisId] !== null) {
            setFeedback(prev => ({ ...prev, [axisId]: null }));
        }
    };

    const handleSubmit = () => {
        if (isComplete || hasSubmitted) return;
        if (Object.values(answers).some(a => !a.trim())) return;

        setHasSubmitted(true);

        const newFeedback: { [key: string]: FeedbackState } = {};
        let allCorrect = true;

        AXIS_3D_CHALLENGE.axes.forEach(axis => {
            const userAnswer = answers[axis.id].trim().toLowerCase();
            const isCorrect = userAnswer === axis.answer.toLowerCase();
            newFeedback[axis.id] = isCorrect ? 'correct' : 'incorrect';
            if (!isCorrect) allCorrect = false;
        });

        setFeedback(newFeedback);

        if (allCorrect) {
            setIsComplete(true);
            setErrorMessage(null);
            setTimeout(() => onComplete(true), 1500);
        } else {
            setErrorMessage('One or more answers are incorrect. Remember: Y=Up, X=Right, Z=Towards you');
            setHasSubmitted(false);
        }
    };

    const getInputClass = (axisId: string) => {
        switch (feedback[axisId]) {
            case 'correct':
                return 'border-green-500 ring-2 ring-green-500/50 bg-green-900/20';
            case 'incorrect':
                return 'border-red-500 ring-2 ring-red-500/50 bg-red-900/20';
            default:
                return 'border-blue-500/50';
        }
    };

    const getAxisColor = (axisId: string) => {
        switch (axisId) {
            case 'up': return 'text-green-400';
            case 'right': return 'text-red-400';
            case 'towards': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">{AXIS_3D_CHALLENGE.question}</p>

            {/* Canvas with 3D axes */}
            <div className="flex justify-center mb-8">
                <canvas
                    ref={canvasRef}
                    width={350}
                    height={350}
                    className="rounded-lg border-2 border-white/20 shadow-lg"
                />
            </div>

            {/* Color legend */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-400 rounded"></div>
                    <span className="text-gray-400">Up axis</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-400 rounded"></div>
                    <span className="text-gray-400">Right axis</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span className="text-gray-400">Towards you</span>
                </div>
            </div>

            {/* Input fields */}
            <div className="max-w-md mx-auto space-y-4">
                {AXIS_3D_CHALLENGE.axes.map((axis) => (
                    <div key={axis.id} className="flex items-center gap-4">
                        <span className={`text-lg font-semibold w-48 text-left ${getAxisColor(axis.id)}`}>
                            {axis.label}
                        </span>
                        <input
                            type="text"
                            value={answers[axis.id]}
                            onChange={(e) => handleInputChange(axis.id, e.target.value)}
                            placeholder="X, Y, or Z"
                            maxLength={1}
                            disabled={isComplete}
                            className={`w-20 px-4 py-3 bg-black/40 border-2 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl font-bold uppercase ${getInputClass(axis.id)}`}
                        />
                        {feedback[axis.id] === 'correct' && (
                            <span className="text-green-400 text-2xl">✓</span>
                        )}
                        {feedback[axis.id] === 'incorrect' && (
                            <span className="text-red-400 text-2xl">✗</span>
                        )}
                    </div>
                ))}
            </div>

            {!isComplete && (
                <button
                    onClick={handleSubmit}
                    disabled={Object.values(answers).some(a => !a.trim()) || hasSubmitted}
                    className="mt-8 w-full max-w-sm px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Check Answers
                </button>
            )}

            <div className="mt-6 min-h-[2.5rem]">
                {errorMessage && !isComplete && (
                    <p className="text-lg font-bold text-red-400">{errorMessage}</p>
                )}
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">
                        ✅ Correct! You know your 3D coordinates!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Axis3DChallenge;

