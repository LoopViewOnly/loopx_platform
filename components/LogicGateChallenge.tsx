import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SCORE_WEIGHTS } from '../constants';

// --- Types ---
type GateType = 'AND' | 'OR' | 'NOT' | 'INPUT_X' | 'INPUT_Y' | 'INPUT_Z' | 'OUTPUT';
type Gate = {
    id: string;
    type: GateType;
    x: number;
    y: number;
    inputs: (string | null)[];
    output: boolean | null;
};
type Wire = {
    id: string;
    fromGateId: string;
    toGateId: string;
    toNodeIndex: number;
};
type Point = { x: number; y: number; };
type WiringState = { fromGateId: string; startPos: Point; };

// --- Constants ---
const GATE_DIMS = { width: 80, height: 40 };
const NODE_RADIUS = 6;

const GATE_PROPS: Record<GateType, { inputs: number; color: string; } | undefined> = {
    AND: { inputs: 2, color: 'bg-blue-600' },
    OR: { inputs: 2, color: 'bg-purple-600' },
    NOT: { inputs: 1, color: 'bg-red-600' },
    INPUT_X: { inputs: 0, color: 'bg-gray-700' },
    INPUT_Y: { inputs: 0, color: 'bg-gray-700' },
    INPUT_Z: { inputs: 0, color: 'bg-gray-700' }, // Added INPUT_Z
    OUTPUT: { inputs: 1, color: 'bg-yellow-600' },
};

const CHALLENGE_STEPS = [
    {
        expression: "(X & Y)",
        inputsNeeded: ['INPUT_X', 'INPUT_Y'],
        truthTable: (x: boolean, y: boolean, z: boolean) => x && y,
        optimalGateCount: 1, // AND gate
    },
    {
        expression: "(X & Y) || Y",
        inputsNeeded: ['INPUT_X', 'INPUT_Y'],
        truthTable: (x: boolean, y: boolean, z: boolean) => (x && y) || y,
        optimalGateCount: 2, // AND, OR
        hint: {
            text: "Use AND first then connect it to OR",
            cost: 15
        }
    },
    {
        expression: "(X & Y) || (Y & Z) || (X & Z)", // Majority function
        inputsNeeded: ['INPUT_X', 'INPUT_Y', 'INPUT_Z'],
        truthTable: (x: boolean, y: boolean, z: boolean) => (x && y) || (y && z) || (x && z),
        optimalGateCount: 5, // 3 AND, 2 OR
        hint: {
            text: "Use 3 AND gates (x & y), (y&z), (x&z) then connect them to 2 OR gates, pssst... connect the end of one OR to another!",
            cost: 10
        }
    },
];

// --- Helper Functions ---
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// --- Component ---
interface LogicGateChallengeProps {
    onComplete: (score: number) => void;
    challengeTitle: string;
}

