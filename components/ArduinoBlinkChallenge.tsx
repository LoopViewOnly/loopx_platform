
import React, { useState, useEffect } from 'react';

interface ArduinoBlinkChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

type Stage = 'coding' | 'simulation';
type SimulationState = 'idle' | 'plugging' | 'powering' | 'booting' | 'running' | 'finished' | 'failed';


const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-2xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Your task is to program the Arduino to make the LED at Pin 2 flash repeatedly. The LED should turn ON for 0.5 seconds, then OFF for 0.5 seconds, in a continuous loop.</p>
        <p className="mt-4 text-sm text-yellow-400">Hint: Use the functions `digitalWrite(pin, state)` and `delay(milliseconds)`.</p>
    </div>
);

const ArduinoBlinkChallenge: React.FC<ArduinoBlinkChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState('');
    const [stage, setStage] = useState<Stage>('coding');
    const [status, setStatus] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [simulationState, setSimulationState] = useState<SimulationState>('idle');

    useEffect(() => {
        if (stage === 'simulation') {
            const validationSuccess = validateCode();
            setIsCorrect(validationSuccess);
            setSimulationState('plugging');
            
            setTimeout(() => {
                setSimulationState('powering'); // Power ON LED
                setTimeout(() => {
                    setSimulationState('booting'); // TX/RX flicker
                    setTimeout(() => {
                        if (validationSuccess) {
                            setSimulationState('running'); // Start main program
                            setTimeout(() => {
                                setSimulationState('finished');
                                onComplete(true);
                            }, 5000); 
                        } else {
                            setSimulationState('failed');
                            setStatus("Simulation failed. The LED did not blink. Check your code logic.");
                            setTimeout(() => {
                                setStage('coding');
                                setStatus(null);
                                setSimulationState('idle');
                            }, 2500);
                        }
                    }, 800); // Duration of boot flicker
                }, 500); // Wait after power on
            }, 1200); // Duration of the plug-in animation
        }
    }, [stage]);

    const validateCode = (): boolean => {
        const cleanCode = code.replace(/\/\/.*$/gm, '').replace(/\s+/g, '');
    
        const pinRegex = '(LED_PIN|2)';
        const highRegex = '(HIGH|1)';
        const lowRegex = '(LOW|0)';
        const delayRegex = 'delay\\(500\\);';
    
        // Pattern: HIGH/1 then LOW/0
        const patternHighLow = new RegExp(`digitalWrite\\(${pinRegex},${highRegex}\\);${delayRegex}digitalWrite\\(${pinRegex},${lowRegex}\\);${delayRegex}`);
    
        // Pattern: LOW/0 then HIGH/1
        const patternLowHigh = new RegExp(`digitalWrite\\(${pinRegex},${lowRegex}\\);${delayRegex}digitalWrite\\(${pinRegex},${highRegex}\\);${delayRegex}`);
    
        return patternHighLow.test(cleanCode) || patternLowHigh.test(cleanCode);
    };

    const handleRunSimulation = () => {
        setStage('simulation');
    };
    
    const renderCodingStage = () => {
        const lineCount = (code.match(/\n/g) || []).length;
        const linesInTextarea = lineCount + 1;
        const lineHeightRem = 1.5; // Effective line height in rem for text-sm + leading-relaxed.
        
        // Position for the closing '}' brace, right after the user's code.
        const braceTopPosition = 10.5 + linesInTextarea * lineHeightRem;

        // Total lines for the number column on the left.
        // 7 lines (static top) + user lines + 1 (closing brace)
        const totalLines = 7 + linesInTextarea + 1;

        return (
            <>
                <div className="text-gray-300 mb-6 text-md">{challengeDescription}</div>
                <div className="w-full max-w-2xl mx-auto bg-[#1e1e1e] rounded-lg shadow-lg overflow-hidden border border-white/10 font-mono text-sm">
                    <div className="flex items-center px-4 py-2 bg-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-auto text-xs text-gray-400 font-semibold">blink.ino</span>
                    </div>
                    <div className="flex p-4">
                        <pre className="text-right pr-4 text-gray-500 select-none leading-relaxed">
                            {[...Array(totalLines)].map((_, i) => `${i + 1}\n`).join('')}
                        </pre>
                        <div className="flex-grow relative">
                            {/* Static, non-editable code */}
                            <pre className="text-left text-gray-300 select-none whitespace-pre-wrap leading-relaxed pointer-events-none">
                                <span className="text-purple-400">const int</span> <span className="text-blue-300">LED_PIN</span> = <span className="text-orange-400">2</span>;{"\n\n"}
                                <span className="text-purple-400">void</span> <span className="text-yellow-300">setup</span>() &#123;{"\n"}
                                {'  '}<span className="text-blue-300">pinMode</span>(LED_PIN, <span className="text-blue-300">OUTPUT</span>);{"\n"}
                                &#125;{"\n\n"}
                                <span className="text-purple-400">void</span> <span className="text-yellow-300">loop</span>() &#123;{"\n"}
                            </pre>
                            {/* Textarea for user input */}
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="absolute top-0 left-0 w-full bg-transparent text-white font-mono text-sm resize-none focus:outline-none whitespace-pre-wrap leading-relaxed"
                                spellCheck="false"
                                style={{
                                    top: '10.5rem',
                                    left: '2ch',
                                    height: `${linesInTextarea * lineHeightRem}rem`,
                                    caretColor: 'white'
                                }}
                            />
                            {/* Dynamic closing brace */}
                            <pre className="text-left text-gray-400 select-none whitespace-pre-wrap leading-relaxed absolute" style={{ top: `${braceTopPosition}rem` }}>
                                &#125;
                            </pre>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleRunSimulation}
                    disabled={!code.trim()}
                    className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                >
                    Run Simulation
                </button>
                <div className="mt-6 min-h-[2.5rem]">
                    {status && stage === 'coding' && <p className="text-lg font-bold text-red-400">{status}</p>}
                </div>
            </>
        );
    };

    const renderSimulationStage = () => (
        <>
            <style>{`
                @keyframes plug-in {
                    0% { transform: translateX(-150px); }
                    100% { transform: translateX(0); }
                }
                .cable-plug-in { animation: plug-in 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

                @keyframes blink-main {
                    0%, 49.9% { fill: #ef4444; filter: drop-shadow(0 0 10px #ef4444); }
                    50%, 100% { fill: #7f1d1d; filter: none; }
                }
                .led-blinking { animation: blink-main 1s infinite; }
                
                @keyframes boot-flicker {
                    0%, 100% { fill: #4a5568; }
                    20%, 60% { fill: #f59e0b; }
                    40%, 80% { fill: #4a5568; }
                }
                .boot-flicker-anim { animation: boot-flicker 0.4s 2; }
            `}</style>
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-full max-w-2xl">
                    <svg viewBox="0 0 800 500" className="w-full h-auto drop-shadow-lg">
                        {/* Board */}
                        <rect width="800" height="500" fill="#00979C" rx="10" />
                        
                        {/* Components */}
                        <g>
                            {/* USB Port */}
                            <rect x="150" y="100" width="100" height="60" fill="#D1D5DB" rx="5" />
                            <rect x="160" y="110" width="80" height="40" fill="#4B5563" />
                            
                            {/* Reset Button */}
                            <rect x="120" y="40" width="30" height="30" fill="#E5E7EB" rx="2" />
                            <circle cx="135" cy="55" r="8" fill="#EF4444" />
                            
                            {/* Digital Pins */}
                            <rect x="280" y="30" width="400" height="40" fill="#1F2937" />
                            <text x="480" y="22" fill="white" fontSize="14" fontFamily="monospace" textAnchor="middle">DIGITAL (PWM~)</text>
                            <text x="290" y="85" fill="white" fontSize="12" fontFamily="monospace">13</text>
                            <text x="320" y="85" fill="white" fontSize="12" fontFamily="monospace">12</text>
                            <text x="350" y="85" fill="white" fontSize="12" fontFamily="monospace">~11</text>
                            <text x="380" y="85" fill="white" fontSize="12" fontFamily="monospace">~10</text>
                            <text x="410" y="85" fill="white" fontSize="12" fontFamily="monospace">~9</text>
                            <text x="440" y="85" fill="white" fontSize="12" fontFamily="monospace">8</text>
                            <text x="470" y="85" fill="white" fontSize="12" fontFamily="monospace">7</text>
                            <text x="500" y="85" fill="white" fontSize="12" fontFamily="monospace">~6</text>
                            <text x="530" y="85" fill="white" fontSize="12" fontFamily="monospace">~5</text>
                            <text x="560" y="85" fill="white" fontSize="12" fontFamily="monospace">4</text>
                            <text x="590" y="85" fill="white" fontSize="12" fontFamily="monospace">~3</text>
                            <text x="620" y="85" fill="white" fontSize="12" fontFamily="monospace">2</text>
                            
                            {/* Main Chip */}
                            <rect x="280" y="200" width="300" height="100" fill="#1F2937" />
                            <circle cx="295" cy="250" r="4" fill="#4B5563"/>
                            
                            {/* Arduino Logo */}
                            <circle cx="370" cy="130" r="25" fill="white"/>
                            <path d="M358 130 A12 12 0 0 1 382 130" fill="none" stroke="#00979C" strokeWidth="5"/>
                            <rect x="367.5" y="120" width="5" height="20" fill="#00979C"/>
                            <text x="480" y="140" fill="white" fontSize="30" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">ARDUINO</text>
                            <circle cx="560" cy="130" r="18" fill="none" stroke="white" strokeWidth="3"/>
                            <text x="560" y="136" fill="white" fontSize="16" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">UNO</text>
                            
                            {/* ON LED */}
                            <circle id="led-on" cx="690" cy="130" r="7" fill={simulationState === 'powering' || simulationState === 'booting' || simulationState === 'running' || simulationState === 'finished' ? '#4ade80' : '#166534'} className="transition-colors duration-300" style={{filter: (simulationState === 'powering' || simulationState === 'booting' || simulationState === 'running' || simulationState === 'finished') ? 'drop-shadow(0 0 6px #4ade80)' : 'none'}}/>
                            <text x="690" y="120" fill="white" fontSize="10" fontFamily="monospace" textAnchor="middle">ON</text>

                            {/* TX/RX LEDs */}
                            <rect x="290" y="155" width="20" height="10" fill="#1F2937"/>
                            <text x="298" y="152" fill="white" fontSize="10" fontFamily="monospace">TX</text>
                            <circle id="led-tx" cx="305" cy="160" r="3" fill="#4A5568" className={simulationState === 'booting' ? 'boot-flicker-anim' : ''} />
                            <rect x="320" y="155" width="20" height="10" fill="#1F2937"/>
                            <text x="328" y="152" fill="white" fontSize="10" fontFamily="monospace">RX</text>
                            <circle id="led-rx" cx="335" cy="160" r="3" fill="#4A5568" className={simulationState === 'booting' ? 'boot-flicker-anim' : ''} style={{animationDelay: '0.2s'}} />

                             {/* Pin 2 LED */}
                            <circle id="led-pin2" cx="625" cy="100" r="10" fill="#7f1d1d" className={isCorrect && simulationState === 'running' ? 'led-blinking' : ''} />
                            <text x="625" y="125" fill="white" fontSize="12" fontFamily="monospace" textAnchor="middle">LED</text>
                            
                            {/* Power Jack */}
                            <rect x="150" y="380" width="60" height="80" fill="#1F2937" rx="5" />
                            <circle cx="180" cy="420" r="20" fill="#4B5563"/>
                        </g>
                    </svg>
                    
                     {/* Cable Animation */}
                    <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none">
                        <g className={simulationState.startsWith('plugging') ? 'cable-plug-in' : ''} style={{ transform: simulationState === 'idle' ? 'translateX(-150px)': 'translateX(0)' }}>
                            <svg x="-150" y="100" width="300" height="60" viewBox="0 0 300 60">
                                <rect x="0" y="5" width="160" height="50" rx="8" fill="#262626"/>
                                <rect x="150" y="0" width="100" height="60" fill="#E5E7EB" />
                                <path d="M120 20 L120 40 L128 40 L128 35 L138 35 L138 25 L128 25 L128 20 Z" fill="#737373" />
                            </svg>
                        </g>
                    </div>
                </div>

                <div className="mt-6 min-h-[2.5rem] text-center">
                    {simulationState === 'plugging' && <p className="text-lg font-bold text-blue-300 animate-pulse">Connecting...</p>}
                    {(simulationState === 'powering' || simulationState === 'booting') && <p className="text-lg font-bold text-green-400 animate-pulse">Power ON... Booting...</p>}
                    {simulationState === 'running' && isCorrect && <p className="text-lg font-bold text-green-400">Simulation successful! LED is blinking.</p>}
                    {simulationState === 'failed' && <p className="text-lg font-bold text-red-400">{status}</p>}
                    {simulationState === 'finished' && <p className="text-2xl font-bold text-green-400">Challenge Complete!</p>}
                </div>
                 {simulationState === 'finished' && (
                    <button
                        onClick={() => onComplete(true)}
                        className="mt-4 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Next Challenge
                    </button>
                )}
            </div>
        </>
    );

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            {stage === 'coding' ? renderCodingStage() : renderSimulationStage()}
        </div>
    );
};

export default ArduinoBlinkChallenge;