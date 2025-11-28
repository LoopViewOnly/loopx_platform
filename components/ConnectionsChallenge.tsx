import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CONNECTIONS_DATA } from '../challenges/content';

import DeepseekLogo from '../assets/org_logos/deepseekLogo.png';
import OpenaiLogo from '../assets/org_logos/openaiLogo.png';
import GeminiLogo from '../assets/org_logos/geminiLogo.png';
import GrokLogo from '../assets/org_logos/grokLogo.png';
import ClaudeLogo from '../assets/org_logos/claudeLogo.png';

interface ConnectionsChallengeProps {
    onComplete: (time: number | null) => void;
    challengeTitle: string;
}

//
// FIXED LOGOS MAP — MUST MATCH CONNECTIONS_DATA.logoId EXACTLY
//
const LOGOS: Record<string, string> = {
    openai: OpenaiLogo,
    google: GeminiLogo,
    anthropic: ClaudeLogo,
    xai: GrokLogo,
    deepseek: DeepseekLogo,
};

//
// Utility shuffle
//
const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

type Item = { id: string; colIndex: number };
type Connection = { from: Item; to: Item };
type Point = { x: number; y: number };

const ConnectionsChallenge: React.FC<ConnectionsChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [models, setModels] = useState<string[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [logos, setLogos] = useState<string[]>([]);

    const [activeItem, setActiveItem] = useState<Item | null>(null);
    const [mousePos, setMousePos] = useState<Point | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isShaking, setIsShaking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const startTimeRef = useRef<number | null>(null);

    const totalNeeded = CONNECTIONS_DATA.length * 2;

    //
    // Initialize shuffled columns
    //
    useEffect(() => {
        startTimeRef.current = Date.now();

        const shuffled = shuffle(CONNECTIONS_DATA);
        setModels(shuffled.map(x => x.model));
        setCompanies(shuffle(shuffled.map(x => x.company)));
        setLogos(shuffle(shuffled.map(x => x.logoId)));
    }, []);

    //
    // Get logo path
    //
    const getLogoSrc = (id: string) => LOGOS[id] ?? '';

    //
    // Solution map: model → company → logoId
    //
    const solutionMap = useMemo(() => {
        const map = new Map<string, string>();
        CONNECTIONS_DATA.forEach(({ model, company, logoId }) => {
            map.set(model, company);
            map.set(company, logoId);
        });
        return map;
    }, []);

    //
    // Track mouse movement for drawing the temporary line
    //
    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (activeItem) setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', move);
        return () => window.removeEventListener('mousemove', move);
    }, [activeItem]);

    //
    // Complete challenge
    //
    useEffect(() => {
        if (!isComplete && connections.length === totalNeeded) {
            setIsComplete(true);
            const elapsed = (Date.now() - (startTimeRef.current ?? Date.now())) / 1000;
            onComplete(elapsed);
        }
    }, [connections, totalNeeded, isComplete, onComplete]);

    //
    // Handle item clicks
    //
    const handleItemClick = (id: string, colIndex: number) => {
        if (isComplete) return;

        const isAlreadySource = connections.some(c => c.from.id === id);
        const isAlreadyTarget = connections.some(c => c.to.id === id);

        if (!activeItem) {
            // Cannot start from logos
            if (colIndex === 2) return;
            // Middle can't start again if already used
            if (colIndex === 1 && isAlreadySource) return;

            setActiveItem({ id, colIndex });
            return;
        }

        // If clicking same item → deselect
        if (activeItem.id === id) {
            setActiveItem(null);
            return;
        }

        // Cannot connect backward to leftmost column
        if (colIndex === 0 || isAlreadyTarget) {
            setActiveItem(null);
            return;
        }

        // Can only connect adjacent columns
        if (Math.abs(activeItem.colIndex - colIndex) !== 1) {
            setActiveItem(null);
            return;
        }

        const from = activeItem.colIndex < colIndex ? activeItem : { id, colIndex };
        const to = activeItem.colIndex < colIndex ? { id, colIndex } : activeItem;

        if (solutionMap.get(from.id) === to.id) {
            setConnections(prev => [...prev, { from, to }]);
        } else {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 300);
        }

        setActiveItem(null);
    };

    //
    // Line drawing helpers
    //
    const getConnectionPoint = (id: string, side: 'left' | 'right'): Point | null => {
        const item = itemRefs.current.get(id);
        const container = containerRef.current;
        if (!item || !container) return null;

        const a = item.getBoundingClientRect();
        const b = container.getBoundingClientRect();

        return {
            x: (side === 'right' ? a.right - b.left : a.left - b.left),
            y: a.top - b.top + a.height / 2,
        };
    };

    const getActiveLineEnd = (): Point | null => {
        if (!mousePos || !containerRef.current) return null;
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: mousePos.x - rect.left,
            y: mousePos.y - rect.top,
        };
    };

    //
    // Render item box
    //
    const renderItem = (item: string, colIndex: number) => {
        const isLogo = colIndex === 2;

        const isSource = connections.some(c => c.from.id === item);
        const isTarget = connections.some(c => c.to.id === item);
        const isConnected = (colIndex === 0 && isSource) || (colIndex === 2 && isTarget) || (isSource && isTarget);

        const isActive = activeItem?.id === item;

        return (
            <div
                key={item}
                ref={el => {
                    if (el) itemRefs.current.set(item, el);
                    else itemRefs.current.delete(item);
                }}
                onClick={() => handleItemClick(item, colIndex)}
                className={`relative flex items-center justify-center px-2 py-1 my-4 border-2 rounded-lg transition-all
                    min-h-[48px] 
                    ${isComplete ? 'border-green-500 bg-green-900/50 cursor-default' : ''}
                    ${isConnected && !isComplete ? 'border-blue-400 bg-blue-900/50' : ''}
                    ${isActive ? 'border-yellow-400 scale-105 shadow-lg' : ''}
                    ${!isConnected && !isActive && !isComplete ? 'border-gray-600 bg-black/40 hover:bg-white/10 cursor-pointer' : 'cursor-pointer'}
                `}
            >
                {colIndex < 2 && <div className="absolute top-1/2 -right-[6px] w-3 h-3 rounded-full bg-gray-700 border-2 border-gray-500 -translate-y-1/2" />}
                {colIndex > 0 && <div className="absolute top-1/2 -left-[6px] w-3 h-3 rounded-full bg-gray-700 border-2 border-gray-500 -translate-y-1/2" />}

                {isLogo ? (
                    <img src={getLogoSrc(item)} alt={`${item} logo`} className="h-10 w-10 object-contain" />
                ) : (
                    <span className="text-white font-semibold text-sm md:text-base text-center">{item}</span>
                )}
            </div>
        );
    };

    return (
        <div className={`p-8 bg-black/30 border border-white/10 backdrop-blur-xl rounded-2xl shadow-glass ${isShaking ? 'shake-animation' : ''}`}>
            <h2 className="text-2xl font-bold text-blue-300 mb-2 text-center">{challengeTitle}</h2>

            <p className="text-gray-300 mb-6 text-center">
                Connect the AI model → its company → its logo
            </p>

            <div className="relative max-w-3xl mx-auto" ref={containerRef}>
                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    <div>{models.map(m => renderItem(m, 0))}</div>
                    <div>{companies.map(c => renderItem(c, 1))}</div>
                    <div>{logos.map(l => renderItem(l, 2))}</div>
                </div>

                {/* Lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <filter id="neon-glow">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {connections.map(({ from, to }) => {
                        const p1 = getConnectionPoint(from.id, 'right');
                        const p2 = getConnectionPoint(to.id, 'left');
                        if (!p1 || !p2) return null;

                        return (
                            <line
                                key={`${from.id}-${to.id}`}
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                filter="url(#neon-glow)"
                            />
                        );
                    })}

                    {/* Active line */}
                    {activeItem && (() => {
                        const side = activeItem.colIndex === 2 ? 'left' : 'right';
                        const p1 = getConnectionPoint(activeItem.id, side);
                        const p2 = getActiveLineEnd();
                        if (!p1 || !p2) return null;

                        return (
                            <line
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="white"
                                strokeWidth="3"
                                strokeDasharray="5 5"
                            />
                        );
                    })()}
                </svg>
            </div>

            <div className="mt-6 text-center min-h-[2.5rem]">
                {isComplete &&
                    <p className="text-2xl font-bold text-green-400">All connections made! Great job!</p>
                }
            </div>
        </div>
    );
};

export default ConnectionsChallenge;
