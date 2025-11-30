import React, { useState, useCallback } from 'react';

interface PCBuildChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

interface Component {
    id: string;
    name: string;
}

interface Slot {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    acceptsComponent: string;
}

const COMPONENTS: Component[] = [
    { id: 'motherboard', name: 'Motherboard' },
    { id: 'psu', name: 'PSU' },
    { id: 'cpu', name: 'CPU' },
    { id: 'ram1', name: 'RAM' },
    { id: 'ram2', name: 'RAM' },
    { id: 'gpu', name: 'GPU' },
    { id: 'ssd', name: 'SSD' },
];

// Slots where components go
const SLOTS: Slot[] = [
    { id: 'mobo_slot', name: 'Motherboard', x: 20, y: 20, width: 250, height: 200, acceptsComponent: 'motherboard' },
    { id: 'psu_slot', name: 'PSU', x: 290, y: 140, width: 90, height: 80, acceptsComponent: 'psu' },
    { id: 'cpu_socket', name: 'CPU', x: 50, y: 45, width: 70, height: 70, acceptsComponent: 'cpu' },
    { id: 'ram_slot1', name: 'RAM', x: 150, y: 35, width: 25, height: 90, acceptsComponent: 'ram1' },
    { id: 'ram_slot2', name: 'RAM', x: 185, y: 35, width: 25, height: 90, acceptsComponent: 'ram2' },
    { id: 'pcie_slot', name: 'GPU', x: 40, y: 175, width: 180, height: 40, acceptsComponent: 'gpu' },
    { id: 'm2_slot', name: 'SSD', x: 150, y: 135, width: 65, height: 20, acceptsComponent: 'ssd' },
];

// Motherboard component - Green PCB
const MotherboardComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const w = size === 'large' ? 90 : 240;
    const h = size === 'large' ? 70 : 190;
    
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: w, height: h }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-green-700 rounded border-2 border-green-800 shadow-lg">
                {/* PCB traces */}
                <div className="absolute inset-1 opacity-30">
                    <div className="absolute top-1 left-0 right-0 h-0.5 bg-green-900"/>
                    <div className="absolute top-3 left-0 right-0 h-0.5 bg-green-900"/>
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-green-900"/>
                    <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-green-900"/>
                </div>
                {/* Capacitors */}
                <div className="absolute top-1 right-1 flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1.5 h-2.5 bg-slate-800 rounded-sm"/>
                    ))}
                </div>
                {/* Chips */}
                <div className="absolute bottom-2 left-2 w-4 h-3 bg-slate-700 rounded-sm"/>
                <div className="absolute bottom-2 right-4 w-3 h-3 bg-slate-600 rounded-sm"/>
            </div>
        </div>
    );
};

// PSU component
const PSUComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const w = size === 'large' ? 70 : 85;
    const h = size === 'large' ? 45 : 75;
    
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: w, height: h }}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-700 to-black rounded border border-slate-500 shadow-lg">
                {/* Fan */}
                <div className="absolute top-1 left-1 right-1 bottom-4 bg-slate-900 rounded flex items-center justify-center">
                    <div className={`${size === 'large' ? 'w-8 h-8' : 'w-12 h-12'} rounded-full border-2 border-slate-600`}>
                        <div className="w-full h-full rounded-full border border-slate-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-slate-500"/>
                        </div>
                    </div>
                </div>
                {/* Label */}
                <div className="absolute bottom-0.5 left-0 right-0 text-center">
                    <span className="text-[6px] font-bold text-yellow-500">750W</span>
                </div>
            </div>
        </div>
    );
};

// CPU component
const CPUComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const s = size === 'large' ? 50 : 65;
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: s, height: s }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 rounded-sm shadow-lg" style={{ borderRadius: '4px' }}>
                {/* CPU Die */}
                <div className="absolute bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center" style={{ top: '18%', left: '18%', right: '18%', bottom: '18%', borderRadius: '2px' }}>
                    <span className="text-[7px] font-bold text-slate-400">i9</span>
                </div>
                {/* Pins */}
                <div className="absolute bottom-0 left-1 right-1 flex justify-between">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-amber-400 rounded-sm"/>
                    ))}
                </div>
            </div>
        </div>
    );
};

