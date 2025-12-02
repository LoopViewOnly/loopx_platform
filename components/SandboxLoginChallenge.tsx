import React, { useState } from 'react';
import { SANDBOX_CHALLENGE } from '../challenges/content';

interface SandboxLoginChallengeProps {
    onComplete: (success: boolean) => void;
    challengeTitle: string;
}

// Separate HTML, CSS, JS strings
const SANDBOX_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Simple Login Demo</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Login</h1>
    <input id="username" type="text" placeholder="Username"><br><br>
    <input id="password" type="password" placeholder="Password"><br><br>
    <button onclick="checkLogin()">Login</button>
    <p id="result"></p>
    <script src="script.js"></script>
</body>
</html>`;

const SANDBOX_CSS = `body { 
    font-family: sans-serif; 
    background-color: #f0f2f5; 
    color: #333; 
    padding: 20px; 
}
h1 { color: #1a73e8; }
input[type="text"], input[type="password"] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 200px;
}
button {
    padding: 10px 15px;
    background-color: #1a73e8;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}
button:hover { background-color: #0d47a1; }
#result { margin-top: 15px; font-weight: bold; }`;

const SANDBOX_JS = `function checkLogin() {
    const userInput = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };
    if (userInput.username === "Looper" && userInput.password === "6122025") {
        document.getElementById("result").innerText = "Login success! Password found: " + userInput.password;
    } else {
        document.getElementById("result").innerText = "Invalid login.";
    }
}`;

const CORRECT_PASSWORD = SANDBOX_CHALLENGE.answer;

const SandboxLoginChallenge: React.FC<SandboxLoginChallengeProps> = ({ onComplete, challengeTitle }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [submittedCorrectly, setSubmittedCorrectly] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (submittedCorrectly || hasSubmitted) return;
        setHasSubmitted(true);

        if (userAnswer.trim() === CORRECT_PASSWORD) {
            setError(null);
            setSubmittedCorrectly(true);
            onComplete(true);
        } else {
            setError("Incorrect password. Inspect the code carefully!");
            setUserAnswer('');
            setHasSubmitted(false);
        }
    };

    const getCode = () => {
        if (activeTab === 'html') return SANDBOX_HTML;
        if (activeTab === 'css') return SANDBOX_CSS;
        return SANDBOX_JS;
    };

    return (
        <div className="p-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass text-center">
            <h2 className="text-2xl font-bold text-blue-300 mb-4">{challengeTitle}</h2>
            <p className="text-gray-300 mb-6 text-lg">
                Inspect the code below to find the correct password.
            </p>

            {/* Navbar */}
            <div className="flex justify-center mb-4 space-x-2">
                {['html', 'css', 'js'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'html' | 'css' | 'js')}
                        className={`px-4 py-2 rounded-t-lg font-bold ${
                            activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                        }`}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Code Viewer */}
            <div className="bg-[#282c34] rounded-b-lg shadow-lg overflow-hidden border border-white/10 mb-8">
                <textarea
                    value={getCode()}
                    readOnly
                    className="w-full h-80 bg-transparent text-white font-mono text-xs resize-none focus:outline-none p-2"
                    spellCheck="false"
                />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <label className="block text-left text-sm font-bold text-gray-400 mb-2 ml-1">
                    Enter the password:
                </label>
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter password"
                    disabled={submittedCorrectly}
                    className="w-full px-4 py-3 bg-black/40 border-2 border-blue-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-center text-xl"
                />
                {!submittedCorrectly && (
                    <button
                        type="submit"
                        disabled={!userAnswer.trim() || hasSubmitted}
                        className="mt-6 w-full px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-600/30"
                    >
                        Submit Password
                    </button>
                )}
            </form>

            <div className="mt-6 min-h-[2.5rem]">
                {error && <p className="text-lg font-bold text-red-400">{error}</p>}
                {submittedCorrectly && (
                    <p className="text-2xl font-bold text-green-400">Correct! Access granted.</p>
                )}
            </div>
        </div>
    );
};

export default SandboxLoginChallenge;
