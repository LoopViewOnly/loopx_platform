import React, { useState } from 'react';

interface HtmlCodingChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Create a simple HTML page for a coffee shop. Your menu must meet the following requirements:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>
                A main title using an <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;h1&gt;</code> tag containing the text: <strong className="text-white">"Loop Coffee Shop"</strong>.
            </li>
            <li>
                At least <strong className="text-white">5 drinks</strong>. Each drink should have an image represented by an <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;img&gt;</code> tag with a <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">src</code> attribute.
            </li>
            <li>
                A link to the official Loop website using an <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;a&gt;</code> tag. The link's destination (<code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">href</code>) must be exactly <strong className="text-white">https://loop.org.il</strong>.
            </li>
        </ul>
    </div>
);


const initialCode = `<!DOCTYPE html>
<html>
  <head>
    <title>My Coffee Shop</title>
  </head>
  <body>

    <!-- Your code goes here -->

  </body>
</html>`;

const HtmlCodingChallenge: React.FC<HtmlCodingChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [status, setStatus] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const validateCode = () => {
        if (isCorrect) return;

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(code, 'text/html');
            const errors: string[] = [];

            // Check 1: Big header <h1> with specific text
            const mainHeading = doc.querySelector('h1');
            if (!mainHeading) {
                errors.push("Missing <h1> tag.");
            } else if (!mainHeading.textContent?.trim().includes("Loop Coffee Shop")) {
                errors.push("The <h1> title should contain 'Loop Coffee Shop'.");
            }

            // Check 2: At least 5 images <img> with a 'src' attribute
            const images = doc.querySelectorAll('img');
            const validImageCount = Array.from(images).filter(img => img.hasAttribute('src')).length;

            if (validImageCount < 5) {
                errors.push(`You need at least 5 <img> tags with a 'src' attribute (found ${validImageCount}).`);
            }

            // Check 3: Link to Loop website <a>
            const links = Array.from(doc.querySelectorAll('a'));
            const hasCorrectLink = links.some(link => link.getAttribute('href') === 'https://loop.org.il');
            
            if (!hasCorrectLink) {
                errors.push("Missing link to Loop website (e.g., <a href='https://loop.org.il'>...</a>).");
            }

            if (errors.length > 0) {
                setErrorMessages(errors);
                setStatus(null);
            } else {
                setErrorMessages([]);
                setStatus("Validation successful! The menu structure is correct. Proceeding...");
                setIsCorrect(true);
                setTimeout(() => onComplete(true), 1500);
            }

        } catch (e) {
            setErrorMessages(["An error occurred while parsing your HTML. Please check for syntax errors."]);
            setStatus(null);
        }
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (errorMessages.length > 0) {
            setErrorMessages([]);
        }
        if (status) {
            setStatus(null);
        }
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">{challengeTitle}</h2>
            <div className="text-gray-300 mb-6 text-md text-center">{challengeDescription}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
                {/* Editor */}
                <div className="bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <div className="flex items-center px-4 py-2 bg-gray-800">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-auto text-xs text-gray-400 font-semibold">editor.html</span>
                    </div>
                    <div className="p-1">
                        <textarea
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            disabled={isCorrect}
                            className="w-full h-96 bg-transparent text-white font-mono text-sm resize-none focus:outline-none p-2"
                            spellCheck="false"
                            aria-label="HTML code editor"
                        />
                    </div>
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <div className="flex items-center px-4 py-2 bg-gray-200">
                         <span className="text-xs text-gray-600 font-semibold">Preview</span>
                    </div>
                    <iframe
                        srcDoc={code}
                        title="HTML Preview"
                        className="w-full h-96 border-0"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>

            <div className="text-center">
                {!isCorrect && (
                    <button
                        onClick={validateCode}
                        disabled={!code.trim()}
                        className="mt-8 w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Validate My Menu
                    </button>
                )}

                <div className="mt-6 min-h-[2.5rem] flex justify-center">
                    {errorMessages.length > 0 && (
                        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg text-left max-w-md">
                            <ul className="list-disc list-inside text-red-400 space-y-1">
                                {errorMessages.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {status && isCorrect && (
                        <p className="text-lg font-bold text-green-400">{status}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HtmlCodingChallenge;