const LogicGateChallenge: React.FC<LogicGateChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [gates, setGates] = useState<Gate[]>(() => []);
    const [wires, setWires] = useState<Wire[]>([]);
    const [wiringState, setWiringState] = useState<WiringState | null>(null);
    const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
    const [isChallengeComplete, setIsChallengeComplete] = useState(false); // Overall challenge completion
    const [stepFeedback, setStepFeedback] = useState<string | null>(null);
    const [hintUsed, setHintUsed] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [draggingGateId, setDraggingGateId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
    const [currentTotalScore, setCurrentTotalScore] = useState(0);
    const [outputLightOn, setOutputLightOn] = useState(false); // New state for the output light

    const canvasRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const currentStep = CHALLENGE_STEPS[currentStepIndex];

    const initializeStep = useCallback(() => {
        const initialGates: Gate[] = [
            { id: 'INPUT_X', type: 'INPUT_X', x: 50, y: 100, inputs: [], output: false },
            { id: 'INPUT_Y', type: 'INPUT_Y', x: 50, y: 250, inputs: [], output: false },
            { id: 'OUTPUT', type: 'OUTPUT', x: 700, y: 175, inputs: [null], output: false },
        ];

        if (currentStep.inputsNeeded.includes('INPUT_Z')) {
            initialGates.push({ id: 'INPUT_Z', type: 'INPUT_Z', x: 50, y: 400, inputs: [], output: false });
        }
        
        setGates(initialGates);
        setWires([]);
        setWiringState(null);
        setStepFeedback(null);
        setHintUsed(false);
        setDraggingGateId(null);
        setDragOffset(null);
        setOutputLightOn(false); // Ensure light is off at the start of a new step
    }, [currentStepIndex, currentStep.inputsNeeded]);


    useEffect(() => {
        initializeStep();
    }, [currentStepIndex, initializeStep]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

            if (draggingGateId && dragOffset) {
                const newX = e.clientX - rect.left - dragOffset.x;
                const newY = e.clientY - rect.top - dragOffset.y;

                setGates(prev => prev.map(g =>
                    g.id === draggingGateId ? { ...g, x: newX, y: newY } : g
                ));
            }
        };

        const handleMouseUp = () => {
            setDraggingGateId(null);
            setDragOffset(null);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingGateId, dragOffset]);

    const getNodePosition = useCallback((gateId: string, type: 'input' | 'output', index: number = 0): Point | null => {
        const gate = gates.find(g => g.id === gateId);
        if (!gate) return null;

        const props = GATE_PROPS[gate.type];
        if (!props) return null;

        if (type === 'input') {
            const yOffset = gate.y + (GATE_DIMS.height / (props.inputs + 1)) * (index + 1);
            return { x: gate.x, y: yOffset };
        } else {
            return { x: gate.x + GATE_DIMS.width, y: gate.y + GATE_DIMS.height / 2 };
        }
    }, [gates]);

    const handlePaletteDragStart = (e: React.DragEvent<HTMLDivElement>, gateType: GateType) => {
        e.dataTransfer.setData('gateType', gateType);
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Cancel wiring if clicking on empty canvas (not on a gate or node)
        if (wiringState) {
            const target = e.target as HTMLElement;
            // Check if click was on a gate
            const isClickOnGate = target.closest('[data-gate-element]') !== null;
            // Check if click was on a node (has cursor-pointer class and bg-gray-300)
            const isClickOnNode = (target.classList.contains('cursor-pointer') && 
                                   target.classList.contains('bg-gray-300')) ||
                                  target.closest('.cursor-pointer.bg-gray-300') !== null;
            
            // If click is not on a gate or node (i.e., empty canvas), cancel wiring
            if (!isClickOnGate && !isClickOnNode) {
                setWiringState(null);
            }
        }
    };

    const handleCanvasDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleCanvasDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (isChallengeComplete) return;

        if (!canvasRef.current) return;
        const gateType = e.dataTransfer.getData('gateType') as GateType;
        if (!gateType || !['AND', 'OR', 'NOT'].includes(gateType)) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - GATE_DIMS.width / 2;
        const y = e.clientY - rect.top - GATE_DIMS.height / 2;

        const props = GATE_PROPS[gateType];
        if(!props) return;

        setGates(prev => [...prev, {
            id: generateId(),
            type: gateType, 
            x, y,
            inputs: Array(props.inputs).fill(null),
            output: false
        }]);
    };
    
    const handleNodeClick = (gateId: string, type: 'input' | 'output', nodeIndex: number) => {
        if (isChallengeComplete) return;

        if (type === 'output') {
            const startPos = getNodePosition(gateId, 'output');
            if (startPos) {
                setWiringState({ fromGateId: gateId, startPos });
            }
        } else if (type === 'input' && wiringState) {
            const fromGate = gates.find(g => g.id === wiringState.fromGateId);
            const toGate = gates.find(g => g.id === gateId);

            if (fromGate && toGate && fromGate.id !== toGate.id) {
                if (wires.some(w => w.toGateId === gateId && w.toNodeIndex === nodeIndex)) {
                    setStepFeedback("Input already wired. Disconnect first to change.");
                    setTimeout(() => setStepFeedback(null), 2000);
                    setWiringState(null);
                    return;
                }

                setWires(prev => [...prev, {
                    id: generateId(),
                    fromGateId: wiringState.fromGateId,
                    toGateId: gateId,
                    toNodeIndex: nodeIndex,
                }]);
            }
            setWiringState(null);
        } else {
            setWiringState(null);
        }
    };
    
    const handleWireClick = (wireId: string) => {
        if (isChallengeComplete) return;
        setWires(prev => prev.filter(w => w.id !== wireId));
    };

    const handleGateMouseDown = (e: React.MouseEvent<HTMLDivElement>, gate: Gate) => {
        if (isChallengeComplete) return;
        if (['INPUT_X', 'INPUT_Y', 'INPUT_Z', 'OUTPUT'].includes(gate.id)) return;

        e.preventDefault();
        setDraggingGateId(gate.id);
        setDragOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const evaluateCircuit = useCallback((inputX: boolean, inputY: boolean, inputZ: boolean): boolean => {
        const gateMap: Map<string, Gate> = new Map(gates.map(g => [g.id, { ...g }]));
        const values = new Map<string, boolean>();
        values.set('INPUT_X', inputX);
        values.set('INPUT_Y', inputY);
        values.set('INPUT_Z', inputZ);
        
        let changed = true;
        for (let iter = 0; iter < gates.length + 5 && changed; iter++) {
            changed = false;
            for (const gate of gateMap.values()) {
                const gateProps = GATE_PROPS[gate.type];
                if (!gateProps || values.has(gate.id) || gate.type.startsWith('INPUT')) continue;

                const inputWires = wires.filter(w => w.toGateId === gate.id);
                if (inputWires.length !== gateProps.inputs) continue;
                
                const inputValues: (boolean | undefined)[] = [];
                let allInputsReady = true;
                for(let i = 0; i < gateProps.inputs; i++) {
                    const wire = inputWires.find(w => w.toNodeIndex === i);
                    if (wire && values.has(wire.fromGateId)) {
                        inputValues[i] = values.get(wire.fromGateId);
                    } else {
                        allInputsReady = false;
                        break;
                    }
                }

                if (allInputsReady && inputValues.every(v => typeof v === 'boolean')) {
                    let output: boolean = false;
                    switch (gate.type) {
                        case 'AND': output = inputValues[0]! && inputValues[1]!; break;
                        case 'OR': output = inputValues[0]! || inputValues[1]!; break;
                        case 'NOT': output = !inputValues[0]!; break;
                    }
                    values.set(gate.id, output);
                    changed = true;
                }
            }
        }
        
        const outputWire = wires.find(w => w.toGateId === 'OUTPUT');
        return outputWire ? values.get(outputWire.fromGateId) ?? false : false;
    }, [gates, wires]);


    const handleCheckCircuit = () => {
        if (isChallengeComplete || hasSubmitted) return;
        setHasSubmitted(true);

        const currentExpression = currentStep.expression;
        const currentTruthTable = currentStep.truthTable;
        const currentInputsNeeded = currentStep.inputsNeeded;

        let allPassed = true;
        const testCases: { x: boolean, y: boolean, z: boolean }[] = [];

        if (currentInputsNeeded.includes('INPUT_Z')) {
            for (let i = 0; i < 8; i++) {
                testCases.push({ x: (i & 4) > 0, y: (i & 2) > 0, z: (i & 1) > 0 });
            }
        } else {
            for (let i = 0; i < 4; i++) {
                testCases.push({ x: (i & 2) > 0, y: (i & 1) > 0, z: false });
            }
        }

        for (const test of testCases) {
            const circuitResult = evaluateCircuit(test.x, test.y, test.z);
            const expectedResult = currentTruthTable(test.x, test.y, test.z);
            if (circuitResult !== expectedResult) {
                allPassed = false;
                break;
            }
        }
        
        if (allPassed) {
            setOutputLightOn(true); // Turn light on for success
            setStepFeedback(`Success! Circuit for "${currentExpression}" is correct.`);
            const userGateCount = gates.filter(g => !['INPUT_X', 'INPUT_Y', 'INPUT_Z', 'OUTPUT'].includes(g.id)).length;
            
            const baseScoreForStep = hintUsed && currentStep.hint
                ? SCORE_WEIGHTS.LOGIC_GATE_SCORE_PER_STEP - currentStep.hint.cost
                : SCORE_WEIGHTS.LOGIC_GATE_SCORE_PER_STEP;
            
            const gatePenalty = Math.max(0, userGateCount - currentStep.optimalGateCount) * 10;
            const stepScore = Math.max(0, baseScoreForStep - gatePenalty);

            const newTotalScore = currentTotalScore + stepScore;
            setCurrentTotalScore(newTotalScore);

            setTimeout(() => {
                if (currentStepIndex < CHALLENGE_STEPS.length - 1) {
                    setCurrentStepIndex(prev => prev + 1);
                    setStepFeedback(null);
                    setHintUsed(false);
                    setHasSubmitted(false);
                } else {
                    setIsChallengeComplete(true);
                    onComplete(newTotalScore);
                }
            }, 1500);
        } else {
            setOutputLightOn(false); // Ensure light is off for failure
            setStepFeedback(`Incorrect logic. The circuit for "${currentExpression}" does not match the truth table. Try again!`);
            setHasSubmitted(false);
        }
    };
    
    const handleReset = () => {
        initializeStep();
        setStepFeedback(null);
        setHintUsed(false);
    };

    const handleUseHint = () => {
        if (hintUsed || !currentStep.hint) return;
        setHintUsed(true);
        setStepFeedback(`Hint: ${currentStep.hint.text}`);
    }

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-2 text-center">{challengeTitle}</h2>
            
            {!isChallengeComplete && (
                <>
                    <p className="text-gray-300 mb-1 text-center">
                        Build the logic circuit for: <strong className="text-yellow-300">{currentStep.expression}</strong>
                    </p>
                    <p className="text-sm text-gray-400 mb-4 text-center">
                        Step {currentStepIndex + 1} of {CHALLENGE_STEPS.length}.
                        {currentStep.optimalGateCount && ` Optimal gates for this step: ${currentStep.optimalGateCount}.`}
                    </p>
                </>
            )}

            {!isChallengeComplete && (
                <div className="flex justify-center items-center gap-4 p-3 mb-4 bg-black/40 rounded-lg border border-white/10">
                    {['AND', 'OR', 'NOT'].map((type) => {
                        const gateProps = GATE_PROPS[type as GateType];
                        return gateProps && (
                            <div
                                key={type}
                                draggable
                                onDragStart={(e) => handlePaletteDragStart(e, type as GateType)}
                                className={`w-20 h-10 flex items-center justify-center rounded text-white font-bold cursor-grab ${gateProps.color}`}
                            >
                                {type}
                            </div>
                        );
                    })}
                </div>
            )}

            <div
                ref={canvasRef}
                onClick={handleCanvasClick}
                onDragOver={handleCanvasDragOver}
                onDrop={handleCanvasDrop}
                className="relative w-full h-[550px] bg-black/20 rounded-lg border-2 border-dashed border-gray-600 overflow-hidden"
            >
                {gates.map(gate => {
                    const gateProps = GATE_PROPS[gate.type];
                    if (!gateProps) return null;

                    if (gate.id === 'INPUT_Z' && !currentStep.inputsNeeded.includes('INPUT_Z')) {
                        return null; 
                    }

                    return (
                        <div
                            key={gate.id}
                            data-gate-element
                            ref={(el: HTMLDivElement | null) => {
                                if (el) {
                                    itemRefs.current.set(gate.id, el);
                                } else {
                                    itemRefs.current.delete(gate.id);
                                }
                            }}
                            onMouseDown={(e) => handleGateMouseDown(e, gate)}
                            style={{ position: 'absolute', left: gate.x, top: gate.y, width: GATE_DIMS.width, height: GATE_DIMS.height }}
                            className={`flex items-center justify-center rounded text-white font-bold select-none ${gateProps.color}
                                ${!['INPUT_X', 'INPUT_Y', 'INPUT_Z', 'OUTPUT'].includes(gate.id) && !isChallengeComplete ? 'cursor-grab active:cursor-grabbing hover:ring-2 ring-blue-400' : 'cursor-default'}
                            `}
                        >
                            {gate.type.startsWith('INPUT') ? gate.type.slice(-1) : gate.type === 'OUTPUT' ?
                                <div className={`w-6 h-6 rounded-full border-2 border-black ${outputLightOn ? 'bg-yellow-300 shadow-[0_0_15px_yellow]' : 'bg-gray-800'}`}/>
                                : gate.type
                            }
                            
                            {Array.from({ length: gateProps.inputs }).map((_, i) => (
                                <div 
                                    key={i} 
                                    onMouseDown={(e) => { e.stopPropagation(); handleNodeClick(gate.id, 'input', i); }} 
                                    style={{ top: `${(100 / (gateProps.inputs + 1)) * (i + 1)}%` }}
                                    className="absolute -left-1.5 -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full cursor-pointer hover:ring-2 ring-yellow-400"
                                />
                            ))}

                            {!gate.type.startsWith('OUTPUT') && (
                                <div 
                                    onMouseDown={(e) => { e.stopPropagation(); handleNodeClick(gate.id, 'output', 0); }} 
                                    className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-gray-300 rounded-full cursor-pointer hover:ring-2 ring-yellow-400" 
                                />
                            )}
                        </div>
                    );
                })}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {wires.map(wire => {
                        const start = getNodePosition(wire.fromGateId, 'output');
                        const end = getNodePosition(wire.toGateId, 'input', wire.toNodeIndex);
                        if (!start || !end) return null;
                        const d = `M ${start.x} ${start.y} C ${start.x + 40} ${start.y}, ${end.x - 40} ${end.y}, ${end.x} ${end.y}`;
                        return (
                            <path 
                                key={wire.id} 
                                d={d} 
                                stroke="cyan" 
                                strokeWidth="2" 
                                fill="none"
                                className="pointer-events-auto hover:stroke-yellow-400 cursor-pointer"
                                onClick={(e) => { e.stopPropagation(); handleWireClick(wire.id); }}
                            >
                                <title>Click to disconnect</title>
                            </path>
                        );
                    })}
                    {wiringState && (
                        <line x1={wiringState.startPos.x} y1={wiringState.startPos.y} x2={mousePos.x} y2={mousePos.y} stroke="yellow" strokeWidth="2" strokeDasharray="5 5" />
                    )}
                </svg>
            </div>
            
            <div className="mt-4 flex flex-col items-center gap-3">
                 {!isChallengeComplete ? (
                     <div className="flex gap-4">
                        <button onClick={handleCheckCircuit} disabled={isChallengeComplete || hasSubmitted} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600">Check Circuit</button>
                        <button onClick={handleReset} className="px-6 py-2 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-700">Reset Step</button>
                        {currentStep.hint && (
                            <button 
                                onClick={handleUseHint}
                                disabled={hintUsed}
                                className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:bg-gray-600"
                            >
                                Hint (-{currentStep.hint.cost}pts)
                            </button>
                        )}
                    </div>
                 ) : (
                    <p className="text-2xl font-bold text-green-400">All logic gates complete!</p>
                 )}
                {stepFeedback && (
                    <p className={`font-bold text-lg ${isChallengeComplete || stepFeedback.startsWith('Success') ? 'text-green-400' : 'text-red-400'}`}>{stepFeedback}</p>
                )}
                {isChallengeComplete && (
                    <button 
                        onClick={() => onComplete(currentTotalScore)} 
                        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300">
                        Next Challenge
                    </button>
                )}
            </div>
        </div>
    );
};

export default LogicGateChallenge;