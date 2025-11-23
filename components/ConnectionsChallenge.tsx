
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

const LOGOS: Record<string, string> = {
    gemini: GeminiLogo,
    grok: GrokLogo,
    claude: ClaudeLogo,
    deepseek: DeepseekLogo,
    openai: OpenaiLogo,
};

// Simple shuffle utility
const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

type Item = { id: string; colIndex: number; };
type Connection = { from: Item; to: Item; };
type Point = { x: number; y: number; };

const ConnectionsChallenge: React.FC<ConnectionsChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [models, setModels] = useState<string[]>([]);
    const [companies, setCompanies] = useState<string[]>([]);
    const [logos, setLogos] = useState<string[]>([]);

    const [activeItem, setActiveItem] = useState<Item | null>(null);
    const [mousePos, setMousePos] = useState<Point | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [isShaking, setIsShaking] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number | null>(null);

    const totalConnectionsNeeded = CONNECTIONS_DATA.length * 2;

    useEffect(() => {
        startTimeRef.current = Date.now();
        const shuffledData = shuffle(CONNECTIONS_DATA);
        setModels(shuffledData.map(d => d.model));
        setCompanies(shuffle(shuffledData.map(d => d.company)));
        setLogos(shuffle(shuffledData.map(d => d.logoId)));
    }, []);

    const getLogoSrc = (logoId: string) => LOGOS[logoId] || '';

    const solutionMap = useMemo(() => {
        const map = new Map<string, string>();
        CONNECTIONS_DATA.forEach(({ model, company, logoId }) => {
            map.set(model, company);
            map.set(company, logoId);
        });
        return map;
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (activeItem) {
                setMousePos({ x: e.clientX, y: e.clientY });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [activeItem]);
    
    useEffect(() => {
        if (connections.length === totalConnectionsNeeded && !isComplete) {
            setIsComplete(true);
            const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 1000;
            onComplete(elapsedTime);
        }
    }, [connections, totalConnectionsNeeded, onComplete, isComplete]);

    const handleItemClick = (id: string, colIndex: number) => {
        if (isComplete) return;

        const clickedItem = { id, colIndex };

        const isAlreadySource = connections.some(c => c.from.id === id);
        const isAlreadyTarget = connections.some(c => c.to.id === id);

        if (!activeItem) {
            // Can't start a line from the final column (logos)
            if (colIndex === 2) return;
            // Can't restart a line from a fully connected middle item
            if (colIndex === 1 && isAlreadySource) return;

            setActiveItem(clickedItem);

        } else { // activeItem exists
            if (activeItem.id === id) { // Deselect if clicking the same item
                setActiveItem(null);
                return;
            }

            // Connection Logic
            // Can't connect to the first column or to an item that's already a target
            if (colIndex === 0 || isAlreadyTarget) {
                setActiveItem(null);
                return;
            }

            // Must connect to an adjacent column
            if (Math.abs(activeItem.colIndex - colIndex) !== 1) {
                setActiveItem(null); // Invalid connection attempt
                return;
            }

            // Identify from/to based on column index
            const from = activeItem.colIndex < clickedItem.colIndex ? activeItem : clickedItem;
            const to = activeItem.colIndex < clickedItem.colIndex ? clickedItem : activeItem;
            
            if (solutionMap.get(from.id) === to.id) {
                // Correct connection
                setConnections(prev => [...prev, { from, to }]);
            } else {
                // Incorrect connection
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 300);
            }
            
            setActiveItem(null); // End connection attempt
        }
    };


    const getConnectionPoint = (id: string, side: 'left' | 'right'): Point | null => {
        const itemEl = itemRefs.current.get(id);
        const containerEl = containerRef.current;
        if (!itemEl || !containerEl) return null;

        const itemRect = itemEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        const y = itemRect.top - containerRect.top + itemRect.height / 2;
        const x = side === 'right' 
            ? itemRect.left - containerRect.left + itemRect.width 
            : itemRect.left - containerRect.left;

        return { x, y };
    };

    const getActiveLineEnd = (): Point | null => {
        if (!mousePos || !containerRef.current) return null;
        const containerRect = containerRef.current.getBoundingClientRect();
        return {
            x: mousePos.x - containerRect.left,
            y: mousePos.y - containerRect.top
        };
    };
    
    const renderItem = (item: string, colIndex: number) => {
        const isLogo = colIndex === 2;
        
        const isSource = connections.some(c => c.from.id === item);
        const isTarget = connections.some(c => c.to.id === item);
        const isFullyConnected = (colIndex === 0 && isSource) || (colIndex === 2 && isTarget) || (isSource && isTarget);

        const isActive = activeItem?.id === item;

        return (
            <div
                key={item}
                ref={el => {
                    if (el) {
                        itemRefs.current.set(item, el);
                    } else {
                        itemRefs.current.delete(item);
                    }
                }}
                onClick={() => handleItemClick(item, colIndex)}
                className={`relative flex items-center justify-center px-2 py-1 my-4 border-2 rounded-lg transition-all duration-200 min-h-[48px]
                    ${isComplete ? 'border-green-500 bg-green-900/50 cursor-default' : ''}
                    ${isFullyConnected && !isComplete ? 'border-blue-400 bg-blue-900/50' : ''}
                    ${isActive ? 'border-yellow-400 scale-105 shadow-lg' : ''}
                    ${!isFullyConnected && !isActive && !isComplete ? 'border-gray-600 bg-black/40 hover:bg-white/10 cursor-pointer' : 'cursor-pointer'}
                `}
            >
                {/* Right Connection Point */}
                {colIndex < 2 && (
                    <div className="absolute top-1/2 -right-[6px] -translate-y-1/2 w-3 h-3 rounded-full bg-gray-700 border-2 border-gray-500 z-20" />
                )}
                {/* Left Connection Point */}
                {colIndex > 0 && (
                    <div className="absolute top-1/2 -left-[6px] -translate-y-1/2 w-3 h-3 rounded-full bg-gray-700 border-2 border-gray-500 z-20" />
                )}

                {isLogo ? (
                    <img src={getLogoSrc(item)} alt={`${item} logo`} className="h-10 w-10 object-contain" />
                ) : (
                    <span className="text-white text-center font-semibold text-sm md:text-base">{item}</span>
                )}
            </div>
        );
    };

    return (
        <div className={`p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass ${isShaking ? 'shake-animation' : ''}`}>
            <h2 className="text-2xl font-bold text-blue-300 mb-2 text-center">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-center">Connect the AI model to its company, and the company to its logo.</p>

            <div className="relative max-w-3xl mx-auto" ref={containerRef}>
                <div className="grid grid-cols-3 gap-4 md:gap-8">
                    <div>{models.map(model => renderItem(model, 0))}</div>
                    <div>{companies.map(company => renderItem(company, 1))}</div>
                    <div>{logos.map(logoId => renderItem(logoId, 2))}</div>
                </div>

                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    <defs>
                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feFlood floodColor="#f87171" result="flood" />
                            <feComposite in="flood" in2="SourceAlpha" operator="in" result="comp" />
                            <feGaussianBlur in="comp" stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    
                    {/* Confirmed connections */}
                    {connections.map(({ from, to }) => {
                        const start = getConnectionPoint(from.id, 'right');
                        const end = getConnectionPoint(to.id, 'left');
                        if (!start || !end) return null;
                        return <line key={`${from.id}-${to.id}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="white" strokeWidth="2" strokeLinecap="round" filter="url(#neon-glow)" />;
                    })}
                    
                    {/* Active drawing line */}
                    {activeItem && (() => {
                        // A connection can only be initiated left-to-right
                        const side = activeItem.colIndex === 2 ? 'left' : 'right';
                        const start = getConnectionPoint(activeItem.id, side);
                        const end = getActiveLineEnd();
                        if (!start || !end) return null;
                        return <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="white" strokeWidth="3" strokeDasharray="5 5" />;
                    })()}
                </svg>
            </div>
            
             <div className="mt-6 text-center min-h-[2.5rem]">
                {isComplete && (
                    <p className="text-2xl font-bold text-green-400">All connections made! Great job!</p>
                )}
            </div>
        </div>
    );
};

export default ConnectionsChallenge;