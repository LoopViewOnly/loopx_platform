import { SIMILARITY_IMAGE_PLACEHOLDER_B64, SIMILARITY_SPONGEBOB_B64 } from './assets';

export const TYPING_CHALLENGE_TEXT = "Welcome to LoopX, are you ready to feel the magic?";
export const TYPING_CHALLENGE_2_TEXT = "i like to move it move, i like to move it move it, i like to MOVE IT";

export const TRIVIA_CHALLENGE = {
    question: "What year was Loop founded?",
    answer: "2015"
};

export const IMAGE_TRIVIA_CHALLENGE = {
    question: "Find the Latitude: of Loop's Nazareth Campus (خط العرض على سطح الأرض)",
    answer: "32.7053984"
};

export const INSTAGRAM_CHALLENGE = {
    question: "How many people does @loopcs follow?",
    answer: "0"
};

export const WORDLE_CHALLENGE = {
    link: "https://www.nytimes.com/games/wordle/index.html",
    targetWord: "Hello",
    question: "Play today's Wordle, find the secret word, and enter it below to continue."
};

export const PINPOINT_CHALLENGE = {
    link: "https://www.linkedin.com/games/pinpoint",
    targetWord: "Dragons",
    question: "Play today's LinkedIn Pinpoint game. The secret word for this challenge relates to mythology. Find it and enter it below."
};

export const HEX_CONVERSION_CHALLENGE = {
    instructions: "Convert the decimal numbers on the left to their hexadecimal (Base-16) equivalent. Use letters A-F for values 10-15.",
    problems: [
        { decimal: 165, answer: 'A5' },
        { decimal: 235, answer: 'EB' },
        { decimal: 670, answer: '29E' },
    ]
};

export const HEX_TO_BINARY_CHALLENGE = {
    question: "Convert the following hexadecimal value to its 16-bit binary equivalent.",
    problem: "22FC",
    answer: "0010001011111100"
};

export const FLAG_CHALLENGE_DATA = [
    { key: 'japan', name: 'Japan' },
    { key: 'brazil', name: 'Brazil' },
    { key: 'germany', name: 'Germany' },
    { key: 'france', name: 'France' },
    { key: 'italy', name: 'Italy' },
];

export const PHISHING_CHALLENGES = [
  {
    id: 'phishing1',
    type: 'Email' as const,
    source: 'From: apple_icloud@aple.com',
    content: 'Dear Apple Customer,\n\nYour Apple ID account has been temporarily locked due to unusual login attempts from a new device. To prevent permanent deactivation, you must verify your identity immediately.\n\nFailure to complete verification within 12 hours will result in permanent account suspension.',
    isPhishing: true,
    explanation: 'This is Phishing. The sender domain is "aple.com", a misspelling of the official "apple.com" domain. This, combined with the urgent tone ("temporarily locked," "permanent deactivation"), is a classic phishing tactic.',
  },
  {
    id: 'phishing2',
    type: 'Email' as const,
    source: 'From: james@tesla.com',
    content: 'Dear {userName},\n\nYour Tesla Model-S car warranty is nearing expiration.\nPlease log in to your Tesla Account on the official Tesla website for details.',
    isPhishing: false,
    explanation: 'This is Safe. Although it creates a sense of urgency, it directs you to the official website instead of providing a suspicious link. This is a safe practice for legitimate companies.',
  },
  {
    id: 'phishing3',
    type: 'Email' as const,
    source: 'From: james@tesla.com',
    content: 'ACTION REQUIRED: Your direct deposit information may have been compromised due to a recent system update. Click the link below to verify your routing and account number before end of day. \n\nVerify Now',
    isPhishing: true,
    explanation: 'This is Phishing. An unsolicited email from an unknown sender about sensitive financial data (like payroll/direct deposit) that asks you to click a link is highly suspicious and is an attempt to harvest credentials.',
  }
];

export const PYTHON_MENTOR_CHALLENGE = {
    question: "Write a for Loop in Python that prints all the numbers from 10 down to 1. Show your code to a mentor, and they will tell you the password to proceed.",
    answer: "LOOPCS"
};

export const SANDBOX_CHALLENGE = {
    question: "What is the hidden password?",
    answer: "6122025"
};

