import React, { useState } from 'react';

interface HtmlListChallengeProps {
    onComplete: (correct: boolean) => void;
    challengeTitle: string;
}

const challengeDescription = (
    <div className="text-gray-300 text-md text-left max-w-xl mx-auto bg-black/20 p-4 rounded-lg border border-white/10">
        <p className="mb-3">Add at least <strong className="text-white">5 meals</strong> to the menu. Each meal should be a <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;li&gt;</code> element with a rounded box style. You can copy-paste the existing ones and change the content.</p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>Make sure each <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">&lt;li&gt;</code> has the class <code className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-sm">meal-box</code>.</li>
            <li>Feel free to add meal name, description, or image inside the <code>&lt;li&gt;</code>.</li>
        </ul>
    </div>
);

const initialCode = `
<!DOCTYPE html>
<html>
  <head>
    <title>Loop Meals Menu</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #b71c1c; /* deep red menu background */
        color: #fff;
        padding: 40px 20px;
      }

      h1 {
        text-align: center;
        font-size: 3rem;
        margin-bottom: 40px;
        text-shadow: 2px 2px 5px #00000080;
      }

      #menu {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 4 columns */
        gap: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }

      .meal-box {
        background-color: #ffebee; /* light cream box */
        color: #b71c1c; /* red text */
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        text-align: center;
        font-weight: bold;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .meal-box:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.5);
      }
    </style>
  </head>
  <body>
    <h1>Loop Meals Menu</h1>
    <ul id="menu">
      <li class="meal-box">Meal 1: Loop Burger</li>
      <li class="meal-box">Meal 2: Loop Pizza</li>

     <!--CODE HERE -->

    </ul>
  </body>
</html>
`;

const HtmlListChallenge: React.FC<HtmlListChallengeProps> = ({ onComplete, challengeTitle }) => {
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

            const liElements = doc.querySelectorAll('li.meal-box');
            if (liElements.length < 8) { // original 3 + at least 5 more
                errors.push(`You need at least 8 <li class="meal-box"> elements (currently ${liElements.length}).`);
            }

            if (errors.length > 0) {
                setErrorMessages(errors);
                setStatus(null);
            } else {
                setErrorMessages([]);
                setStatus("Validation successful! You added enough meals.");
                setIsCorrect(true);
                setTimeout(() => onComplete(true), 1500);
            }

        } catch (e) {
            setErrorMessages(["An error occurred while parsing your HTML. Check for syntax errors."]);
            setStatus(null);
        }
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        if (errorMessages.length > 0) setErrorMessages([]);
        if (status) setStatus(null);
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass">
            <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">{challengeTitle}</h2>
            <div className="text-gray-300 mb-6 text-center">{challengeDescription}</div>

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

export default HtmlListChallenge;
