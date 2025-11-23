
import React from 'react';
import { EmojiConfig } from '../types';

// Constants for customization
const BG_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#64748B'];
const EYEBROW_STYLES = ['default', 'raised', 'angry', 'unibrow', 'sad'];
const EYE_STYLES = ['default', 'wink', 'happy', 'surprised', 'lashes', 'hearts', 'stars'];
const NOSE_STYLES = ['none', 'line', 'curve', 'triangle', 'button'];
const MOUTH_STYLES = ['neutral', 'smile', 'smirk', 'open', 'sad'];


// SVG components for parts
const Eyebrows: React.FC<{ style: string }> = ({ style }) => {
    switch (style) {
        case 'raised':
            return <>
                <path d="M 10 12 C 11 10, 15 10, 16 12" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 20 12 C 21 10, 25 10, 26 12" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
        case 'angry':
            return <>
                <path d="M 10 13 L 15 11" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 26 13 L 21 11" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
        case 'unibrow':
             return <path d="M 10 12 L 26 12" stroke="#262626" strokeWidth="2" fill="none" strokeLinecap="round"/>;
        case 'sad':
            return <>
                <path d="M 10 13 C 11 14, 15 14, 16 13" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 20 13 C 21 14, 25 14, 26 13" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
        default: // default (flat)
            return <>
                <path d="M 10 12 H 16" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 20 12 H 26" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
    }
};

const Eyes: React.FC<{ style: string }> = ({ style }) => {
    switch (style) {
        case 'wink':
            return <>
                <circle cx="13" cy="16" r="2" fill="#262626" />
                <circle cx="13.5" cy="15.5" r="0.5" fill="white" />
                <path d="M 21 16 C 22 17, 24 17, 25 16" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
        case 'happy':
             return <>
                <path d="M 10 17 L 13 15 L 16 17" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M 20 17 L 23 15 L 26 17" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </>;
        case 'surprised':
            return <>
                <circle cx="13" cy="16" r="3" fill="white" stroke="black" strokeWidth="0.5"/>
                <circle cx="13" cy="16" r="1.2" fill="black" />
                <circle cx="23" cy="16" r="3" fill="white" stroke="black" strokeWidth="0.5"/>
                <circle cx="23" cy="16" r="1.2" fill="black" />
            </>;
        case 'lashes':
            return <>
                 <g fill="none" stroke="#262626" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M 10 16 C 11 15, 15 15, 16 16" />
                    <path d="M 20 16 C 21 15, 25 15, 26 16" />
                    <path d="M 10 16 L 9 14" />
                    <path d="M 16 16 L 17 14" />
                    <path d="M 20 16 L 19 14" />
                    <path d="M 26 16 L 27 14" />
                </g>
            </>
        case 'hearts':
            return <>
                <path transform="translate(10.5, 13.5) scale(0.3)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#262626"/>
                <path transform="translate(20.5, 13.5) scale(0.3)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#262626"/>
            </>
        case 'stars':
             return <>
                <path transform="translate(13, 16) scale(0.3)" d="M 0,-10 L 2.939,-4.045 L 9.511,-3.09 L 4.755,1.545 L 5.878,8.09 L 0,5 L -5.878,8.09 L -4.755,1.545 L -9.511,-3.09 L -2.939,-4.045 Z" fill="#262626" />
                <path transform="translate(23, 16) scale(0.3)" d="M 0,-10 L 2.939,-4.045 L 9.511,-3.09 L 4.755,1.545 L 5.878,8.09 L 0,5 L -5.878,8.09 L -4.755,1.545 L -9.511,-3.09 L -2.939,-4.045 Z" fill="#262626" />
            </>
        default: // default
            return <>
                <circle cx="13" cy="16" r="2" fill="#262626" />
                <circle cx="13.5" cy="15.5" r="0.5" fill="white" />
                <circle cx="23" cy="16" r="2" fill="#262626" />
                <circle cx="23.5" cy="15.5" r="0.5" fill="white" />
            </>;
    }
};

const Nose: React.FC<{ style: string }> = ({ style }) => {
    switch (style) {
        case 'line':
            return <path d="M 18 19 V 22" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>;
        case 'curve':
            return <path d="M 17 20 C 18 22, 20 22, 20 20" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
        case 'triangle':
            return <path d="M 18 19 L 17 22 L 19 22 Z" fill="#262626" />;
        case 'button':
            return <path d="M 17 21 C 17.5 22, 18.5 22, 19 21" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
        default: // none
            return null;
    }
};