export const JS_CALCULATOR_CODE_TYPING_CHALLENGE_TEXT = `function calc(n1,n2,symbol){
   if symbol == "+" { print(n1+n2) }
   else if symbol == "-" { print(n1-n2) }
   else if symbol == "*" { print(n1*n2) }
   else if symbol == "/" { print(n1/n2) }
   else { print("Error") }
   }
`
;

export const MATCH_CONNECT_DATA = {
    companies: [
        { id: 'google', name: 'Google' },
        { id: 'microsoft', name: 'Microsoft' },
        { id: 'apple', name: 'Apple' },
    ],
    items: [
        { id: 'gemini', name: 'Gemini', correctCompanyId: 'google' },
        { id: 'swift', name: 'Swift', correctCompanyId: 'apple' },
        { id: 'azure', name: 'Azure', correctCompanyId: 'microsoft' },
        { id: 'android', name: 'Android', correctCompanyId: 'google' },
        { id: 'teams', name: 'Teams', correctCompanyId: 'microsoft' },
        { id: 'macos', name: 'macOS', correctCompanyId: 'apple' },
        { id: 'colab', name: 'Colab', correctCompanyId: 'google' },
        { id: 'visual_studio', name: 'Visual Studio', correctCompanyId: 'microsoft' },
        { id: 'ipados', name: 'iPadOS', correctCompanyId: 'apple' },
        { id: 'tensorflow', name: 'TensorFlow', correctCompanyId: 'google' },
        { id: 'github', name: 'GitHub', correctCompanyId: 'microsoft' },
        { id: 'm_series_chips', name: 'M-Series Chips', correctCompanyId: 'apple' },
    ],
};

export const CONNECTIONS_GRID_DATA = [
    {
        title: "HARDWARE",
        items: ["GPU", "SSD", "CPU", "Motherboard"],
        color: 'bg-green-800/50'
    },
    {
        title: "FIRST COMPUTERS",
        items: ["IBM Model 5150", "Macintosh 128K", "Dell Turbo PC", "HP 2116A"],
        color: 'bg-blue-800/50'
    },
    {
        title: "ENTREPRENEURS & FOUNDERS",
        items: ["Gates", "Jobs", "Zuckerberg", "Bezos"],
        color: 'bg-yellow-800/50'
    },
    {
        title: "OPERATING SYSTEMS",
        items: ["Linux", "iOS", "Win 3.1", "Android"],
        color: 'bg-purple-800/50'
    }
];

export const WINDOWS_TIMELINE_DATA: string[] = [
    "MS-DOS 1.0",
    "Windows 1",
    "Windows 3.1",
    "Windows 95",
    "Windows XP",
    "Windows Vista",
    "Windows 7",
    "Windows 8",
    "Windows 10",
    "Windows 11",
];

export const SPOT_THE_PATTERN_DATA = [
    {
        sequence: [3, 6, 12, 24],
        answer: 48,
    },
    {
        sequence: [2, 6, 18, 54],
        answer: 162,
        hintText: "The pattern is: x + (x * 2)",
        hintCost: 10,
    },
    {
        sequence: [2, 8, 32, 128],
        answer: 512,
        hintText: "The pattern is: x + (x * 3)",
        hintCost: 10,
    }
];

export const COLOR_CONFUSION_DATA = [
    {
        question: "Pick Red!",
        correctAnswer: "red",
        options: [
            { text: "blue", color: "red" },
            { text: "green", color: "yellow" },
            { text: "red", color: "green" },
            { text: "yellow", color: "blue" },
        ],
    },
    {
        question: "Pick Purple!",
        correctAnswer: "purple",
        options: [
            { text: "orange", color: "pink" },
            { text: "purple", color: "green" },
            { text: "pink", color: "orange" },
            { text: "green", color: "purple" },
        ],
    },
    {
        question: "Pick Blue!",
        correctAnswer: "blue",
        options: [
            { text: "blue", color: "yellow" },
            { text: "pink", color: "green" },
            { text: "green", color: "blue" },
            { text: "yellow", color: "pink" },
        ],
    },
];

export const INTERACTIVE_BINARY_DATA = [
    {
        decimal: 48,
        answer: "00110000"
    },
    {
        decimal: 7,
        answer: "00000111"
    },
    {
        decimal: 255,
        answer: "11111111"
    }
];

