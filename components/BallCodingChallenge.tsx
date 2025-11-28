import React, { useState, useRef, useEffect, useMemo } from 'react';

interface BallCodingChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
    description: string;
    initialCode: string;
    expectedMoves: string[];
}

const IFRAME_CONTENT = ({ finishX, finishY }: { finishX: number; finishY: number; }) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            margin: 0; 
            overflow: hidden; 
            background-color: #2d3748; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh;
            width: 100%;
            background-image:
                linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
            background-size: 40px 40px;
        }
        #ball {
            width: 30px;
            height: 30px;
            background-color: #f6ad55;
            border-radius: 50%;
            position: absolute;
            left: 40px;
            top: 40px;
            transition: left 0.45s linear, top 0.45s linear;
            border: 2px solid #ed8936;
            box-sizing: border-box;
        }
        #finish {
            position: absolute;
            font-size: 30px;
            left: ${finishX + 15}px;
            top: ${finishY + 15}px;
            transform: translate(-50%, -50%);
        }
    </style>
</head>
<body>
    <div id="finish">🏁</div>
    <div id="ball"></div>
    <script>
        const ballElement = document.getElementById('ball');
        let ballX = 40;
        let ballY = 40;
        const step = 40;
        const moveHistory = []; 

        function updateBallPosition() {
            ballElement.style.left = \`\${ballX}px\`;
            ballElement.style.top = \`\${ballY}px\`;
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        class Ball {
            constructor() {
                this.moveQueue = Promise.resolve();
            }

            async _performMove(direction) {
                switch(direction) {
                    case 'moveUp':
                        ballY = Math.max(0, ballY - step);
                        break;
                    case 'moveDown':
                        ballY = Math.min(window.innerHeight - ballElement.offsetHeight, ballY + step);
                        break;
                    case 'moveLeft':
                        ballX = Math.max(0, ballX - step);
                        break;
                    case 'moveRight':
                        ballX = Math.min(window.innerWidth - ballElement.offsetWidth, ballX + step);
                        break;
                }
                updateBallPosition();
                moveHistory.push(direction);
                await delay(500); // Wait for animation to finish
            }

            _enqueueMove(direction) {
                this.moveQueue = this.moveQueue.then(() => this._performMove(direction));
            }

            moveUp() { this._enqueueMove('moveUp'); }
            moveDown() { this._enqueueMove('moveDown'); }
            moveLeft() { this._enqueueMove('moveLeft'); }
            moveRight() { this._enqueueMove('moveRight'); }
        }

        function runUserCode(code) {
            ballX = 40;
            ballY = 40;
            updateBallPosition();
            moveHistory.length = 0;
            
            const ball = new Ball();

            try {
                const userFunc = new Function('ball', code);
                userFunc(ball);
            } catch (e) {
                console.error('Error executing user code:', e);
                window.parent.postMessage({ type: 'ballChallengeResult', error: e.message }, '*');
                return; 
            }

            // After user code runs, wait for the move queue to finish
            ball.moveQueue.then(() => {
                window.parent.postMessage({ type: 'ballChallengeResult', moves: moveHistory }, '*');
            });
        }

        window.addEventListener('message', (event) => {
            if (event.data.type === 'runBallCode' && event.data.code !== undefined) {
                runUserCode(event.data.code);
            }
        });

        updateBallPosition();
    </script>
</body>
</html>
`;


const BallCodingChallenge: React.FC<BallCodingChallengeProps> = ({ onComplete, challengeTitle, description, initialCode, expectedMoves }) => {
    const [code, setCode] = useState(initialCode);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const { finishX, finishY } = useMemo(() => {
        const initialPos = { x: 40, y: 40 };
        const step = 40;
        let finalX = initialPos.x;
        let finalY = initialPos.y;

        for (const move of expectedMoves) {
            switch (move) {
                case 'moveUp': finalY -= step; break;
                case 'moveDown': finalY += step; break;
                case 'moveLeft': finalX -= step; break;
                case 'moveRight': finalX += step; break;
            }
        }
        return { finishX: finalX, finishY: finalY };
    }, [expectedMoves]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.source === iframeRef.current?.contentWindow && event.data.type === 'ballChallengeResult') {
                setIsLoading(false);
                if (event.data.error) {
                    setStatusMessage(`Code error: ${event.data.error}`);
                    setIsCorrect(false);
                } else {
                    const receivedMoves: string[] = event.data.moves;
                    const passed = JSON.stringify(receivedMoves) === JSON.stringify(expectedMoves);
                    
                    if (passed) {
                        setStatusMessage('Success! The ball reached the finish line.');
                        setIsCorrect(true);
                        setTimeout(() => onComplete(true), 1500);
                    } else {
                        setStatusMessage(`Incorrect sequence. The ball didn't reach the finish line. Try again!`);
                        setIsCorrect(false);
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [expectedMoves, onComplete]);

    const handleRunCode = () => {
        if (iframeRef.current?.contentWindow && !isLoading) {
            setIsLoading(true);
            setStatusMessage('Running code...');
            iframeRef.current.contentWindow.postMessage({ type: 'runBallCode', code: code }, '*');
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        if (statusMessage && !isLoading) {
            setStatusMessage(null);
            setIsCorrect(false);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-md text-center whitespace-pre-line">{description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
                <div className="bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <div className="flex items-center px-4 py-2 bg-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-auto text-xs text-gray-400 font-semibold">ball_script.js</span>
                    </div>
                    <div className="p-1">
                        <textarea
                            value={code}
                            onChange={handleCodeChange}
                            disabled={isCorrect || isLoading}
                            className="w-full h-80 bg-transparent text-white font-mono text-sm resize-none focus:outline-none p-2"
                            spellCheck="false"
                            aria-label="JavaScript code editor for ball movement"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <div className="flex items-center px-4 py-2 bg-gray-200">
                         <span className="text-xs text-gray-600 font-semibold">Ball Movement Preview</span>
                    </div>
                    <iframe
                        ref={iframeRef}
                        srcDoc={IFRAME_CONTENT({ finishX, finishY })}
                        title="Ball Movement Sandbox"
                        className="w-full h-80 border-0"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>

            <div className="text-center">
                {!isCorrect && (
                    <button
                        onClick={handleRunCode}
                        disabled={!code.trim() || isLoading}
                        className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        {isLoading ? 'Running Code...' : 'Run Code'}
                    </button>
                )}

                <div className="mt-6 min-h-[2.5rem] flex justify-center">
                    {statusMessage && (
                        <p className={`text-lg font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {statusMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BallCodingChallenge;