const Mouth: React.FC<{ style: string }> = ({ style }) => {
    switch(style) {
        case 'smile':
            return <path d="M 13 23 C 14 27, 22 27, 23 23" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
        case 'smirk':
             return <path d="M 14 23 Q 18 24 22 22" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
        case 'open':
            return <ellipse cx="18" cy="24" rx="4" ry="2.5" fill="#262626" />;
        case 'sad':
            return <path d="M 13 25 C 14 22, 22 22, 23 25" stroke="#262626" strokeWidth="1.5" fill="none" strokeLinecap="round"/>;
        default: // neutral
            return <path d="M 15 24 H 21" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
    }
}


// Main Builder Component
interface EmojiBuilderProps {
    config: EmojiConfig;
    setConfig: (newConfig: EmojiConfig) => void;
}

const EmojiBuilder: React.FC<EmojiBuilderProps> = ({ config, setConfig }) => {
    
    const SelectionButton: React.FC<{ label: string; onClick: () => void; isActive: boolean }> = ({ label, onClick, isActive }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 capitalize ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-black/40 text-gray-300 hover:bg-white/10'}`}
        >
            {label}
        </button>
    );

    const ColorButton: React.FC<{ color: string; onClick: () => void; isActive: boolean }> = ({ color, onClick, isActive }) => (
         <button
            onClick={onClick}
            style={{ backgroundColor: color }}
            className={`w-8 h-8 rounded-full transition-all duration-200 transform hover:scale-110 border-2 border-transparent ${isActive ? 'ring-2 ring-offset-2 ring-offset-black/50 ring-white' : ''}`}
            aria-label={`Select color ${color}`}
        />
    );


    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Preview */}
            <div className="w-40 h-40 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden" style={{ backgroundColor: config.backgroundColor }}>
                <svg viewBox="0 0 36 36" width="160" height="160" style={{ display: 'block' }}>
                    <circle cx="18" cy="18" r="12" fill="#FFD95A" stroke="#4a4a4a" strokeWidth="0.5"/>
                    <Eyebrows style={config.eyebrowStyle} />
                    <Eyes style={config.eyeStyle} />
                    <Nose style={config.noseStyle} />
                    <Mouth style={config.mouthStyle} />
                </svg>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 w-full">
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Background</h4>
                     <div className="flex gap-2 flex-wrap">{BG_COLORS.map(color => <ColorButton key={color} color={color} onClick={() => setConfig({...config, backgroundColor: color})} isActive={config.backgroundColor === color} />)}</div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Eyebrows</h4>
                    <div className="flex gap-2 flex-wrap">{EYEBROW_STYLES.map(style => <SelectionButton key={style} label={style} onClick={() => setConfig({...config, eyebrowStyle: style})} isActive={config.eyebrowStyle === style} />)}</div>
                </div>
                 <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Eyes</h4>
                    <div className="flex gap-2 flex-wrap">{EYE_STYLES.map(style => <SelectionButton key={style} label={style} onClick={() => setConfig({...config, eyeStyle: style})} isActive={config.eyeStyle === style} />)}</div>
                </div>
                 <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Nose</h4>
                    <div className="flex gap-2 flex-wrap">{NOSE_STYLES.map(style => <SelectionButton key={style} label={style} onClick={() => setConfig({...config, noseStyle: style})} isActive={config.noseStyle === style} />)}</div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-300 mb-2">Mouth</h4>
                    <div className="flex gap-2 flex-wrap">{MOUTH_STYLES.map(style => <SelectionButton key={style} label={style} onClick={() => setConfig({...config, mouthStyle: style})} isActive={config.mouthStyle === style} />)}</div>
                </div>
            </div>
        </div>
    );
};

export default EmojiBuilder;