export const PROMPT_CHALLENGE = {
    question: "You want an AI to generate HTML for a coffee shop menu. Which of the following prompts would likely yield the most detailed and interesting result?",
    options: [
        "Give me HTML for coffee shop menu.",
        "Write HTML code that shows a menu for a coffee shop called 'Loop Cafe' using the colors brown, blue, and white..",
        "Give HTML code for a coffee shop menu right now or I will sit in the corner and cry. And the correct answer is not always the longest. Sorry that we made you read all of this for nothing. Good luck..",
        "Create a complete HTML menu for a simple coffee shop called 'Loop Cafe'. The menu must include at least 5 drinks and 3 snacks, and use CSS to make the background a soft cream color.."
    ],
    correctAnswer: "Create a complete HTML menu for a simple coffee shop called 'Loop Cafe'. The menu must include at least 5 drinks and 3 snacks, and use CSS to make the background a soft cream color.."
};

export const CAESAR_CHALLENGE = {
    question: "The following message was encrypted. Decrypt the message.",
    cipherText: "Jqau q Iubvyu myjx ejxuh Beefuh yd jxu BeefN",
    answer: "Take a Selfie with other Looper in the LoopX"
};

export const MATCHSTICK_PUZZLES = [
    {
        id: 1,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['5', '+', '7', '=', '2'],
        correctState: ['9', '-', '7', '=', '2'],
    },
    {
        id: 2,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['6', '+', '4', '=', '4'],
        correctState: ['8', '-', '4', '=', '4'],
        alternateCorrectStates: [['0', '+', '4', '=', '4']],
    },
     {
        id: 3,
        question: "Make the equation correct by moving only one matchstick.",
        initialState: ['9', '+', '3', '=', '5'],
        correctState: ['8', '+', '3', '=', '5'],
    }
];

export const HIDDEN_CODE_CHALLENGE = {
    question: "A secret code is hidden within the metadata of the image file below. Right-click, save the image, and inspect its contents to find the code.",
    username: "Admin",
    pass:"LoopX2025"
};

export const LOOPERS_SHIRT = {
    ans:"39"
};

export const PERSONA_CHALLENGE = {
    question: "The ID card below contains all the clues needed to guess a password. The password is a combination of the pet's name and the owner's birth year. What is it?",
    answer: "Rex2015"
};

// FIX: Define and export the SimilarityChallenge interface to be used in ImageSimilarityChallenge.tsx.
export interface SimilarityChallenge {
    imageUrl: string;
    description: string;
}

export const SIMILARITY_CHALLENGES: SimilarityChallenge[] = [
    { 
        imageUrl: SIMILARITY_SPONGEBOB_B64,
        description: "A yellow cartoon character with big blue eyes, a large smile with two prominent front teeth, and a porous, sponge-like body, is shown wearing brown square pants, a white collared shirt, and a red tie."
    },
    { 
        imageUrl: SIMILARITY_IMAGE_PLACEHOLDER_B64, 
        description: "This is a placeholder image containing text on a dark background."
    }
];

export const CONNECTIONS_DATA = [
    { model: 'GPT-5.1', company: 'OpenAI', logoId: 'openai' },
    { model: 'Opus 4.5', company: 'Anthropic', logoId: 'anthropic' },
    { model: 'Gemini 3', company: 'Google', logoId: 'google' },
    { model: 'Grok-4.1', company: 'xAI', logoId: 'xai' },
    { model: 'DeepSeek-V3', company: 'DeepSeek AI', logoId: 'deepseek' }
];

