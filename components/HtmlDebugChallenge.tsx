
import React, { useState } from 'react';

interface HtmlDebugChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">You've been handed some HTML for a page about Loop, but it has two critical bugs. Your task is to debug and fix them:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>
                The main title is in a <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;p&gt;</code> tag. Change it to a proper HTML header tag (e.g., <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;h1&gt;</code>).
            </li>
            <li>
                The Loop logo image is not showing. It's an <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;img&gt;</code> tag with a <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">data-src</code> attribute. You need to use the provided URL to correctly display the image using its <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">src</code> attribute.
            </li>
        </ul>
    </div>
);

const initialCode = `<!DOCTYPE html>
<html>
<head>
    <title>Loop Debug Challenge</title>
</head>
<body>
    <p>Welcome to Loop!</p>
    <img data-src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3pv7-E-TyTDVzKr6shRLbaYpPSZKS2MpDw&s" alt="Loop Logo" style="max-width: 300px; display: block; margin: 20px auto;" />
    <p>We are a community of passionate developers.</p>
</body>
</html>`;

const HtmlDebugChallenge: React.FC<HtmlDebugChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [code, setCode] = useState(initialCode);
    const [status, setStatus] = useState<string | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const targetImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY3pv7-E-TyTDVzKr6shRLbaYpPSZKS2MpDw&s";
    const targetHeaderText = "Welcome to Loop!";

    const validateCode = () => {
        if (isCorrect) return;
        setErrorMessages([]);
        setStatus(null);

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(code, 'text/html');
            const errors: string[] = [];

            // Check 1: Header
            const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let foundHeader = false;
            headers.forEach(h => {
                if (h.textContent?.includes(targetHeaderText)) {
                    foundHeader = true;
                }
            });

            if (!foundHeader) {
                errors.push(`The text '${targetHeaderText}' must be inside a header tag (<h1> - <h6>).`);
            }

            // Check 2: Incorrect p tag
            const paragraphs = Array.from(doc.querySelectorAll('p'));
            const incorrectP = paragraphs.find(p => p.textContent?.includes(targetHeaderText));
            if (incorrectP) {
                errors.push(`The '${targetHeaderText}' text is still inside a <p> tag. Please replace it.`);
            }

            // Check 3: Image src
            const img = doc.querySelector('img');
            if (!img) {
                errors.push("The <img> tag is missing.");
            } else {
                const src = img.getAttribute('src');
                if (!src || src.trim() === "") {
                    errors.push("The image is missing the 'src' attribute.");
                } else if (src !== targetImageUrl) {
                    errors.push(`The <img> tag's 'src' attribute is incorrect. It should be exactly '${targetImageUrl}'.`);
                }
            }

            if (errors.length > 0) {
                setErrorMessages(errors);
            } else {
                setStatus("Success! You fixed the bugs.");
                setIsCorrect(true);
                setTimeout(() => onComplete(true), 1500);
            }
        } catch (e) {
            setErrorMessages(["An error occurred while parsing the HTML."]);
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
            <div className="mb-6">{challengeDescription}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
                <div className="bg-[#282c34] rounded-lg shadow-lg overflow-hidden border border-white/10">
                    <div className="flex items-center px-4 py-2 bg-gray-800">
                         <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-auto text-xs text-gray-400 font-semibold">index.html</span>
                    </div>
                    <div className="p-1">
                        <textarea
                            value={code}
                            onChange={(e) => handleCodeChange(e.target.value)}
                            disabled={isCorrect}
                            className="w-full h-96 bg-transparent text-white font-mono text-sm resize-none focus:outline-none p-2"
                            spellCheck="false"
                        />
                    </div>
                </div>

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

             <div className="text-center mt-8">
                {!isCorrect && (
                    <button
                        onClick={validateCode}
                        className="w-full max-w-sm mx-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Check Code
                    </button>
                )}
                <div className="mt-6 min-h-[2.5rem]">
                    {errorMessages.length > 0 && (
                        <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-lg text-left max-w-md mx-auto">
                            <ul className="list-disc list-inside text-red-400 space-y-1">
                                {errorMessages.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                    {status && <p className="text-lg font-bold text-green-400">{status}</p>}
                </div>
            </div>
        </div>
    );
};

export default HtmlDebugChallenge;