export const generateEmojiSvg = (config: EmojiConfig): string => {
    // A simplified, self-contained version for generating the SVG string
    let eyebrowSvg = '';
    switch (config.eyebrowStyle) {
        case 'raised': eyebrowSvg = `<path d="M 10 12 C 11 10, 15 10, 16 12" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 20 12 C 21 10, 25 10, 26 12" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'angry': eyebrowSvg = `<path d="M 10 13 L 15 11" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 26 13 L 21 11" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'unibrow': eyebrowSvg = `<path d="M 10 12 L 26 12" stroke="#262626" stroke-width="2" fill="none" stroke-linecap="round"/>`; break;
        case 'sad': eyebrowSvg = `<path d="M 10 13 C 11 14, 15 14, 16 13" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 20 13 C 21 14, 25 14, 26 13" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        default: eyebrowSvg = `<path d="M 10 12 H 16" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 20 12 H 26" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
    }

    let eyesSvg = '';
    switch (config.eyeStyle) {
        case 'wink': eyesSvg = `<circle cx="13" cy="16" r="2" fill="#262626" /><circle cx="13.5" cy="15.5" r="0.5" fill="white" /><path d="M 21 16 C 22 17, 24 17, 25 16" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'happy': eyesSvg = `<path d="M 10 17 L 13 15 L 16 17" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 20 17 L 23 15 L 26 17" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'surprised': eyesSvg = `<circle cx="13" cy="16" r="3" fill="white" stroke="black" stroke-width="0.5" /><circle cx="13" cy="16" r="1.2" fill="black" /><circle cx="23" cy="16" r="3" fill="white" stroke="black" stroke-width="0.5" /><circle cx="23" cy="16" r="1.2" fill="black" />`; break;
        case 'lashes': eyesSvg = `<g fill="none" stroke="#262626" stroke-width="1.5" stroke-linecap="round"><path d="M 10 16 C 11 15, 15 15, 16 16" /><path d="M 20 16 C 21 15, 25 15, 26 16" /><path d="M 10 16 L 9 14" /><path d="M 16 16 L 17 14" /><path d="M 20 16 L 19 14" /><path d="M 26 16 L 27 14" /></g>`; break;
        case 'hearts': eyesSvg = `<path transform="translate(10.5, 13.5) scale(0.3)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#262626"/><path transform="translate(20.5, 13.5) scale(0.3)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#262626"/>`; break;
        case 'stars': eyesSvg = `<path transform="translate(13, 16) scale(0.3)" d="M 0,-10 L 2.939,-4.045 L 9.511,-3.09 L 4.755,1.545 L 5.878,8.09 L 0,5 L -5.878,8.09 L -4.755,1.545 L -9.511,-3.09 L -2.939,-4.045 Z" fill="#262626" /><path transform="translate(23, 16) scale(0.3)" d="M 0,-10 L 2.939,-4.045 L 9.511,-3.09 L 4.755,1.545 L 5.878,8.09 L 0,5 L -5.878,8.09 L -4.755,1.545 L -9.511,-3.09 L -2.939,-4.045 Z" fill="#262626" />`; break;
        default: eyesSvg = `<circle cx="13" cy="16" r="2" fill="#262626" /><circle cx="13.5" cy="15.5" r="0.5" fill="white" /><circle cx="23" cy="16" r="2" fill="#262626" /><circle cx="23.5" cy="15.5" r="0.5" fill="white" />`; break;
    }

    let noseSvg = '';
    switch (config.noseStyle) {
        case 'line': noseSvg = `<path d="M 18 19 V 22" stroke="black" stroke-width="1.5" stroke-linecap="round"/>`; break;
        case 'curve': noseSvg = `<path d="M 17 20 C 18 22, 20 22, 20 20" stroke="black" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'triangle': noseSvg = `<path d="M 18 19 L 17 22 L 19 22 Z" fill="#262626" />`; break;
        case 'button': noseSvg = `<path d="M 17 21 C 17.5 22, 18.5 22, 19 21" stroke="black" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        default: noseSvg = ''; break;
    }

    let mouthSvg = '';
    switch(config.mouthStyle) {
        case 'smile': mouthSvg = `<path d="M 13 23 C 14 27, 22 27, 23 23" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'smirk': mouthSvg = `<path d="M 14 23 Q 18 24 22 22" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        case 'open': mouthSvg = `<ellipse cx="18" cy="24" rx="4" ry="2.5" fill="#262626" />`; break;
        case 'sad': mouthSvg = `<path d="M 13 25 C 14 22, 22 22, 23 25" stroke="#262626" stroke-width="1.5" fill="none" stroke-linecap="round"/>`; break;
        default: mouthSvg = `<path d="M 15 24 H 21" stroke="black" stroke-width="1.5" stroke-linecap="round"/>`; break;
    }
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="160" height="160">
        <circle cx="18" cy="18" r="18" fill="${config.backgroundColor}" />
        <circle cx="18" cy="18" r="12" fill="#FFD95A" stroke="#4a4a4a" stroke-width="0.5"/>
        ${eyebrowSvg}
        ${eyesSvg}
        ${noseSvg}
        ${mouthSvg}
    </svg>`;
};

export const svgToDataUrl = (svg: string): string => {
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