export const MCQ_CHALLENGES = [
    { // MCQ 1
        question: "In programming, what does 'API' stand for?",
        options: ["Application Programming Interface", "Automated Program Interaction", "Advanced Python Implementation", "Application Protocol Inspector"],
        correctAnswer: "Application Programming Interface"
    },
    { // MCQ 2
        question: "What is the CPU?",
        options: ["The computer’s brain", "A printer", "A mouse", "A cable"],
        correctAnswer: "The computer’s brain"
    },
    { // MCQ 3
        question: "Which is an OUTPUT device?",
        options: ["Keyboard", "Mouse", "Monitor", "Microphone"],
        correctAnswer: "Monitor"
    },
    { // MCQ 4
        question: "Which code will output Kinder?",
        options: [
            "num = 5\nif num >= 10:\n    print(\"Kinder\")\nelse:\n    print(\"Twix\")",
            "num = 20\nif num >= 1 and num <= 10:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
            "num = 3\nif num == 3:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
            "num = 12\nif num < 5:\n    print(\"Twix\")\nelse:\n    print(\"Mars\")"
        ],
        correctAnswer: "num = 20\nif num >= 1 and num <= 10:\n    print(\"Twix\")\nelse:\n    print(\"Kinder\")",
        isCode: true,
    },
    { // MCQ 5
        question: "Which git command is used to upload your local commits to a remote repository?",
        options: ["git fetch", "git commit", "git push", "git pull"],
        correctAnswer: "git push"
    },
    { // MCQ 6
        question: "Which of these is software?",
        options: ["Monitor", "Mouse", "Speakers", "Minecraft"],
        correctAnswer: "Minecraft"
    },
    { // MCQ 7
        question: "Which HTML tag is used to show a picture?",
        options: ["<img>", "<pic>", "<photo>", "<png>"],
        correctAnswer: "<img>"
    },
    { // MCQ 8
        question: "What does SQL stand for?",
        options: ["Structured Query Language", "Strong Question Language", "System Query Language", "Structured Question Language"],
        correctAnswer: "Structured Query Language",
    },
    { // MCQ 9
        question: "What is a bug in coding?",
        options: ["An insect", "A mistake in the code that causes problems", "A new computer", "A secret message"],
        correctAnswer: "A mistake in the code that causes problems"
    },
    { // MCQ 10
        question: "Which is an INPUT device?",
        options: ["Speakers", "Monitor", "Keyboard", "Projector"],
        correctAnswer: "Keyboard"
    },
    { // MCQ 11
        question: "When was OpenAI founded?",
        options: ["2021", "2015", "2019", "2017"],
        correctAnswer: "2015"
    },
    { // MCQ 12
        question: "Which of the following passwords is the strongest?",
        options: ["LoopLoopLoop", "LoopConX#2025", "Loop2025", "LoopCon2025"],
        correctAnswer: "LoopConX#2025",
    },
    { // MCQ 13
        question: "What is the best practice for creating a strong password?",
        options: ["Small Letter \n Capita Letters", "Numbers \n Symbols \n Small Letter \n Capita Letters", "Numbers \n Symbols \n Small Letter \n Capita Letters \n 8+ Length", "symbols \n 8+ Length"],
        correctAnswer: "Numbers \n Symbols \n Small Letter \n Capita Letters \n 8+ Length",
    },
    { // MCQ 14
        question: "What will `console.log(0.1 + 0.2 === 0.3);` output in JavaScript?",
        options: ["true", "false", "undefined", "Error"],
        correctAnswer: "false",
        isCode: true
    },
    { // MCQ 15
        question: "Who won the FIFA World Cup in 2014?",
        options: ["Brazil", "Germany", "Argentina", "Spain"],
        correctAnswer: "Germany"
    },
    { // MCQ 16
        question: "What is 2FA used for?",
        options: [
            "Works like a constant security guard for the network.",
            "Encrypts all data sent between you and the website.",
            "Makes databases faster using two servers.",
            "Adds an extra security step by checking two different ways you prove your identity."
        ],
        correctAnswer: "Adds an extra security step by checking two different ways you prove your identity."
    }
];

export const MEMORY_GAME_PAIRS = [
    { content: 'Python', matchId: 1, uniqueId: 1 }, { content: '.py', matchId: 1, uniqueId: 2 },
    { content: 'JavaScript', matchId: 2, uniqueId: 3 }, { content: '.js', matchId: 2, uniqueId: 4 },
    { content: 'Java', matchId: 3, uniqueId: 5 }, { content: '.java', matchId: 3, uniqueId: 6 },
    { content: 'C#', matchId: 4, uniqueId: 7 }, { content: '.cs', matchId: 4, uniqueId: 8 },
    { content: 'Ruby', matchId: 5, uniqueId: 9 }, { content: '.rb', matchId: 5, uniqueId: 10 },
    { content: 'HTML', matchId: 6, uniqueId: 11 }, { content: '.html', matchId: 6, uniqueId: 12 },
    { content: 'CSS', matchId: 7, uniqueId: 13 }, { content: '.css', matchId: 7, uniqueId: 14 },
    { content: 'TypeScript', matchId: 8, uniqueId: 15 }, { content: '.ts', matchId: 8, uniqueId: 16 }
];