// RAM component
const RAMComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const w = size === 'large' ? 60 : 20;
    const h = size === 'large' ? 18 : 85;
    const isVertical = size === 'small';
    
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: w, height: h }}>
            <div className="absolute inset-0 bg-gradient-to-b from-green-600 to-green-700 rounded-sm shadow-lg overflow-hidden">
                {/* Chips */}
                <div className={`absolute ${isVertical ? 'top-2 left-0.5 right-0.5 flex flex-col gap-1' : 'top-1 left-1 right-1 flex gap-0.5'}`}>
                    {[...Array(isVertical ? 6 : 4)].map((_, i) => (
                        <div key={i} className={`bg-slate-800 rounded-sm ${isVertical ? 'h-2' : 'w-2.5 h-2'}`}/>
                    ))}
                </div>
                {/* Gold contacts */}
                <div className={`absolute bg-gradient-to-b from-amber-400 to-amber-600 ${isVertical ? 'bottom-0 left-0 right-0 h-3' : 'bottom-0 left-0 right-0 h-2'}`}/>
            </div>
        </div>
    );
};

// GPU component
const GPUComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const w = size === 'large' ? 120 : 175;
    const h = size === 'large' ? 40 : 35;
    
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: w, height: h }}>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded shadow-lg overflow-hidden">
                {/* Fans */}
                <div className="absolute top-1 left-2 right-2 flex justify-around">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className={`${size === 'large' ? 'w-6 h-6' : 'w-5 h-5'} rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"/>
                        </div>
                    ))}
                </div>
                {/* RGB */}
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full opacity-80"/>
            </div>
        </div>
    );
};

// SSD component
const SSDComponent: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
    const w = size === 'large' ? 55 : 60;
    const h = size === 'large' ? 16 : 16;
    
    return (
        <div className="relative hover:scale-105 transition-transform" style={{ width: w, height: h }}>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 rounded-sm shadow-lg border border-slate-600">
                {/* Controller */}
                <div className="absolute top-1 left-1 w-3 h-2 bg-slate-700 rounded-sm"/>
                {/* NAND */}
                <div className="absolute top-1 left-5 right-4 flex gap-0.5">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex-1 h-2 bg-slate-600 rounded-sm"/>
                    ))}
                </div>
                {/* Connector */}
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-sm"/>
            </div>
        </div>
    );
};

const renderComponent = (id: string, size: 'small' | 'large' = 'large') => {
    switch (id) {
        case 'motherboard': return <MotherboardComponent size={size} />;
        case 'psu': return <PSUComponent size={size} />;
        case 'cpu': return <CPUComponent size={size} />;
        case 'ram1':
        case 'ram2': return <RAMComponent size={size} />;
        case 'gpu': return <GPUComponent size={size} />;
        case 'ssd': return <SSDComponent size={size} />;
        default: return null;
    }
};

const PCBuildChallenge: React.FC<PCBuildChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [availableComponents, setAvailableComponents] = useState<Component[]>([...COMPONENTS]);
    const [placedComponents, setPlacedComponents] = useState<Map<string, string>>(new Map());
    const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
    const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const motherboardInstalled = placedComponents.has('mobo_slot');
    const psuInstalled = placedComponents.has('psu_slot');

    const handleDragStart = useCallback((component: Component, e: React.DragEvent) => {
        setDraggedComponent(component);
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedComponent(null);
        setHoveredSlot(null);
    }, []);

    const handleSlotDragOver = useCallback((slot: Slot, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedComponent && slot.acceptsComponent === draggedComponent.id) {
            setHoveredSlot(slot.id);
        }
    }, [draggedComponent]);

    const handleSlotDragLeave = useCallback(() => {
        setHoveredSlot(null);
    }, []);

    const tryPlaceComponent = useCallback((component: Component, slotId: string) => {
        const slot = SLOTS.find(s => s.id === slotId);
        if (!slot) return false;

        // Check motherboard must be first
        if (slotId !== 'mobo_slot' && !motherboardInstalled) {
            setErrorMessage("Install the Motherboard first!");
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return false;
        }

        // Check PSU must be second (before other components except motherboard)
        if (slotId !== 'mobo_slot' && slotId !== 'psu_slot' && !psuInstalled) {
            setErrorMessage("Install the PSU to power the system!");
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return false;
        }

        // Check if component matches slot
        if (slot.acceptsComponent !== component.id) {
            setErrorMessage("That doesn't fit there!");
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            return false;
        }

        // Place the component
        const newPlaced = new Map(placedComponents);
        newPlaced.set(slotId, component.id);
        setPlacedComponents(newPlaced);
        setAvailableComponents(prev => prev.filter(c => c.id !== component.id));
        setShowError(false);

        // Check completion
        if (newPlaced.size === SLOTS.length) {
            setIsComplete(true);
        }

        return true;
    }, [motherboardInstalled, psuInstalled, placedComponents]);

    const handleSlotDrop = useCallback((slot: Slot, e: React.DragEvent) => {
        e.preventDefault();
        if (draggedComponent) {
            tryPlaceComponent(draggedComponent, slot.id);
        }
        setDraggedComponent(null);
        setHoveredSlot(null);
    }, [draggedComponent, tryPlaceComponent]);

    const handleComponentClick = useCallback((component: Component) => {
        // Find matching slot
        const targetSlot = SLOTS.find(s => s.acceptsComponent === component.id && !placedComponents.has(s.id));
        if (targetSlot) {
            tryPlaceComponent(component, targetSlot.id);
        }
    }, [placedComponents, tryPlaceComponent]);

    const resetBuild = () => {
        setAvailableComponents([...COMPONENTS]);
        setPlacedComponents(new Map());
        setIsComplete(false);
        setShowError(false);
    };

    // Get visible slots based on progress
    const getVisibleSlots = () => {
        if (!motherboardInstalled) {
            return SLOTS.filter(s => s.id === 'mobo_slot');
        }
        if (!psuInstalled) {
            return SLOTS.filter(s => s.id === 'mobo_slot' || s.id === 'psu_slot');
        }
        return SLOTS;
    };

    const visibleSlots = getVisibleSlots();

    return (
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/40 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] select-none">
            <h2 className="text-2xl font-bold text-cyan-300 mb-2 text-center">{challengeTitle}</h2>
            
            <div className="text-center mb-4">
                <span className="text-3xl">🖥️</span>
                <p className="text-gray-400 text-sm mt-1">Build a PC! Drag components to their slots.</p>
            </div>

            {/* Progress */}
            <div className="mb-4 bg-black/30 rounded-full h-3 border border-white/10">
                <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${(placedComponents.size / SLOTS.length) * 100}%` }}
                />
            </div>
            <p className="text-center text-xs text-gray-400 mb-4">
                {placedComponents.size} / {SLOTS.length} installed
            </p>

            {/* Main Area */}
            <div className="flex gap-4">
                {/* Toolbox */}
                <div className="w-36 bg-black/40 border border-white/10 rounded-xl p-2">
                    <h3 className="text-xs font-bold text-gray-300 mb-2 text-center">🧰 PARTS</h3>
                    <div className="space-y-2">
                        {availableComponents.map((component) => (
                            <div
                                key={component.id}
                                draggable
                                onDragStart={(e) => handleDragStart(component, e)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleComponentClick(component)}
                                className={`bg-slate-800/80 p-2 rounded-lg cursor-grab active:cursor-grabbing border-2 border-slate-600 hover:border-cyan-400 transition-all flex flex-col items-center gap-1 ${
                                    draggedComponent?.id === component.id ? 'opacity-50 scale-95' : ''
                                }`}
                            >
                                {renderComponent(component.id, 'large')}
                                <span className="text-[9px] font-bold text-slate-300">{component.name}</span>
                            </div>
                        ))}
                        {availableComponents.length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                                <span className="text-xl">✅</span>
                                <p className="text-[10px] mt-1">All done!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Build Area */}
                <div className="flex-1 flex justify-center">
                    <div 
                        className="relative bg-slate-900/80 rounded-xl border-2 border-slate-700 shadow-2xl"
                        style={{ width: '400px', height: '240px' }}
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                            backgroundSize: '15px 15px'
                        }} />

                        {/* Motherboard background (when installed) */}
                        {motherboardInstalled && (
                            <div 
                                className="absolute bg-gradient-to-br from-green-600 via-green-500 to-green-700 rounded"
                                style={{ left: 20, top: 20, width: 250, height: 200 }}
                            >
                                {/* PCB traces */}
                                <svg className="absolute inset-0 w-full h-full opacity-25">
                                    <line x1="10" y1="30" x2="240" y2="30" stroke="#166534" strokeWidth="2"/>
                                    <line x1="10" y1="100" x2="240" y2="100" stroke="#166534" strokeWidth="2"/>
                                    <line x1="10" y1="170" x2="240" y2="170" stroke="#166534" strokeWidth="2"/>
                                    <line x1="40" y1="10" x2="40" y2="190" stroke="#166534" strokeWidth="2"/>
                                    <line x1="125" y1="10" x2="125" y2="190" stroke="#166534" strokeWidth="2"/>
                                    <line x1="210" y1="10" x2="210" y2="190" stroke="#166534" strokeWidth="2"/>
                                </svg>
                                {/* Capacitors */}
                                <div className="absolute top-2 left-2 flex gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-3 bg-slate-800 rounded-sm"/>
                                    ))}
                                </div>
                                {/* BIOS */}
                                <div className="absolute bottom-2 right-2 w-6 h-4 bg-slate-800 rounded-sm flex items-center justify-center">
                                    <span className="text-[5px] text-cyan-400 font-bold">BIOS</span>
                                </div>
                            </div>
                        )}

                        {/* Slots */}
                        {visibleSlots.map((slot) => {
                            const placed = placedComponents.get(slot.id);
                            const isHovered = hoveredSlot === slot.id;
                            const canAccept = draggedComponent?.id === slot.acceptsComponent;
                            
                            // Don't show motherboard slot after it's placed
                            if (slot.id === 'mobo_slot' && motherboardInstalled) return null;

                            return (
                                <div
                                    key={slot.id}
                                    className={`absolute rounded transition-all duration-200 flex items-center justify-center ${
                                        placed
                                            ? 'shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                                            : isHovered && canAccept
                                                ? 'border-2 border-dashed border-green-400 bg-green-400/30'
                                                : canAccept
                                                    ? 'border-2 border-dashed border-cyan-400 bg-cyan-400/20 animate-pulse'
                                                    : 'border-2 border-dashed border-slate-500 bg-slate-800/50'
                                    }`}
                                    style={{
                                        left: slot.x,
                                        top: slot.y,
                                        width: slot.width,
                                        height: slot.height,
                                    }}
                                    onDragOver={(e) => handleSlotDragOver(slot, e)}
                                    onDragLeave={handleSlotDragLeave}
                                    onDrop={(e) => handleSlotDrop(slot, e)}
                                >
                                    {placed ? (
                                        renderComponent(placed, 'small')
                                    ) : (
                                        <span className="text-[8px] text-slate-500 font-bold">?</span>
                                    )}
                                </div>
                            );
                        })}

                        {/* Empty state */}
                        {!motherboardInstalled && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center text-slate-500">
                                    <span className="text-3xl opacity-30">🔲</span>
                                    <p className="text-xs mt-1">Start with Motherboard</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Error */}
            {showError && (
                <div className="mt-4 bg-red-900/50 border border-red-500 rounded-lg p-3 text-center animate-shake">
                    <span className="text-red-400 font-bold">❌ {errorMessage}</span>
                </div>
            )}

            {/* Success */}
            {isComplete && (
                <div className="mt-6 bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-2 border-green-500 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">PC Built!</h3>
                    <p className="text-gray-300 mb-4">All components installed correctly!</p>
                    <button
                        onClick={() => onComplete(true)}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transform hover:scale-105 transition-all shadow-lg shadow-green-600/30"
                    >
                        Complete → 100 pts
                    </button>
                </div>
            )}

            {/* Reset */}
            {placedComponents.size > 0 && !isComplete && (
                <div className="mt-4 text-center">
                    <button onClick={resetBuild} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 text-sm">
                        🔄 Reset
                    </button>
                </div>
            )}

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.3s ease-in-out; }
            `}</style>
        </div>
    );
};

export default PCBuildChallenge;