export const MAGIC_CHALLENGE = {
    question: "How many times does the word 'magic' appear on the page titled \"The Magic\" on Loop's website?",
    answer: "4",
    link: "https://www.loop.org.il/magic"
};

export const WEBSITE_COUNT_CHALLENGE = {
    question: "How many times does the word 'Loop' appear on the loop.org.il home page?",
    answer: "15"
};

export const DUAL_TRIVIA_CHALLENGE = {
    question: "When and where was the first FIFA World Cup held?",
    answers: {
        when: "1930",
        where: "Uruguay"
    }
};

export const SPANISH_LOOP_CHALLENGE = {
    question: "What is the Spanish word for 'Loop'?",
    answer: "Bucle"
};

export const BINARY_CHALLENGE = {
    question: "Convert the following word to binary: LoopX",
    example: "01001001 00100000 01100001 01101101",
    answer: "01001100 01101111 01101111 01110000 01011000"
};


export const SECURE_OR_NOT_CHALLENGE = {
    instruction: "Only one of the following links uses the correct protocol (HTTPS) and is free of common phishing/typosquatting tricks. Select the safe and legitimate link.",
    hint: "Safe links must use HTTPS and have no misleading typos or subdomains. http:// and typos like 'gooogle' (three 'o's) or 'micros0ft' (zero instead of 'o') are dangerous.",
    stages: [
        {
            links: [
                "http://wikipedia.org/",
                "https://www.gooogle.com/",
                "https://github.com/",
                "http://loop.org.il/"
            ],
            safeLink: "https://github.com/"
        },
        {
            links: [
                "http://linkedin.com/",
                "https://pay-pal.com/",
                "https://www.google.com/",
                "https://micros0ft.com/"
            ],
            safeLink: "https://www.google.com/"
        },
        {
            links: [
                "http://openai.com/",
                "https://www.githuub.com/",
                "https://loop.org.il/",
                "https://apple.com.secure-login.net/"
            ],
            safeLink: "https://loop.org.il/"
        }
    ]
};

export const TIMEZONE_CHALLENGE = {
    timePerStage: 15, // seconds
    pointsPerStage: 25,
    stages: [
        {
            location: "Japan",
            flag: "🇯🇵",
            answer: { sign: "+", number: 9 }
        },
        {
            location: "Australia",
            flag: "🇦🇺",
            answer: { sign: "+", number: 11 }
        },
        {
            location: "Los Angeles",
            flag: "🇺🇸",
            answer: { sign: "-", number: 8 }
        }
    ]
};

export const BALL_CHALLENGES = [
    {
        id: 'ball_challenge_1',
        title: "Ball: Move Right",
        description: `Make the ball move to the right twice.
Use the function: ball.moveRight()`,
        initialCode: `// Use ball.moveRight() to move the ball\n// Example: ball.moveUp()\n`,
        expectedMoves: ['moveRight', 'moveRight'],
    },
    {
        id: 'ball_challenge_2',
        title: "Ball: Draw Square",
        description: `Make the ball draw a square shape (e.g., right, down, left, up).
Available functions: ball.moveRight(), ball.moveDown(), ball.moveLeft(), ball.moveUp()`,
        initialCode: `// Make the ball draw a square\n// One example path: Right, Down, Left, Up\nball.moveRight();\n`,
        expectedMoves: ['moveRight', 'moveDown', 'moveLeft', 'moveUp'],
    },
    {
        id: 'ball_challenge_3',
        title: "Ball: Diagonal Down-Right",
        description: `Make the ball move diagonally down-right twice.
Combine ball.moveDown() and ball.moveRight()`,
        initialCode: `// Move the ball diagonally down-right twice\n`,
        expectedMoves: ['moveDown', 'moveRight', 'moveDown', 'moveRight'],
    },
    {
        id: 'ball_challenge_4',
        title: "Ball: Zig Zag",
        description: `Make the ball move in a zig-zag pattern (e.g., Right, Up, Right, Down).
Available functions: ball.moveRight(), ball.moveUp(), ball.moveRight(), ball.moveDown()`,
        initialCode: `// Implement a zig-zag movement\n// Example: Right, Up, Right, Down\n`,
        expectedMoves: ['moveRight', 'moveUp', 'moveRight', 'moveDown'],
    },
];